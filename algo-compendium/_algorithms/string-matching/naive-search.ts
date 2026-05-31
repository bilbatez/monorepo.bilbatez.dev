import { registerAlgorithm } from '../registry';
import type { StringCommand, StringState } from './commands';
import { makeStringState, stringReducer } from './commands';

export function naiveSearchCommands(
  text: string,
  pattern: string
): StringCommand[] {
  const cmds: StringCommand[] = [];
  const n = text.length;
  const m = pattern.length;

  if (m === 0) return cmds;

  for (let offset = 0; offset <= n - m; offset++) {
    cmds.push({
      type: 'shift',
      newOffset: offset,
      description: `Aligning pattern at offset ${offset}`,
    });

    let matched = true;
    for (let j = 0; j < m; j++) {
      const ti = offset + j;
      cmds.push({
        type: 'compare',
        textIndex: ti,
        patternIndex: j,
        description: `Compare text[${ti}]='${text[ti]}' with pattern[${j}]='${pattern[j]}'`,
      });

      if (text[ti] === pattern[j]) {
        cmds.push({
          type: 'match_char',
          textIndex: ti,
          patternIndex: j,
          description: `Match: text[${ti}]='${text[ti]}' == pattern[${j}]='${pattern[j]}'`,
        });
      } else {
        cmds.push({
          type: 'mismatch',
          textIndex: ti,
          patternIndex: j,
          description: `Mismatch: text[${ti}]='${text[ti]}' != pattern[${j}]='${pattern[j]}'`,
        });
        matched = false;
        break;
      }
    }

    if (matched) {
      cmds.push({
        type: 'found',
        at: offset,
        description: `Pattern found at index ${offset}`,
      });
    }
  }

  return cmds;
}

registerAlgorithm({
  name: 'Naive String Search',
  slug: 'naive-search',
  category: 'string-matching',
  description:
    'The simplest string matching algorithm that checks for the pattern at each position in the text by comparing characters one by one. Simple but inefficient for large inputs.',
  bestCase: 'O(n)',
  averageCase: 'O(nm)',
  worstCase: 'O(nm)',
  spaceComplexity: 'O(1)',
  pseudocode: `for offset = 0 to n - m:
  matched = true
  for j = 0 to m - 1:
    if text[offset + j] != pattern[j]:
      matched = false
      break
  if matched:
    report match at offset`,
  visualizerType: 'string',
  defaultInput: makeStringState('AABAACAADAABAABA', 'AABA'),
  run: (state: StringState) => naiveSearchCommands(state.text, state.pattern),
  reduce: stringReducer,
});
