import { LevelEntity } from './types';

export function distancePx(
  ax: number,
  ay: number,
  bx: number,
  by: number
): number {
  return Math.sqrt((ax - bx) ** 2 + (ay - by) ** 2);
}

/** Returns entities (disappearing/mover) whose trigger radius the player center is within. */
export function getActivatedEntities(
  entities: LevelEntity[],
  playerCenterX: number,
  playerCenterY: number
): LevelEntity[] {
  return entities.filter((e) => {
    if (e.type !== 'disappearing' && e.type !== 'mover') return false;
    if (e.radius == null) return false;
    const entityCenterX = e.x + e.w / 2;
    const entityCenterY = e.y + e.h / 2;
    return (
      distancePx(playerCenterX, playerCenterY, entityCenterX, entityCenterY) <=
      e.radius
    );
  });
}
