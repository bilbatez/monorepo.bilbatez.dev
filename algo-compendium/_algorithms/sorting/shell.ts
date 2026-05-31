import { registerAlgorithm } from '../registry';
import type { SortCommand } from './commands';
import { makeSortState, sortReducer } from './commands';

export function shellSortCommands(input: number[]): SortCommand[] {
  const cmds: SortCommand[] = [];
  const a = [...input];
  const n = a.length;

  // Ciura gap sequence
  const gaps = [701, 301, 132, 57, 23, 10, 4, 1].filter((g) => g < n);
  if (gaps[gaps.length - 1] !== 1) gaps.push(1);

  for (const gap of gaps) {
    for (let i = gap; i < n; i++) {
      const temp = a[i];
      let j = i;
      cmds.push({
        type: 'set_pivot',
        index: i,
        description: `Shell sort with gap=${gap}: insert a[${i}]=${temp}`,
      });
      while (j >= gap) {
        cmds.push({
          type: 'compare',
          i: j - gap,
          j,
          description: `Compare a[${j - gap}]=${a[j - gap]} and a[${j}]=${a[j]} (gap=${gap})`,
        });
        if (a[j - gap] > temp) {
          a[j] = a[j - gap];
          cmds.push({
            type: 'set',
            index: j,
            value: a[j],
            description: `Shift a[${j - gap}]=${a[j]} to position ${j}`,
          });
          j -= gap;
        } else {
          break;
        }
      }
      a[j] = temp;
      cmds.push({
        type: 'set',
        index: j,
        value: temp,
        description: `Place ${temp} at position ${j}`,
      });
      cmds.push({
        type: 'clear_pivot',
        description: `Inserted at position ${j}`,
      });
    }
  }

  if (n > 0) {
    const allIndices = Array.from({ length: n }, (_, i) => i);
    cmds.push({
      type: 'mark_sorted',
      indices: allIndices,
      description: 'All elements sorted',
    });
  }

  return cmds;
}

registerAlgorithm({
  name: 'Shell Sort',
  slug: 'shell-sort',
  category: 'sorting',
  description:
    'An extension of insertion sort that allows the exchange of far-apart elements. Uses a decreasing sequence of gaps to progressively reduce the disorder before a final insertion sort pass.',
  bestCase: 'O(n log n)',
  averageCase: 'O(n log² n)',
  worstCase: 'O(n²)',
  spaceComplexity: 'O(1)',
  stable: false,
  inPlace: true,
  pseudocode: `gaps = [701, 301, 132, 57, 23, 10, 4, 1]
for each gap in gaps
  for i = gap to n-1
    temp = a[i]
    j = i
    while j >= gap and a[j-gap] > temp
      a[j] = a[j-gap]
      j -= gap
    a[j] = temp`,
  visualizerType: 'array',
  defaultInput: makeSortState([64, 34, 25, 12, 22, 11, 90]),
  run: (state) => shellSortCommands(state.array),
  reduce: sortReducer,
});
