import Phaser from 'phaser';
import { GAME_EVENTS } from './events';
import { buildScene, type SceneObjects } from './factory';
import { getActivatedEntities } from '../_engine/triggers';
import { parseTiledObjects } from '../_levels/parse';
import type { LevelManifestEntry, LevelEntity } from '../_engine/types';
import {
  HEIGHT,
  WIDTH,
  JUMP_VELOCITY,
  MOVE_SPEED,
  COYOTE_TIME,
  JUMP_BUFFER_TIME,
} from '../_engine/constants';

interface SceneInitData {
  entry: LevelManifestEntry;
}

export class PlatformerScene extends Phaser.Scene {
  private entry!: LevelManifestEntry;
  private objects!: SceneObjects;
  private allEntities: LevelEntity[] = [];

  // input
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: Record<string, Phaser.Input.Keyboard.Key>;

  // coyote time + jump buffer
  private coyoteTimer = 0;
  private jumpBufferTimer = 0;

  // one-shot tracking
  private activatedIds = new Set<number>();
  private dead = false;
  private won = false;

  constructor() {
    super('PlatformerScene');
  }

  init(data: SceneInitData) {
    this.entry = data.entry;
    this.activatedIds.clear();
    this.dead = false;
    this.won = false;
    this.coyoteTimer = 0;
    this.jumpBufferTimer = 0;
  }

  preload() {
    this.load.tilemapTiledJSON(this.entry.key, this.entry.url);
  }

  create() {
    // parse map
    const map = this.make.tilemap({ key: this.entry.key });
    const layer = map.getObjectLayer('entities');
    if (!layer)
      throw new Error(`Map ${this.entry.key} missing 'entities' layer`);
    this.allEntities = parseTiledObjects(
      layer.objects as unknown as import('../_engine/types').TiledObject[]
    );

    // build scene
    this.objects = buildScene(this, this.allEntities);
    const { player, statics, movers, hazards, movingHazards, exitSprite } =
      this.objects;

    // world bounds — bottom open so falling kills
    this.physics.world.setBounds(0, 0, WIDTH, HEIGHT);
    this.physics.world.setBoundsCollision(true, true, true, false);

    // colliders
    this.physics.add.collider(player, statics);
    this.physics.add.collider(player, this.objects.platformGroup);
    this.physics.add.collider(player, movers);

    // disappearing blocks collider (checked individually in update)
    for (const d of this.objects.disappearingEntities) {
      this.physics.add.collider(
        player,
        d.sprite as unknown as Phaser.Physics.Arcade.Image
      );
    }

    // hazard overlaps → death
    this.physics.add.overlap(player, hazards, () => this.triggerDeath());
    this.physics.add.overlap(player, movingHazards, () => this.triggerDeath());

    // exit overlap → win
    this.physics.add.overlap(
      player,
      exitSprite as unknown as Phaser.Physics.Arcade.Image,
      () => this.triggerWin()
    );

    // input
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.wasd = this.input.keyboard!.addKeys('W,A,S,D,SPACE') as Record<
      string,
      Phaser.Input.Keyboard.Key
    >;

    // notify React the scene is ready
    this.game.events.emit(GAME_EVENTS.READY);
  }

  update(_time: number, delta: number) {
    if (this.dead || this.won) return;

    const { player } = this.objects;
    const body = player.body as Phaser.Physics.Arcade.Body;
    const grounded = body.blocked.down;

    // --- coyote time ---
    if (grounded) {
      this.coyoteTimer = COYOTE_TIME;
    } else {
      this.coyoteTimer = Math.max(0, this.coyoteTimer - delta);
    }

    // --- jump buffer ---
    const jumpPressed =
      Phaser.Input.Keyboard.JustDown(this.cursors.up) ||
      Phaser.Input.Keyboard.JustDown(this.cursors.space) ||
      Phaser.Input.Keyboard.JustDown(this.wasd['W']) ||
      Phaser.Input.Keyboard.JustDown(this.wasd['SPACE']);

    if (jumpPressed) this.jumpBufferTimer = JUMP_BUFFER_TIME;
    else this.jumpBufferTimer = Math.max(0, this.jumpBufferTimer - delta);

    // --- jump execution ---
    if (this.jumpBufferTimer > 0 && (grounded || this.coyoteTimer > 0)) {
      body.setVelocityY(JUMP_VELOCITY);
      this.jumpBufferTimer = 0;
      this.coyoteTimer = 0;
    }

    // --- horizontal movement ---
    const left = this.cursors.left.isDown || this.wasd['A'].isDown;
    const right = this.cursors.right.isDown || this.wasd['D'].isDown;
    if (left) body.setVelocityX(-MOVE_SPEED);
    else if (right) body.setVelocityX(MOVE_SPEED);
    else body.setVelocityX(0);

    // --- platform patrol (static bodies moved manually + carry player) ---
    const playerBody = player.body as Phaser.Physics.Arcade.Body;
    for (const p of this.objects.platformEntries) {
      const e = p.entity;
      const speed = (e.speed ?? 150) * (delta / 1000);
      const startCX = e.x + e.w / 2;
      const endCX = (e.toX ?? e.x) + e.w / 2;
      const prevX = p.currentX;

      p.currentX += p.dir * speed;
      if (p.dir === 1 && p.currentX >= endCX) {
        p.currentX = endCX;
        p.dir = -1;
      }
      if (p.dir === -1 && p.currentX <= startCX) {
        p.currentX = startCX;
        p.dir = 1;
      }

      p.sprite.setPosition(p.currentX, p.currentY);
      (p.sprite.body as Phaser.Physics.Arcade.StaticBody).reset(
        p.currentX,
        p.currentY
      );

      // carry player when standing on this platform
      const dx = p.currentX - prevX;
      if (dx !== 0 && playerBody.blocked.down) {
        const platTop = p.currentY - e.h / 2;
        const platLeft = p.currentX - e.w / 2;
        const platRight = p.currentX + e.w / 2;
        const playerBottom = player.y + playerBody.halfHeight;
        if (
          Math.abs(playerBottom - platTop) < 8 &&
          player.x + playerBody.halfWidth > platLeft &&
          player.x - playerBody.halfWidth < platRight
        ) {
          // Update both sprite AND body immediately so blocked.down stays
          // true next frame (body position lags sprite by one step otherwise)
          player.x += dx;
          playerBody.position.x += dx;
        }
      }
    }

    // --- moving hazard patrol reversal ---
    for (const mh of this.objects.movingHazards.getChildren() as Phaser.Physics.Arcade.Image[]) {
      const e = mh.getData('entity') as LevelEntity;
      if (!e.toX && !e.toY) continue;
      const speed = e.speed ?? 150;
      const dir = mh.getData('dir') as number;
      const startX = e.x + e.w / 2;
      const endX = e.toX !== undefined ? e.toX + e.w / 2 : startX;
      if (dir === 1 && mh.x >= endX) {
        mh.setData('dir', -1);
        mh.setVelocityX(-speed);
      } else if (dir === -1 && mh.x <= startX) {
        mh.setData('dir', 1);
        mh.setVelocityX(speed);
      }
    }

    // --- proximity triggers ---
    const px = player.x;
    const py = player.y;
    const unactivated = this.allEntities.filter(
      (_e, i) => !this.activatedIds.has(i)
    );
    const triggered = getActivatedEntities(unactivated, px, py);

    for (const e of triggered) {
      const idx = this.allEntities.indexOf(e);
      if (this.activatedIds.has(idx)) continue;
      this.activatedIds.add(idx);

      if (e.type === 'disappearing') {
        const d = this.objects.disappearingEntities.find((d) => d.entity === e);
        if (d) {
          this.tweens.add({
            targets: d.sprite,
            alpha: 0,
            duration: 150,
            onComplete: () => {
              const physBody = d.sprite
                .body as Phaser.Physics.Arcade.StaticBody | null;
              if (physBody) {
                this.physics.world.remove(physBody);
              }
              d.sprite.setActive(false).setVisible(false);
            },
          });
        }
      }

      if (e.type === 'mover') {
        const m = this.objects.movers
          .getChildren()
          .find(
            (child) =>
              (child as Phaser.Physics.Arcade.Image).getData('entity') === e
          ) as Phaser.Physics.Arcade.Image | undefined;
        if (m && e.toX !== undefined) {
          const speed = e.speed ?? MOVE_SPEED / 2;
          const dx = e.toX + e.w / 2 - m.x;
          const dy = e.toY !== undefined ? e.toY + e.h / 2 - m.y : 0;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > 1) {
            m.setVelocityX((dx / dist) * speed);
            m.setVelocityY((dy / dist) * speed);
            // stop when arrived
            const targetX = e.toX + e.w / 2;
            const targetY = e.toY !== undefined ? e.toY + e.h / 2 : m.y;
            this.time.addEvent({
              delay: (dist / speed) * 1000,
              callback: () => {
                m.setVelocity(0, 0);
                m.setPosition(targetX, targetY);
                (m.body as Phaser.Physics.Arcade.Body).reset(targetX, targetY);
              },
            });
          }
        }
      }
    }

    // --- fall death ---
    if (player.y > HEIGHT + 60) {
      this.triggerDeath();
    }
  }

  private triggerDeath() {
    if (this.dead || this.won) return;
    this.dead = true;
    this.cameras.main.shake(200, 0.01);
    this.cameras.main.flash(150, 255, 50, 50);
    this.time.delayedCall(350, () => {
      this.game.events.emit(GAME_EVENTS.DEATH);
      this.scene.restart({ entry: this.entry });
    });
  }

  private triggerWin() {
    if (this.dead || this.won) return;
    this.won = true;
    this.cameras.main.fade(400, 0, 0, 0);
    this.time.delayedCall(400, () => {
      this.game.events.emit(GAME_EVENTS.WIN);
    });
  }
}
