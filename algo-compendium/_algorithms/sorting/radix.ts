import { registerAlgorithm } from '../registry';
import type { SortCommand } from './commands';
import { makeSortState, sortReducer } from './commands';

export function radixSortCommands(input: number[]): SortCommand[] {
  const cmds: SortCommand[] = [];
  if (input.length === 0) return cmds;

  const a = [...input];
  const n = a.length;
  const max = Math.max(...a);

  function countingSortByDigit(exp: number): void {
    const output = new Array(n).fill(0);
    const count = new Array(10).fill(0);

    // Count occurrences
    for (let i = 0; i < n; i++) {
      const digit = Math.floor(a[i] / exp) % 10;
      count[digit]++;
      cmds.push({
        type: 'compare',
        i,
        j: i,
        description: `Count digit ${digit} from a[${i}]=${a[i]} (place ${exp})`,
      });
    }

    // Change count[i] so that it contains the actual position
    for (let i = 1; i < 10; i++) {
      count[i] += count[i - 1];
    }

    // Build output array (traverse right-to-left for stability)
    for (let i = n - 1; i >= 0; i--) {
      const digit = Math.floor(a[i] / exp) % 10;
      output[count[digit] - 1] = a[i];
      count[digit]--;
    }

    // Copy output back and emit set commands
    for (let i = 0; i < n; i++) {
      a[i] = output[i];
      cmds.push({
        type: 'compare',
        i,
        j: i,
        description: `Place ${output[i]} at position ${i} (place ${exp})`,
      });
      cmds.push({
        type: 'set',
        index: i,
        value: output[i],
        description: `Radix (digit place ${exp}): place ${output[i]} at position ${i}`,
      });
    }
  }

  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    countingSortByDigit(exp);
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
  name: 'Radix Sort',
  slug: 'radix-sort',
  category: 'sorting',
  description:
    'A non-comparison integer sorting algorithm that sorts elements digit by digit from the least significant digit (LSD) to the most significant digit (MSD) using counting sort as a stable subroutine.',
  bestCase: 'O(nk)',
  averageCase: 'O(nk)',
  worstCase: 'O(nk)',
  spaceComplexity: 'O(n+k)',
  stable: true,
  inPlace: false,
  pseudocode: `radixSort(a, n)
  max = max(a)
  for exp = 1; max/exp > 0; exp *= 10
    countingSortByDigit(a, n, exp)

countingSortByDigit(a, n, exp)
  count digit = (a[i] / exp) % 10
  build stable output array
  copy back to a`,
  visualizerType: 'array',
  defaultInput: makeSortState([170, 45, 75, 90, 802, 24, 2, 66]),
  run: (state) => radixSortCommands(state.array),
  reduce: sortReducer,
});
