import { describe, it, expect } from 'vitest';
import { knightsTourCommands } from './knights-tour';
import { makeGridState, backtrackReducer } from './commands';

const BOARD_SIZE = 5;

function makeBoard() {
  return makeGridState(
    BOARD_SIZE,
    BOARD_SIZE,
    ['0', '1', '2', '3', '4'],
    ['0', '1', '2', '3', '4']
  );
}

describe('knightsTour', () => {
  it('visits all 25 squares', () => {
    const initial = makeBoard();
    const cmds = knightsTourCommands(initial);
    const result = cmds.reduce(backtrackReducer, initial);
    // Count filled cells
    let filled = 0;
    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        if (result.grid[r][c].value !== null) filled++;
      }
    }
    expect(filled).toBe(BOARD_SIZE * BOARD_SIZE);
  });

  it('each cell has a unique move number 1 to 25', () => {
    const initial = makeBoard();
    const cmds = knightsTourCommands(initial);
    const result = cmds.reduce(backtrackReducer, initial);
    const values = new Set<number>();
    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        const v = result.grid[r][c].value;
        if (typeof v === 'number') values.add(v);
      }
    }
    expect(values.size).toBe(BOARD_SIZE * BOARD_SIZE);
    expect(Math.min(...values)).toBe(1);
    expect(Math.max(...values)).toBe(BOARD_SIZE * BOARD_SIZE);
  });

  it('sets result to Tour complete!', () => {
    const initial = makeBoard();
    const cmds = knightsTourCommands(initial);
    const result = cmds.reduce(backtrackReducer, initial);
    expect(result.result).toBe('Tour complete!');
  });

  it('emits compute commands for each move', () => {
    const initial = makeBoard();
    const cmds = knightsTourCommands(initial);
    const computeCmds = cmds.filter((c) => c.type === 'compute');
    expect(computeCmds.length).toBe(BOARD_SIZE * BOARD_SIZE);
  });

  it('reducer does not mutate state', () => {
    const initial = makeBoard();
    const cmds = knightsTourCommands(initial);
    if (cmds.length > 0) {
      const s1 = backtrackReducer(initial, cmds[0]);
      expect(initial.result).toBeNull();
      expect(s1).not.toBe(initial);
    }
  });
});
