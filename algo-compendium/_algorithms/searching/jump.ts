import { registerAlgorithm } from '../registry';
import type { SearchCommand } from './commands';
import { makeSearchState, searchReducer } from './commands';

export function jumpSearchCommands(
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

  const step = Math.floor(Math.sqrt(n));
  let prev = 0;
  let curr = Math.min(step, n) - 1;

  // Jump phase: find the block where target may exist
  while (curr < n && array[curr] < target) {
    cmds.push({
      type: 'visit',
      index: curr,
      description: `Jump to index ${curr}: a[${curr}]=${array[curr]} < ${target}, jump ahead`,
    });
    cmds.push({
      type: 'compare',
      index: curr,
      description: `a[${curr}]=${array[curr]} < target=${target}, continue jumping`,
    });
    cmds.push({
      type: 'eliminate',
      from: prev,
      to: curr,
      description: `Block [${prev}..${curr}] eliminated`,
    });
    prev = curr + 1;
    if (prev >= n) break;
    curr = Math.min(curr + step, n - 1);
  }

  // Linear scan phase within the identified block
  cmds.push({
    type: 'set_bounds',
    low: prev,
    high: Math.min(curr, n - 1),
    description: `Linear scan in block [${prev}..${Math.min(curr, n - 1)}]`,
  });

  for (let i = prev; i <= Math.min(curr, n - 1); i++) {
    cmds.push({
      type: 'visit',
      index: i,
      description: `Linear scan at index ${i}: a[${i}]=${array[i]}`,
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
    if (array[i] > target) break;
  }

  cmds.push({
    type: 'not_found',
    description: `${target} not found in array`,
  });
  return cmds;
}

registerAlgorithm({
  name: 'Jump Search',
  slug: 'jump-search',
  category: 'searching',
  description:
    'Works on sorted arrays by jumping ahead by fixed steps of √n, then performing a linear search backwards in the identified block. Faster than linear search for large sorted arrays.',
  bestCase: 'O(1)',
  averageCase: 'O(√n)',
  worstCase: 'O(√n)',
  spaceComplexity: 'O(1)',
  pseudocode: `step = sqrt(n)
prev = 0
while a[min(step,n)-1] < target
  prev = step
  step += sqrt(n)
  if prev >= n: return -1
for i = prev to min(step, n)-1
  if a[i] == target: return i
return -1`,
  visualizerType: 'array',
  defaultInput: makeSearchState([11, 21, 34, 39, 45, 56, 67, 73, 82, 91], 45),
  run: (state) => jumpSearchCommands(state.array, state.target),
  reduce: searchReducer,
});
