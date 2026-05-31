import { registerAlgorithm } from '../registry';
import type { SearchCommand } from './commands';
import { makeSearchState, searchReducer } from './commands';

export function ternarySearchCommands(
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
    const third = Math.floor((high - low) / 3);
    const mid1 = low + third;
    const mid2 = high - third;

    cmds.push({
      type: 'set_mid',
      index: mid1,
      description: `mid1=${mid1}, mid2=${mid2} (dividing [${low}..${high}] into 3 parts)`,
    });

    cmds.push({
      type: 'compare',
      index: mid1,
      description: `Comparing a[${mid1}]=${array[mid1]} with target=${target}`,
    });

    if (array[mid1] === target) {
      cmds.push({
        type: 'found',
        index: mid1,
        description: `Found ${target} at index ${mid1}`,
      });
      return cmds;
    }

    cmds.push({
      type: 'compare',
      index: mid2,
      description: `Comparing a[${mid2}]=${array[mid2]} with target=${target}`,
    });

    if (array[mid2] === target) {
      cmds.push({
        type: 'found',
        index: mid2,
        description: `Found ${target} at index ${mid2}`,
      });
      return cmds;
    }

    if (target < array[mid1]) {
      cmds.push({
        type: 'eliminate',
        from: mid1,
        to: high,
        description: `target < a[${mid1}], eliminate [${mid1}..${high}]`,
      });
      high = mid1 - 1;
      cmds.push({
        type: 'set_bounds',
        low,
        high,
        description: `New bounds: low=${low}, high=${high}`,
      });
    } else if (target > array[mid2]) {
      cmds.push({
        type: 'eliminate',
        from: low,
        to: mid2,
        description: `target > a[${mid2}], eliminate [${low}..${mid2}]`,
      });
      low = mid2 + 1;
      cmds.push({
        type: 'set_bounds',
        low,
        high,
        description: `New bounds: low=${low}, high=${high}`,
      });
    } else {
      cmds.push({
        type: 'eliminate',
        from: low,
        to: mid1,
        description: `target in (a[${mid1}], a[${mid2}]), eliminate [${low}..${mid1}] and [${mid2}..${high}]`,
      });
      cmds.push({
        type: 'eliminate',
        from: mid2,
        to: high,
        description: `Eliminate [${mid2}..${high}]`,
      });
      low = mid1 + 1;
      high = mid2 - 1;
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
  name: 'Ternary Search',
  slug: 'ternary-search',
  category: 'searching',
  description:
    'Divides the sorted array into three parts by computing two midpoints, then eliminates two-thirds of the search space each iteration. Similar to binary search but with three partitions.',
  bestCase: 'O(1)',
  averageCase: 'O(log₃ n)',
  worstCase: 'O(log₃ n)',
  spaceComplexity: 'O(1)',
  pseudocode: `low = 0, high = n-1
while low <= high
  mid1 = low + (high - low) / 3
  mid2 = high - (high - low) / 3
  if a[mid1] == target: return mid1
  if a[mid2] == target: return mid2
  if target < a[mid1]: high = mid1 - 1
  else if target > a[mid2]: low = mid2 + 1
  else: low = mid1 + 1, high = mid2 - 1
return -1`,
  visualizerType: 'array',
  defaultInput: makeSearchState([11, 21, 34, 39, 45, 56, 67, 73, 82, 91], 45),
  run: (state) => ternarySearchCommands(state.array, state.target),
  reduce: searchReducer,
});
