import { registerAlgorithm } from '../registry';
import type { TreeCommand, TreeState } from './commands';
import { makeTreeState, treeReducer } from './commands';
import { buildBST } from './types';
import type { TreeNode } from './types';

export function bstSearchCommands(state: TreeState): TreeCommand[] {
  const cmds: TreeCommand[] = [];
  const target = state.targetValue ?? 0;

  function search(node: TreeNode | null): boolean {
    if (!node) {
      cmds.push({
        type: 'not_found',
        description: `${target} not found in tree`,
      });
      return false;
    }

    cmds.push({
      type: 'compare',
      nodeId: node.id,
      description: `Compare ${node.value} with target ${target}`,
    });

    if (node.value === target) {
      cmds.push({
        type: 'found',
        nodeId: node.id,
        description: `Found ${target} at node ${node.id}`,
      });
      return true;
    } else if (target < node.value) {
      cmds.push({
        type: 'visit',
        nodeId: node.id,
        description: `${target} < ${node.value}, go left`,
      });
      return search(node.left);
    } else {
      cmds.push({
        type: 'visit',
        nodeId: node.id,
        description: `${target} > ${node.value}, go right`,
      });
      return search(node.right);
    }
  }

  search(state.tree);
  return cmds;
}

registerAlgorithm({
  name: 'BST Search',
  slug: 'bst-search',
  category: 'tree',
  description:
    'Searches for a value in a Binary Search Tree by comparing at each node and moving left or right accordingly.',
  bestCase: 'O(1)',
  averageCase: 'O(log n)',
  worstCase: 'O(n)',
  spaceComplexity: 'O(h)',
  pseudocode: `function search(node, target):
  if node is null: return NOT_FOUND
  if target == node.value: return FOUND
  if target < node.value:
    return search(node.left, target)
  else:
    return search(node.right, target)`,
  visualizerType: 'tree',
  defaultInput: makeTreeState(buildBST([8, 4, 12, 2, 6, 10, 14]), 6),
  run: bstSearchCommands,
  reduce: treeReducer,
});
