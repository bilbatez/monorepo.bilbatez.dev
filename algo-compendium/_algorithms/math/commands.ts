export type MathCommand =
  | { type: 'highlight_number'; index: number; description: string }
  | { type: 'mark_prime'; index: number; description: string }
  | { type: 'mark_composite'; index: number; description: string }
  | {
      type: 'step';
      a: number;
      b: number;
      remainder: number;
      description: string;
    }
  | { type: 'set_result'; result: number | string; description: string }
  | { type: 'set_value'; index: number; value: number; description: string }
  | {
      type: 'binary_step';
      bit: number;
      current: number;
      result: number;
      description: string;
    };

export type MathState = {
  numbers: number[];
  primes: number[];
  composites: number[];
  highlighted: number | null;
  steps: { a: number; b: number; remainder: number; description: string }[];
  sequence: number[];
  binarySteps: { bit: number; current: number; result: number }[];
  result: number | string | null;
  description: string;
};

export function makeMathState(numbers?: number[]): MathState {
  return {
    numbers: numbers ?? [],
    primes: [],
    composites: [],
    highlighted: null,
    steps: [],
    sequence: [],
    binarySteps: [],
    result: null,
    description: 'Ready',
  };
}

export function mathReducer(state: MathState, cmd: MathCommand): MathState {
  switch (cmd.type) {
    case 'highlight_number':
      return { ...state, highlighted: cmd.index, description: cmd.description };
    case 'mark_prime':
      return {
        ...state,
        primes: [...new Set([...state.primes, cmd.index])],
        highlighted: cmd.index,
        description: cmd.description,
      };
    case 'mark_composite':
      return {
        ...state,
        composites: [...new Set([...state.composites, cmd.index])],
        description: cmd.description,
      };
    case 'step':
      return {
        ...state,
        steps: [
          ...state.steps,
          {
            a: cmd.a,
            b: cmd.b,
            remainder: cmd.remainder,
            description: cmd.description,
          },
        ],
        description: cmd.description,
      };
    case 'set_result':
      return { ...state, result: cmd.result, description: cmd.description };
    case 'set_value': {
      const sequence = [...state.sequence];
      sequence[cmd.index] = cmd.value;
      return { ...state, sequence, description: cmd.description };
    }
    case 'binary_step':
      return {
        ...state,
        binarySteps: [
          ...state.binarySteps,
          { bit: cmd.bit, current: cmd.current, result: cmd.result },
        ],
        description: cmd.description,
      };
  }
}
