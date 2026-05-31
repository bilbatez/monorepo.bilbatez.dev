import { registerAlgorithm } from '../registry';
import type { SortCommand } from './commands';
import { makeSortState, sortReducer } from './commands';

export function cocktailShakerSortCommands(input: number[]): SortCommand[] {
  const cmds: SortCommand[] = [];
  const a = [...input];
  const n = a.length;
  let start = 0;
  let end = n - 1;
  let swapped = true;

  while (swapped) {
    swapped = false;
    // Forward pass
    for (let i = start; i < end; i++) {
      cmds.push({
        type: 'compare',
        i,
        j: i + 1,
        description: `Forward: compare a[${i}]=${a[i]} and a[${i + 1}]=${a[i + 1]}`,
      });
      if (a[i] > a[i + 1]) {
        [a[i], a[i + 1]] = [a[i + 1], a[i]];
        cmds.push({
          type: 'swap',
          i,
          j: i + 1,
          description: `Swap a[${i}] and a[${i + 1}]`,
        });
        swapped = true;
      }
    }
    cmds.push({
      type: 'mark_sorted',
      indices: [end],
      description: `Position ${end} is sorted`,
    });
    end--;

    if (!swapped) break;

    swapped = false;
    // Backward pass
    for (let i = end; i > start; i--) {
      cmds.push({
        type: 'compare',
        i: i - 1,
        j: i,
        description: `Backward: compare a[${i - 1}]=${a[i - 1]} and a[${i}]=${a[i]}`,
      });
      if (a[i - 1] > a[i]) {
        [a[i - 1], a[i]] = [a[i], a[i - 1]];
        cmds.push({
          type: 'swap',
          i: i - 1,
          j: i,
          description: `Swap a[${i - 1}] and a[${i}]`,
        });
        swapped = true;
      }
    }
    cmds.push({
      type: 'mark_sorted',
      indices: [start],
      description: `Position ${start} is sorted`,
    });
    start++;
  }

  // Mark any remaining unsorted positions as sorted
  const sortedIndices: number[] = [];
  for (let i = start; i <= end; i++) sortedIndices.push(i);
  if (sortedIndices.length > 0) {
    cmds.push({
      type: 'mark_sorted',
      indices: sortedIndices,
      description: 'All elements sorted',
    });
  }

  return cmds;
}

registerAlgorithm({
  name: 'Cocktail Shaker Sort',
  slug: 'cocktail-shaker-sort',
  category: 'sorting',
  description:
    'A bidirectional variant of bubble sort that traverses the list in both directions alternately. This helps move small elements at the end of the list to the front more quickly.',
  bestCase: 'O(n)',
  averageCase: 'O(n²)',
  worstCase: 'O(n²)',
  spaceComplexity: 'O(1)',
  stable: true,
  inPlace: true,
  pseudocode: `start = 0, end = n-1
while swapped
  swapped = false
  for i = start to end-1
    if a[i] > a[i+1]: swap; swapped = true
  end--
  for i = end downto start+1
    if a[i-1] > a[i]: swap; swapped = true
  start++`,
  visualizerType: 'array',
  defaultInput: makeSortState([64, 34, 25, 12, 22, 11, 90]),
  run: (state) => cocktailShakerSortCommands(state.array),
  reduce: sortReducer,
});
