import { registerAlgorithm } from '../registry';
import type { BacktrackCommand } from './commands';
import { makeGridState, backtrackReducer } from './commands';
import type { GridState } from './commands';

const BOARD_SIZE = 5;

// All 8 possible knight moves
const MOVES: [number, number][] = [
  [2, 1],
  [1, 2],
  [-1, 2],
  [-2, 1],
  [-2, -1],
  [-1, -2],
  [1, -2],
  [2, -1],
];

function isValid(row: number, col: number, visited: boolean[][]): boolean {
  return (
    row >= 0 &&
    row < BOARD_SIZE &&
    col >= 0 &&
    col < BOARD_SIZE &&
    !visited[row][col]
  );
}

// Warnsdorff's heuristic: pick the move with the fewest onward moves
function getDegree(row: number, col: number, visited: boolean[][]): number {
  let count = 0;
  for (const [dr, dc] of MOVES) {
    if (isValid(row + dr, col + dc, visited)) count++;
  }
  return count;
}

function findKnightsTour(
  startRow: number,
  startCol: number
): [number, number][] | null {
  const visited: boolean[][] = Array.from({ length: BOARD_SIZE }, () =>
    new Array(BOARD_SIZE).fill(false)
  );
  const path: [number, number][] = [[startRow, startCol]];
  visited[startRow][startCol] = true;
  let row = startRow;
  let col = startCol;

  for (let move = 1; move < BOARD_SIZE * BOARD_SIZE; move++) {
    // Get all valid next moves
    const candidates: { row: number; col: number; degree: number }[] = [];
    for (const [dr, dc] of MOVES) {
      const nr = row + dr;
      const nc = col + dc;
      if (isValid(nr, nc, visited)) {
        candidates.push({
          row: nr,
          col: nc,
          degree: getDegree(nr, nc, visited),
        });
      }
    }

    if (candidates.length === 0) return null;

    // Pick move with minimum degree (Warnsdorff's rule)
    candidates.sort((a, b) => a.degree - b.degree);
    const next = candidates[0];
    visited[next.row][next.col] = true;
    path.push([next.row, next.col]);
    row = next.row;
    col = next.col;
  }

  return path;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function knightsTourCommands(_state: GridState): BacktrackCommand[] {
  const cmds: BacktrackCommand[] = [];

  const tour = findKnightsTour(0, 0);

  if (!tour) {
    cmds.push({
      type: 'set_result',
      result: 'No tour found',
      description: 'Warnsdorff heuristic failed to find a tour',
    });
    return cmds;
  }

  // Emit commands for each move in the tour
  for (let i = 0; i < tour.length; i++) {
    const [row, col] = tour[i];
    const moveNumber = i + 1;

    cmds.push({
      type: 'highlight',
      row,
      col,
      description: `Move ${moveNumber}: knight moves to (${row}, ${col})`,
    });

    cmds.push({
      type: 'compute',
      row,
      col,
      value: moveNumber,
      description: `Place move number ${moveNumber} at (${row}, ${col})`,
    });
  }

  // Trace the tour path
  const traceCells: [number, number][] = tour.map(([r, c]) => [r, c]);
  cmds.push({
    type: 'trace',
    cells: traceCells,
    description: `Knight's tour complete: all ${BOARD_SIZE * BOARD_SIZE} squares visited`,
  });

  cmds.push({
    type: 'set_result',
    result: 'Tour complete!',
    description: `Knight visited all ${BOARD_SIZE * BOARD_SIZE} squares`,
  });

  return cmds;
}

registerAlgorithm({
  name: "Knight's Tour",
  slug: 'knights-tour',
  category: 'backtracking',
  description:
    "Finds a sequence of knight moves on a 5×5 chessboard such that the knight visits every square exactly once. Uses Warnsdorff's heuristic: always move to the square with the fewest onward moves.",
  bestCase: 'O(8^n)',
  averageCase: 'O(8^n)',
  worstCase: 'O(8^n)',
  spaceComplexity: 'O(n²)',
  pseudocode: `function warnsdorff(row, col):
  visited[row][col] = true
  for move = 1 to n*n - 1:
    candidates = valid next squares
    sort candidates by number of onward moves (ascending)
    next = candidates[0]  // fewest onward moves
    visited[next.row][next.col] = true
    move to next`,
  visualizerType: 'grid',
  defaultInput: makeGridState(
    BOARD_SIZE,
    BOARD_SIZE,
    ['0', '1', '2', '3', '4'],
    ['0', '1', '2', '3', '4']
  ),
  run: knightsTourCommands,
  reduce: backtrackReducer,
});
