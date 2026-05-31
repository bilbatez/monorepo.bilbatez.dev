import { describe, it, expect } from 'vitest';
import { nQueensCommands } from './n-queens';
import { makeGridState, backtrackReducer } from './commands';
import type { BacktrackCommand } from './commands';

function runAlgo(state: ReturnType<typeof makeGridState>) {
  const cmds = nQueensCommands(state);
  return cmds.reduce(backtrackReducer, state);
}

describe('N-Queens (4x4)', () => {
  it('finds a solution (result === "Solution found!")', () => {
    const state = makeGridState(
      4,
      4,
      ['Row 0', 'Row 1', 'Row 2', 'Row 3'],
      ['Col 0', 'Col 1', 'Col 2', 'Col 3']
    );
    const result = runAlgo(state);
    expect(result.result).toBe('Solution found!');
  });

  it('trace contains exactly 4 queen positions', () => {
    const state = makeGridState(
      4,
      4,
      ['Row 0', 'Row 1', 'Row 2', 'Row 3'],
      ['Col 0', 'Col 1', 'Col 2', 'Col 3']
    );
    const result = runAlgo(state);
    expect(result.tracePath).toHaveLength(4);
  });

  it('places queens so each row has exactly one queen', () => {
    const state = makeGridState(
      4,
      4,
      ['Row 0', 'Row 1', 'Row 2', 'Row 3'],
      ['Col 0', 'Col 1', 'Col 2', 'Col 3']
    );
    const result = runAlgo(state);
    const tracedRows = result.tracePath.map(([r]) => r);
    const uniqueRows = new Set(tracedRows);
    expect(uniqueRows.size).toBe(4);
  });

  it('no two queens share a column', () => {
    const state = makeGridState(
      4,
      4,
      ['Row 0', 'Row 1', 'Row 2', 'Row 3'],
      ['Col 0', 'Col 1', 'Col 2', 'Col 3']
    );
    const result = runAlgo(state);
    const tracedCols = result.tracePath.map(([, c]) => c);
    const uniqueCols = new Set(tracedCols);
    expect(uniqueCols.size).toBe(4);
  });

  it('no two queens share a diagonal', () => {
    const state = makeGridState(
      4,
      4,
      ['Row 0', 'Row 1', 'Row 2', 'Row 3'],
      ['Col 0', 'Col 1', 'Col 2', 'Col 3']
    );
    const result = runAlgo(state);
    const positions = result.tracePath;
    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        const [r1, c1] = positions[i];
        const [r2, c2] = positions[j];
        expect(Math.abs(r1 - r2)).not.toBe(Math.abs(c1 - c2));
      }
    }
  });

  it('produces commands (non-empty)', () => {
    const state = makeGridState(
      4,
      4,
      ['Row 0', 'Row 1', 'Row 2', 'Row 3'],
      ['Col 0', 'Col 1', 'Col 2', 'Col 3']
    );
    const cmds = nQueensCommands(state);
    expect(cmds.length).toBeGreaterThan(0);
  });

  it('reducer does not mutate original state', () => {
    const state = makeGridState(
      4,
      4,
      ['Row 0', 'Row 1', 'Row 2', 'Row 3'],
      ['Col 0', 'Col 1', 'Col 2', 'Col 3']
    );
    const cmds = nQueensCommands(state);
    const next = backtrackReducer(state, cmds[0] as BacktrackCommand);
    expect(state.grid[0][0].value).toBeNull();
    expect(next).not.toBe(state);
  });
});
