import type { TreeNode } from './types';

export type TreeCommand =
  | { type: 'visit'; nodeId: string; description: string }
  | { type: 'compare'; nodeId: string; description: string }
  | { type: 'found'; nodeId: string; description: string }
  | { type: 'not_found'; description: string }
  | {
      type: 'insert';
      nodeId: string;
      parentId: string | null;
      direction: 'left' | 'right' | 'root';
      value: number;
      description: string;
    }
  | { type: 'delete'; nodeId: string; description: string }
  | { type: 'mark_done'; nodeId: string; description: string }
  | { type: 'set_tree'; tree: TreeNode | null; description: string };

export type TreeState = {
  tree: TreeNode | null;
  visited: string[]; // node IDs visited/done
  current: string | null; // currently active node ID
  found: string | null; // found node ID
  targetValue?: number;
  description: string;
};

export function makeTreeState(
  tree: TreeNode | null,
  targetValue?: number
): TreeState {
  return {
    tree,
    visited: [],
    current: null,
    found: null,
    targetValue,
    description: 'Ready',
  };
}

export function treeReducer(state: TreeState, cmd: TreeCommand): TreeState {
  switch (cmd.type) {
    case 'visit':
      return { ...state, current: cmd.nodeId, description: cmd.description };
    case 'compare':
      return { ...state, current: cmd.nodeId, description: cmd.description };
    case 'found':
      return {
        ...state,
        found: cmd.nodeId,
        current: cmd.nodeId,
        description: cmd.description,
      };
    case 'not_found':
      return { ...state, current: null, description: cmd.description };
    case 'mark_done':
      return {
        ...state,
        visited: [...state.visited, cmd.nodeId],
        current: null,
        description: cmd.description,
      };
    case 'set_tree':
      return { ...state, tree: cmd.tree, description: cmd.description };
    case 'insert':
    case 'delete':
      return { ...state, description: cmd.description };
  }
}
