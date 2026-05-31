import { registerAlgorithm } from '../registry';
import type { SortCommand } from './commands';
import { makeSortState, sortReducer } from './commands';

const RUN = 8;

export function timSortCommands(input: number[]): SortCommand[] {
  const cmds: SortCommand[] = [];
  const a = [...input];
  const n = a.length;

  if (n <= 1) {
    if (n === 1) {
      cmds.push({
        type: 'mark_sorted',
        indices: [0],
        description: 'Single element — already sorted',
      });
    }
    return cmds;
  }

  // Insertion sort each run of size RUN
  for (let left = 0; left < n; left += RUN) {
    const right = Math.min(left + RUN - 1, n - 1);
    for (let i = left + 1; i <= right; i++) {
      const temp = a[i];
      cmds.push({
        type: 'set_pivot',
        index: i,
        description: `Insertion sort run [${left}..${right}]: insert a[${i}]=${temp}`,
      });
      let j = i - 1;
      while (j >= left) {
        cmds.push({
          type: 'compare',
          i: j,
          j: j + 1,
          description: `Compare a[${j}]=${a[j]} and key=${temp}`,
        });
        if (a[j] > temp) {
          a[j + 1] = a[j];
          cmds.push({
            type: 'set',
            index: j + 1,
            value: a[j + 1],
            description: `Shift a[${j}]=${a[j + 1]} to position ${j + 1}`,
          });
          j--;
        } else {
          break;
        }
      }
      a[j + 1] = temp;
      cmds.push({
        type: 'set',
        index: j + 1,
        value: temp,
        description: `Place ${temp} at position ${j + 1}`,
      });
      cmds.push({ type: 'clear_pivot', description: `Inserted ${temp}` });
    }
  }

  // Merge runs
  for (let size = RUN; size < n; size *= 2) {
    for (let left = 0; left < n; left += 2 * size) {
      const mid = Math.min(left + size - 1, n - 1);
      const right = Math.min(left + 2 * size - 1, n - 1);

      if (mid >= right) continue;

      // Merge a[left..mid] and a[mid+1..right]
      const leftArr = a.slice(left, mid + 1);
      const rightArr = a.slice(mid + 1, right + 1);
      let i = 0;
      let j = 0;
      let k = left;

      while (i < leftArr.length && j < rightArr.length) {
        if (leftArr[i] <= rightArr[j]) {
          a[k] = leftArr[i++];
        } else {
          a[k] = rightArr[j++];
        }
        cmds.push({
          type: 'set',
          index: k,
          value: a[k],
          description: `Merge [${left}..${mid}] and [${mid + 1}..${right}]: place ${a[k]} at ${k}`,
        });
        k++;
      }
      while (i < leftArr.length) {
        a[k] = leftArr[i++];
        cmds.push({
          type: 'set',
          index: k,
          value: a[k],
          description: `Merge: copy remaining left ${a[k]} to ${k}`,
        });
        k++;
      }
      while (j < rightArr.length) {
        a[k] = rightArr[j++];
        cmds.push({
          type: 'set',
          index: k,
          value: a[k],
          description: `Merge: copy remaining right ${a[k]} to ${k}`,
        });
        k++;
      }
    }
  }

  cmds.push({
    type: 'mark_sorted',
    indices: Array.from({ length: n }, (_, i) => i),
    description: 'All elements sorted',
  });

  return cmds;
}

registerAlgorithm({
  name: 'Tim Sort',
  slug: 'tim-sort',
  category: 'sorting',
  description:
    'A hybrid sorting algorithm derived from Merge Sort and Insertion Sort. It divides the array into small runs (size 8–64), sorts each with Insertion Sort, then merges the runs using a merge step.',
  bestCase: 'O(n)',
  averageCase: 'O(n log n)',
  worstCase: 'O(n log n)',
  spaceComplexity: 'O(n)',
  stable: true,
  inPlace: false,
  pseudocode: `RUN = 8
// Insertion sort each run
for left = 0 to n-1 step RUN:
  right = min(left+RUN-1, n-1)
  insertionSort(a, left, right)

// Merge runs bottom-up
size = RUN
while size < n:
  for left = 0 to n-1 step 2*size:
    mid = left + size - 1
    right = min(left + 2*size - 1, n-1)
    merge(a, left, mid, right)
  size *= 2`,
  visualizerType: 'array',
  defaultInput: makeSortState([64, 34, 25, 12, 22, 11, 90, 42, 78, 5, 8, 37]),
  run: (state) => timSortCommands(state.array),
  reduce: sortReducer,
});
