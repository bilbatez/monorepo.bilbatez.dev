import { registerAlgorithm } from '../registry';
import type { GridCommand, GridState } from './commands';
import { makeGridState, gridReducer } from './commands';

// dims = [10, 30, 5, 60] means 3 matrices: A(10x30), B(30x5), C(5x60)
const DIMS = [10, 30, 5, 60];
const N = DIMS.length - 1; // 3 matrices

function makeMatrixChainState(): GridState {
  return makeGridState(N, N, ['A', 'B', 'C'], ['A', 'B', 'C']);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function matrixChainCommands(_state: GridState): GridCommand[] {
  const cmds: GridCommand[] = [];
  const dims = DIMS;
  const n = dims.length - 1;

  // dp[i][j] = min cost to multiply matrices i..j (0-indexed)
  const dp: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));

  // Base case: single matrices cost 0
  for (let i = 0; i < n; i++) {
    cmds.push({
      type: 'compute',
      row: i,
      col: i,
      value: 0,
      description: `Base case: dp[${i}][${i}] = 0 (single matrix)`,
    });
  }

  // Fill for chain lengths 2, 3, ...
  for (let len = 2; len <= n; len++) {
    for (let i = 0; i <= n - len; i++) {
      const j = i + len - 1;
      dp[i][j] = Infinity;

      cmds.push({
        type: 'highlight',
        row: i,
        col: j,
        description: `Compute dp[${i}][${j}]: min cost for matrices ${i}..${j}`,
      });

      for (let k = i; k < j; k++) {
        cmds.push({
          type: 'compare',
          row: i,
          col: j,
          description: `Try split at k=${k}: cost = dp[${i}][${k}] + dp[${k + 1}][${j}] + ${dims[i]}×${dims[k + 1]}×${dims[j + 1]}`,
        });

        const cost =
          dp[i][k] + dp[k + 1][j] + dims[i] * dims[k + 1] * dims[j + 1];

        if (cost < dp[i][j]) {
          dp[i][j] = cost;
        }
      }

      cmds.push({
        type: 'compute',
        row: i,
        col: j,
        value: dp[i][j],
        description: `dp[${i}][${j}] = ${dp[i][j]} (min multiplications)`,
      });
    }
  }

  // Trace optimal path
  cmds.push({
    type: 'trace',
    cells: [[0, n - 1]],
    description: `Optimal total cost at dp[0][${n - 1}] = ${dp[0][n - 1]}`,
  });

  cmds.push({
    type: 'set_result',
    result: `Min cost: ${dp[0][n - 1]}`,
    description: `Minimum multiplications: ${dp[0][n - 1]}`,
  });

  return cmds;
}

registerAlgorithm({
  name: 'Matrix Chain Multiplication',
  slug: 'matrix-chain',
  category: 'dynamic-programming',
  description:
    'Finds the optimal order to multiply a chain of matrices to minimize the total number of scalar multiplications. Uses a DP table where dp[i][j] = min cost to multiply matrices i through j.',
  bestCase: 'O(n³)',
  averageCase: 'O(n³)',
  worstCase: 'O(n³)',
  spaceComplexity: 'O(n²)',
  pseudocode: `for i = 0 to n-1: dp[i][i] = 0
for len = 2 to n:
  for i = 0 to n-len:
    j = i + len - 1
    dp[i][j] = ∞
    for k = i to j-1:
      cost = dp[i][k] + dp[k+1][j] + dims[i]*dims[k+1]*dims[j+1]
      dp[i][j] = min(dp[i][j], cost)`,
  visualizerType: 'grid',
  defaultInput: makeMatrixChainState(),
  run: matrixChainCommands,
  reduce: gridReducer,
});
