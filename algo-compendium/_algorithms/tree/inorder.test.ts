import { describe, it, expect } from 'vitest';
import { inorderTraversalCommands } from './inorder';
import { makeTreeState, treeReducer } from './commands';
import { buildBST } from './types';
import type { TreeCommand } from './commands';

function getVisitOrder(cmds: TreeCommand[], tree: ReturnType<typeof buildBST>) {
  // Build a map from node ID to value
  const idToValue = new Map<string, number>();
  function collect(node: ReturnType<typeof buildBST>) {
    if (!node) return;
    idToValue.set(node.id, node.value);
    collect(node.left);
    collect(node.right);
  }
  collect(tree);

  return cmds
    .filter((c) => c.type === 'mark_done')
    .map((c) => {
      if (c.type === 'mark_done') return idToValue.get(c.nodeId) ?? -1;
      return -1;
    });
}

describe('inorderTraversal', () => {
  it('visits nodes in sorted (in-order) sequence', () => {
    const tree = buildBST([8, 4, 12, 2, 6, 10, 14]);
    const state = makeTreeState(tree);
    const cmds = inorderTraversalCommands(state);
    const order = getVisitOrder(cmds, tree);
    expect(order).toEqual([2, 4, 6, 8, 10, 12, 14]);
  });

  it('handles empty tree', () => {
    const state = makeTreeState(null);
    const cmds = inorderTraversalCommands(state);
    expect(cmds).toHaveLength(0);
  });

  it('handles single node', () => {
    const tree = buildBST([5]);
    const state = makeTreeState(tree);
    const cmds = inorderTraversalCommands(state);
    const order = getVisitOrder(cmds, tree);
    expect(order).toEqual([5]);
  });

  it('reducer does not mutate previous state', () => {
    const tree = buildBST([4, 2, 6]);
    const state = makeTreeState(tree);
    const cmds = inorderTraversalCommands(state);
    const s1 = treeReducer(state, cmds[0]);
    expect(state.current).toBeNull();
    expect(s1).not.toBe(state);
  });

  it('emits visit then mark_done for each node', () => {
    const tree = buildBST([4, 2, 6]);
    const state = makeTreeState(tree);
    const cmds = inorderTraversalCommands(state);
    const types = cmds.map((c) => c.type);
    // Should alternate visit/mark_done for each node
    for (let i = 0; i < types.length; i += 2) {
      expect(types[i]).toBe('visit');
      expect(types[i + 1]).toBe('mark_done');
    }
  });
});
