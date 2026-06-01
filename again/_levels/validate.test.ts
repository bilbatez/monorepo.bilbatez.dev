import { describe, it, expect } from 'vitest';
import { validateEntities } from './validate';
import type { LevelEntity } from '../_engine/types';

const floor: LevelEntity = { type: 'solid', x: 0, y: 1020, w: 1920, h: 60 };
const start: LevelEntity = { type: 'start', x: 60, y: 960, w: 60, h: 60 };
const exit: LevelEntity = { type: 'exit', x: 1800, y: 960, w: 60, h: 60 };

describe('validateEntities', () => {
  it('passes a valid level', () => {
    const r = validateEntities([floor, start, exit]);
    expect(r.valid).toBe(true);
    expect(r.errors).toHaveLength(0);
  });

  it('fails with no start', () => {
    const r = validateEntities([floor, exit]);
    expect(r.valid).toBe(false);
    expect(r.errors.some((e) => e.includes('start'))).toBe(true);
  });

  it('fails with no exit', () => {
    const r = validateEntities([floor, start]);
    expect(r.valid).toBe(false);
    expect(r.errors.some((e) => e.includes('exit'))).toBe(true);
  });

  it('fails with out-of-bounds entity', () => {
    const oob: LevelEntity = { type: 'solid', x: 1900, y: 0, w: 120, h: 60 }; // x+w=2020 > 1920
    const r = validateEntities([oob, start, exit]);
    expect(r.valid).toBe(false);
    expect(r.errors.some((e) => e.includes('out of bounds'))).toBe(true);
  });

  it('fails with two starts', () => {
    const r = validateEntities([floor, start, start, exit]);
    expect(r.valid).toBe(false);
  });
});
