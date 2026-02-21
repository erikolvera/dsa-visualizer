import { motion, AnimatePresence } from 'framer-motion';
import type { TreeVisualState } from '../../../data/problems/inorder-traversal';

interface TreeVisualizerProps {
  visualState: Record<string, unknown>;
}

interface NodePosition {
  x: number;
  y: number;
  idx: number;
  val: number;
}

const SVG_WIDTH = 480;
const NODE_RADIUS = 22;
const LEVEL_HEIGHT = 70;

function computePositions(tree: (number | null)[]): NodePosition[] {
  const positions: NodePosition[] = [];

  for (let idx = 1; idx < tree.length; idx++) {
    if (tree[idx] == null) continue;
    const level = Math.floor(Math.log2(idx));
    const posInLevel = idx - Math.pow(2, level);
    const nodesInLevel = Math.pow(2, level);
    const x = ((posInLevel + 0.5) / nodesInLevel) * SVG_WIDTH;
    const y = level * LEVEL_HEIGHT + NODE_RADIUS + 10;
    positions.push({ x, y, idx, val: tree[idx] as number });
  }

  return positions;
}

function getNodeColors(
  idx: number,
  state: TreeVisualState
): { fill: string; stroke: string; textFill: string } {
  if (idx === state.currentNodeIdx) {
    if (state.phase === 'visiting') {
      return { fill: '#10b981', stroke: '#34d399', textFill: '#fff' };
    }
    return { fill: '#eab308', stroke: '#facc15', textFill: '#1c1917' };
  }
  if (state.visitedIds.includes(idx)) {
    return { fill: '#059669', stroke: '#10b981', textFill: '#fff' };
  }
  if (state.activeStack.includes(idx)) {
    return { fill: '#3b82f6', stroke: '#60a5fa', textFill: '#fff' };
  }
  return { fill: '#1f2937', stroke: '#374151', textFill: '#9ca3af' };
}

export function TreeVisualizer({ visualState }: TreeVisualizerProps) {
  const state = visualState as unknown as TreeVisualState;
  const { tree, result, phase } = state;

  const positions = computePositions(tree);
  const posMap = new Map(positions.map((p) => [p.idx, p]));

  // Compute max depth for SVG height
  const maxLevel = positions.reduce((m, p) => Math.max(m, Math.floor(Math.log2(p.idx))), 0);
  const svgHeight = (maxLevel + 1) * LEVEL_HEIGHT + NODE_RADIUS * 2 + 10;

  // Build edges
  const edges: Array<{ x1: number; y1: number; x2: number; y2: number; key: number }> = [];
  for (const p of positions) {
    for (const childIdx of [2 * p.idx, 2 * p.idx + 1]) {
      const child = posMap.get(childIdx);
      if (child) {
        edges.push({ x1: p.x, y1: p.y, x2: child.x, y2: child.y, key: childIdx });
      }
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 p-4">
      {/* SVG Tree — use plain SVG, animate via fill/stroke on circle */}
      <div className="w-full">
        <svg
          viewBox={`0 0 ${SVG_WIDTH} ${svgHeight}`}
          className="w-full"
          style={{ maxHeight: '220px' }}
        >
          {/* Edges */}
          {edges.map(({ x1, y1, x2, y2, key }) => (
            <line
              key={key}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#374151"
              strokeWidth={1.5}
            />
          ))}

          {/* Nodes — use motion.circle for animated color, no SVG transform issues */}
          {positions.map(({ x, y, idx, val }) => {
            const colors = getNodeColors(idx, state);
            return (
              <g key={idx}>
                <motion.circle
                  cx={x}
                  cy={y}
                  r={NODE_RADIUS}
                  animate={{ fill: colors.fill, stroke: colors.stroke }}
                  transition={{ duration: 0.3 }}
                  strokeWidth={2}
                />
                <text
                  x={x}
                  y={y + 5}
                  textAnchor="middle"
                  fill={colors.textFill}
                  fontSize="13"
                  fontWeight="bold"
                  fontFamily="monospace"
                  style={{ pointerEvents: 'none' }}
                >
                  {val}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Result array */}
      <div className="flex flex-col items-center gap-2">
        <span className="text-xs text-gray-500 uppercase tracking-wider">Inorder Result</span>
        <div className="flex items-center gap-1.5">
          <span className="text-gray-600 text-sm">[</span>
          <AnimatePresence>
            {result.map((val, i) => (
              <motion.span
                key={`${val}-${i}`}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-sm font-bold text-emerald-400 font-mono"
              >
                {val}{i < result.length - 1 ? ',' : ''}
              </motion.span>
            ))}
          </AnimatePresence>
          {result.length === 0 && (
            <span className="text-xs text-gray-700 italic">empty</span>
          )}
          <span className="text-gray-600 text-sm">]</span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs">
        <LegendDot color="#eab308" label="current" />
        <LegendDot color="#3b82f6" label="on stack" />
        <LegendDot color="#059669" label="visited" />
      </div>

      {phase === 'done' && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full"
        >
          Traversal complete ✓
        </motion.div>
      )}
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-3 h-3 rounded-full border border-white/20" style={{ backgroundColor: color }} />
      <span className="text-gray-400">{label}</span>
    </div>
  );
}
