import { registerAlgorithm } from '../registry';
import type { GridCommand, GridState } from './commands';
import { makeGridState, gridReducer } from './commands';

export function knapsackCommands(state: GridState): GridCommand[] {
  const cmds: GridCommand[] = [];
  const items = state.items ?? [];
  const W = state.grid[0].length - 1; // cols - 1 = max capacity
  const n = items.length;

  // dp[i][w] = max value using first i items with capacity w
  const dp: number[][] = Array.from({ length: n + 1 }, () =>
    new Array(W + 1).fill(0)
  );

  // Initialize row 0 (no items)
  for (let w = 0; w <= W; w++) {
    cmds.push({
      type: 'compute',
      row: 0,
      col: w,
      value: 0,
      description: `Base case: dp[0][${w}] = 0 (no items)`,
    });
  }

  // Fill table
  for (let i = 1; i <= n; i++) {
    const item = items[i - 1];
    for (let w = 0; w <= W; w++) {
      cmds.push({
        type: 'compare',
        row: i,
        col: w,
        description: `Item ${i} (w=${item.w}, v=${item.v}), capacity=${w}`,
      });
      if (item.w > w) {
        // Can't include item
        dp[i][w] = dp[i - 1][w];
        cmds.push({
          type: 'compute',
          row: i,
          col: w,
          value: dp[i][w],
          description: `Item ${i} too heavy (${item.w} > ${w}), dp[${i}][${w}] = dp[${i - 1}][${w}] = ${dp[i][w]}`,
        });
      } else {
        const withItem = dp[i - 1][w - item.w] + item.v;
        const withoutItem = dp[i - 1][w];
        dp[i][w] = Math.max(withItem, withoutItem);
        cmds.push({
          type: 'compute',
          row: i,
          col: w,
          value: dp[i][w],
          description: `dp[${i}][${w}] = max(${withoutItem}, ${withItem}) = ${dp[i][w]}`,
        });
      }
    }
  }

  cmds.push({
    type: 'set_result',
    result: dp[n][W],
    description: `Max value = ${dp[n][W]}`,
  });

  return cmds;
}

const defaultItems = [
  { w: 2, v: 3 },
  { w: 3, v: 4 },
  { w: 4, v: 5 },
  { w: 5, v: 6 },
];
const W = 8;

registerAlgorithm({
  name: '0/1 Knapsack',
  slug: 'knapsack',
  category: 'dynamic-programming',
  description:
    'Given items with weights and values, find the maximum total value that fits in a knapsack of capacity W. Each item can be taken at most once.',
  bestCase: 'O(nW)',
  averageCase: 'O(nW)',
  worstCase: 'O(nW)',
  spaceComplexity: 'O(nW)',
  stable: false,
  inPlace: false,
  pseudocode: `for i = 1 to n:
  for w = 0 to W:
    if items[i].weight > w:
      dp[i][w] = dp[i-1][w]
    else:
      dp[i][w] = max(dp[i-1][w],
                     dp[i-1][w - items[i].w] + items[i].v)
return dp[n][W]`,
  visualizerType: 'grid',
  defaultInput: {
    ...makeGridState(
      defaultItems.length + 1,
      W + 1,
      ['∅', ...defaultItems.map((_, i) => `i${i + 1}`)],
      Array.from({ length: W + 1 }, (_, i) => String(i))
    ),
    items: defaultItems,
  },
  run: knapsackCommands,
  reduce: gridReducer,
});
