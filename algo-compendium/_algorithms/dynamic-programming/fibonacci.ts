import { registerAlgorithm } from '../registry';
import type { GridCommand, GridState } from './commands';
import { makeGridState, gridReducer } from './commands';

export function fibonacciCommands(state: GridState): GridCommand[] {
  const cmds: GridCommand[] = [];
  const n = state.grid[0].length - 1; // cols - 1
  const dp: number[] = new Array(n + 1).fill(0);

  // Base cases
  dp[0] = 0;
  cmds.push({
    type: 'compute',
    row: 0,
    col: 0,
    value: 0,
    description: 'Base case: dp[0] = 0',
  });

  if (n >= 1) {
    dp[1] = 1;
    cmds.push({
      type: 'compute',
      row: 0,
      col: 1,
      value: 1,
      description: 'Base case: dp[1] = 1',
    });
  }

  for (let i = 2; i <= n; i++) {
    cmds.push({
      type: 'compare',
      row: 0,
      col: i,
      description: `Computing dp[${i}] = dp[${i - 1}] + dp[${i - 2}] = ${dp[i - 1]} + ${dp[i - 2]}`,
    });
    dp[i] = dp[i - 1] + dp[i - 2];
    cmds.push({
      type: 'compute',
      row: 0,
      col: i,
      value: dp[i],
      description: `dp[${i}] = ${dp[i]}`,
    });
  }

  cmds.push({
    type: 'set_result',
    result: dp[n],
    description: `Fibonacci(${n}) = ${dp[n]}`,
  });

  return cmds;
}

registerAlgorithm({
  name: 'Fibonacci',
  slug: 'fibonacci',
  category: 'dynamic-programming',
  description:
    'Computes the nth Fibonacci number using bottom-up dynamic programming, storing all values in a 1D table to avoid redundant computation.',
  bestCase: 'O(n)',
  averageCase: 'O(n)',
  worstCase: 'O(n)',
  spaceComplexity: 'O(n)',
  stable: false,
  inPlace: false,
  pseudocode: `dp[0] = 0, dp[1] = 1
for i = 2 to n:
  dp[i] = dp[i-1] + dp[i-2]
return dp[n]`,
  visualizerType: 'grid',
  defaultInput: makeGridState(
    1,
    11,
    ['dp'],
    ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
  ),
  run: fibonacciCommands,
  reduce: gridReducer,
});
