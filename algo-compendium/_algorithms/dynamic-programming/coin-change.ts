import { registerAlgorithm } from '../registry';
import type { GridCommand, GridState } from './commands';
import { makeGridState, gridReducer } from './commands';

export function coinChangeCommands(state: GridState): GridCommand[] {
  const cmds: GridCommand[] = [];
  const coins = state.coins ?? [];
  const amount = state.amount ?? 0;
  const INF = amount + 1;

  const dp: number[] = new Array(amount + 1).fill(INF);
  dp[0] = 0;

  // Base case
  cmds.push({
    type: 'compute',
    row: 0,
    col: 0,
    value: 0,
    description: 'Base case: dp[0] = 0 (0 coins needed for amount 0)',
  });

  for (let i = 1; i <= amount; i++) {
    cmds.push({
      type: 'highlight',
      row: 0,
      col: i,
      description: `Computing dp[${i}] — min coins for amount ${i}`,
    });

    let best = INF;
    for (const coin of coins) {
      if (coin <= i && dp[i - coin] + 1 < best) {
        best = dp[i - coin] + 1;
        cmds.push({
          type: 'compare',
          row: 0,
          col: i,
          description: `Coin ${coin}: dp[${i - coin}] + 1 = ${dp[i - coin] + 1} (new best)`,
        });
      }
    }

    dp[i] = best;
    const displayVal = dp[i] >= INF ? -1 : dp[i];
    cmds.push({
      type: 'compute',
      row: 0,
      col: i,
      value: displayVal,
      description:
        dp[i] >= INF ? `dp[${i}] = -1 (impossible)` : `dp[${i}] = ${dp[i]}`,
    });
  }

  const finalResult = dp[amount] >= INF ? -1 : dp[amount];
  cmds.push({
    type: 'set_result',
    result: finalResult,
    description:
      finalResult === -1
        ? `Amount ${amount} cannot be formed`
        : `Min coins for ${amount} = ${finalResult}`,
  });

  return cmds;
}

const defaultCoins = [1, 5, 10, 25];
const defaultAmount = 41;

registerAlgorithm({
  name: 'Coin Change',
  slug: 'coin-change',
  category: 'dynamic-programming',
  description:
    'Finds the minimum number of coins needed to make up a given amount. Uses a 1D DP array where dp[i] is the minimum coins required for amount i.',
  bestCase: 'O(amount × coins)',
  averageCase: 'O(amount × coins)',
  worstCase: 'O(amount × coins)',
  spaceComplexity: 'O(amount)',
  stable: false,
  inPlace: false,
  pseudocode: `dp[0] = 0
for i = 1 to amount:
  for each coin:
    if coin <= i:
      dp[i] = min(dp[i], dp[i - coin] + 1)
return dp[amount]`,
  visualizerType: 'grid',
  defaultInput: {
    ...makeGridState(
      1,
      defaultAmount + 1,
      ['dp'],
      Array.from({ length: defaultAmount + 1 }, (_, i) => String(i))
    ),
    coins: defaultCoins,
    amount: defaultAmount,
  },
  run: coinChangeCommands,
  reduce: gridReducer,
});
