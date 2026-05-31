import { registerAlgorithm } from '../registry';
import type { TreeCommand, TreeState } from './commands';
import { makeTreeState, treeReducer } from './commands';
import { buildBST } from './types';
import type { TreeNode } from './types';

export function postorderTraversalCommands(state: TreeState): TreeCommand[] {
  const cmds: TreeCommand[] = [];

  function traverse(node: TreeNode | null) {
    if (!node) return;
    traverse(node.left);
    traverse(node.right);
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
  }

  traverse(state.tree);
  return cmds;
}

registerAlgorithm({
  name: 'Post-order Traversal',
  slug: 'postorder-traversal',
  category: 'tree',
  description:
    'Visits nodes in Left → Right → Root order. Useful for deleting a tree or evaluating postfix expressions.',
  bestCase: 'O(n)',
  averageCase: 'O(n)',
  worstCase: 'O(n)',
  spaceComplexity: 'O(h)',
  pseudocode: `function postorder(node):
  if node is null: return
  postorder(node.left)
  postorder(node.right)
  visit(node)`,
  visualizerType: 'tree',
  defaultInput: makeTreeState(buildBST([8, 4, 12, 2, 6, 10, 14])),
  run: postorderTraversalCommands,
  reduce: treeReducer,
});
