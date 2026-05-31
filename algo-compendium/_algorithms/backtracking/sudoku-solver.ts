import { registerAlgorithm } from '../registry';
import type { GridState, BacktrackCommand } from './commands';
import { makeGridState, backtrackReducer } from './commands';

// 4x4 Sudoku: digits 1-4, 2x2 boxes
// 0 = empty cell
const PUZZLE: number[][] = [
  [3, 0, 0, 2],
  [0, 0, 3, 0],
  [0, 1, 0, 0],
  [2, 0, 0, 1],
];

export function sudokuCommands(state: GridState): BacktrackCommand[] {
  const cmds: BacktrackCommand[] = [];
  const size = state.grid.length; // 4
  const boxSize = Math.sqrt(size); // 2

  // Build working board from the state grid
  const board: (number | null)[][] = state.grid.map((row) =>
    row.map((cell) => (cell.value !== null ? Number(cell.value) : null))
  );

  function isValid(row: number, col: number, num: number): boolean {
    // Check row
    for (let c = 0; c < size; c++) {
      if (board[row][c] === num) return false;
    }
    // Check column
    for (let r = 0; r < size; r++) {
      if (board[r][col] === num) return false;
    }
    // Check box
    const boxRow = Math.floor(row / boxSize) * boxSize;
    const boxCol = Math.floor(col / boxSize) * boxSize;
    for (let r = boxRow; r < boxRow + boxSize; r++) {
      for (let c = boxCol; c < boxCol + boxSize; c++) {
        if (board[r][c] === num) return false;
      }
    }
    return true;
  }

  function solve(): boolean {
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        if (board[row][col] === null) {
          cmds.push({
            type: 'highlight',
            row,
            col,
            description: `Finding empty cell at (${row}, ${col})`,
          });
          for (let num = 1; num <= size; num++) {
            cmds.push({
              type: 'compare',
              row,
              col,
              description: `Trying ${num} at (${row}, ${col})`,
            });
            if (isValid(row, col, num)) {
              board[row][col] = num;
              cmds.push({
                type: 'compute',
                row,
                col,
                value: num,
                description: `Placed ${num} at (${row}, ${col})`,
              });
              if (solve()) return true;
              // Backtrack
              board[row][col] = null;
              cmds.push({
                type: 'clear',
                row,
                col,
                description: `Backtrack: removed ${num} from (${row}, ${col})`,
              });
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  const solved = solve();

  if (solved) {
    const solvedCells: [number, number][] = [];
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        solvedCells.push([r, c]);
      }
    }
    cmds.push({
      type: 'trace',
      cells: solvedCells,
      description: 'Sudoku solved!',
    });
    cmds.push({
      type: 'set_result',
      result: 'Puzzle solved!',
      description: 'All cells filled correctly',
    });
  } else {
    cmds.push({
      type: 'set_result',
      result: 'No solution',
      description: 'Puzzle has no solution',
    });
  }

  return cmds;
}

// Build initial state with puzzle pre-filled
function makeSudokuState(): GridState {
  const state = makeGridState(
    4,
    4,
    ['Row 0', 'Row 1', 'Row 2', 'Row 3'],
    ['Col 0', 'Col 1', 'Col 2', 'Col 3']
  );
  // Pre-fill given cells
  const grid = state.grid.map((row, r) =>
    row.map((cell, c) =>
      PUZZLE[r][c] !== 0 ? { value: PUZZLE[r][c], computed: true } : cell
    )
  );
  return { ...state, grid };
}

registerAlgorithm({
  name: 'Sudoku Solver',
  slug: 'sudoku-solver',
  category: 'backtracking',
  description:
    'Solve a 4×4 Sudoku puzzle using backtracking. Each row, column, and 2×2 box must contain each digit from 1 to 4 exactly once.',
  bestCase: 'O(1)',
  averageCase: 'O(4^k)',
  worstCase: 'O(4^16)',
  spaceComplexity: 'O(1)',
  stable: false,
  inPlace: true,
  pseudocode: `function solve():
  find empty cell (row, col)
  if none: return true  // solved
  for num = 1 to 4:
    if isValid(row, col, num):
      board[row][col] = num
      if solve(): return true
      board[row][col] = 0  // backtrack
  return false`,
  visualizerType: 'grid',
  defaultInput: makeSudokuState(),
  run: sudokuCommands,
  reduce: backtrackReducer,
});
