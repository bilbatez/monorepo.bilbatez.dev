import { describe, it, expect } from 'vitest';
import { knapsackCommands } from './knapsack';
import { makeGridState, gridReducer } from './commands';

function runDP(items: { w: number; v: number }[], W: number) {
  const n = items.length;
  const initialState = {
    ...makeGridState(
      n + 1,
      W + 1,
      ['∅', ...items.map((_, i) => `i${i + 1}`)],
      Array.from({ length: W + 1 }, (_, i) => String(i))
    ),
    items,
  };
  const cmds = knapsackCommands(initialState);
  return cmds.reduce(gridReducer, initialState);
}

describe('0/1 Knapsack DP', () => {
  it('finds max value for default input', () => {
    const items = [
      { w: 2, v: 3 },
      { w: 3, v: 4 },
      { w: 4, v: 5 },
      { w: 5, v: 6 },
    ];
    const result = runDP(items, 8);
    // Optimal: items 1+2+4 => w=2+3+3=no, items 1(2,3)+2(3,4)+4? Let's trust algorithm
    // w=2(3) + w=3(4) + ... best is items w:2,v:3 + w:3,v:4 + w:3?,
    // Items: {2,3},{3,4},{4,5},{5,6} W=8
    // Combinations: {2,3}+{3,4}+{3,4}? No, 0/1 each once
    // {3,4}+{5,6} = w8 v10
    // {2,3}+{3,4}+{3,4}? can't repeat — {2,3}+{6,9}? no
    // {2,3}+{3,4} = w5 v7; remaining 3: item {3,4} = total w8 v11? Wait {2,3}+{3,4}+... item3 is {4,5}, w=2+3+4=9 > 8
    // {3,4}+{5,6} = w=8 v=10
    // {2,3}+{3,4} = w=5, v=7, + {3,4}? only 1 of each. remaining=3, item1 {2,3}: total {2,3}+{3,4}=w5,v7+ no more weight
    // Actually: {2,3}+{6,9}? Not in items. Max is 10
    expect(result.result).toBe(10);
  });

  it('initializes base row (no items) to 0', () => {
    const items = [{ w: 1, v: 2 }];
    const result = runDP(items, 3);
    for (let c = 0; c <= 3; c++) {
      expect(result.grid[0][c].value).toBe(0);
    }
  });

  it('handles single item that fits', () => {
    const items = [{ w: 2, v: 5 }];
    const result = runDP(items, 3);
    expect(result.result).toBe(5);
  });

  it('handles single item that does not fit', () => {
    const items = [{ w: 5, v: 10 }];
    const result = runDP(items, 3);
    expect(result.result).toBe(0);
  });

  it('handles empty items', () => {
    const result = runDP([], 5);
    expect(result.result).toBe(0);
  });

  it('handles W=0', () => {
    const items = [{ w: 2, v: 3 }];
    const result = runDP(items, 0);
    expect(result.result).toBe(0);
  });
});
