import { registerAlgorithm } from '../registry';
import type { SortCommand } from './commands';
import { makeSortState, sortReducer } from './commands';

export function selectionSortCommands(input: number[]): SortCommand[] {
  const cmds: SortCommand[] = [];
  const a = [...input];
  const n = a.length;

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    cmds.push({
      type: 'set_pivot',
      index: i,
      description: `Assume a[${i}]=${a[i]} is the minimum`,
    });
    for (let j = i + 1; j < n; j++) {
      cmds.push({
        type: 'compare',
        i: minIdx,
        j,
        description: `Compare a[${minIdx}]=${a[minIdx]} and a[${j}]=${a[j]}`,
      });
      if (a[j] < a[minIdx]) {
        minIdx = j;
        cmds.push({
          type: 'set_pivot',
          index: minIdx,
          description: `New minimum found: a[${minIdx}]=${a[minIdx]}`,
        });
      }
    }
    if (minIdx !== i) {
      [a[i], a[minIdx]] = [a[minIdx], a[i]];
      cmds.push({
        type: 'swap',
        i,
        j: minIdx,
        description: `Swap minimum a[${minIdx}] to position ${i}`,
      });
    }
    cmds.push({
      type: 'clear_pivot',
      description: `Position ${i} is sorted`,
    });
    cmds.push({
      type: 'mark_sorted',
      indices: [i],
      description: `Position ${i} is sorted`,
    });
  }
  if (n > 0) {
    cmds.push({
      type: 'mark_sorted',
      indices: [n - 1],
      description: 'All elements sorted',
    });
  }

  return cmds;
}

registerAlgorithm({
  name: 'Selection Sort',
  slug: 'selection-sort',
  category: 'sorting',
  description:
    'Divides the list into a sorted and unsorted portion. On each pass, finds the minimum element from the unsorted portion and places it at the end of the sorted portion.',
  bestCase: 'O(n²)',
  averageCase: 'O(n²)',
  worstCase: 'O(n²)',
  spaceComplexity: 'O(1)',
  stable: false,
  inPlace: true,
  pseudocode: `for i = 0 to n-2
  minIdx = i
  for j = i+1 to n-1
    if a[j] < a[minIdx]
      minIdx = j
  if minIdx != i
    swap(a[i], a[minIdx])`,
  visualizerType: 'array',
  defaultInput: makeSortState([64, 34, 25, 12, 22, 11, 90]),
  run: (state) => selectionSortCommands(state.array),
  reduce: sortReducer,
});
