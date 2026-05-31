import { describe, it, expect } from 'vitest';
import { fastPowerCommands } from './fast-power';
import { makeMathState, mathReducer } from './commands';

describe('fastPower', () => {
  it('2^10 = 1024', () => {
    const initial = makeMathState([2, 10]);
    const result = fastPowerCommands(initial).reduce(mathReducer, initial);
    expect(result.result).toBe(1024);
  });

  it('3^5 = 243', () => {
    const initial = makeMathState([3, 5]);
    const result = fastPowerCommands(initial).reduce(mathReducer, initial);
    expect(result.result).toBe(243);
  });

  it('5^0 = 1', () => {
    const initial = makeMathState([5, 0]);
    const result = fastPowerCommands(initial).reduce(mathReducer, initial);
    expect(result.result).toBe(1);
  });

  it('2^1 = 2', () => {
    const initial = makeMathState([2, 1]);
    const result = fastPowerCommands(initial).reduce(mathReducer, initial);
    expect(result.result).toBe(2);
  });

  it('records binary steps', () => {
    const initial = makeMathState([2, 10]);
    const result = fastPowerCommands(initial).reduce(mathReducer, initial);
    expect(result.binarySteps.length).toBeGreaterThan(0);
  });
});
