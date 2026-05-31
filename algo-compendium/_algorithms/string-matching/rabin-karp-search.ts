import { registerAlgorithm } from '../registry';
import type { StringCommand, StringState } from './commands';
import { makeStringState, stringReducer } from './commands';

const BASE = 31;
const MOD = 1_000_000_007;

export function rabinKarpSearchCommands(
  text: string,
  pattern: string
): StringCommand[] {
  const cmds: StringCommand[] = [];
  const n = text.length;
  const m = pattern.length;

  if (m === 0 || m > n) return cmds;

  // Compute pattern hash and initial window hash
  let patternHash = 0;
  let textHash = 0;
  let highPow = 1; // BASE^(m-1) mod MOD

  for (let i = 0; i < m - 1; i++) {
    highPow = (highPow * BASE) % MOD;
  }

  for (let i = 0; i < m; i++) {
    patternHash = (patternHash * BASE + pattern.charCodeAt(i)) % MOD;
    textHash = (textHash * BASE + text.charCodeAt(i)) % MOD;
  }

  cmds.push({
    type: 'update_hash',
    textHash,
    patternHash,
    description: `Initial hashes — text window[0..${m - 1}]: ${textHash}, pattern: ${patternHash}`,
  });

  for (let offset = 0; offset <= n - m; offset++) {
    cmds.push({
      type: 'shift',
      newOffset: offset,
      description: `Check window at offset ${offset} (hash: ${textHash})`,
    });

    if (textHash === patternHash) {
      // Hash match — verify character by character
      let matched = true;
      for (let j = 0; j < m; j++) {
        const ti = offset + j;
        cmds.push({
          type: 'compare',
          textIndex: ti,
          patternIndex: j,
          description: `Hash match! Verify: text[${ti}]='${text[ti]}' vs pattern[${j}]='${pattern[j]}'`,
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
            description: `Spurious hash hit — mismatch: text[${ti}]='${text[ti]}' != pattern[${j}]='${pattern[j]}'`,
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

    // Roll the hash to next window
    if (offset < n - m) {
      textHash =
        (BASE * (textHash - ((text.charCodeAt(offset) * highPow) % MOD)) +
          text.charCodeAt(offset + m) +
          MOD * 2) %
        MOD;
      cmds.push({
        type: 'update_hash',
        textHash,
        patternHash,
        description: `Rolling hash: remove '${text[offset]}', add '${text[offset + m]}' → new hash ${textHash}`,
      });
    }
  }

  return cmds;
}

registerAlgorithm({
  name: 'Rabin-Karp Search',
  slug: 'rabin-karp-search',
  category: 'string-matching',
  description:
    'Uses rolling hash to efficiently scan the text. Computes a hash for each window of the text and compares it against the pattern hash. Only performs character-by-character verification on hash matches.',
  bestCase: 'O(n)',
  averageCase: 'O(n+m)',
  worstCase: 'O(nm)',
  spaceComplexity: 'O(1)',
  pseudocode: `compute patternHash and textHash for first window
for offset = 0 to n - m:
  if textHash == patternHash:
    verify character by character
    if all match: report match at offset
  if offset < n - m:
    roll hash: remove leftmost char, add next char`,
  visualizerType: 'string',
  defaultInput: makeStringState('AABAACAADAABAABA', 'AABA'),
  run: (state: StringState) =>
    rabinKarpSearchCommands(state.text, state.pattern),
  reduce: stringReducer,
});
