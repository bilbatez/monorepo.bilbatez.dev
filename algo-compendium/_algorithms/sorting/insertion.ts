import { registerAlgorithm } from '../registry';
import type { SortCommand } from './commands';
import { makeSortState, sortReducer } from './commands';

export function insertionSortCommands(input: number[]): SortCommand[] {
  const cmds: SortCommand[] = [];
  const a = [...input];
  const n = a.length;

  if (n > 0) {
    cmds.push({
      type: 'mark_sorted',
      indices: [0],
      description: 'First element is trivially sorted',
    });
  }

  for (let i = 1; i < n; i++) {
    const key = a[i];
    let j = i - 1;
    cmds.push({
      type: 'set_pivot',
      index: i,
      description: `Insert a[${i}]=${key} into sorted portion`,
    });
    while (j >= 0 && a[j] > key) {
      cmds.push({
        type: 'compare',
        i: j,
        j: j + 1,
        description: `a[${j}]=${a[j]} > ${key}, shift right`,
      });
      a[j + 1] = a[j];
      cmds.push({
        type: 'set',
        index: j + 1,
        value: a[j + 1],
        description: `Shift a[${j}]=${a[j]} to position ${j + 1}`,
      });
      j--;
    }
    a[j + 1] = key;
    cmds.push({
      type: 'set',
      index: j + 1,
      value: key,
      description: `Place ${key} at position ${j + 1}`,
    });
    cmds.push({
      type: 'clear_pivot',
      description: `Positions 0..${i} are sorted`,
    });
    cmds.push({
      type: 'mark_sorted',
      indices: [i],
      description: `Positions 0..${i} are sorted`,
    });
  }

  return cmds;
}

registerAlgorithm({
  name: 'Insertion Sort',
  slug: 'insertion-sort',
  category: 'sorting',
  description:
    'Builds the sorted array one element at a time by picking each element and inserting it into its correct position in the already-sorted portion.',
  bestCase: 'O(n)',
  averageCase: 'O(n²)',
  worstCase: 'O(n²)',
  spaceComplexity: 'O(1)',
  stable: true,
  inPlace: true,
  pseudocode: `for i = 1 to n-1
  key = a[i]
  j = i - 1
  while j >= 0 and a[j] > key
    a[j+1] = a[j]
    j = j - 1
  a[j+1] = key`,
  visualizerType: 'array',
  legendLabels: { pivot: 'key' },
  defaultInput: makeSortState([64, 34, 25, 12, 22, 11, 90]),
  run: (state) => insertionSortCommands(state.array),
  reduce: sortReducer,
});
