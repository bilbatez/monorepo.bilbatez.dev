import { registerAlgorithm } from '../registry';
import type { MathCommand, MathState } from './commands';
import { makeMathState, mathReducer } from './commands';

export function primeFactorizationCommands(state: MathState): MathCommand[] {
  const cmds: MathCommand[] = [];
  let n = state.numbers[0];
  const factors: number[] = [];

  let divisor = 2;
  while (divisor * divisor <= n) {
    cmds.push({
      type: 'highlight_number',
      index: divisor,
      description: `Trying divisor ${divisor}`,
    });

    while (n % divisor === 0) {
      factors.push(divisor);
      cmds.push({
        type: 'set_value',
        index: factors.length - 1,
        value: divisor,
        description: `${divisor} is a factor — ${state.numbers[0]} / ${divisor} = ${n / divisor}`,
      });
      n = Math.floor(n / divisor);
    }
    divisor++;
  }

  if (n > 1) {
    factors.push(n);
    cmds.push({
      type: 'highlight_number',
      index: n,
      description: `${n} is a prime factor`,
    });
    cmds.push({
      type: 'set_value',
      index: factors.length - 1,
      value: n,
      description: `Remaining factor: ${n}`,
    });
  }

  const factorizationStr = factors.join(' × ');
  cmds.push({
    type: 'set_result',
    result: factorizationStr,
    description: `${state.numbers[0]} = ${factorizationStr}`,
  });

  return cmds;
}

registerAlgorithm({
  name: 'Prime Factorization',
  slug: 'prime-factorization',
  category: 'math',
  description:
    'Decomposes a number into its prime factors by trial division up to the square root of n.',
  bestCase: 'O(√n)',
  averageCase: 'O(√n)',
  worstCase: 'O(√n)',
  spaceComplexity: 'O(log n)',
  pseudocode: `function primeFactorize(n):
  factors = []
  divisor = 2
  while divisor * divisor <= n:
    while n % divisor == 0:
      factors.push(divisor)
      n = n / divisor
    divisor++
  if n > 1:
    factors.push(n)
  return factors`,
  visualizerType: 'math',
  defaultInput: makeMathState([360]),
  run: primeFactorizationCommands,
  reduce: mathReducer,
});
