import Phaser from 'phaser';
import type { LevelEntity } from '../_engine/types';
import { textureFor } from './sprites';

export interface PlatformEntry {
  sprite: Phaser.Physics.Arcade.Image;
  entity: LevelEntity;
  dir: number;
  currentX: number;
  currentY: number;
}

export interface SceneObjects {
  player: Phaser.Physics.Arcade.Sprite;
  statics: Phaser.Physics.Arcade.StaticGroup;
  platformGroup: Phaser.Physics.Arcade.StaticGroup;
  platformEntries: PlatformEntry[];
  movers: Phaser.Physics.Arcade.Group;
  hazards: Phaser.Physics.Arcade.StaticGroup;
  movingHazards: Phaser.Physics.Arcade.Group;
  disappearingEntities: Array<{
    entity: LevelEntity;
    sprite: Phaser.GameObjects.Image;
  }>;
  exitSprite: Phaser.GameObjects.Image;
  startPos: { x: number; y: number };
}

export function buildScene(
  scene: Phaser.Scene,
  entities: LevelEntity[]
): SceneObjects {
  const statics = scene.physics.add.staticGroup();
  const platformGroup = scene.physics.add.staticGroup();
  const platformEntries: PlatformEntry[] = [];
  const movers = scene.physics.add.group({ allowGravity: false });
  const hazards = scene.physics.add.staticGroup();
  const movingHazards = scene.physics.add.group({ allowGravity: false });
  const disappearingEntities: SceneObjects['disappearingEntities'] = [];
  let exitSprite!: Phaser.GameObjects.Image;
  let startPos = { x: 120, y: 900 };

  for (const e of entities) {
    const cx = e.x + e.w / 2;
    const cy = e.y + e.h / 2;

    switch (e.type) {
      case 'start':
        startPos = { x: cx, y: cy };
        break;

      case 'exit': {
        const tex = textureFor(scene, 'exit', e.w, e.h);
        exitSprite = scene.add.image(cx, cy, tex);
        scene.physics.add.existing(exitSprite, true);
        break;
      }

      case 'solid': {
        const tex = textureFor(scene, 'solid', e.w, e.h);
        const s = statics.create(cx, cy, tex) as Phaser.Physics.Arcade.Image;
        s.setImmovable(true);
        s.refreshBody();
        break;
      }

      case 'disappearing': {
        const tex = textureFor(scene, 'disappearing', e.w, e.h);
        const img = scene.add.image(cx, cy, tex);
        scene.physics.add.existing(img, true);
        disappearingEntities.push({ entity: e, sprite: img });
        break;
      }

      case 'mover': {
        const tex = textureFor(scene, 'mover', e.w, e.h);
        const body = scene.physics.add.image(cx, cy, tex);
        body.setImmovable(true);
        (body.body as Phaser.Physics.Arcade.Body).allowGravity = false;
        // store entity data on the image for update logic
        body.setData('entity', e);
        body.setData('activated', false);
        movers.add(body);
        break;
      }

      case 'platform': {
        const tex = textureFor(scene, 'platform', e.w, e.h);
        const sprite = platformGroup.create(
          cx,
          cy,
          tex
        ) as Phaser.Physics.Arcade.Image;
        sprite.refreshBody();
        platformEntries.push({
          sprite,
          entity: e,
          dir: 1,
          currentX: cx,
          currentY: cy,
        });
        break;
      }

      case 'hazard': {
        const tex = textureFor(scene, 'hazard', e.w, e.h);
        const h = hazards.create(cx, cy, tex) as Phaser.Physics.Arcade.Image;
        h.setImmovable(true);
        h.refreshBody();
        break;
      }

      case 'movingHazard': {
        const tex = textureFor(scene, 'movingHazard', e.w, e.h);
        const body = scene.physics.add.image(cx, cy, tex);
        body.setImmovable(true);
        (body.body as Phaser.Physics.Arcade.Body).allowGravity = false;
        body.setData('entity', e);
        body.setData('dir', 1);
        const speed = e.speed ?? 150;
        body.setVelocityX(speed);
        movingHazards.add(body);
        break;
      }

      case 'decoration': {
        const tex = textureFor(scene, 'decoration', e.w, e.h);
        scene.add.image(cx, cy, tex).setAlpha(0.5);
        break;
      }
    }
  }

  // Player
  const playerTex = textureFor(scene, 'player', 40, 48);
  const player = scene.physics.add.sprite(startPos.x, startPos.y, playerTex);
  player.setCollideWorldBounds(true);
  (player.body as Phaser.Physics.Arcade.Body).setSize(36, 44);

  return {
    player,
    statics,
    platformGroup,
    platformEntries,
    movers,
    hazards,
    movingHazards,
    disappearingEntities,
    exitSprite,
    startPos,
  };
}
