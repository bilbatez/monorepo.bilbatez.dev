import { registerAlgorithm } from '../registry';
import type { SortCommand } from './commands';
import { makeSortState, sortReducer } from './commands';

export function countingSortCommands(input: number[]): SortCommand[] {
  const cmds: SortCommand[] = [];
  if (input.length === 0) return cmds;

  const a = [...input];
  const n = a.length;

  // Find range (clamp to 0-99 for this visualizer)
  const min = Math.min(...a);
  const max = Math.max(...a);
  const range = max - min + 1;

  // Build count array
  const count = new Array(range).fill(0);
  for (const val of a) {
    count[val - min]++;
  }

  // Build output array using set commands
  let outIdx = 0;
  for (let i = 0; i < range; i++) {
    while (count[i] > 0) {
      const value = i + min;
      cmds.push({
        type: 'set',
        index: outIdx,
        value,
        description: `Place value ${value} at position ${outIdx}`,
      });
      a[outIdx] = value;
      outIdx++;
      count[i]--;
    }
  }

  const allIndices = Array.from({ length: n }, (_, i) => i);
  cmds.push({
    type: 'mark_sorted',
    indices: allIndices,
    description: 'All elements sorted',
  });

  return cmds;
}

registerAlgorithm({
  name: 'Counting Sort',
  slug: 'counting-sort',
  category: 'sorting',
  description:
    'A non-comparison integer sorting algorithm that counts the occurrences of each value and uses those counts to place elements directly in their final positions. Efficient for small integer ranges.',
  bestCase: 'O(n+k)',
  averageCase: 'O(n+k)',
  worstCase: 'O(n+k)',
  spaceComplexity: 'O(k)',
  stable: true,
  inPlace: false,
  pseudocode: `countingSort(a, n)
  min = min(a), max = max(a)
  count[0..max-min] = 0
  for each val in a
    count[val - min]++
  outIdx = 0
  for i = 0 to max-min
    while count[i] > 0
      a[outIdx++] = i + min
      count[i]--`,
  visualizerType: 'array',
  defaultInput: makeSortState([45, 12, 78, 34, 56, 23, 89, 11, 67, 5]),
  run: (state) => countingSortCommands(state.array),
  reduce: sortReducer,
});
