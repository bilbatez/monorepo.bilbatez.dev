import { describe, it, expect } from 'vitest';
import { sudokuCommands } from './sudoku-solver';
import { makeGridState, backtrackReducer } from './commands';
import type { GridState } from './commands';

// 4x4 puzzle used as defaultInput
const PUZZLE: number[][] = [
  [3, 0, 0, 2],
  [0, 0, 3, 0],
  [0, 1, 0, 0],
  [2, 0, 0, 1],
];

function makeSudokuState(): GridState {
  const state = makeGridState(
    4,
    4,
    ['Row 0', 'Row 1', 'Row 2', 'Row 3'],
    ['Col 0', 'Col 1', 'Col 2', 'Col 3']
  );
  const grid = state.grid.map((row, r) =>
    row.map((cell, c) =>
      PUZZLE[r][c] !== 0 ? { value: PUZZLE[r][c], computed: true } : cell
    )
  );
  return { ...state, grid };
}

describe('Sudoku Solver (4x4)', () => {
  it('result is "Puzzle solved!"', () => {
    const state = makeSudokuState();
    const cmds = sudokuCommands(state);
    const result = cmds.reduce(backtrackReducer, state);
    expect(result.result).toBe('Puzzle solved!');
  });

  it('each row contains digits 1-4', () => {
    const state = makeSudokuState();
    const cmds = sudokuCommands(state);
    const result = cmds.reduce(backtrackReducer, state);
    for (let r = 0; r < 4; r++) {
      const rowVals = result.grid[r].map((c) => Number(c.value)).sort();
      expect(rowVals).toEqual([1, 2, 3, 4]);
    }
  });

  it('each column contains digits 1-4', () => {
    const state = makeSudokuState();
    const cmds = sudokuCommands(state);
    const result = cmds.reduce(backtrackReducer, state);
    for (let c = 0; c < 4; c++) {
      const colVals = result.grid.map((row) => Number(row[c].value)).sort();
      expect(colVals).toEqual([1, 2, 3, 4]);
    }
  });

  it('given cells are preserved', () => {
    const state = makeSudokuState();
    const cmds = sudokuCommands(state);
    const result = cmds.reduce(backtrackReducer, state);
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (PUZZLE[r][c] !== 0) {
          expect(Number(result.grid[r][c].value)).toBe(PUZZLE[r][c]);
        }
      }
    }
  });

  it('produces commands (non-empty)', () => {
    const state = makeSudokuState();
    const cmds = sudokuCommands(state);
    expect(cmds.length).toBeGreaterThan(0);
  });
});
