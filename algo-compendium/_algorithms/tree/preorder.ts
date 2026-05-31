import { registerAlgorithm } from '../registry';
import type { TreeCommand, TreeState } from './commands';
import { makeTreeState, treeReducer } from './commands';
import { buildBST } from './types';
import type { TreeNode } from './types';

export function preorderTraversalCommands(state: TreeState): TreeCommand[] {
  const cmds: TreeCommand[] = [];

  function traverse(node: TreeNode | null) {
    if (!node) return;
    cmds.push({
      type: 'visit',
      nodeId: node.id,
      description: `Visit node ${node.value}`,
    });
    cmds.push({
      type: 'mark_done',
      nodeId: node.id,
      description: `Done with node ${node.value}`,
    });
    traverse(node.left);
    traverse(node.right);
  }

  traverse(state.tree);
  return cmds;
}

registerAlgorithm({
  name: 'Pre-order Traversal',
  slug: 'preorder-traversal',
  category: 'tree',
  description:
    'Visits nodes in Root → Left → Right order. Useful for creating a copy of the tree or prefix expression evaluation.',
  bestCase: 'O(n)',
  averageCase: 'O(n)',
  worstCase: 'O(n)',
  spaceComplexity: 'O(h)',
  pseudocode: `function preorder(node):
  if node is null: return
  visit(node)
  preorder(node.left)
  preorder(node.right)`,
  visualizerType: 'tree',
  defaultInput: makeTreeState(buildBST([8, 4, 12, 2, 6, 10, 14])),
  run: preorderTraversalCommands,
  reduce: treeReducer,
});
