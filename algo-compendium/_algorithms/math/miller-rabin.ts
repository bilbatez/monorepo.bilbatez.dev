import { registerAlgorithm } from '../registry';
import type { MathCommand, MathState } from './commands';
import { makeMathState, mathReducer } from './commands';

function modPow(base: number, exp: number, mod: number): number {
  let result = 1;
  base = base % mod;
  while (exp > 0) {
    if (exp % 2 === 1) {
      result = (result * base) % mod;
    }
    exp = Math.floor(exp / 2);
    base = (base * base) % mod;
  }
  return result;
}

export function millerRabinCommands(state: MathState): MathCommand[] {
  const cmds: MathCommand[] = [];
  const n = state.numbers[0];

  if (n === undefined || n < 2) {
    cmds.push({
      type: 'set_result',
      result: `${n} is not prime`,
      description: 'Numbers less than 2 are not prime',
    });
    return cmds;
  }

  cmds.push({
    type: 'highlight_number',
    index: 0,
    description: `Testing ${n} for primality using Miller-Rabin with witnesses 2, 3, 5, 7`,
  });

  // Handle small cases
  if (n === 2 || n === 3 || n === 5 || n === 7) {
    cmds.push({
      type: 'mark_prime',
      index: 0,
      description: `${n} is a known prime`,
    });
    cmds.push({
      type: 'set_result',
      result: `${n} is prime`,
      description: `${n} is prime (base case)`,
    });
    return cmds;
  }

  if (n % 2 === 0) {
    cmds.push({
      type: 'mark_composite',
      index: 0,
      description: `${n} is even, not prime`,
    });
    cmds.push({
      type: 'set_result',
      result: `${n} is composite`,
      description: `${n} is divisible by 2`,
    });
    return cmds;
  }

  // Write n-1 = 2^r * d
  let d = n - 1;
  let r = 0;
  while (d % 2 === 0) {
    d = Math.floor(d / 2);
    r++;
  }

  cmds.push({
    type: 'step',
    a: n - 1,
    b: r,
    remainder: d,
    description: `n-1 = ${n - 1} = 2^${r} × ${d} (r=${r}, d=${d})`,
  });

  const witnesses = [2, 3, 5, 7];
  let isPrime = true;

  for (let wi = 0; wi < witnesses.length; wi++) {
    const a = witnesses[wi];

    if (a >= n) continue;

    cmds.push({
      type: 'highlight_number',
      index: 0,
      description: `Test witness a=${a}: compute ${a}^${d} mod ${n}`,
    });

    let x = modPow(a, d, n);

    cmds.push({
      type: 'binary_step',
      bit: wi,
      current: a,
      result: x,
      description: `Witness ${a}: ${a}^${d} mod ${n} = ${x}`,
    });

    if (x === 1 || x === n - 1) {
      cmds.push({
        type: 'highlight_number',
        index: 0,
        description: `Witness ${a} passes (x=${x} is 1 or n-1)`,
      });
      continue;
    }

    let composite = true;
    for (let i = 0; i < r - 1; i++) {
      x = (x * x) % n;
      cmds.push({
        type: 'binary_step',
        bit: i,
        current: x,
        result: x,
        description: `Square: x = ${x} (iteration ${i + 1})`,
      });
      if (x === n - 1) {
        composite = false;
        cmds.push({
          type: 'highlight_number',
          index: 0,
          description: `Witness ${a} passes (x became n-1=${n - 1})`,
        });
        break;
      }
    }

    if (composite) {
      isPrime = false;
      cmds.push({
        type: 'mark_composite',
        index: 0,
        description: `Witness ${a} proves ${n} is composite`,
      });
      break;
    }
  }

  if (isPrime) {
    cmds.push({
      type: 'mark_prime',
      index: 0,
      description: `All witnesses passed — ${n} is (probably) prime`,
    });
    cmds.push({
      type: 'set_result',
      result: `${n} is prime`,
      description: `Miller-Rabin: ${n} is prime`,
    });
  } else {
    cmds.push({
      type: 'set_result',
      result: `${n} is composite`,
      description: `Miller-Rabin: ${n} is composite`,
    });
  }

  return cmds;
}

registerAlgorithm({
  name: 'Miller-Rabin Primality Test',
  slug: 'miller-rabin',
  category: 'math',
  description:
    'A probabilistic primality test that uses witnesses to determine whether a number is composite or probably prime. Testing with witnesses 2, 3, 5, and 7 gives a deterministic result for all n < 3,215,031,751.',
  bestCase: 'O(k log²n)',
  averageCase: 'O(k log²n)',
  worstCase: 'O(k log²n)',
  spaceComplexity: 'O(1)',
  pseudocode: `write n-1 as 2^r * d
for each witness a in {2,3,5,7}:
  x = a^d mod n
  if x == 1 or x == n-1: continue
  for i = 0 to r-2:
    x = x² mod n
    if x == n-1: goto next witness
  return COMPOSITE
return PROBABLY PRIME`,
  visualizerType: 'math',
  defaultInput: makeMathState([97]),
  run: millerRabinCommands,
  reduce: mathReducer,
});
