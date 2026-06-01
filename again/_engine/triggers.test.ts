import { describe, it, expect } from 'vitest';
import { getActivatedEntities, distancePx } from './triggers';
import type { LevelEntity } from './types';

describe('distancePx', () => {
  it('returns 0 for same point', () => expect(distancePx(0, 0, 0, 0)).toBe(0));
  it('returns 5 for 3-4-5 triangle', () =>
    expect(distancePx(0, 0, 3, 4)).toBe(5));
});

describe('getActivatedEntities', () => {
  const disappearing: LevelEntity = {
    type: 'disappearing',
    x: 100,
    y: 100,
    w: 60,
    h: 60,
    radius: 120,
  };
  const mover: LevelEntity = {
    type: 'mover',
    x: 400,
    y: 100,
    w: 60,
    h: 60,
    radius: 90,
    toX: 600,
    toY: 100,
  };
  const solid: LevelEntity = { type: 'solid', x: 0, y: 200, w: 1920, h: 60 };

  it('activates disappearing block when player within radius', () => {
    // entity center = (130,130), radius=120 → player at (130,130) is distance 0
    const result = getActivatedEntities([disappearing], 130, 130);
    expect(result).toContain(disappearing);
  });

  it('does not activate when player outside radius', () => {
    // distance from (130,130) to (400,400) >> 120
    const result = getActivatedEntities([disappearing], 400, 400);
    expect(result).not.toContain(disappearing);
  });

  it('activates mover within its radius', () => {
    // mover center = (430,130), radius=90 → player at (430,130) is distance 0
    const result = getActivatedEntities([mover], 430, 130);
    expect(result).toContain(mover);
  });

  it('ignores solid entities regardless of distance', () => {
    const result = getActivatedEntities([solid], 30, 230);
    expect(result).toHaveLength(0);
  });

  it('activates at exactly the radius boundary', () => {
    // entity center = (130,130), radius=120 → player at (130+120,130) = distance 120
    const result = getActivatedEntities([disappearing], 250, 130);
    expect(result).toContain(disappearing);
  });

  it('does not activate just outside radius', () => {
    // player at (130+121,130) = distance 121 > 120
    const result = getActivatedEntities([disappearing], 251, 130);
    expect(result).not.toContain(disappearing);
  });
});
