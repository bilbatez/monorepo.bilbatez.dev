import { registerAlgorithm } from '../registry';
import type { TreeCommand, TreeState } from './commands';
import { makeTreeState, treeReducer } from './commands';
import { buildBST, bstInsertNode } from './types';
import type { TreeNode } from './types';

export function bstInsertCommands(state: TreeState): TreeCommand[] {
  const cmds: TreeCommand[] = [];
  const target = state.targetValue ?? 0;
  let nodeCounter = 100; // start high to avoid colliding with existing IDs

  function insert(
    node: TreeNode | null,
    parentId: string | null,
    direction: 'left' | 'right' | 'root'
  ): TreeNode {
    if (!node) {
      const newId = `ins-${nodeCounter++}`;
      cmds.push({
        type: 'insert',
        nodeId: newId,
        parentId,
        direction,
        value: target,
        description: `Insert ${target} as ${direction === 'root' ? 'root' : direction + ' child of ' + parentId}`,
      });
      const newNode = { id: newId, value: target, left: null, right: null };
      return newNode;
    }

    cmds.push({
      type: 'compare',
      nodeId: node.id,
      description: `Compare ${target} with node ${node.value}`,
    });

    if (target === node.value) {
      cmds.push({
        type: 'found',
        nodeId: node.id,
        description: `${target} already exists in tree, no insertion needed`,
      });
      return node;
    } else if (target < node.value) {
      cmds.push({
        type: 'visit',
        nodeId: node.id,
        description: `${target} < ${node.value}, go left`,
      });
      const newLeft = insert(node.left, node.id, 'left');
      return { ...node, left: newLeft };
    } else {
      cmds.push({
        type: 'visit',
        nodeId: node.id,
        description: `${target} > ${node.value}, go right`,
      });
      const newRight = insert(node.right, node.id, 'right');
      return { ...node, right: newRight };
    }
  }

  const newTree = insert(state.tree, null, 'root');

  cmds.push({
    type: 'set_tree',
    tree: newTree,
    description: `Inserted ${target} into the BST`,
  });

  return cmds;
}

registerAlgorithm({
  name: 'BST Insert',
  slug: 'bst-insert',
  category: 'tree',
  description:
    'Inserts a new value into a Binary Search Tree by comparing at each node to find the correct position.',
  bestCase: 'O(log n)',
  averageCase: 'O(log n)',
  worstCase: 'O(n)',
  spaceComplexity: 'O(h)',
  pseudocode: `function insert(node, value):
  if node is null: return newNode(value)
  if value < node.value:
    node.left = insert(node.left, value)
  else if value > node.value:
    node.right = insert(node.right, value)
  return node`,
  visualizerType: 'tree',
  defaultInput: makeTreeState(buildBST([8, 4, 12, 2, 6, 10, 14]), 7),
  run: bstInsertCommands,
  reduce: (state, cmd) => {
    const next = treeReducer(state, cmd);
    // When set_tree command arrives, update the tree in state
    if (cmd.type === 'set_tree') {
      return { ...next, tree: cmd.tree };
    }
    return next;
  },
});

// Re-export for external use (tests, etc)
export { bstInsertNode };
