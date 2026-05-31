import { registerAlgorithm } from '../registry';
import type { SearchCommand } from './commands';
import { makeSearchState, searchReducer } from './commands';

export function binarySearchCommands(
  array: number[],
  target: number
): SearchCommand[] {
  const cmds: SearchCommand[] = [];
  const n = array.length;

  if (n === 0) {
    cmds.push({
      type: 'not_found',
      description: `${target} not found in empty array`,
    });
    return cmds;
  }

  let low = 0;
  let high = n - 1;

  cmds.push({
    type: 'set_bounds',
    low,
    high,
    description: `Initialize: low=${low}, high=${high}`,
  });

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);

    cmds.push({
      type: 'set_mid',
      index: mid,
      description: `mid = (${low} + ${high}) / 2 = ${mid}`,
    });
    cmds.push({
      type: 'compare',
      index: mid,
      description: `Comparing a[${mid}]=${array[mid]} with target=${target}`,
    });

    if (array[mid] === target) {
      cmds.push({
        type: 'found',
        index: mid,
        description: `Found ${target} at index ${mid}`,
      });
      return cmds;
    } else if (array[mid] < target) {
      cmds.push({
        type: 'eliminate',
        from: low,
        to: mid,
        description: `Eliminate left half [${low}..${mid}], target > a[${mid}]`,
      });
      low = mid + 1;
      cmds.push({
        type: 'set_bounds',
        low,
        high,
        description: `New bounds: low=${low}, high=${high}`,
      });
    } else {
      cmds.push({
        type: 'eliminate',
        from: mid,
        to: high,
        description: `Eliminate right half [${mid}..${high}], target < a[${mid}]`,
      });
      high = mid - 1;
      cmds.push({
        type: 'set_bounds',
        low,
        high,
        description: `New bounds: low=${low}, high=${high}`,
      });
    }
  }

  cmds.push({
    type: 'not_found',
    description: `${target} not found in array`,
  });
  return cmds;
}

registerAlgorithm({
  name: 'Binary Search',
  slug: 'binary-search',
  category: 'searching',
  description:
    'Efficiently searches a sorted array by repeatedly dividing the search interval in half. If the target is less than the midpoint, search the left half; otherwise search the right half.',
  bestCase: 'O(1)',
  averageCase: 'O(log n)',
  worstCase: 'O(log n)',
  spaceComplexity: 'O(1)',
  pseudocode: `low = 0, high = n-1
while low <= high
  mid = (low + high) / 2
  if a[mid] == target
    return mid
  else if a[mid] < target
    low = mid + 1
  else
    high = mid - 1
return -1`,
  visualizerType: 'array',
  defaultInput: makeSearchState([11, 21, 34, 39, 45, 56, 67, 73, 82, 91], 45),
  run: (state) => binarySearchCommands(state.array, state.target),
  reduce: searchReducer,
});
