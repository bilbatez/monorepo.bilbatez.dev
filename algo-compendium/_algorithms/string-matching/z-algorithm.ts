import { registerAlgorithm } from '../registry';
import type { StringCommand, StringState } from './commands';
import { makeStringState, stringReducer } from './commands';

export function zAlgorithmCommands(
  text: string,
  pattern: string
): StringCommand[] {
  const cmds: StringCommand[] = [];
  const m = pattern.length;
  const n = text.length;

  if (m === 0) return cmds;

  // Build concatenated string: pattern + '$' + text
  const concat = pattern + '$' + text;
  const L = concat.length;
  const Z: number[] = new Array(L).fill(0);

  // Z-array construction
  let l = 0;
  let r = 0;

  for (let i = 1; i < L; i++) {
    if (i < r) {
      Z[i] = Math.min(r - i, Z[i - l]);
    }

    while (i + Z[i] < L && concat[Z[i]] === concat[i + Z[i]]) {
      // This comparison corresponds to pattern char Z[i] vs concat char i+Z[i]
      // Only emit visual commands for the text portion (i > m)
      const textOffset = i - (m + 1);
      if (textOffset >= 0 && i + Z[i] > m + 1) {
        const textIdx = textOffset + Z[i];
        if (textIdx < n) {
          cmds.push({
            type: 'compare',
            textIndex: textIdx,
            patternIndex: Z[i],
            description: `Z-construction: compare pattern[${Z[i]}]='${pattern[Z[i]]}' with text[${textIdx}]='${text[textIdx]}'`,
          });
          cmds.push({
            type: 'match_char',
            textIndex: textIdx,
            patternIndex: Z[i],
            description: `Match at text[${textIdx}]`,
          });
        }
      }
      Z[i]++;
    }

    if (i + Z[i] > r) {
      l = i;
      r = i + Z[i];
    }
  }

  // Now scan the Z-array for matches
  // Z[i] for i >= m+1 gives the match length at text position i-(m+1)
  const occurrences: number[] = [];
  let currentOffset = -1;

  for (let i = m + 1; i < L; i++) {
    const textPos = i - (m + 1);

    if (currentOffset !== textPos) {
      currentOffset = textPos;
      cmds.push({
        type: 'shift',
        newOffset: textPos,
        description: `Check position ${textPos} in text (Z[${i}]=${Z[i]})`,
      });
    }

    if (Z[i] >= m) {
      // Pattern found at textPos
      for (let k = 0; k < m; k++) {
        cmds.push({
          type: 'compare',
          textIndex: textPos + k,
          patternIndex: k,
          description: `Verify match at text[${textPos + k}]='${text[textPos + k]}' == pattern[${k}]='${pattern[k]}'`,
        });
        cmds.push({
          type: 'match_char',
          textIndex: textPos + k,
          patternIndex: k,
          description: `Match: text[${textPos + k}] == pattern[${k}]`,
        });
      }
      occurrences.push(textPos);
      cmds.push({
        type: 'found',
        at: textPos,
        description: `Pattern found at index ${textPos} (Z[${i}]=${Z[i]} >= m=${m})`,
      });
    } else if (Z[i] > 0) {
      // Partial match
      for (let k = 0; k < Z[i]; k++) {
        cmds.push({
          type: 'compare',
          textIndex: textPos + k,
          patternIndex: k,
          description: `Partial: text[${textPos + k}]='${text[textPos + k]}' vs pattern[${k}]='${pattern[k]}'`,
        });
        if (concat[k] === concat[i + k]) {
          cmds.push({
            type: 'match_char',
            textIndex: textPos + k,
            patternIndex: k,
            description: `Match`,
          });
        }
      }
      // Mismatch at Z[i]
      if (textPos + Z[i] < n && Z[i] < m) {
        cmds.push({
          type: 'mismatch',
          textIndex: textPos + Z[i],
          patternIndex: Z[i],
          description: `Mismatch at text[${textPos + Z[i]}]='${text[textPos + Z[i]]}' vs pattern[${Z[i]}]='${pattern[Z[i]]}'`,
        });
      }
    }
  }

  if (occurrences.length === 0) {
    cmds.push({
      type: 'mismatch',
      textIndex: 0,
      patternIndex: 0,
      description: `Pattern "${pattern}" not found in text`,
    });
  }

  return cmds;
}

registerAlgorithm({
  name: 'Z-Algorithm',
  slug: 'z-algorithm',
  category: 'string-matching',
  description:
    'Builds a Z-array for the concatenated string "pattern$text" where Z[i] is the length of the longest substring starting at position i that matches a prefix. Pattern occurrences correspond to Z[i] ≥ pattern length.',
  bestCase: 'O(n+m)',
  averageCase: 'O(n+m)',
  worstCase: 'O(n+m)',
  spaceComplexity: 'O(n+m)',
  pseudocode: `concat = pattern + '$' + text
Z[0] = |concat|; l = 0; r = 0
for i = 1 to |concat|-1:
  if i < r: Z[i] = min(r-i, Z[i-l])
  while i+Z[i] < |concat| and concat[Z[i]] == concat[i+Z[i]]:
    Z[i]++
  if i+Z[i] > r: l=i; r=i+Z[i]
// Z[i] >= m means pattern found at i-(m+1)`,
  visualizerType: 'string',
  defaultInput: makeStringState('AABABCABAB', 'ABAB'),
  run: (state: StringState) => zAlgorithmCommands(state.text, state.pattern),
  reduce: stringReducer,
});
