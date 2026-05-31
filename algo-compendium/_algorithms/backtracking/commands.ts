import type { GridState } from '../dynamic-programming/commands';

// Re-export shared types and utilities
export type { GridState, GridCell } from '../dynamic-programming/commands';
export { makeGridState } from '../dynamic-programming/commands';

// BacktrackCommand extends GridCommand to support string values in 'compute'
// and adds a 'clear' command to reset a cell during backtracking
export type BacktrackCommand =
  | {
      type: 'compute';
      row: number;
      col: number;
      value: number | string;
      description: string;
    }
  | { type: 'clear'; row: number; col: number; description: string }
  | { type: 'highlight'; row: number; col: number; description: string }
  | { type: 'trace'; cells: [number, number][]; description: string }
  | { type: 'set_result'; result: number | string; description: string }
  | { type: 'compare'; row: number; col: number; description: string };

export function backtrackReducer(
  state: GridState,
  cmd: BacktrackCommand
): GridState {
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
    case 'clear': {
      const grid = state.grid.map((row, r) =>
        row.map((cell, c) =>
          r === cmd.row && c === cmd.col
            ? { value: null, computed: false }
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
