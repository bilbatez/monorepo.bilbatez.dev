import { describe, it, expect } from 'vitest';
import { avlInsertCommands } from './avl-insert';
import { makeTreeState, treeReducer } from './commands';
import type { TreeNode } from './types';

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

function flattenValues(node: TreeNode | null): number[] {
  if (!node) return [];
  return [
    node.value,
    ...flattenValues(node.left),
    ...flattenValues(node.right),
  ];
}

describe('avlInsert', () => {
  it('inserts 25 and tree contains 25', () => {
    const initialTree = buildAvlTree();
    const initial = makeTreeState(initialTree, 25);
    const cmds = avlInsertCommands(initial);
    const reduce = (state: typeof initial, cmd: (typeof cmds)[0]) => {
      const next = treeReducer(state, cmd);
      if (cmd.type === 'set_tree') return { ...next, tree: cmd.tree };
      return next;
    };
    const result = cmds.reduce(reduce, initial);
    const values = flattenValues(result.tree);
    expect(values).toContain(25);
  });

  it('emits compare commands when traversing', () => {
    const initial = makeTreeState(buildAvlTree(), 25);
    const cmds = avlInsertCommands(initial);
    const compareCmds = cmds.filter((c) => c.type === 'compare');
    expect(compareCmds.length).toBeGreaterThan(0);
  });

  it('emits a final set_tree command', () => {
    const initial = makeTreeState(buildAvlTree(), 25);
    const cmds = avlInsertCommands(initial);
    const setTreeCmds = cmds.filter((c) => c.type === 'set_tree');
    expect(setTreeCmds.length).toBeGreaterThan(0);
  });

  it('handles inserting a value already in tree', () => {
    const initial = makeTreeState(buildAvlTree(), 30);
    const cmds = avlInsertCommands(initial);
    expect(cmds.length).toBeGreaterThan(0);
  });

  it('reducer does not mutate state', () => {
    const initial = makeTreeState(buildAvlTree(), 25);
    const cmds = avlInsertCommands(initial);
    if (cmds.length > 0) {
      const s1 = treeReducer(initial, cmds[0]);
      expect(initial.visited).toEqual([]);
      expect(s1).not.toBe(initial);
    }
  });
});
