import { registerAlgorithm } from '../registry';
import type { GridCommand, GridState } from './commands';
import { makeGridState, gridReducer } from './commands';

const ARR = [-2, 1, -3, 4, -1, 2, 1, -5];
const COLS = ARR.length;

function makeKadaneState(): GridState {
  const state = makeGridState(
    2,
    COLS,
    ['arr', 'cur'],
    ARR.map((_, i) => String(i))
  );
  // Pre-fill row 0 with array values
  const grid = state.grid.map((row, r) =>
    row.map((cell, c) => (r === 0 ? { value: ARR[c], computed: true } : cell))
  );
  return { ...state, grid, arr: ARR };
}

export function kadaneCommands(state: GridState): GridCommand[] {
  const cmds: GridCommand[] = [];
  const arr = state.arr ?? ARR;
  const n = arr.length;

  if (n === 0) {
    cmds.push({
      type: 'set_result',
      result: 'Max sum: 0',
      description: 'Empty array',
    });
    return cmds;
  }

  let maxEndingHere = arr[0];
  let maxSoFar = arr[0];
  let bestStart = 0;
  let bestEnd = 0;
  let currentStart = 0;

  cmds.push({
    type: 'highlight',
    row: 1,
    col: 0,
    description: `Initialize: maxEndingHere=${arr[0]}, maxSoFar=${arr[0]}`,
  });
  cmds.push({
    type: 'compute',
    row: 1,
    col: 0,
    value: arr[0],
    description: `cur[0] = arr[0] = ${arr[0]}`,
  });

  for (let i = 1; i < n; i++) {
    cmds.push({
      type: 'highlight',
      row: 0,
      col: i,
      description: `Consider arr[${i}]=${arr[i]}: maxEndingHere=${maxEndingHere}`,
    });

    const prev = maxEndingHere;
    if (maxEndingHere + arr[i] < arr[i]) {
      maxEndingHere = arr[i];
      currentStart = i;
    } else {
      maxEndingHere = maxEndingHere + arr[i];
    }

    cmds.push({
      type: 'compare',
      row: 1,
      col: i,
      description: `maxEndingHere + arr[${i}] = ${prev} + ${arr[i]} = ${prev + arr[i]} vs arr[${i}]=${arr[i]}`,
    });
    cmds.push({
      type: 'compute',
      row: 1,
      col: i,
      value: maxEndingHere,
      description: `cur[${i}] = ${maxEndingHere}`,
    });

    if (maxEndingHere > maxSoFar) {
      maxSoFar = maxEndingHere;
      bestStart = currentStart;
      bestEnd = i;
    }
  }

  // Trace the best subarray
  const traceCells: [number, number][] = [];
  for (let i = bestStart; i <= bestEnd; i++) {
    traceCells.push([0, i]);
    traceCells.push([1, i]);
  }
  cmds.push({
    type: 'trace',
    cells: traceCells,
    description: `Best subarray: indices [${bestStart}..${bestEnd}], sum=${maxSoFar}`,
  });

  cmds.push({
    type: 'set_result',
    result: `Max sum: ${maxSoFar}`,
    description: `Maximum subarray sum = ${maxSoFar}`,
  });

  return cmds;
}

registerAlgorithm({
  name: "Kadane's Algorithm",
  slug: 'kadane',
  category: 'dynamic-programming',
  description:
    'Finds the contiguous subarray with the largest sum in O(n) time. At each position, decides whether to extend the current subarray or start fresh, keeping track of the best sum seen so far.',
  bestCase: 'O(n)',
  averageCase: 'O(n)',
  worstCase: 'O(n)',
  spaceComplexity: 'O(1)',
  pseudocode: `maxEndingHere = arr[0]
maxSoFar = arr[0]
for i = 1 to n-1:
  maxEndingHere = max(arr[i], maxEndingHere + arr[i])
  maxSoFar = max(maxSoFar, maxEndingHere)
return maxSoFar`,
  visualizerType: 'grid',
  defaultInput: makeKadaneState(),
  run: kadaneCommands,
  reduce: gridReducer,
});
