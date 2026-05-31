import { describe, it, expect } from 'vitest';
import { coinChangeCommands } from './coin-change';
import { makeGridState, gridReducer } from './commands';

function runDP(coins: number[], amount: number) {
  const initialState = {
    ...makeGridState(
      1,
      amount + 1,
      ['dp'],
      Array.from({ length: amount + 1 }, (_, i) => String(i))
    ),
    coins,
    amount,
  };
  const cmds = coinChangeCommands(initialState);
  return cmds.reduce(gridReducer, initialState);
}

describe('Coin Change DP', () => {
  it('finds min coins for amount 41 with coins [1,5,10,25]', () => {
    const result = runDP([1, 5, 10, 25], 41);
    // 25 + 10 + 5 + 1 = 4 coins
    expect(result.result).toBe(4);
  });

  it('base case dp[0] = 0', () => {
    const result = runDP([1, 5], 5);
    expect(result.grid[0][0].value).toBe(0);
  });

  it('returns 1 for amount equal to a single coin', () => {
    const result = runDP([5, 10], 5);
    expect(result.result).toBe(1);
  });

  it('returns -1 for impossible amount', () => {
    const result = runDP([2], 3);
    expect(result.result).toBe(-1);
  });

  it('handles amount = 0', () => {
    const result = runDP([1, 5], 0);
    expect(result.result).toBe(0);
  });

  it('handles coins=[1] for various amounts', () => {
    const result = runDP([1], 7);
    expect(result.result).toBe(7);
  });

  it('handles larger amount with classic coins', () => {
    // coins=[1,5,10,25], amount=30 => 25+5=2 coins
    const result = runDP([1, 5, 10, 25], 30);
    expect(result.result).toBe(2);
  });
});
