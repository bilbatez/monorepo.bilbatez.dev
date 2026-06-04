import Phaser from 'phaser';
import type { EntityType } from '../_engine/types';

const COLOR_MAP: Record<EntityType | 'player', number> = {
  solid: 0x64748b, // slate
  disappearing: 0xf59e0b, // amber
  mover: 0x3b82f6, // blue
  platform: 0x60a5fa, // lighter blue
  hazard: 0xef4444, // red
  movingHazard: 0xdc2626, // darker red
  decoration: 0x6b7280, // gray
  start: 0x22c55e, // green (not drawn)
  exit: 0x22c55e, // green
  player: 0xf8fafc, // white
};

const textureCache = new Set<string>();

export function textureFor(
  scene: Phaser.Scene,
  type: EntityType | 'player',
  w: number,
  h: number
): string {
  const key = `${type}_${w}_${h}`;
  if (!textureCache.has(key)) {
    const color = COLOR_MAP[type] ?? 0x888888;
    const gfx = scene.add.graphics();
    gfx.fillStyle(color, 1);
    gfx.fillRect(0, 0, w, h);
    gfx.generateTexture(key, w, h);
    gfx.destroy();
    textureCache.add(key);
  }
  return key;
}

export function clearTextureCache(): void {
  textureCache.clear();
}
