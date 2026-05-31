import { registerAlgorithm } from '../registry';
import type { GridState, BacktrackCommand } from './commands';
import { makeGridState, backtrackReducer } from './commands';

export function subsetsCommands(state: GridState): BacktrackCommand[] {
  const cmds: BacktrackCommand[] = [];
  const n = state.grid[0].length; // number of elements
  const elements: number[] = Array.from({ length: n }, (_, i) => i + 1);
  const current: number[] = [];
  let subsetRow = 0;
  let subsetCount = 0;

  function generate(start: number) {
    // Record current subset in its row
    for (let c = 0; c < n; c++) {
      if (current.includes(elements[c])) {
        cmds.push({
          type: 'compute',
          row: subsetRow,
          col: c,
          value: elements[c],
          description: `Subset ${subsetCount + 1}: {${current.join(', ')}} — include ${elements[c]}`,
        });
      } else {
        cmds.push({
          type: 'highlight',
          row: subsetRow,
          col: c,
          description: `Subset ${subsetCount + 1}: {${current.join(', ')}} — ${elements[c]} not included`,
        });
      }
    }
    subsetCount++;
    subsetRow++;

    for (let i = start; i < n; i++) {
      current.push(elements[i]);
      generate(i + 1);
      current.pop(); // backtrack
    }
  }

  generate(0);

  cmds.push({
    type: 'set_result',
    result: subsetCount,
    description: `Found ${subsetCount} subsets of [${elements.join(', ')}] (2^${n} = ${subsetCount})`,
  });

  return cmds;
}

registerAlgorithm({
  name: 'Subsets',
  slug: 'subsets',
  category: 'backtracking',
  description:
    'Generate all subsets (power set) of [1, 2, 3] using backtracking. Each row shows one subset, with included elements filled in.',
  bestCase: 'O(2^n)',
  averageCase: 'O(2^n)',
  worstCase: 'O(2^n)',
  spaceComplexity: 'O(n)',
  stable: false,
  inPlace: false,
  pseudocode: `function generate(start):
  record current subset
  for i = start to n-1:
    include elements[i]
    generate(i + 1)
    exclude elements[i]  // backtrack`,
  visualizerType: 'grid',
  defaultInput: makeGridState(
    8,
    3,
    ['∅', '{1}', '{1,2}', '{1,2,3}', '{1,3}', '{2}', '{2,3}', '{3}'],
    ['1', '2', '3']
  ),
  run: subsetsCommands,
  reduce: backtrackReducer,
});
