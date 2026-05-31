import { registerAlgorithm } from '../registry';
import type { StringCommand, StringState } from './commands';
import { makeStringState, stringReducer } from './commands';

export function boyerMooreSearchCommands(
  text: string,
  pattern: string
): StringCommand[] {
  const cmds: StringCommand[] = [];
  const n = text.length;
  const m = pattern.length;

  if (m === 0) return cmds;

  // Build bad character table
  const badChar = new Map<string, number>();
  for (let i = 0; i < m; i++) {
    badChar.set(pattern[i], i);
  }

  let offset = 0;

  while (offset <= n - m) {
    cmds.push({
      type: 'shift',
      newOffset: offset,
      description: `Aligning pattern at offset ${offset}`,
    });

    // Compare right to left
    let j = m - 1;
    let mismatchFound = false;

    while (j >= 0) {
      const ti = offset + j;
      cmds.push({
        type: 'compare',
        textIndex: ti,
        patternIndex: j,
        description: `Compare text[${ti}]='${text[ti]}' with pattern[${j}]='${pattern[j]}' (right-to-left)`,
      });

      if (text[ti] === pattern[j]) {
        cmds.push({
          type: 'match_char',
          textIndex: ti,
          patternIndex: j,
          description: `Match: text[${ti}]='${text[ti]}' == pattern[${j}]='${pattern[j]}'`,
        });
        j--;
      } else {
        cmds.push({
          type: 'mismatch',
          textIndex: ti,
          patternIndex: j,
          description: `Mismatch: text[${ti}]='${text[ti]}' != pattern[${j}]='${pattern[j]}'`,
        });

        // Bad character heuristic
        const lastOccurrence = badChar.get(text[ti]) ?? -1;
        const shift = Math.max(1, j - lastOccurrence);
        const newOffset = offset + shift;

        cmds.push({
          type: 'shift',
          newOffset,
          description: `Bad character '${text[ti]}' last seen at pattern[${lastOccurrence}]; shift by ${shift} to offset ${newOffset}`,
        });
        offset = newOffset;
        mismatchFound = true;
        break;
      }
    }

    if (!mismatchFound) {
      // Full match
      cmds.push({
        type: 'found',
        at: offset,
        description: `Pattern found at index ${offset}`,
      });
      // Shift by 1 to continue searching
      const newOffset = offset + 1;
      cmds.push({
        type: 'shift',
        newOffset,
        description: `Continue search after match at offset ${newOffset}`,
      });
      offset = newOffset;
    }
  }

  return cmds;
}

registerAlgorithm({
  name: 'Boyer-Moore Search',
  slug: 'boyer-moore-search',
  category: 'string-matching',
  description:
    'Compares the pattern right-to-left and uses the bad character heuristic to skip large portions of the text. Often the fastest practical string matching algorithm for large alphabets.',
  bestCase: 'O(n/m)',
  averageCase: 'O(n/m)',
  worstCase: 'O(nm)',
  spaceComplexity: 'O(m+σ)',
  pseudocode: `preprocess bad-character table
offset = 0
while offset <= n - m:
  j = m - 1
  while j >= 0 and pattern[j] == text[offset + j]:
    j--
  if j < 0:
    report match at offset
    offset += 1
  else:
    last = bad_char.get(text[offset + j], -1)
    offset += max(1, j - last)`,
  visualizerType: 'string',
  defaultInput: makeStringState('AABAACAADAABAABA', 'AABA'),
  run: (state: StringState) =>
    boyerMooreSearchCommands(state.text, state.pattern),
  reduce: stringReducer,
});
