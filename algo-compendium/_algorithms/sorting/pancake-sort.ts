import { registerAlgorithm } from '../registry';
import type { SortCommand } from './commands';
import { makeSortState, sortReducer } from './commands';

function flip(a: number[], k: number, cmds: SortCommand[]): void {
  // Reverse a[0..k] in place, emitting set commands
  let left = 0;
  let right = k;
  while (left < right) {
    const tmp = a[left];
    a[left] = a[right];
    a[right] = tmp;
    cmds.push({
      type: 'set',
      index: left,
      value: a[left],
      description: `Flip: set a[${left}]=${a[left]}`,
    });
    cmds.push({
      type: 'set',
      index: right,
      value: a[right],
      description: `Flip: set a[${right}]=${a[right]}`,
    });
    left++;
    right--;
  }
}

export function pancakeSortCommands(input: number[]): SortCommand[] {
  const cmds: SortCommand[] = [];
  const a = [...input];
  const n = a.length;

  for (let size = n; size > 1; size--) {
    // Find index of maximum element in a[0..size-1]
    let maxIdx = 0;
    for (let i = 1; i < size; i++) {
      cmds.push({
        type: 'compare',
        i: maxIdx,
        j: i,
        description: `Find max in [0..${size - 1}]: compare a[${maxIdx}]=${a[maxIdx]} with a[${i}]=${a[i]}`,
      });
      if (a[i] > a[maxIdx]) {
        maxIdx = i;
      }
    }

    if (maxIdx === size - 1) {
      // Already in place
      cmds.push({
        type: 'mark_sorted',
        indices: [size - 1],
        description: `a[${size - 1}]=${a[size - 1]} is already in position`,
      });
      continue;
    }

    if (maxIdx !== 0) {
      // Flip max to front
      cmds.push({
        type: 'set_pivot',
        index: maxIdx,
        description: `Flip max element ${a[maxIdx]} to front: flip [0..${maxIdx}]`,
      });
      flip(a, maxIdx, cmds);
      cmds.push({
        type: 'clear_pivot',
        description: `Max ${a[0]} now at front`,
      });
    }

    // Flip to final position
    cmds.push({
      type: 'set_pivot',
      index: 0,
      description: `Flip max ${a[0]} to position ${size - 1}: flip [0..${size - 1}]`,
    });
    flip(a, size - 1, cmds);
    cmds.push({
      type: 'clear_pivot',
      description: `Max placed at position ${size - 1}`,
    });

    cmds.push({
      type: 'mark_sorted',
      indices: [size - 1],
      description: `Position ${size - 1} sorted: a[${size - 1}]=${a[size - 1]}`,
    });
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
  name: 'Pancake Sort',
  slug: 'pancake-sort',
  category: 'sorting',
  description:
    'Sorts by repeatedly finding the maximum element and flipping it into position using a "pancake flip" operation that reverses a prefix of the array.',
  bestCase: 'O(n)',
  averageCase: 'O(n²)',
  worstCase: 'O(n²)',
  spaceComplexity: 'O(1)',
  stable: false,
  inPlace: true,
  pseudocode: `for size = n downto 2:
  maxIdx = index of max in a[0..size-1]
  if maxIdx != size-1:
    if maxIdx != 0:
      flip(a, maxIdx)  // bring max to front
    flip(a, size-1)    // move max to final position`,
  visualizerType: 'array',
  legendLabels: { pivot: 'max' },
  defaultInput: makeSortState([3, 6, 2, 7, 4, 9, 1, 5]),
  run: (state) => pancakeSortCommands(state.array),
  reduce: sortReducer,
});
