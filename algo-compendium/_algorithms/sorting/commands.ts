export type SortCommand =
  | { type: 'compare'; i: number; j: number; description: string }
  | { type: 'swap'; i: number; j: number; description: string }
  | { type: 'set'; index: number; value: number; description: string }
  | { type: 'mark_sorted'; indices: number[]; description: string }
  | { type: 'set_pivot'; index: number; description: string }
  | { type: 'clear_pivot'; description: string };

export type SortState = {
  array: number[];
  comparing: number[];
  swapping: number[];
  sorted: number[]; // number[] not Set for serialization + React useMemo
  pivot: number | null;
  description: string;
};

export function makeSortState(array: number[]): SortState {
  return {
    array: [...array],
    comparing: [],
    swapping: [],
    sorted: [],
    pivot: null,
    description: 'Ready',
  };
}

export function sortReducer(state: SortState, cmd: SortCommand): SortState {
  switch (cmd.type) {
    case 'compare':
      return {
        ...state,
        comparing: [cmd.i, cmd.j],
        swapping: [],
        description: cmd.description,
      };
    case 'swap': {
      const array = [...state.array];
      [array[cmd.i], array[cmd.j]] = [array[cmd.j], array[cmd.i]];
      return {
        ...state,
        array,
        comparing: [],
        swapping: [cmd.i, cmd.j],
        description: cmd.description,
      };
    }
    case 'set': {
      const array = [...state.array];
      array[cmd.index] = cmd.value;
      return { ...state, array, description: cmd.description };
    }
    case 'mark_sorted': {
      const sortedSet = new Set([...state.sorted, ...cmd.indices]);
      return {
        ...state,
        sorted: [...sortedSet],
        comparing: [],
        swapping: [],
        pivot: null,
        description: cmd.description,
      };
    }
    case 'set_pivot':
      return { ...state, pivot: cmd.index, description: cmd.description };
    case 'clear_pivot':
      return { ...state, pivot: null, description: cmd.description };
  }
}
