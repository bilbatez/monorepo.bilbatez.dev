import { describe, it, expect } from 'vitest';
import { parseTiledObject, parseTiledObjects } from './parse';
import type { TiledObject } from '../_engine/types';

const solidObj: TiledObject = {
  id: 1,
  name: '',
  type: 'solid',
  x: 0,
  y: 960,
  width: 1920,
  height: 60,
  visible: true,
};
const disappearingObj: TiledObject = {
  id: 2,
  name: '',
  type: 'disappearing',
  x: 300,
  y: 600,
  width: 60,
  height: 60,
  visible: true,
  properties: [{ name: 'radius', type: 'int', value: 150 }],
};
const moverObj: TiledObject = {
  id: 3,
  name: '',
  type: 'mover',
  x: 600,
  y: 600,
  width: 60,
  height: 60,
  visible: true,
  properties: [
    { name: 'toX', type: 'int', value: 900 },
    { name: 'toY', type: 'int', value: 600 },
    { name: 'radius', type: 'int', value: 120 },
    { name: 'rideable', type: 'bool', value: true },
  ],
};

describe('parseTiledObject', () => {
  it('parses solid with no properties', () => {
    const e = parseTiledObject(solidObj);
    expect(e.type).toBe('solid');
    expect(e.x).toBe(0);
    expect(e.w).toBe(1920);
    expect(e.radius).toBeUndefined();
  });

  it('parses disappearing radius', () => {
    const e = parseTiledObject(disappearingObj);
    expect(e.type).toBe('disappearing');
    expect(e.radius).toBe(150);
  });

  it('parses mover with all props', () => {
    const e = parseTiledObject(moverObj);
    expect(e.type).toBe('mover');
    expect(e.toX).toBe(900);
    expect(e.toY).toBe(600);
    expect(e.rideable).toBe(true);
  });
});

describe('parseTiledObjects', () => {
  it('maps array correctly', () => {
    const result = parseTiledObjects([solidObj, disappearingObj]);
    expect(result).toHaveLength(2);
    expect(result[0].type).toBe('solid');
    expect(result[1].type).toBe('disappearing');
  });
});
