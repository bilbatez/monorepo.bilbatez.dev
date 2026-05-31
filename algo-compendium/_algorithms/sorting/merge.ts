import { registerAlgorithm } from '../registry';
import type { SortCommand } from './commands';
import { makeSortState, sortReducer } from './commands';

export function mergeSortCommands(input: number[]): SortCommand[] {
  const cmds: SortCommand[] = [];
  const a = [...input];

  function mergeSort(arr: number[], left: number, right: number): void {
    if (right - left <= 0) return;
    const mid = Math.floor((left + right) / 2);
    mergeSort(arr, left, mid);
    mergeSort(arr, mid + 1, right);
    merge(arr, left, mid, right);
  }

  function merge(
    arr: number[],
    left: number,
    mid: number,
    right: number
  ): void {
    const leftPart = arr.slice(left, mid + 1);
    const rightPart = arr.slice(mid + 1, right + 1);
    let i = 0,
      j = 0,
      k = left;

    while (i < leftPart.length && j < rightPart.length) {
      cmds.push({
        type: 'compare',
        i: left + i,
        j: mid + 1 + j,
        description: `Merge: compare ${leftPart[i]} and ${rightPart[j]}`,
      });
      if (leftPart[i] <= rightPart[j]) {
        arr[k] = leftPart[i];
        cmds.push({
          type: 'set',
          index: k,
          value: leftPart[i],
          description: `Place ${leftPart[i]} at position ${k}`,
        });
        i++;
      } else {
        arr[k] = rightPart[j];
        cmds.push({
          type: 'set',
          index: k,
          value: rightPart[j],
          description: `Place ${rightPart[j]} at position ${k}`,
        });
        j++;
      }
      k++;
    }
    while (i < leftPart.length) {
      arr[k] = leftPart[i];
      cmds.push({
        type: 'set',
        index: k,
        value: leftPart[i],
        description: `Place remaining ${leftPart[i]} at position ${k}`,
      });
      i++;
      k++;
    }
    while (j < rightPart.length) {
      arr[k] = rightPart[j];
      cmds.push({
        type: 'set',
        index: k,
        value: rightPart[j],
        description: `Place remaining ${rightPart[j]} at position ${k}`,
      });
      j++;
      k++;
    }

    // Mark the merged range as sorted if it covers the full array
    if (left === 0 && right === input.length - 1) {
      const indices = Array.from(
        { length: right - left + 1 },
        (_, idx) => left + idx
      );
      cmds.push({
        type: 'mark_sorted',
        indices,
        description: 'Array fully merged and sorted',
      });
    }
  }

  if (a.length > 0) {
    mergeSort(a, 0, a.length - 1);
    if (a.length === 1) {
      cmds.push({
        type: 'mark_sorted',
        indices: [0],
        description: 'Single element is sorted',
      });
    }
  }

  return cmds;
}

registerAlgorithm({
  name: 'Merge Sort',
  slug: 'merge-sort',
  category: 'sorting',
  description:
    'A divide-and-conquer algorithm that divides the array into halves, recursively sorts each half, and then merges the sorted halves. Guarantees O(n log n) in all cases.',
  bestCase: 'O(n log n)',
  averageCase: 'O(n log n)',
  worstCase: 'O(n log n)',
  spaceComplexity: 'O(n)',
  stable: true,
  inPlace: false,
  pseudocode: `mergeSort(a, left, right)
  if left >= right: return
  mid = (left + right) / 2
  mergeSort(a, left, mid)
  mergeSort(a, mid+1, right)
  merge(a, left, mid, right)

merge(a, left, mid, right)
  copy left and right halves
  merge back using set commands`,
  visualizerType: 'array',
  defaultInput: makeSortState([64, 34, 25, 12, 22, 11, 90]),
  run: (state) => mergeSortCommands(state.array),
  reduce: sortReducer,
});
