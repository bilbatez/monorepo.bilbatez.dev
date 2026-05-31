import { registerAlgorithm } from '../registry';
import type { SearchCommand } from './commands';
import { makeSearchState, searchReducer } from './commands';

export function fibonacciSearchCommands(
  array: number[],
  target: number
): SearchCommand[] {
  const cmds: SearchCommand[] = [];
  const n = array.length;

  if (n === 0) {
    cmds.push({ type: 'not_found', description: 'Array is empty' });
    return cmds;
  }

  // Build Fibonacci numbers up to n
  let fibM2 = 0; // (m-2)th Fibonacci
  let fibM1 = 1; // (m-1)th Fibonacci
  let fibM = fibM2 + fibM1; // mth Fibonacci

  while (fibM < n) {
    fibM2 = fibM1;
    fibM1 = fibM;
    fibM = fibM2 + fibM1;
  }

  let offset = -1;

  cmds.push({
    type: 'set_bounds',
    low: 0,
    high: n - 1,
    description: `Fibonacci search: fibM=${fibM}, searching for ${target} in ${n} elements`,
  });

  while (fibM > 1) {
    const i = Math.min(offset + fibM2, n - 1);

    cmds.push({
      type: 'set_mid',
      index: i,
      description: `Check index ${i} (fibM2=${fibM2})`,
    });
    cmds.push({
      type: 'compare',
      index: i,
      description: `Compare a[${i}]=${array[i]} with target ${target}`,
    });

    if (array[i] < target) {
      fibM = fibM1;
      fibM1 = fibM2;
      fibM2 = fibM - fibM1;
      offset = i;
      cmds.push({
        type: 'eliminate',
        from: 0,
        to: i,
        description: `a[${i}]=${array[i]} < ${target}, eliminate left side`,
      });
      cmds.push({
        type: 'set_bounds',
        low: i + 1,
        high: n - 1,
        description: `New search range: [${i + 1}, ${n - 1}]`,
      });
    } else if (array[i] > target) {
      fibM = fibM2;
      fibM1 = fibM1 - fibM2;
      fibM2 = fibM - fibM1;
      cmds.push({
        type: 'eliminate',
        from: i,
        to: n - 1,
        description: `a[${i}]=${array[i]} > ${target}, eliminate right side`,
      });
      cmds.push({
        type: 'set_bounds',
        low: offset + 1,
        high: i - 1,
        description: `New search range: [${offset + 1}, ${i - 1}]`,
      });
    } else {
      cmds.push({
        type: 'found',
        index: i,
        description: `Found ${target} at index ${i}`,
      });
      return cmds;
    }
  }

  // Check last remaining element
  if (fibM1 && offset + 1 < n) {
    const i = offset + 1;
    cmds.push({
      type: 'compare',
      index: i,
      description: `Final check: compare a[${i}]=${array[i]} with target ${target}`,
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
  name: 'Fibonacci Search',
  slug: 'fibonacci-search',
  category: 'searching',
  description:
    'Searches a sorted array using Fibonacci numbers to divide the search space. Similar to binary search but uses Fibonacci number offsets instead of halving, which can be advantageous in systems with sequential access.',
  bestCase: 'O(1)',
  averageCase: 'O(log n)',
  worstCase: 'O(log n)',
  spaceComplexity: 'O(1)',
  pseudocode: `fibM2=0, fibM1=1, fibM=1
while fibM < n: advance Fibonacci numbers
offset = -1
while fibM > 1:
  i = min(offset + fibM2, n-1)
  if a[i] < target:
    fibM=fibM1; fibM1=fibM2; fibM2=fibM-fibM1
    offset = i
  else if a[i] > target:
    fibM=fibM2; fibM1-=fibM2; fibM2=fibM-fibM1
  else: return i
if fibM1 and a[offset+1]==target: return offset+1
return -1`,
  visualizerType: 'array',
  defaultInput: makeSearchState(
    [10, 22, 35, 40, 45, 50, 80, 82, 85, 90, 100],
    85
  ),
  run: (state) => fibonacciSearchCommands(state.array, state.target),
  reduce: searchReducer,
});
