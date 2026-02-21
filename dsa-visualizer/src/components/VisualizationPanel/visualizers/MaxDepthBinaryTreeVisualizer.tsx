import { motion, AnimatePresence } from 'framer-motion';
import type { MaxDepthVisualState } from '../../../data/problems/maximum-depth-binary-tree';

interface Props { visualState: Record<string, unknown>; }

interface NodePos { x: number; y: number; }

function buildLayout(tree: (number | null)[], containerWidth: number): NodePos[] {
  const positions: NodePos[] = [];
  const nodeHeight = 80;
  const maxNodes = tree.length;

  for (let i = 0; i < maxNodes; i++) {
    if (tree[i] === null) {
      positions.push({ x: -1, y: -1 });
      continue;
    }
    const level = Math.floor(Math.log2(i + 1));
    const levelStart = Math.pow(2, level) - 1;
    const levelCount = Math.pow(2, level);
    const posInLevel = i - levelStart;
    const spacing = containerWidth / (levelCount + 1);
    const x = spacing * (posInLevel + 1);
    const y = nodeHeight * (level + 1);
    positions.push({ x, y });
  }
  return positions;
}

export function MaxDepthBinaryTreeVisualizer({ visualState }: Props) {
  const state = visualState as unknown as MaxDepthVisualState;
  const { tree, currentNode, nodeDepths, maxDepth, phase } = state;

  const containerWidth = 500;
  const containerHeight = 300;
  const positions = buildLayout(tree, containerWidth);
  const nodeRadius = 22;

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 p-4">
      {/* Tree SVG */}
      <div className="relative" style={{ width: containerWidth, height: containerHeight }}>
        <svg
          width={containerWidth}
          height={containerHeight}
          className="absolute inset-0"
        >
          {/* Edges */}
          {tree.map((val, i) => {
            if (val === null) return null;
            const leftChild = 2 * i + 1;
            const rightChild = 2 * i + 2;
            return [leftChild, rightChild].map((child) => {
              if (child >= tree.length || tree[child] === null) return null;
              const from = positions[i];
              const to = positions[child];
              if (from.x < 0 || to.x < 0) return null;
              return (
                <line
                  key={`edge-${i}-${child}`}
                  x1={from.x} y1={from.y}
                  x2={to.x} y2={to.y}
                  stroke="#374151"
                  strokeWidth={2}
                />
              );
            });
          })}
        </svg>

        {/* Nodes */}
        {tree.map((val, i) => {
          if (val === null) return null;
          const pos = positions[i];
          if (pos.x < 0) return null;
          const depth = nodeDepths[i];
          const isCurrent = i === currentNode;

          return (
            <motion.div
              key={i}
              style={{
                position: 'absolute',
                left: pos.x - nodeRadius,
                top: pos.y - nodeRadius,
                width: nodeRadius * 2,
                height: nodeRadius * 2,
              }}
              animate={{ scale: isCurrent ? 1.2 : 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              <div
                className={`w-full h-full rounded-full border-2 flex items-center justify-center text-sm font-bold font-mono transition-colors duration-300 ${
                  isCurrent
                    ? 'bg-yellow-500/20 border-yellow-400 text-yellow-300'
                    : depth !== undefined
                      ? 'bg-blue-500/15 border-blue-500/40 text-blue-300'
                      : 'bg-gray-800 border-gray-700 text-gray-300'
                }`}
              >
                {val}
              </div>
              {depth !== undefined && (
                <div
                  className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-mono text-purple-400 whitespace-nowrap"
                >
                  d={depth}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Max depth tracker */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-400">Max depth so far:</span>
        <AnimatePresence mode="wait">
          <motion.span
            key={maxDepth}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="text-2xl font-bold text-purple-400 font-mono"
          >
            {maxDepth}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Result */}
      <AnimatePresence>
        {phase === 'done' && (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 bg-emerald-500/15 border border-emerald-500/40 rounded-lg px-4 py-2"
          >
            <span className="text-emerald-400 text-sm font-medium">
              Maximum depth = {maxDepth}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
