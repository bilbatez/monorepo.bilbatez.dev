import { registerAlgorithm } from '../registry';
import type { SortCommand } from './commands';
import { makeSortState, sortReducer } from './commands';

export function combSortCommands(input: number[]): SortCommand[] {
  const cmds: SortCommand[] = [];
  const a = [...input];
  const n = a.length;

  let gap = n;
  let sorted = false;

  while (!sorted) {
    gap = Math.floor(gap / 1.3);
    if (gap <= 1) {
      gap = 1;
      sorted = true;
    }

    for (let i = 0; i + gap < n; i++) {
      cmds.push({
        type: 'compare',
        i,
        j: i + gap,
        description: `Compare a[${i}]=${a[i]} and a[${i + gap}]=${a[i + gap]} (gap=${gap})`,
      });
      if (a[i] > a[i + gap]) {
        [a[i], a[i + gap]] = [a[i + gap], a[i]];
        cmds.push({
          type: 'swap',
          i,
          j: i + gap,
          description: `Swap a[${i}]=${a[i]} and a[${i + gap}]=${a[i + gap]}`,
        });
        sorted = false;
      }
    }
  }

  if (n > 0) {
    cmds.push({
      type: 'mark_sorted',
      indices: Array.from({ length: n }, (_, i) => i),
      description: 'All elements sorted',
    });
  }

  return cmds;
}

registerAlgorithm({
  name: 'Comb Sort',
  slug: 'comb-sort',
  category: 'sorting',
  description:
    'An improvement over Bubble Sort that eliminates turtles (small values near the end) by using a gap larger than 1. The gap shrinks by a factor of 1.3 each pass until it reaches 1.',
  bestCase: 'O(n log n)',
  averageCase: 'O(n²/2^p)',
  worstCase: 'O(n²)',
  spaceComplexity: 'O(1)',
  stable: false,
  inPlace: true,
  pseudocode: `gap = n
sorted = false
while not sorted:
  gap = floor(gap / 1.3)
  if gap <= 1: gap = 1; sorted = true
  for i = 0 to n-gap-1:
    if a[i] > a[i+gap]:
      swap(a[i], a[i+gap])
      sorted = false`,
  visualizerType: 'array',
  defaultInput: makeSortState([64, 34, 25, 12, 22, 11, 90, 42, 78, 5]),
  run: (state) => combSortCommands(state.array),
  reduce: sortReducer,
});
