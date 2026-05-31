import { registerAlgorithm } from '../registry';
import type { SortCommand } from './commands';
import { makeSortState, sortReducer } from './commands';

export function quickSortCommands(input: number[]): SortCommand[] {
  const cmds: SortCommand[] = [];
  const a = [...input];

  function quickSort(low: number, high: number): void {
    if (low >= high) {
      if (low === high) {
        cmds.push({
          type: 'mark_sorted',
          indices: [low],
          description: `Position ${low} is sorted`,
        });
      }
      return;
    }
    const pivotIdx = partition(low, high);
    quickSort(low, pivotIdx - 1);
    quickSort(pivotIdx + 1, high);
  }

  function partition(low: number, high: number): number {
    const pivot = a[high];
    cmds.push({
      type: 'set_pivot',
      index: high,
      description: `Pivot = a[${high}]=${pivot}`,
    });
    let i = low - 1;

    for (let j = low; j < high; j++) {
      cmds.push({
        type: 'compare',
        i: j,
        j: high,
        description: `Compare a[${j}]=${a[j]} with pivot=${pivot}`,
      });
      if (a[j] <= pivot) {
        i++;
        if (i !== j) {
          [a[i], a[j]] = [a[j], a[i]];
          cmds.push({
            type: 'swap',
            i,
            j,
            description: `Swap a[${i}]=${a[i]} and a[${j}]=${a[j]}`,
          });
        }
      }
    }
    const pivotFinal = i + 1;
    if (pivotFinal !== high) {
      [a[pivotFinal], a[high]] = [a[high], a[pivotFinal]];
      cmds.push({
        type: 'swap',
        i: pivotFinal,
        j: high,
        description: `Place pivot ${pivot} at position ${pivotFinal}`,
      });
    }
    cmds.push({
      type: 'clear_pivot',
      description: `Pivot ${pivot} is at its final position ${pivotFinal}`,
    });
    cmds.push({
      type: 'mark_sorted',
      indices: [pivotFinal],
      description: `Pivot position ${pivotFinal} is sorted`,
    });
    return pivotFinal;
  }

  if (a.length > 0) {
    quickSort(0, a.length - 1);
  }

  return cmds;
}

registerAlgorithm({
  name: 'Quick Sort',
  slug: 'quick-sort',
  category: 'sorting',
  description:
    'A divide-and-conquer algorithm that selects a pivot element and partitions the array around it, recursively sorting the sub-arrays. Very efficient in practice with O(n log n) average case.',
  bestCase: 'O(n log n)',
  averageCase: 'O(n log n)',
  worstCase: 'O(n²)',
  spaceComplexity: 'O(log n)',
  stable: false,
  inPlace: true,
  pseudocode: `quickSort(a, low, high)
  if low < high
    pivotIdx = partition(a, low, high)
    quickSort(a, low, pivotIdx-1)
    quickSort(a, pivotIdx+1, high)

partition(a, low, high)
  pivot = a[high]
  i = low - 1
  for j = low to high-1
    if a[j] <= pivot: i++; swap(a[i], a[j])
  swap(a[i+1], a[high])
  return i+1`,
  visualizerType: 'array',
  defaultInput: makeSortState([64, 34, 25, 12, 22, 11, 90]),
  run: (state) => quickSortCommands(state.array),
  reduce: sortReducer,
});
