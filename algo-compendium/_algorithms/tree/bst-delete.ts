import { registerAlgorithm } from '../registry';
import type { TreeCommand, TreeState } from './commands';
import { makeTreeState, treeReducer } from './commands';
import { buildBST } from './types';
import type { TreeNode } from './types';

// Find the in-order successor (smallest node in right subtree)
function findMin(node: TreeNode): TreeNode {
  let current = node;
  while (current.left) current = current.left;
  return current;
}

export function bstDeleteCommands(state: TreeState): TreeCommand[] {
  const cmds: TreeCommand[] = [];
  const target = state.targetValue ?? 0;

  function deleteNode(node: TreeNode | null): TreeNode | null {
    if (!node) {
      cmds.push({
        type: 'not_found',
        description: `${target} not found in tree`,
      });
      return null;
    }

    cmds.push({
      type: 'compare',
      nodeId: node.id,
      description: `Compare ${target} with node ${node.value}`,
    });

    if (target < node.value) {
      cmds.push({
        type: 'visit',
        nodeId: node.id,
        description: `${target} < ${node.value}, go left`,
      });
      return { ...node, left: deleteNode(node.left) };
    } else if (target > node.value) {
      cmds.push({
        type: 'visit',
        nodeId: node.id,
        description: `${target} > ${node.value}, go right`,
      });
      return { ...node, right: deleteNode(node.right) };
    } else {
      // Found the node to delete
      cmds.push({
        type: 'found',
        nodeId: node.id,
        description: `Found ${target}, preparing to delete`,
      });

      // Case 1: Leaf node
      if (!node.left && !node.right) {
        cmds.push({
          type: 'delete',
          nodeId: node.id,
          description: `Delete leaf node ${node.value}`,
        });
        return null;
      }

      // Case 2: One child
      if (!node.right) {
        cmds.push({
          type: 'delete',
          nodeId: node.id,
          description: `Delete node ${node.value}, replace with left child`,
        });
        return node.left;
      }
      if (!node.left) {
        cmds.push({
          type: 'delete',
          nodeId: node.id,
          description: `Delete node ${node.value}, replace with right child`,
        });
        return node.right;
      }

      // Case 3: Two children — replace with in-order successor
      const successor = findMin(node.right);
      cmds.push({
        type: 'delete',
        nodeId: node.id,
        description: `Delete node ${node.value}, replace with in-order successor ${successor.value}`,
      });
      const newRight = deleteNode(node.right);
      return { ...node, value: successor.value, id: node.id, right: newRight };
    }
  }

  const newTree = deleteNode(state.tree);

  cmds.push({
    type: 'set_tree',
    tree: newTree,
    description: `Deleted ${target} from the BST`,
  });

  return cmds;
}

registerAlgorithm({
  name: 'BST Delete',
  slug: 'bst-delete',
  category: 'tree',
  description:
    'Deletes a value from a Binary Search Tree, handling three cases: leaf node, one child, and two children (in-order successor).',
  bestCase: 'O(log n)',
  averageCase: 'O(log n)',
  worstCase: 'O(n)',
  spaceComplexity: 'O(h)',
  pseudocode: `function delete(node, value):
  if node is null: return null
  if value < node.value:
    node.left = delete(node.left, value)
  else if value > node.value:
    node.right = delete(node.right, value)
  else: // found
    if no left child: return node.right
    if no right child: return node.left
    // two children: replace with in-order successor
    successor = findMin(node.right)
    node.value = successor.value
    node.right = delete(node.right, successor.value)
  return node`,
  visualizerType: 'tree',
  defaultInput: makeTreeState(buildBST([8, 4, 12, 2, 6, 10, 14]), 4),
  run: bstDeleteCommands,
  reduce: (state, cmd) => {
    const next = treeReducer(state, cmd);
    if (cmd.type === 'set_tree') {
      return { ...next, tree: cmd.tree };
    }
    return next;
  },
});
