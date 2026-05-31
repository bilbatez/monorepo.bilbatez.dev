import { registerAlgorithm } from '../registry';
import type { SearchCommand } from './commands';
import { makeSearchState, searchReducer } from './commands';

export function interpolationSearchCommands(
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

  while (low <= high && target >= array[low] && target <= array[high]) {
    if (low === high) {
      cmds.push({
        type: 'compare',
        index: low,
        description: `Single element: comparing a[${low}]=${array[low]} with target=${target}`,
      });
      if (array[low] === target) {
        cmds.push({
          type: 'found',
          index: low,
          description: `Found ${target} at index ${low}`,
        });
      } else {
        cmds.push({
          type: 'not_found',
          description: `${target} not found in array`,
        });
      }
      return cmds;
    }

    // Interpolation formula
    const rangeDivisor = array[high] - array[low];
    const pos =
      low + Math.floor(((target - array[low]) * (high - low)) / rangeDivisor);
    const clampedPos = Math.max(low, Math.min(high, pos));

    cmds.push({
      type: 'set_mid',
      index: clampedPos,
      description: `Interpolated pos = ${low} + ((${target} - ${array[low]}) * (${high} - ${low})) / (${array[high]} - ${array[low]}) = ${clampedPos}`,
    });
    cmds.push({
      type: 'compare',
      index: clampedPos,
      description: `Comparing a[${clampedPos}]=${array[clampedPos]} with target=${target}`,
    });

    if (array[clampedPos] === target) {
      cmds.push({
        type: 'found',
        index: clampedPos,
        description: `Found ${target} at index ${clampedPos}`,
      });
      return cmds;
    } else if (array[clampedPos] < target) {
      cmds.push({
        type: 'eliminate',
        from: low,
        to: clampedPos,
        description: `Eliminate [${low}..${clampedPos}], target > a[${clampedPos}]`,
      });
      low = clampedPos + 1;
      cmds.push({
        type: 'set_bounds',
        low,
        high,
        description: `New bounds: low=${low}, high=${high}`,
      });
    } else {
      cmds.push({
        type: 'eliminate',
        from: clampedPos,
        to: high,
        description: `Eliminate [${clampedPos}..${high}], target < a[${clampedPos}]`,
      });
      high = clampedPos - 1;
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
  name: 'Interpolation Search',
  slug: 'interpolation-search',
  category: 'searching',
  description:
    'An improved variant of binary search for uniformly distributed sorted arrays. Uses interpolation to estimate the position of the target, potentially finding it faster than binary search.',
  bestCase: 'O(1)',
  averageCase: 'O(log log n)',
  worstCase: 'O(n)',
  spaceComplexity: 'O(1)',
  pseudocode: `low = 0, high = n-1
while low <= high and target in [a[low], a[high]]
  pos = low + ((target - a[low]) * (high - low)) / (a[high] - a[low])
  if a[pos] == target: return pos
  else if a[pos] < target: low = pos + 1
  else: high = pos - 1
return -1`,
  visualizerType: 'array',
  defaultInput: makeSearchState([11, 21, 34, 39, 45, 56, 67, 73, 82, 91], 45),
  run: (state) => interpolationSearchCommands(state.array, state.target),
  reduce: searchReducer,
});
