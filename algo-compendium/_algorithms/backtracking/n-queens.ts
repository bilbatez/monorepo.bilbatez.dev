import { registerAlgorithm } from '../registry';
import type { GridState, BacktrackCommand } from './commands';
import { makeGridState, backtrackReducer } from './commands';

export function nQueensCommands(state: GridState): BacktrackCommand[] {
  const cmds: BacktrackCommand[] = [];
  const n = state.grid.length;
  const queens: number[] = []; // queens[row] = col

  function isSafe(row: number, col: number): boolean {
    for (let r = 0; r < row; r++) {
      const c = queens[r];
      if (c === col || Math.abs(c - col) === Math.abs(r - row)) {
        return false;
      }
    }
    return true;
  }

  let solved = false;

  function solve(row: number): boolean {
    if (row === n) {
      return true;
    }
    for (let col = 0; col < n; col++) {
      cmds.push({
        type: 'highlight',
        row,
        col,
        description: `Row ${row}: trying column ${col}`,
      });

      if (isSafe(row, col)) {
        queens[row] = col;
        cmds.push({
          type: 'compute',
          row,
          col,
          value: 'Q',
          description: `Placed queen at (${row}, ${col})`,
        });

        if (solve(row + 1)) {
          return true;
        }

        // Backtrack
        queens.splice(row, 1);
        cmds.push({
          type: 'clear',
          row,
          col,
          description: `Backtrack: removed queen from (${row}, ${col})`,
        });
      }
    }
    return false;
  }

  solved = solve(0);

  if (solved) {
    const solutionCells: [number, number][] = queens.map((col, row) => [
      row,
      col,
    ]);
    cmds.push({
      type: 'trace',
      cells: solutionCells,
      description: `Solution found: ${queens.map((col, row) => `(${row},${col})`).join(', ')}`,
    });
    cmds.push({
      type: 'set_result',
      result: 'Solution found!',
      description: `N-Queens solved for n=${n}`,
    });
  } else {
    cmds.push({
      type: 'set_result',
      result: 'No solution',
      description: `No solution exists for n=${n}`,
    });
  }

  return cmds;
}

registerAlgorithm({
  name: 'N-Queens',
  slug: 'n-queens',
  category: 'backtracking',
  description:
    'Place N queens on an N×N chessboard so that no two queens attack each other (no shared row, column, or diagonal). Uses backtracking to find the first valid arrangement.',
  bestCase: 'O(N!)',
  averageCase: 'O(N!)',
  worstCase: 'O(N!)',
  spaceComplexity: 'O(N)',
  stable: false,
  inPlace: true,
  pseudocode: `function solve(row):
  if row == N: return true  // solution found
  for col = 0 to N-1:
    if isSafe(row, col):
      place queen at (row, col)
      if solve(row + 1): return true
      remove queen from (row, col)  // backtrack
  return false`,
  visualizerType: 'grid',
  defaultInput: makeGridState(
    4,
    4,
    ['Row 0', 'Row 1', 'Row 2', 'Row 3'],
    ['Col 0', 'Col 1', 'Col 2', 'Col 3']
  ),
  run: nQueensCommands,
  reduce: backtrackReducer,
});
