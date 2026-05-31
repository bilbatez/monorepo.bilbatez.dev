import { registerAlgorithm } from '../registry';
import type { SortCommand } from './commands';
import { makeSortState, sortReducer } from './commands';

export function bubbleSortCommands(input: number[]): SortCommand[] {
  const cmds: SortCommand[] = [];
  const a = [...input];
  const n = a.length;

  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      cmds.push({
        type: 'compare',
        i: j,
        j: j + 1,
        description: `Compare a[${j}]=${a[j]} and a[${j + 1}]=${a[j + 1]}`,
      });
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        cmds.push({
          type: 'swap',
          i: j,
          j: j + 1,
          description: `Swap a[${j}] and a[${j + 1}]`,
        });
        swapped = true;
      }
    }
    cmds.push({
      type: 'mark_sorted',
      indices: [n - i - 1],
      description: `Position ${n - i - 1} is sorted`,
    });
    if (!swapped) {
      // Array is already sorted — mark remaining elements
      const remaining: number[] = [];
      for (let k = 0; k < n - i - 1; k++) remaining.push(k);
      if (remaining.length > 0) {
        cmds.push({
          type: 'mark_sorted',
          indices: remaining,
          description: 'Array is fully sorted (early exit)',
        });
      }
      break;
    }
  }
  if (n > 0) {
    cmds.push({
      type: 'mark_sorted',
      indices: [0],
      description: 'All elements sorted',
    });
  }

  return cmds;
}

registerAlgorithm({
  name: 'Bubble Sort',
  slug: 'bubble-sort',
  category: 'sorting',
  description:
    'Repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order. The pass through the list is repeated until no swaps are needed.',
  bestCase: 'O(n)',
  averageCase: 'O(n²)',
  worstCase: 'O(n²)',
  spaceComplexity: 'O(1)',
  stable: true,
  inPlace: true,
  pseudocode: `for i = 0 to n-1
  swapped = false
  for j = 0 to n-i-2
    if a[j] > a[j+1]
      swap(a[j], a[j+1])
      swapped = true
  if not swapped
    break`,
  visualizerType: 'array',
  defaultInput: makeSortState([64, 34, 25, 12, 22, 11, 90]),
  run: (state) => bubbleSortCommands(state.array),
  reduce: sortReducer,
});
