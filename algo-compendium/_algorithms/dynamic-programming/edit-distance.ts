import { registerAlgorithm } from '../registry';
import type { GridCommand, GridState } from './commands';
import { makeGridState, gridReducer } from './commands';

export function editDistanceCommands(state: GridState): GridCommand[] {
  const cmds: GridCommand[] = [];
  const s1 = state.s1 ?? '';
  const s2 = state.s2 ?? '';
  const m = s1.length;
  const n = s2.length;

  // dp[i][j] = edit distance between s1[0..i-1] and s2[0..j-1]
  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    new Array(n + 1).fill(0)
  );

  // Base cases: row 0 (deletions from s1)
  for (let i = 0; i <= m; i++) {
    dp[i][0] = i;
    cmds.push({
      type: 'compute',
      row: i,
      col: 0,
      value: i,
      description: `Base: dp[${i}][0] = ${i} (delete ${i} chars)`,
    });
  }

  // Base cases: col 0 (insertions into s1)
  for (let j = 1; j <= n; j++) {
    dp[0][j] = j;
    cmds.push({
      type: 'compute',
      row: 0,
      col: j,
      value: j,
      description: `Base: dp[0][${j}] = ${j} (insert ${j} chars)`,
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
        dp[i][j] = dp[i - 1][j - 1];
        cmds.push({
          type: 'compute',
          row: i,
          col: j,
          value: dp[i][j],
          description: `Match! dp[${i}][${j}] = dp[${i - 1}][${j - 1}] = ${dp[i][j]}`,
        });
      } else {
        const del = dp[i - 1][j] + 1;
        const ins = dp[i][j - 1] + 1;
        const rep = dp[i - 1][j - 1] + 1;
        dp[i][j] = Math.min(del, ins, rep);
        cmds.push({
          type: 'compute',
          row: i,
          col: j,
          value: dp[i][j],
          description: `dp[${i}][${j}] = min(del=${del}, ins=${ins}, rep=${rep}) = ${dp[i][j]}`,
        });
      }
    }
  }

  // Traceback
  const tracePath: [number, number][] = [];
  let i = m;
  let j = n;
  while (i > 0 || j > 0) {
    tracePath.push([i, j]);
    if (i === 0) {
      j--;
    } else if (j === 0) {
      i--;
    } else if (s1[i - 1] === s2[j - 1]) {
      i--;
      j--;
    } else {
      const del = dp[i - 1][j];
      const ins = dp[i][j - 1];
      const rep = dp[i - 1][j - 1];
      const minVal = Math.min(del, ins, rep);
      if (rep === minVal) {
        i--;
        j--;
      } else if (del === minVal) {
        i--;
      } else {
        j--;
      }
    }
  }
  tracePath.push([0, 0]);

  cmds.push({
    type: 'trace',
    cells: tracePath,
    description: 'Traceback path highlighted',
  });

  cmds.push({
    type: 'set_result',
    result: dp[m][n],
    description: `Edit distance between "${s1}" and "${s2}" = ${dp[m][n]}`,
  });

  return cmds;
}

const s1 = 'kitten';
const s2 = 'sitting';

registerAlgorithm({
  name: 'Edit Distance',
  slug: 'edit-distance',
  category: 'dynamic-programming',
  description:
    'Computes the minimum number of single-character edits (insertions, deletions, substitutions) required to transform one string into another.',
  bestCase: 'O(mn)',
  averageCase: 'O(mn)',
  worstCase: 'O(mn)',
  spaceComplexity: 'O(mn)',
  stable: false,
  inPlace: false,
  pseudocode: `for i = 0 to m: dp[i][0] = i
for j = 0 to n: dp[0][j] = j
for i = 1 to m:
  for j = 1 to n:
    if s1[i] == s2[j]:
      dp[i][j] = dp[i-1][j-1]
    else:
      dp[i][j] = 1 + min(dp[i-1][j],   // delete
                         dp[i][j-1],   // insert
                         dp[i-1][j-1]) // replace
return dp[m][n]`,
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
  run: editDistanceCommands,
  reduce: gridReducer,
});
