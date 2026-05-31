import { useAlgorithmPlayer } from '../_components/hooks/useAlgorithmPlayer';
import { Controls } from '../_components/Controls';
import { LegendRow } from '../_components/composed/LegendRow';
import { TargetIndicator } from '../_components/composed/TargetIndicator';
import type { TreeState, TreeCommand } from '../_algorithms/tree/commands';
import { treeReducer } from '../_algorithms/tree/commands';
import type { TreeNode } from '../_algorithms/tree/types';

// Tree layout: assign x/y positions via in-order traversal
type NodeLayout = { id: string; value: number; x: number; y: number };

function layoutTree(root: TreeNode | null): NodeLayout[] {
  const nodes: NodeLayout[] = [];
  let xCounter = 0;

  function traverse(node: TreeNode | null, depth: number) {
    if (!node) return;
    traverse(node.left, depth + 1);
    const x = xCounter++;
    nodes.push({ id: node.id, value: node.value, x, y: depth });
    traverse(node.right, depth + 1);
  }

  traverse(root, 0);
  return nodes;
}

type EdgeDef = { x1: number; y1: number; x2: number; y2: number };

function buildEdgesFromTree(
  node: TreeNode | null,
  layout: NodeLayout[],
  xSpacing: number,
  ySpacing: number,
  offsetX: number,
  offsetY: number,
  edges: EdgeDef[]
) {
  if (!node) return;
  const parentLayout = layout.find((n) => n.id === node.id);
  if (!parentLayout) return;
  for (const child of [node.left, node.right].filter(Boolean) as TreeNode[]) {
    const childLayout = layout.find((n) => n.id === child.id);
    if (childLayout) {
      edges.push({
        x1: parentLayout.x * xSpacing + offsetX,
        y1: parentLayout.y * ySpacing + offsetY,
        x2: childLayout.x * xSpacing + offsetX,
        y2: childLayout.y * ySpacing + offsetY,
      });
    }
    buildEdgesFromTree(
      child,
      layout,
      xSpacing,
      ySpacing,
      offsetX,
      offsetY,
      edges
    );
  }
}

type Props = {
  commands: TreeCommand[];
  initialState: TreeState;
};

export function TreeVisualizer({ commands, initialState }: Props) {
  const player = useAlgorithmPlayer(initialState, commands, treeReducer);
  const { currentState } = player;

  const layout = layoutTree(currentState.tree);
  const SVG_W = 500;
  const SVG_H = 300;
  const xSpacing =
    layout.length > 0
      ? Math.min(60, (SVG_W - 40) / Math.max(layout.length, 1))
      : 60;
  const ySpacing = 60;
  const offsetX = 20 + xSpacing / 2;
  const offsetY = 30;

  const edges: EdgeDef[] = [];
  buildEdgesFromTree(
    currentState.tree,
    layout,
    xSpacing,
    ySpacing,
    offsetX,
    offsetY,
    edges
  );

  return (
    <div className="flex flex-col gap-4">
      {currentState.targetValue !== undefined && (
        <TargetIndicator
          label="Target"
          value={currentState.targetValue}
          foundMessage={currentState.found ? 'Found!' : null}
        />
      )}

      {/* SVG Tree */}
      <div className="bg-gray-50 rounded-lg p-2 overflow-x-auto">
        <svg
          width={SVG_W}
          height={SVG_H}
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          aria-label="Tree visualization"
        >
          {/* Edges */}
          {edges.map((e, i) => (
            <line
              key={i}
              x1={e.x1}
              y1={e.y1}
              x2={e.x2}
              y2={e.y2}
              stroke="#d1d5db"
              strokeWidth={1.5}
            />
          ))}

          {/* Nodes */}
          {layout.map((node) => {
            const cx = node.x * xSpacing + offsetX;
            const cy = node.y * ySpacing + offsetY;
            let fill = '#e5e7eb'; // gray-200
            let stroke = '#9ca3af'; // gray-400
            if (currentState.found === node.id) {
              fill = '#22c55e';
              stroke = '#16a34a';
            } else if (currentState.current === node.id) {
              fill = '#fbbf24';
              stroke = '#f59e0b';
            } else if (currentState.visited.includes(node.id)) {
              fill = 'var(--color-turquoise)';
              stroke = 'var(--color-turquoise-dark)';
            }
            return (
              <g key={node.id}>
                <circle
                  cx={cx}
                  cy={cy}
                  r={18}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={2}
                />
                <text
                  x={cx}
                  y={cy + 4}
                  textAnchor="middle"
                  fontSize={12}
                  fill="#374151"
                  fontWeight="600"
                >
                  {node.value}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <LegendRow
        items={[
          {
            dotClass: 'bg-gray-200 border border-gray-400',
            label: 'Unvisited',
            shape: 'circle',
          },
          {
            dotClass: 'bg-yellow-400 border border-yellow-500',
            label: 'Current',
            shape: 'circle',
          },
          {
            dotStyle: {
              background: 'var(--color-turquoise)',
              borderColor: 'var(--color-turquoise-dark)',
            },
            dotClass: 'border',
            label: 'Visited',
            shape: 'circle',
          },
          {
            dotClass: 'bg-green-500 border border-green-600',
            label: 'Found',
            shape: 'circle',
          },
        ]}
      />

      <Controls
        index={player.index}
        totalCommands={player.totalCommands}
        isPlaying={player.isPlaying}
        speed={player.speed}
        description={currentState.description}
        onPlay={player.play}
        onPause={player.pause}
        onStepBack={player.stepBack}
        onStepForward={player.stepForward}
        onReset={player.reset}
        onSpeedChange={player.setSpeed}
        onJumpTo={player.jumpTo}
      />
    </div>
  );
}
