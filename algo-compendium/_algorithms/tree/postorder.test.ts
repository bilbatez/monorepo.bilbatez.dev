import { describe, it, expect } from 'vitest';
import { postorderTraversalCommands } from './postorder';
import { makeTreeState } from './commands';
import { buildBST } from './types';
import type { TreeCommand } from './commands';

function getVisitOrder(cmds: TreeCommand[], tree: ReturnType<typeof buildBST>) {
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

describe('postorderTraversal', () => {
  it('visits leaves first then root last', () => {
    const tree = buildBST([8, 4, 12, 2, 6, 10, 14]);
    const state = makeTreeState(tree);
    const cmds = postorderTraversalCommands(state);
    const order = getVisitOrder(cmds, tree);
    expect(order).toEqual([2, 6, 4, 10, 14, 12, 8]);
  });

  it('handles empty tree', () => {
    const state = makeTreeState(null);
    const cmds = postorderTraversalCommands(state);
    expect(cmds).toHaveLength(0);
  });

  it('handles single node', () => {
    const tree = buildBST([5]);
    const state = makeTreeState(tree);
    const cmds = postorderTraversalCommands(state);
    const order = getVisitOrder(cmds, tree);
    expect(order).toEqual([5]);
  });
});
