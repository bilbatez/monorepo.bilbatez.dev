export type SearchCommand =
  | { type: 'visit'; index: number; description: string }
  | { type: 'compare'; index: number; description: string }
  | { type: 'eliminate'; from: number; to: number; description: string }
  | { type: 'found'; index: number; description: string }
  | { type: 'not_found'; description: string }
  | { type: 'set_bounds'; low: number; high: number; description: string }
  | { type: 'set_mid'; index: number; description: string };

export type SearchState = {
  array: number[];
  target: number;
  current: number | null; // index currently being examined
  low: number | null; // lower bound for binary-style searches
  high: number | null; // upper bound
  mid: number | null; // midpoint
  eliminated: number[]; // indices eliminated from search
  found: number | null; // index where target was found, or null
  description: string;
};

export function makeSearchState(array: number[], target: number): SearchState {
  return {
    array: [...array],
    target,
    current: null,
    low: null,
    high: null,
    mid: null,
    eliminated: [],
    found: null,
    description: `Searching for ${target}`,
  };
}

export function searchReducer(
  state: SearchState,
  cmd: SearchCommand
): SearchState {
  switch (cmd.type) {
    case 'visit':
      return { ...state, current: cmd.index, description: cmd.description };
    case 'compare':
      return { ...state, current: cmd.index, description: cmd.description };
    case 'eliminate':
      return {
        ...state,
        eliminated: [
          ...new Set([...state.eliminated, ...range(cmd.from, cmd.to)]),
        ],
        description: cmd.description,
      };
    case 'found':
      return {
        ...state,
        found: cmd.index,
        current: cmd.index,
        description: cmd.description,
      };
    case 'not_found':
      return { ...state, current: null, description: cmd.description };
    case 'set_bounds':
      return {
        ...state,
        low: cmd.low,
        high: cmd.high,
        description: cmd.description,
      };
    case 'set_mid':
      return { ...state, mid: cmd.index, description: cmd.description };
  }
}

function range(from: number, to: number): number[] {
  const result: number[] = [];
  for (let i = from; i <= to; i++) result.push(i);
  return result;
}
