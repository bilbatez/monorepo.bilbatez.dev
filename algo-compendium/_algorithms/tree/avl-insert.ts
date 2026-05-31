import { registerAlgorithm } from '../registry';
import type { TreeCommand, TreeState } from './commands';
import { makeTreeState, treeReducer } from './commands';
import type { TreeNode } from './types';

// Build a balanced AVL tree with values [10, 20, 30, 40, 50]
// Inserting in order 10,20,30,40,50 with AVL rotations produces:
// After inserting 10,20,30 → RR rotation on 10 → root=20, left=10, right=30
// After inserting 40 → 30.right=40
// After inserting 50 → RR rotation on 30 → 30.right becomes 40, 40.right=50 → rotate 30 up?
// Final balanced tree: root=20, left=10, right=40, 40.left=30, 40.right=50
function buildAvlTree(): TreeNode {
  return {
    id: 'n0',
    value: 20,
    left: { id: 'n1', value: 10, left: null, right: null },
    right: {
      id: 'n2',
      value: 40,
      left: { id: 'n3', value: 30, left: null, right: null },
      right: { id: 'n4', value: 50, left: null, right: null },
    },
  };
}

function getHeight(node: TreeNode | null): number {
  if (!node) return 0;
  return 1 + Math.max(getHeight(node.left), getHeight(node.right));
}

function getBalance(node: TreeNode | null): number {
  if (!node) return 0;
  return getHeight(node.left) - getHeight(node.right);
}

let nodeIdCounter = 10;

function rotateRight(y: TreeNode): TreeNode {
  const x = y.left!;
  const T2 = x.right;
  return {
    ...x,
    right: { ...y, left: T2 },
  };
}

function rotateLeft(x: TreeNode): TreeNode {
  const y = x.right!;
  const T2 = y.left;
  return {
    ...y,
    left: { ...x, right: T2 },
  };
}

export function avlInsertCommands(state: TreeState): TreeCommand[] {
  const cmds: TreeCommand[] = [];
  const target = state.targetValue ?? 25;

  function insert(
    node: TreeNode | null,
    parentId: string | null,
    direction: 'left' | 'right' | 'root'
  ): TreeNode {
    if (!node) {
      const newId = `avl-${nodeIdCounter++}`;
      cmds.push({
        type: 'insert',
        nodeId: newId,
        parentId,
        direction,
        value: target,
        description: `Insert ${target} as ${direction === 'root' ? 'root' : direction + ' child of node ' + parentId}`,
      });
      return { id: newId, value: target, left: null, right: null };
    }

    cmds.push({
      type: 'compare',
      nodeId: node.id,
      description: `Compare ${target} with node ${node.value}`,
    });

    let updated: TreeNode;
    if (target < node.value) {
      cmds.push({
        type: 'visit',
        nodeId: node.id,
        description: `${target} < ${node.value}, go left`,
      });
      updated = { ...node, left: insert(node.left, node.id, 'left') };
    } else if (target > node.value) {
      cmds.push({
        type: 'visit',
        nodeId: node.id,
        description: `${target} > ${node.value}, go right`,
      });
      updated = { ...node, right: insert(node.right, node.id, 'right') };
    } else {
      // Duplicate
      return node;
    }

    const balance = getBalance(updated);

    // LL case
    if (balance > 1 && updated.left && target < updated.left.value) {
      cmds.push({
        type: 'set_tree',
        tree: updated,
        description: `LL imbalance at ${updated.value} (balance=${balance}): right rotation`,
      });
      const rotated = rotateRight(updated);
      cmds.push({
        type: 'set_tree',
        tree: rotated,
        description: `After right rotation: new subtree root = ${rotated.value}`,
      });
      return rotated;
    }

    // RR case
    if (balance < -1 && updated.right && target > updated.right.value) {
      cmds.push({
        type: 'set_tree',
        tree: updated,
        description: `RR imbalance at ${updated.value} (balance=${balance}): left rotation`,
      });
      const rotated = rotateLeft(updated);
      cmds.push({
        type: 'set_tree',
        tree: rotated,
        description: `After left rotation: new subtree root = ${rotated.value}`,
      });
      return rotated;
    }

    // LR case
    if (balance > 1 && updated.left && target > updated.left.value) {
      cmds.push({
        type: 'set_tree',
        tree: updated,
        description: `LR imbalance at ${updated.value}: left-right rotation`,
      });
      const rotatedLeft = { ...updated, left: rotateLeft(updated.left) };
      cmds.push({
        type: 'set_tree',
        tree: rotatedLeft,
        description: `After left rotation on left child`,
      });
      const rotated = rotateRight(rotatedLeft);
      cmds.push({
        type: 'set_tree',
        tree: rotated,
        description: `After right rotation: new subtree root = ${rotated.value}`,
      });
      return rotated;
    }

    // RL case
    if (balance < -1 && updated.right && target < updated.right.value) {
      cmds.push({
        type: 'set_tree',
        tree: updated,
        description: `RL imbalance at ${updated.value}: right-left rotation`,
      });
      const rotatedRight = { ...updated, right: rotateRight(updated.right) };
      cmds.push({
        type: 'set_tree',
        tree: rotatedRight,
        description: `After right rotation on right child`,
      });
      const rotated = rotateLeft(rotatedRight);
      cmds.push({
        type: 'set_tree',
        tree: rotated,
        description: `After left rotation: new subtree root = ${rotated.value}`,
      });
      return rotated;
    }

    return updated;
  }

  const newTree = insert(state.tree, null, 'root');
  cmds.push({
    type: 'set_tree',
    tree: newTree,
    description: `Inserted ${target}. Tree is balanced.`,
  });
  cmds.push({
    type: 'mark_done',
    nodeId: newTree.id,
    description: 'AVL insert complete',
  });

  return cmds;
}

registerAlgorithm({
  name: 'AVL Tree Insert',
  slug: 'avl-insert',
  category: 'tree',
  description:
    'Inserts a value into a self-balancing AVL tree. After BST insertion, checks the balance factor at each ancestor node and performs rotations (LL, RR, LR, RL) to maintain the AVL property: |height(left) - height(right)| ≤ 1.',
  bestCase: 'O(log n)',
  averageCase: 'O(log n)',
  worstCase: 'O(log n)',
  spaceComplexity: 'O(log n)',
  pseudocode: `function insert(node, value):
  // Standard BST insert
  if not node: return newNode(value)
  if value < node.value: node.left = insert(node.left, value)
  else if value > node.value: node.right = insert(node.right, value)
  else: return node  // duplicate
  balance = height(left) - height(right)
  // LL: balance > 1, value < left.value → rotateRight(node)
  // RR: balance < -1, value > right.value → rotateLeft(node)
  // LR: balance > 1, value > left.value → rotateLeft(left); rotateRight(node)
  // RL: balance < -1, value < right.value → rotateRight(right); rotateLeft(node)`,
  visualizerType: 'tree',
  defaultInput: makeTreeState(buildAvlTree(), 25),
  run: avlInsertCommands,
  reduce: (state, cmd) => {
    const next = treeReducer(state, cmd);
    if (cmd.type === 'set_tree') {
      return { ...next, tree: cmd.tree };
    }
    return next;
  },
});
