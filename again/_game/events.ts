export const GAME_EVENTS = {
  WIN: 'win',
  DEATH: 'death',
  READY: 'ready',
} as const;

export type GameEventName = (typeof GAME_EVENTS)[keyof typeof GAME_EVENTS];
