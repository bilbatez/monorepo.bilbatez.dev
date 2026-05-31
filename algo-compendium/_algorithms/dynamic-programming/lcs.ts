import { registerAlgorithm } from '../registry';
import type { GridCommand, GridState } from './commands';
import { makeGridState, gridReducer } from './commands';

export function lcsCommands(state: GridState): GridCommand[] {
  const cmds: GridCommand[] = [];
  const s1 = state.s1 ?? '';
  const s2 = state.s2 ?? '';
  const m = s1.length;
  const n = s2.length;

  // dp[i][j] = LCS length of s1[0..i-1] and s2[0..j-1]
  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    new Array(n + 1).fill(0)
  );

  // Initialize row 0 and col 0 to 0
  for (let j = 0; j <= n; j++) {
    cmds.push({
      type: 'compute',
      row: 0,
      col: j,
      value: 0,
      description: `Base case: dp[0][${j}] = 0`,
    });
  }
  for (let i = 1; i <= m; i++) {
    cmds.push({
      type: 'compute',
      row: i,
      col: 0,
      value: 0,
      description: `Base case: dp[${i}][0] = 0`,
    });
  }

  // Fill DP table
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      cmds.push({
        type: 'compare',
        row: i,
        col: j,
        description: `Compare s1[${i - 1}]='${s1[i - 1]}' with s2[${j - 1}]='${s2[j - 1]}'`,
      });
      if (s1[i - 1] === s2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
        cmds.push({
          type: 'compute',
          row: i,
          col: j,
          value: dp[i][j],
          description: `Match! dp[${i}][${j}] = dp[${i - 1}][${j - 1}] + 1 = ${dp[i][j]}`,
        });
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        cmds.push({
          type: 'compute',
          row: i,
          col: j,
          value: dp[i][j],
          description: `No match. dp[${i}][${j}] = max(${dp[i - 1][j]}, ${dp[i][j - 1]}) = ${dp[i][j]}`,
        });
      }
    }
  }

  // Traceback to find LCS string
  const tracePath: [number, number][] = [];
  let lcsStr = '';
  let i = m;
  let j = n;
  while (i > 0 && j > 0) {
    tracePath.push([i, j]);
    if (s1[i - 1] === s2[j - 1]) {
      lcsStr = s1[i - 1] + lcsStr;
      i--;
      j--;
    } else if (dp[i - 1][j] > dp[i][j - 1]) {
      i--;
    } else {
      j--;
    }
  }

  cmds.push({
    type: 'trace',
    cells: tracePath,
    description: `Traceback path highlighted`,
  });

  cmds.push({
    type: 'set_result',
    result: lcsStr || '(empty)',
    description: `LCS = "${lcsStr}" (length ${dp[m][n]})`,
  });

  return cmds;
}

const s1 = 'ABCBDAB';
const s2 = 'BDCABA';

registerAlgorithm({
  name: 'Longest Common Subsequence',
  slug: 'lcs',
  category: 'dynamic-programming',
  description:
    'Finds the longest subsequence common to two strings. Uses a 2D DP table where dp[i][j] is the LCS length of the first i characters of s1 and first j characters of s2.',
  bestCase: 'O(mn)',
  averageCase: 'O(mn)',
  worstCase: 'O(mn)',
  spaceComplexity: 'O(mn)',
  stable: false,
  inPlace: false,
  pseudocode: `for i = 0 to m:
  for j = 0 to n:
    if s1[i] == s2[j]:
      dp[i][j] = dp[i-1][j-1] + 1
    else:
      dp[i][j] = max(dp[i-1][j], dp[i][j-1])
// traceback from dp[m][n]`,
  visualizerType: 'grid',
  defaultInput: {
    ...makeGridState(
      s1.length + 1,
      s2.length + 1,
      ['', ...s1.split('')],
      ['', ...s2.split('')]
    ),
    s1,
    s2,
  },
  run: lcsCommands,
  reduce: gridReducer,
});
