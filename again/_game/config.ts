import Phaser from 'phaser';
import { WIDTH, HEIGHT, GRAVITY } from '../_engine/constants';

export function createGameConfig(
  parent: string | HTMLElement
): Phaser.Types.Core.GameConfig {
  return {
    type: Phaser.AUTO,
    width: WIDTH,
    height: HEIGHT,
    backgroundColor: '#1a1a2e',
    parent,
    physics: {
      default: 'arcade',
      arcade: { gravity: { x: 0, y: GRAVITY }, debug: false },
    },
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [],
    audio: { noAudio: true },
  };
}
