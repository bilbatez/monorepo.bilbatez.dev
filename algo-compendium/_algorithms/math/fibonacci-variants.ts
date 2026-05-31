import { registerAlgorithm } from '../registry';
import type { MathCommand, MathState } from './commands';
import { makeMathState, mathReducer } from './commands';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function fibonacciCommands(_state: MathState): MathCommand[] {
  const cmds: MathCommand[] = [];
  const n = 10;

  // Build Fibonacci sequence iteratively
  const fib: number[] = new Array(n + 1).fill(0);
  fib[0] = 0;
  fib[1] = 1;

  cmds.push({
    type: 'set_value',
    index: 0,
    value: 0,
    description: 'F(0) = 0 (base case)',
  });

  cmds.push({
    type: 'set_value',
    index: 1,
    value: 1,
    description: 'F(1) = 1 (base case)',
  });

  for (let i = 2; i <= n; i++) {
    fib[i] = fib[i - 1] + fib[i - 2];
    cmds.push({
      type: 'set_value',
      index: i,
      value: fib[i],
      description: `F(${i}) = F(${i - 1}) + F(${i - 2}) = ${fib[i - 1]} + ${fib[i - 2]} = ${fib[i]}`,
    });
  }

  cmds.push({
    type: 'set_result',
    result: fib[n],
    description: `F(${n}) = ${fib[n]}`,
  });

  return cmds;
}

registerAlgorithm({
  name: 'Fibonacci Variants',
  slug: 'fibonacci-variants',
  category: 'math',
  description:
    'Demonstrates iterative Fibonacci computation with memoization. Each value is computed from the two preceding values, building the sequence step by step.',
  bestCase: 'O(n)',
  averageCase: 'O(n)',
  worstCase: 'O(n)',
  spaceComplexity: 'O(n)',
  pseudocode: `function fibonacci(n):
  if n <= 1: return n
  fib = array of size n+1
  fib[0] = 0, fib[1] = 1
  for i from 2 to n:
    fib[i] = fib[i-1] + fib[i-2]
  return fib[n]`,
  visualizerType: 'math',
  defaultInput: makeMathState([]),
  run: fibonacciCommands,
  reduce: mathReducer,
});
