import { registerAlgorithm } from '../registry';
import type { MathCommand, MathState } from './commands';
import { makeMathState, mathReducer } from './commands';

export function sieveCommands(state: MathState): MathCommand[] {
  const cmds: MathCommand[] = [];
  const n = state.numbers.length;
  const isPrime = new Array(n).fill(true);
  isPrime[0] = false;
  isPrime[1] = false;

  for (let i = 2; i < n; i++) {
    cmds.push({
      type: 'highlight_number',
      index: i,
      description: `Checking if ${state.numbers[i]} is prime`,
    });

    if (isPrime[i]) {
      cmds.push({
        type: 'mark_prime',
        index: i,
        description: `${state.numbers[i]} is prime`,
      });

      for (let j = i * i; j < n; j += i) {
        if (isPrime[j]) {
          isPrime[j] = false;
          cmds.push({
            type: 'mark_composite',
            index: j,
            description: `${state.numbers[j]} is composite (multiple of ${state.numbers[i]})`,
          });
        }
      }
    }
  }

  const primeNums = state.numbers
    .filter((_, i) => isPrime[i] && i >= 2)
    .join(', ');

  cmds.push({
    type: 'set_result',
    result: `Primes: ${primeNums}`,
    description: `Found all primes up to ${n - 1}`,
  });

  return cmds;
}

registerAlgorithm({
  name: 'Sieve of Eratosthenes',
  slug: 'sieve-of-eratosthenes',
  category: 'math',
  description:
    'Efficiently finds all prime numbers up to N by iteratively marking multiples of each prime as composite.',
  bestCase: 'O(n log log n)',
  averageCase: 'O(n log log n)',
  worstCase: 'O(n log log n)',
  spaceComplexity: 'O(n)',
  pseudocode: `function sieve(n):
  isPrime = array of true, size n+1
  isPrime[0] = isPrime[1] = false
  for i from 2 to sqrt(n):
    if isPrime[i]:
      for j from i*i to n step i:
        isPrime[j] = false
  return all i where isPrime[i] is true`,
  visualizerType: 'math',
  defaultInput: makeMathState(Array.from({ length: 50 }, (_, i) => i)),
  run: sieveCommands,
  reduce: mathReducer,
});
