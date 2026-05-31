import { registerAlgorithm } from '../registry';
import type { SortCommand } from './commands';
import { makeSortState, sortReducer } from './commands';

export function heapSortCommands(input: number[]): SortCommand[] {
  const cmds: SortCommand[] = [];
  const a = [...input];
  const n = a.length;

  function heapify(size: number, root: number): void {
    let largest = root;
    const left = 2 * root + 1;
    const right = 2 * root + 2;

    if (left < size) {
      cmds.push({
        type: 'compare',
        i: left,
        j: largest,
        description: `Compare a[${left}]=${a[left]} and a[${largest}]=${a[largest]}`,
      });
      if (a[left] > a[largest]) largest = left;
    }
    if (right < size) {
      cmds.push({
        type: 'compare',
        i: right,
        j: largest,
        description: `Compare a[${right}]=${a[right]} and a[${largest}]=${a[largest]}`,
      });
      if (a[right] > a[largest]) largest = right;
    }
    if (largest !== root) {
      [a[root], a[largest]] = [a[largest], a[root]];
      cmds.push({
        type: 'swap',
        i: root,
        j: largest,
        description: `Swap a[${root}]=${a[root]} and a[${largest}]=${a[largest]}`,
      });
      heapify(size, largest);
    }
  }

  // Build max heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(n, i);
  }

  // Extract elements from heap one by one
  for (let i = n - 1; i > 0; i--) {
    [a[0], a[i]] = [a[i], a[0]];
    cmds.push({
      type: 'swap',
      i: 0,
      j: i,
      description: `Move max ${a[i]} to position ${i}`,
    });
    cmds.push({
      type: 'mark_sorted',
      indices: [i],
      description: `Position ${i} is sorted`,
    });
    heapify(i, 0);
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
  name: 'Heap Sort',
  slug: 'heap-sort',
  category: 'sorting',
  description:
    'Builds a max-heap from the array, then repeatedly extracts the maximum element and places it at the end of the sorted portion. Achieves O(n log n) in all cases with O(1) space.',
  bestCase: 'O(n log n)',
  averageCase: 'O(n log n)',
  worstCase: 'O(n log n)',
  spaceComplexity: 'O(1)',
  stable: false,
  inPlace: true,
  pseudocode: `buildMaxHeap(a, n)
  for i = n/2-1 downto 0
    heapify(a, n, i)

heapSort(a, n)
  buildMaxHeap(a, n)
  for i = n-1 downto 1
    swap(a[0], a[i])
    heapify(a, i, 0)`,
  visualizerType: 'array',
  defaultInput: makeSortState([64, 34, 25, 12, 22, 11, 90]),
  run: (state) => heapSortCommands(state.array),
  reduce: sortReducer,
});
