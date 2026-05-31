import { registerAlgorithm } from '../registry';
import type { GridCommand, GridState } from './commands';
import { makeGridState, gridReducer } from './commands';

export function lisCommands(state: GridState): GridCommand[] {
  const cmds: GridCommand[] = [];
  const arr = state.arr ?? [];
  const n = arr.length;

  if (n === 0) {
    cmds.push({
      type: 'set_result',
      result: 0,
      description: 'Empty array — LIS length = 0',
    });
    return cmds;
  }

  // dp[i] = length of LIS ending at index i
  const dp: number[] = new Array(n).fill(1);

  // Initialize all cells to 1 (each element is a LIS of length 1)
  for (let i = 0; i < n; i++) {
    cmds.push({
      type: 'compute',
      row: 0,
      col: i,
      value: 1,
      description: `dp[${i}] = 1 (LIS ending at arr[${i}]=${arr[i]} starts at 1)`,
    });
  }

  // Fill DP table O(n²)
  for (let i = 1; i < n; i++) {
    for (let j = 0; j < i; j++) {
      cmds.push({
        type: 'compare',
        row: 0,
        col: j,
        description: `Compare arr[${j}]=${arr[j]} with arr[${i}]=${arr[i]}`,
      });
      if (arr[j] < arr[i] && dp[j] + 1 > dp[i]) {
        dp[i] = dp[j] + 1;
        cmds.push({
          type: 'compute',
          row: 0,
          col: i,
          value: dp[i],
          description: `arr[${j}]=${arr[j]} < arr[${i}]=${arr[i]}, update dp[${i}] = ${dp[i]}`,
        });
      }
    }
    cmds.push({
      type: 'highlight',
      row: 0,
      col: i,
      description: `dp[${i}] = ${dp[i]} (LIS ending at arr[${i}]=${arr[i]})`,
    });
  }

  const lisLength = Math.max(...dp);
  cmds.push({
    type: 'set_result',
    result: lisLength,
    description: `Longest Increasing Subsequence length = ${lisLength}`,
  });

  return cmds;
}

const defaultArr = [10, 9, 2, 5, 3, 7, 101, 18];

registerAlgorithm({
  name: 'Longest Increasing Subsequence',
  slug: 'lis',
  category: 'dynamic-programming',
  description:
    'Finds the length of the longest strictly increasing subsequence in an array. Uses O(n²) DP where dp[i] is the LIS length ending at index i.',
  bestCase: 'O(n²)',
  averageCase: 'O(n²)',
  worstCase: 'O(n²)',
  spaceComplexity: 'O(n)',
  stable: false,
  inPlace: false,
  pseudocode: `for i = 0 to n-1:
  dp[i] = 1
for i = 1 to n-1:
  for j = 0 to i-1:
    if arr[j] < arr[i]:
      dp[i] = max(dp[i], dp[j] + 1)
return max(dp)`,
  visualizerType: 'grid',
  defaultInput: {
    ...makeGridState(1, defaultArr.length, ['dp'], defaultArr.map(String)),
    arr: defaultArr,
  },
  run: lisCommands,
  reduce: gridReducer,
});
