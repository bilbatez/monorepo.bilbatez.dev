import type { LevelEntity, EntityType, TiledObject } from '../_engine/types';

function getProp<T>(
  properties: TiledObject['properties'],
  name: string
): T | undefined {
  return properties?.find((p) => p.name === name)?.value as T | undefined;
}

export function parseTiledObject(obj: TiledObject): LevelEntity {
  const props = obj.properties ?? [];
  const type = obj.type as EntityType;
  return {
    type,
    x: obj.x,
    y: obj.y,
    w: obj.width,
    h: obj.height,
    ...(getProp<number>(props, 'toX') !== undefined && {
      toX: getProp<number>(props, 'toX'),
    }),
    ...(getProp<number>(props, 'toY') !== undefined && {
      toY: getProp<number>(props, 'toY'),
    }),
    ...(getProp<number>(props, 'radius') !== undefined && {
      radius: getProp<number>(props, 'radius'),
    }),
    ...(getProp<number>(props, 'speed') !== undefined && {
      speed: getProp<number>(props, 'speed'),
    }),
    ...(getProp<string>(props, 'hazardKind') !== undefined && {
      hazardKind: getProp<string>(props, 'hazardKind') as 'spike' | 'lava',
    }),
    ...(getProp<boolean>(props, 'rideable') !== undefined && {
      rideable: getProp<boolean>(props, 'rideable'),
    }),
  };
}

export function parseTiledObjects(objects: TiledObject[]): LevelEntity[] {
  return objects.map(parseTiledObject);
}
