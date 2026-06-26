import { useAlgorithmPlayer } from '../_components/hooks/useAlgorithmPlayer';
import { Controls } from '../_components/Controls';
import type { GraphState, GraphCommand } from '../_algorithms/graph/commands';
import { graphReducer } from '../_algorithms/graph/commands';

const SVG_W = 500;
const SVG_H = 300;

export function GraphVisualizer({
  commands,
  initialState,
}: {
  commands: GraphCommand[];
  initialState: GraphState;
}) {
  const player = useAlgorithmPlayer(initialState, commands, graphReducer);
  const { currentState } = player;
  const { graph } = currentState;

  const sx = (x: number) => (x / 100) * (SVG_W - 60) + 30;
  const sy = (y: number) => (y / 100) * (SVG_H - 60) + 30;

  function getEdgeColor(from: string, to: string): string {
    if (
      currentState.mstEdges.some(
        ([f, t]) => (f === from && t === to) || (f === to && t === from)
      )
    )
      return 'var(--color-turquoise)';
    if (currentState.path.length > 1) {
      const pathEdges = currentState.path
        .slice(0, -1)
        .map((n, i) => [n, currentState.path[i + 1]]);
      if (pathEdges.some(([f, t]) => f === from && t === to)) return '#22c55e';
    }
    if (currentState.visitedEdges.some(([f, t]) => f === from && t === to))
      return '#fbbf24';
    return '#d1d5db';
  }

  function getNodeColors(nodeId: string): { fill: string; stroke: string } {
    if (currentState.current === nodeId)
      return { fill: '#fbbf24', stroke: '#f59e0b' };
    if (currentState.path.includes(nodeId))
      return { fill: '#22c55e', stroke: '#16a34a' };
    if (currentState.finalized.includes(nodeId))
      return {
        fill: 'var(--color-turquoise)',
        stroke: 'var(--color-turquoise-dark)',
      };
    if (currentState.visited.includes(nodeId))
      return { fill: '#ddd6fe', stroke: '#7c3aed' };
    return { fill: '#e5e7eb', stroke: '#9ca3af' };
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-gray-50 rounded-lg overflow-x-auto">
        <svg
          width={SVG_W}
          height={SVG_H}
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          aria-label="Graph visualization"
        >
          <defs>
            <marker
              id="graph-arrow"
              markerWidth="8"
              markerHeight="6"
              refX="7"
              refY="3"
              orient="auto"
            >
              <polygon points="0 0, 8 3, 0 6" fill="#9ca3af" />
            </marker>
          </defs>

          {/* Edges */}
          {graph.edges.map((edge, i) => {
            const fromNode = graph.nodes.find((n) => n.id === edge.from);
            const toNode = graph.nodes.find((n) => n.id === edge.to);
            if (!fromNode || !toNode) return null;
            const x1 = sx(fromNode.x);
            const y1 = sy(fromNode.y);
            const x2 = sx(toNode.x);
            const y2 = sy(toNode.y);
            const color = getEdgeColor(edge.from, edge.to);
            const mx = (x1 + x2) / 2;
            const my = (y1 + y2) / 2;
            return (
              <g key={i}>
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={color}
                  strokeWidth={2}
                  markerEnd={graph.directed ? 'url(#graph-arrow)' : undefined}
                />
                {edge.weight !== undefined && (
                  <text
                    x={mx}
                    y={my - 4}
                    textAnchor="middle"
                    fontSize={10}
                    fill="#6b7280"
                  >
                    {edge.weight}
                  </text>
                )}
              </g>
            );
          })}

          {/* Nodes */}
          {graph.nodes.map((node) => {
            const { fill, stroke } = getNodeColors(node.id);
            const cx = sx(node.x);
            const cy = sy(node.y);
            const dist = currentState.distances[node.id];
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
                  fontSize={11}
                  fill="#374151"
                  fontWeight="600"
                >
                  {node.label}
                </text>
                {dist !== undefined && dist !== Infinity && (
                  <text
                    x={cx}
                    y={cy - 24}
                    textAnchor="middle"
                    fontSize={9}
                    fill="#6b7280"
                  >
                    {dist}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

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

      {/* Legend */}
      <div className="flex items-center gap-4 flex-wrap text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 rounded-full bg-gray-200 border border-gray-400" />
          Unvisited
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 rounded-full bg-yellow-400 border border-yellow-500" />
          Current
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 rounded-full bg-violet-200 border border-violet-600" />
          Visited
        </span>
        <span className="flex items-center gap-1">
          <span
            className="inline-block w-3 h-3 rounded-full border"
            style={{
              background: 'var(--color-turquoise)',
              borderColor: 'var(--color-turquoise-dark)',
            }}
          />
          Finalized
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 rounded-full bg-green-500 border border-green-600" />
          Path / MST
        </span>
      </div>

      {currentState.result.length > 0 && (
        <div className="text-sm text-gray-600">
          <span className="font-medium">Topological Order:</span>{' '}
          {currentState.result.join(' → ')}
        </div>
      )}
    </div>
  );
}
