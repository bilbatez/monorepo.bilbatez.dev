import { registerAlgorithm } from '../registry';
import type { MathCommand, MathState } from './commands';
import { makeMathState, mathReducer } from './commands';

export function fastPowerCommands(state: MathState): MathCommand[] {
  const cmds: MathCommand[] = [];
  const base = state.numbers[0];
  let exp = state.numbers[1];
  let current = base;
  let result = 1;

  while (exp > 0) {
    const bit = exp & 1;
    cmds.push({
      type: 'binary_step',
      bit,
      current,
      result: bit ? result * current : result,
      description: `exp bit=${bit}, current=${current}, result=${bit ? result * current : result}`,
    });

    if (bit === 1) {
      result *= current;
    }
    current *= current;
    exp >>= 1;
  }

  cmds.push({
    type: 'set_result',
    result,
    description: `${base}^${state.numbers[1]} = ${result}`,
  });

  return cmds;
}

registerAlgorithm({
  name: 'Fast Power (Binary Exponentiation)',
  slug: 'fast-power',
  category: 'math',
  description:
    'Computes base^exp in O(log exp) time by squaring the base at each step and multiplying into the result only when the corresponding bit of the exponent is set.',
  bestCase: 'O(1)',
  averageCase: 'O(log n)',
  worstCase: 'O(log n)',
  spaceComplexity: 'O(1)',
  pseudocode: `function fastPower(base, exp):
  result = 1
  current = base
  while exp > 0:
    if exp is odd:
      result = result * current
    current = current * current
    exp = exp >> 1  // divide by 2
  return result`,
  visualizerType: 'math',
  defaultInput: makeMathState([2, 10]),
  run: fastPowerCommands,
  reduce: mathReducer,
});
