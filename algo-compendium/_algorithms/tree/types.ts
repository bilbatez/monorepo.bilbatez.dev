export type TreeNode = {
  id: string; // unique id like "node-0", "node-1"
  value: number;
  left: TreeNode | null;
  right: TreeNode | null;
};

export function makeNode(value: number, id: string): TreeNode {
  return { id, value, left: null, right: null };
}

// Build a BST from array values for default inputs
export function buildBST(values: number[]): TreeNode | null {
  let root: TreeNode | null = null;
  let counter = 0;
  for (const val of values) {
    root = bstInsertNode(root, val, () => `n${counter++}`);
  }
  return root;
}

export function bstInsertNode(
  root: TreeNode | null,
  value: number,
  makeId: () => string
): TreeNode {
  if (!root) return makeNode(value, makeId());
  if (value < root.value)
    return { ...root, left: bstInsertNode(root.left, value, makeId) };
  if (value > root.value)
    return { ...root, right: bstInsertNode(root.right, value, makeId) };
  return root; // duplicate, ignore
}

// Flatten tree to array of node values (pre-order) for easy testing
export function flattenTree(root: TreeNode | null): number[] {
  if (!root) return [];
  return [root.value, ...flattenTree(root.left), ...flattenTree(root.right)];
}
