export const TILE = 60;
export const WIDTH = 1920;
export const HEIGHT = 1080;
export const GRAVITY = 600;
export const JUMP_VELOCITY = -520;
export const MOVE_SPEED = 300;
export const MIN_SCREEN_PX = 1024;
export const COYOTE_TIME = 80;
export const JUMP_BUFFER_TIME = 100;
// derived reach limits — author all levels within these
export const MAX_JUMP_HEIGHT = Math.round(
  (JUMP_VELOCITY * JUMP_VELOCITY) / (2 * GRAVITY)
); // px
export const MAX_GAP = Math.round(
  (MOVE_SPEED * 2 * Math.abs(JUMP_VELOCITY)) / GRAVITY
); // px
