import { registerAlgorithm } from '../registry';
import type { StringCommand, StringState } from './commands';
import { makeStringState, stringReducer } from './commands';

export function kmpSearchCommands(
  text: string,
  pattern: string
): StringCommand[] {
  const cmds: StringCommand[] = [];
  const n = text.length;
  const m = pattern.length;

  if (m === 0) return cmds;

  // Build failure function (prefix table)
  const failure: number[] = new Array(m).fill(0);
  cmds.push({
    type: 'update_failure',
    index: 0,
    value: 0,
    description: `Failure table: failure[0] = 0 (base case)`,
  });

  let k = 0;
  for (let i = 1; i < m; i++) {
    while (k > 0 && pattern[k] !== pattern[i]) {
      k = failure[k - 1];
    }
    if (pattern[k] === pattern[i]) {
      k++;
    }
    failure[i] = k;
    cmds.push({
      type: 'update_failure',
      index: i,
      value: k,
      description: `Failure table: failure[${i}] = ${k} (prefix of length ${k} matches suffix ending at ${i})`,
    });
  }

  // Search phase
  let q = 0; // number of chars matched
  cmds.push({
    type: 'shift',
    newOffset: 0,
    description: `Start search: aligning pattern at offset 0`,
  });

  for (let i = 0; i < n; i++) {
    while (q > 0 && pattern[q] !== text[i]) {
      const newOffset = i - failure[q - 1];
      cmds.push({
        type: 'mismatch',
        textIndex: i,
        patternIndex: q,
        description: `Mismatch: text[${i}]='${text[i]}' != pattern[${q}]='${pattern[q]}', use failure table`,
      });
      q = failure[q - 1];
      cmds.push({
        type: 'shift',
        newOffset: newOffset,
        description: `KMP shift: new offset ${newOffset}, resume matching at pattern[${q}]`,
      });
    }

    cmds.push({
      type: 'compare',
      textIndex: i,
      patternIndex: q,
      description: `Compare text[${i}]='${text[i]}' with pattern[${q}]='${pattern[q]}'`,
    });

    if (pattern[q] === text[i]) {
      cmds.push({
        type: 'match_char',
        textIndex: i,
        patternIndex: q,
        description: `Match: text[${i}]='${text[i]}' == pattern[${q}]='${pattern[q]}'`,
      });
      q++;
    } else {
      cmds.push({
        type: 'mismatch',
        textIndex: i,
        patternIndex: q,
        description: `Mismatch: text[${i}]='${text[i]}' != pattern[${q}]='${pattern[q]}'`,
      });
    }

    if (q === m) {
      const at = i - m + 1;
      cmds.push({
        type: 'found',
        at,
        description: `Pattern found at index ${at}`,
      });
      const newOffset = at + failure[q - 1];
      q = failure[q - 1];
      if (i + 1 < n) {
        cmds.push({
          type: 'shift',
          newOffset: newOffset,
          description: `After match: shift to offset ${newOffset} using failure table`,
        });
      }
    }
  }

  return cmds;
}

registerAlgorithm({
  name: 'KMP Search',
  slug: 'kmp-search',
  category: 'string-matching',
  description:
    'Knuth-Morris-Pratt algorithm preprocesses the pattern to build a failure function that allows skipping redundant comparisons. Achieves linear time complexity by never re-examining characters.',
  bestCase: 'O(n)',
  averageCase: 'O(n+m)',
  worstCase: 'O(n+m)',
  spaceComplexity: 'O(m)',
  pseudocode: `// Preprocessing: build failure table
failure[0] = 0
k = 0
for i = 1 to m-1:
  while k > 0 and pattern[k] != pattern[i]:
    k = failure[k-1]
  if pattern[k] == pattern[i]: k++
  failure[i] = k

// Search
q = 0
for i = 0 to n-1:
  while q > 0 and pattern[q] != text[i]:
    q = failure[q-1]
  if pattern[q] == text[i]: q++
  if q == m:
    report match at i - m + 1
    q = failure[q-1]`,
  visualizerType: 'string',
  defaultInput: makeStringState('AABAACAADAABAABA', 'AABA'),
  run: (state: StringState) => kmpSearchCommands(state.text, state.pattern),
  reduce: stringReducer,
});
