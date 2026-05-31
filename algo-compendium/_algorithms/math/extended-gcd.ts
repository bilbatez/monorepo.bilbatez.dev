import { registerAlgorithm } from '../registry';
import type { MathCommand, MathState } from './commands';
import { makeMathState, mathReducer } from './commands';

export function extendedGcdCommands(state: MathState): MathCommand[] {
  const cmds: MathCommand[] = [];
  const origA = state.numbers[0];
  const origB = state.numbers[1];

  if (origA === undefined || origB === undefined) {
    cmds.push({
      type: 'set_result',
      result: 'Invalid input',
      description: 'Need two numbers',
    });
    return cmds;
  }

  // Iterative extended Euclidean algorithm
  // Maintain: a = old_a, b = old_b
  // At each step: a = q*b + r, then a := b, b := r
  // Coefficients: (old_x, old_y), (x, y) tracking ax + by = current value

  let a = origA;
  let b = origB;
  let x0 = 1;
  let y0 = 0;
  let x1 = 0;
  let y1 = 1;

  cmds.push({
    type: 'highlight_number',
    index: 0,
    description: `Extended GCD(${origA}, ${origB}): find x,y such that ${origA}x + ${origB}y = gcd`,
  });

  while (b !== 0) {
    const q = Math.floor(a / b);
    const remainder = a % b;

    cmds.push({
      type: 'step',
      a,
      b,
      remainder,
      description: `${a} = ${q} × ${b} + ${remainder} | coeff: (${x0}, ${y0}) → (${x1}, ${y1})`,
    });

    const newX = x0 - q * x1;
    const newY = y0 - q * y1;

    a = b;
    b = remainder;
    x0 = x1;
    y0 = y1;
    x1 = newX;
    y1 = newY;
  }

  // Final step
  const gcd = a;
  const x = x0;
  const y = y0;

  cmds.push({
    type: 'step',
    a,
    b: 0,
    remainder: 0,
    description: `gcd(${a}, 0) = ${a} | Bezout coefficients: x=${x}, y=${y}`,
  });

  cmds.push({
    type: 'highlight_number',
    index: 0,
    description: `Verification: ${origA}×(${x}) + ${origB}×(${y}) = ${origA * x + origB * y} = ${gcd}`,
  });

  cmds.push({
    type: 'set_result',
    result: `gcd=${gcd}, x=${x}, y=${y}`,
    description: `${origA}×${x} + ${origB}×${y} = ${gcd}`,
  });

  return cmds;
}

registerAlgorithm({
  name: 'Extended GCD',
  slug: 'extended-gcd',
  category: 'math',
  description:
    'Extends the Euclidean algorithm to find Bézout coefficients x and y such that ax + by = gcd(a,b). These coefficients are useful for computing modular inverses in cryptography.',
  bestCase: 'O(log min(a,b))',
  averageCase: 'O(log min(a,b))',
  worstCase: 'O(log min(a,b))',
  spaceComplexity: 'O(log min(a,b))',
  pseudocode: `function extGcd(a, b):
  if b == 0: return (a, 1, 0)
  x0, y0, x1, y1 = 1, 0, 0, 1
  while b != 0:
    q = floor(a / b)
    a, b = b, a mod b
    x0, x1 = x1, x0 - q*x1
    y0, y1 = y1, y0 - q*y1
  return (a, x0, y0)  // gcd, x, y`,
  visualizerType: 'math',
  defaultInput: makeMathState([35, 15]),
  run: extendedGcdCommands,
  reduce: mathReducer,
});
