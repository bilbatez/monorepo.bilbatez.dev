import { registerAlgorithm } from '../registry';
import type { SearchCommand } from './commands';
import { makeSearchState, searchReducer } from './commands';

export function linearSearchCommands(
  array: number[],
  target: number
): SearchCommand[] {
  const cmds: SearchCommand[] = [];
  const n = array.length;

  for (let i = 0; i < n; i++) {
    cmds.push({
      type: 'visit',
      index: i,
      description: `Visiting index ${i}: value = ${array[i]}`,
    });
    cmds.push({
      type: 'compare',
      index: i,
      description: `Comparing a[${i}]=${array[i]} with target=${target}`,
    });
    if (array[i] === target) {
      cmds.push({
        type: 'found',
        index: i,
        description: `Found ${target} at index ${i}`,
      });
      return cmds;
    }
  }

  cmds.push({
    type: 'not_found',
    description: `${target} not found in array`,
  });
  return cmds;
}

registerAlgorithm({
  name: 'Linear Search',
  slug: 'linear-search',
  category: 'searching',
  description:
    'Sequentially checks each element of the list until a match is found or the whole list has been searched. Works on both sorted and unsorted arrays.',
  bestCase: 'O(1)',
  averageCase: 'O(n)',
  worstCase: 'O(n)',
  spaceComplexity: 'O(1)',
  pseudocode: `for i = 0 to n-1
  if a[i] == target
    return i
return -1`,
  visualizerType: 'array',
  defaultInput: makeSearchState([11, 21, 34, 39, 45, 56, 67, 73, 82, 91], 45),
  run: (state) => linearSearchCommands(state.array, state.target),
  reduce: searchReducer,
});
