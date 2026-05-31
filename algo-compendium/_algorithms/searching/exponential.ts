import { registerAlgorithm } from '../registry';
import type { SearchCommand } from './commands';
import { makeSearchState, searchReducer } from './commands';

export function exponentialSearchCommands(
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

  // Check first element
  cmds.push({
    type: 'compare',
    index: 0,
    description: `Check a[0]=${array[0]} against target=${target}`,
  });
  if (array[0] === target) {
    cmds.push({
      type: 'found',
      index: 0,
      description: `Found ${target} at index 0`,
    });
    return cmds;
  }

  // Find range by doubling
  let bound = 1;
  while (bound < n && array[bound] <= target) {
    cmds.push({
      type: 'visit',
      index: bound,
      description: `Exponential jump to index ${bound}: a[${bound}]=${array[bound]}`,
    });
    cmds.push({
      type: 'compare',
      index: bound,
      description: `a[${bound}]=${array[bound]} <= ${target}, double bound`,
    });
    bound *= 2;
  }

  // Binary search in range [bound/2, min(bound, n-1)]
  const low = Math.floor(bound / 2);
  const high = Math.min(bound, n - 1);

  cmds.push({
    type: 'eliminate',
    from: 0,
    to: low - 1 >= 0 ? low - 1 : 0,
    description: `Eliminate [0..${low > 0 ? low - 1 : 0}], binary search in [${low}..${high}]`,
  });
  cmds.push({
    type: 'set_bounds',
    low,
    high,
    description: `Binary search range: low=${low}, high=${high}`,
  });

  let bLow = low;
  let bHigh = high;
  while (bLow <= bHigh) {
    const mid = Math.floor((bLow + bHigh) / 2);
    cmds.push({
      type: 'set_mid',
      index: mid,
      description: `mid = (${bLow} + ${bHigh}) / 2 = ${mid}`,
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
        from: bLow,
        to: mid,
        description: `Eliminate left [${bLow}..${mid}]`,
      });
      bLow = mid + 1;
      cmds.push({
        type: 'set_bounds',
        low: bLow,
        high: bHigh,
        description: `New bounds: low=${bLow}, high=${bHigh}`,
      });
    } else {
      cmds.push({
        type: 'eliminate',
        from: mid,
        to: bHigh,
        description: `Eliminate right [${mid}..${bHigh}]`,
      });
      bHigh = mid - 1;
      cmds.push({
        type: 'set_bounds',
        low: bLow,
        high: bHigh,
        description: `New bounds: low=${bLow}, high=${bHigh}`,
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
  name: 'Exponential Search',
  slug: 'exponential-search',
  category: 'searching',
  description:
    'Finds the range where the target may exist by exponentially doubling the bound, then performs binary search within that range. Useful for unbounded or infinite sorted arrays.',
  bestCase: 'O(1)',
  averageCase: 'O(log n)',
  worstCase: 'O(log n)',
  spaceComplexity: 'O(1)',
  pseudocode: `if a[0] == target: return 0
bound = 1
while bound < n and a[bound] <= target
  bound *= 2
binary search in a[bound/2 .. min(bound, n-1)]`,
  visualizerType: 'array',
  defaultInput: makeSearchState([11, 21, 34, 39, 45, 56, 67, 73, 82, 91], 45),
  run: (state) => exponentialSearchCommands(state.array, state.target),
  reduce: searchReducer,
});
