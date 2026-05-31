import { registerAlgorithm } from '../registry';
import type { TreeCommand, TreeState } from './commands';
import { makeTreeState, treeReducer } from './commands';
import { buildBST } from './types';
import type { TreeNode } from './types';

export function levelOrderTraversalCommands(state: TreeState): TreeCommand[] {
  const cmds: TreeCommand[] = [];
  if (!state.tree) return cmds;

  const queue: TreeNode[] = [state.tree];

  while (queue.length > 0) {
    const node = queue.shift()!;
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
    if (node.left) queue.push(node.left);
    if (node.right) queue.push(node.right);
  }

  return cmds;
}

registerAlgorithm({
  name: 'Level-order Traversal',
  slug: 'level-order-traversal',
  category: 'tree',
  description:
    'Visits nodes level by level using a queue (BFS). Explores all nodes at depth d before nodes at depth d+1.',
  bestCase: 'O(n)',
  averageCase: 'O(n)',
  worstCase: 'O(n)',
  spaceComplexity: 'O(w)',
  pseudocode: `function levelOrder(root):
  queue = [root]
  while queue not empty:
    node = queue.dequeue()
    visit(node)
    if node.left:  queue.enqueue(node.left)
    if node.right: queue.enqueue(node.right)`,
  visualizerType: 'tree',
  defaultInput: makeTreeState(buildBST([8, 4, 12, 2, 6, 10, 14])),
  run: levelOrderTraversalCommands,
  reduce: treeReducer,
});
