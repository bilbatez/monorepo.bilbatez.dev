import { registerAlgorithm } from '../registry';
import type { MathCommand, MathState } from './commands';
import { makeMathState, mathReducer } from './commands';

export function gcdCommands(state: MathState): MathCommand[] {
  const cmds: MathCommand[] = [];
  let a = state.numbers[0];
  let b = state.numbers[1];

  while (b !== 0) {
    const remainder = a % b;
    cmds.push({
      type: 'step',
      a,
      b,
      remainder,
      description: `gcd(${a}, ${b}): ${a} = ${Math.floor(a / b)} × ${b} + ${remainder}`,
    });
    a = b;
    b = remainder;
  }

  // Final step showing gcd(a, 0) = a
  cmds.push({
    type: 'step',
    a,
    b: 0,
    remainder: 0,
    description: `gcd(${a}, 0) = ${a}`,
  });

  cmds.push({
    type: 'set_result',
    result: a,
    description: `GCD = ${a}`,
  });

  return cmds;
}

registerAlgorithm({
  name: 'Euclidean GCD',
  slug: 'euclidean-gcd',
  category: 'math',
  description:
    'Computes the Greatest Common Divisor of two numbers using repeated division. Each step reduces the problem until the remainder is zero.',
  bestCase: 'O(1)',
  averageCase: 'O(log min(a,b))',
  worstCase: 'O(log min(a,b))',
  spaceComplexity: 'O(1)',
  pseudocode: `function gcd(a, b):
  while b != 0:
    remainder = a mod b
    a = b
    b = remainder
  return a`,
  visualizerType: 'math',
  defaultInput: makeMathState([48, 18]),
  run: gcdCommands,
  reduce: mathReducer,
});
