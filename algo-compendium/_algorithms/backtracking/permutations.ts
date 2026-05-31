import { registerAlgorithm } from '../registry';
import type { GridState, BacktrackCommand } from './commands';
import { makeGridState, backtrackReducer } from './commands';

export function permutationsCommands(state: GridState): BacktrackCommand[] {
  const cmds: BacktrackCommand[] = [];
  const n = state.grid[0].length; // number of elements (cols)
  const elements: number[] = Array.from({ length: n }, (_, i) => i + 1);
  const arr = [...elements];
  let resultRow = 0;
  let permCount = 0;

  function swap(i: number, j: number) {
    cmds.push({
      type: 'highlight',
      row: resultRow,
      col: i,
      description: `Swapping positions ${i} and ${j}: [${arr.join(', ')}]`,
    });
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  function generate(start: number) {
    if (start === n) {
      // Record this permutation in the result row
      for (let c = 0; c < n; c++) {
        cmds.push({
          type: 'compute',
          row: resultRow,
          col: c,
          value: arr[c],
          description: `Permutation ${permCount + 1}: [${arr.join(', ')}] — place ${arr[c]} at position ${c}`,
        });
      }
      permCount++;
      resultRow++;
      return;
    }

    for (let i = start; i < n; i++) {
      swap(start, i);
      generate(start + 1);
      swap(start, i); // restore
    }
  }

  generate(0);

  cmds.push({
    type: 'set_result',
    result: permCount,
    description: `Found ${permCount} permutations of [${elements.join(', ')}] (${n}! = ${permCount})`,
  });

  return cmds;
}

registerAlgorithm({
  name: 'Permutations',
  slug: 'permutations',
  category: 'backtracking',
  description:
    'Generate all permutations of [1, 2, 3] using backtracking with in-place swapping. Each row in the grid shows one permutation.',
  bestCase: 'O(n!)',
  averageCase: 'O(n!)',
  worstCase: 'O(n!)',
  spaceComplexity: 'O(n)',
  stable: false,
  inPlace: true,
  pseudocode: `function generate(start):
  if start == n:
    record permutation
    return
  for i = start to n-1:
    swap(arr[start], arr[i])
    generate(start + 1)
    swap(arr[start], arr[i])  // backtrack`,
  visualizerType: 'grid',
  defaultInput: makeGridState(
    6,
    3,
    ['p1', 'p2', 'p3', 'p4', 'p5', 'p6'],
    ['[0]', '[1]', '[2]']
  ),
  run: permutationsCommands,
  reduce: backtrackReducer,
});
