export type EntityType =
  | 'solid'
  | 'disappearing'
  | 'mover'
  | 'platform'
  | 'hazard'
  | 'movingHazard'
  | 'decoration'
  | 'start'
  | 'exit';

export interface LevelEntity {
  type: EntityType;
  x: number; // px, top-left
  y: number;
  w: number;
  h: number;
  // optional per-type props
  toX?: number;
  toY?: number;
  radius?: number;
  speed?: number;
  hazardKind?: 'spike' | 'lava';
  rideable?: boolean;
}

export interface LevelManifestEntry {
  id: number;
  key: string; // e.g. 'level-01'
  name: string;
  url: string; // e.g. '/levels/level-01.json'
}

export interface TiledObject {
  id: number;
  name: string;
  type: string; // Tiled "class" field
  x: number;
  y: number;
  width: number;
  height: number;
  visible: boolean;
  properties?: Array<{ name: string; type: string; value: unknown }>;
}

export interface TiledObjectLayer {
  name: string;
  objects: TiledObject[];
}
