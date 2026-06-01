import type { LevelManifestEntry } from '../_engine/types';

export const LEVELS: LevelManifestEntry[] = [
  { id: 1, key: 'level-01', name: 'First Steps', url: '/levels/level-01.json' },
  { id: 2, key: 'level-02', name: 'Moving On', url: '/levels/level-02.json' },
  {
    id: 3,
    key: 'level-03',
    name: 'Now You See Me',
    url: '/levels/level-03.json',
  },
  {
    id: 4,
    key: 'level-04',
    name: 'Bridge Builder',
    url: '/levels/level-04.json',
  },
  { id: 5, key: 'level-05', name: 'Spike Zone', url: '/levels/level-05.json' },
  { id: 6, key: 'level-06', name: 'Lava Flow', url: '/levels/level-06.json' },
  {
    id: 7,
    key: 'level-07',
    name: 'Danger Patrol',
    url: '/levels/level-07.json',
  },
  {
    id: 8,
    key: 'level-08',
    name: 'Fade and Shift',
    url: '/levels/level-08.json',
  },
  { id: 9, key: 'level-09', name: 'Gauntlet', url: '/levels/level-09.json' },
  {
    id: 10,
    key: 'level-10',
    name: 'The Final Run',
    url: '/levels/level-10.json',
  },
];

export const TOTAL_LEVELS = LEVELS.length;
