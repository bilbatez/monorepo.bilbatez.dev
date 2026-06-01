import type { LevelEntity } from '../_engine/types';
import { WIDTH, HEIGHT } from '../_engine/constants';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateEntities(entities: LevelEntity[]): ValidationResult {
  const errors: string[] = [];
  const starts = entities.filter((e) => e.type === 'start');
  const exits = entities.filter((e) => e.type === 'exit');
  if (starts.length !== 1)
    errors.push(`Expected 1 start, got ${starts.length}`);
  if (exits.length !== 1) errors.push(`Expected 1 exit, got ${exits.length}`);
  for (const e of entities) {
    if (e.x < 0 || e.y < 0 || e.x + e.w > WIDTH || e.y + e.h > HEIGHT) {
      errors.push(
        `Entity type=${e.type} at (${e.x},${e.y}) w=${e.w} h=${e.h} out of bounds`
      );
    }
  }
  return { valid: errors.length === 0, errors };
}
