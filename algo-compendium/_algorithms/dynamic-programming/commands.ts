export type GridCommand =
  | {
      type: 'compute';
      row: number;
      col: number;
      value: number;
      description: string;
    }
  | { type: 'highlight'; row: number; col: number; description: string }
  | { type: 'trace'; cells: [number, number][]; description: string }
  | { type: 'set_result'; result: number | string; description: string }
  | { type: 'compare'; row: number; col: number; description: string };

export type GridCell = {
  value: number | string | null;
  computed: boolean;
};

export type GridState = {
  grid: GridCell[][];
  rowLabels: string[];
  colLabels: string[];
  highlighted: [number, number] | null;
  tracePath: [number, number][];
  result: number | string | null;
  description: string;
  // DP-specific optional fields
  targetN?: number;
  s1?: string;
  s2?: string;
  items?: { w: number; v: number }[];
  coins?: number[];
  amount?: number;
  arr?: number[];
};

export function makeGridState(
  rows: number,
  cols: number,
  rowLabels?: string[],
  colLabels?: string[]
): GridState {
  const grid: GridCell[][] = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({ value: null, computed: false }))
  );
  return {
    grid,
    rowLabels: rowLabels ?? Array.from({ length: rows }, (_, i) => String(i)),
    colLabels: colLabels ?? Array.from({ length: cols }, (_, i) => String(i)),
    highlighted: null,
    tracePath: [],
    result: null,
    description: 'Ready',
  };
}

export function gridReducer(state: GridState, cmd: GridCommand): GridState {
  switch (cmd.type) {
    case 'compute': {
      const grid = state.grid.map((row, r) =>
        row.map((cell, c) =>
          r === cmd.row && c === cmd.col
            ? { value: cmd.value, computed: true }
            : cell
        )
      );
      return {
        ...state,
        grid,
        highlighted: [cmd.row, cmd.col],
        description: cmd.description,
      };
    }
    case 'highlight':
      return {
        ...state,
        highlighted: [cmd.row, cmd.col],
        description: cmd.description,
      };
    case 'compare':
      return {
        ...state,
        highlighted: [cmd.row, cmd.col],
        description: cmd.description,
      };
    case 'trace':
      return {
        ...state,
        tracePath: cmd.cells,
        description: cmd.description,
      };
    case 'set_result':
      return { ...state, result: cmd.result, description: cmd.description };
  }
}
