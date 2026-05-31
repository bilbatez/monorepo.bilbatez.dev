import { registerAlgorithm } from '../registry';
import type { TreeCommand, TreeState } from './commands';
import { makeTreeState, treeReducer } from './commands';
import { buildBST } from './types';
import type { TreeNode } from './types';

export function inorderTraversalCommands(state: TreeState): TreeCommand[] {
  const cmds: TreeCommand[] = [];

  function traverse(node: TreeNode | null) {
    if (!node) return;
    traverse(node.left);
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
    traverse(node.right);
  }

  traverse(state.tree);
  return cmds;
}

registerAlgorithm({
  name: 'In-order Traversal',
  slug: 'inorder-traversal',
  category: 'tree',
  description:
    'Visits nodes in Left → Root → Right order, producing sorted output for a BST.',
  bestCase: 'O(n)',
  averageCase: 'O(n)',
  worstCase: 'O(n)',
  spaceComplexity: 'O(h)',
  pseudocode: `function inorder(node):
  if node is null: return
  inorder(node.left)
  visit(node)
  inorder(node.right)`,
  visualizerType: 'tree',
  defaultInput: makeTreeState(buildBST([8, 4, 12, 2, 6, 10, 14])),
  run: inorderTraversalCommands,
  reduce: treeReducer,
});
