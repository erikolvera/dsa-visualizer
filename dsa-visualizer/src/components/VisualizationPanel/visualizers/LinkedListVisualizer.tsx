import { motion, AnimatePresence } from 'framer-motion';
import type { LinkedListVisualState } from '../../../data/problems/reverse-linked-list';

interface LinkedListVisualizerProps {
  visualState: Record<string, unknown>;
}

const POINTER_COLORS: Record<string, { label: string; color: string }> = {
  prev: { label: 'prev', color: 'text-blue-400' },
  curr: { label: 'curr', color: 'text-yellow-400' },
  next: { label: 'next', color: 'text-orange-400' },
};

export function LinkedListVisualizer({ visualState }: LinkedListVisualizerProps) {
  const state = visualState as unknown as LinkedListVisualState;
  const { nodes, prevIdx, currIdx, nextIdx, reversedUpTo, phase } = state;

  const getNodeColor = (idx: number) => {
    if (idx === currIdx) return 'border-yellow-400 bg-yellow-500/15 text-yellow-300';
    if (idx === prevIdx) return 'border-blue-400 bg-blue-500/15 text-blue-300';
    if (idx === nextIdx) return 'border-orange-400 bg-orange-500/15 text-orange-300';
    if (idx < reversedUpTo) return 'border-emerald-500 bg-emerald-500/10 text-emerald-300';
    return 'border-gray-700 bg-gray-800 text-gray-300';
  };

  const getPointerLabels = (idx: number) => {
    const labels: Array<{ label: string; color: string }> = [];
    if (idx === prevIdx) labels.push(POINTER_COLORS.prev);
    if (idx === currIdx) labels.push(POINTER_COLORS.curr);
    if (idx === nextIdx) labels.push(POINTER_COLORS.next);
    return labels;
  };

  return (
    <div className="flex flex-col items-center justify-center h-full gap-10 p-6">
      {/* Phase badge */}
      <div className="flex items-center gap-2">
        {phase === 'done' ? (
          <span className="text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full">
            Reversed ✓
          </span>
        ) : (
          <span className="text-xs bg-blue-500/20 text-blue-400 border border-blue-500/30 px-3 py-1 rounded-full">
            Reversing...
          </span>
        )}
      </div>

      {/* Nodes */}
      <div className="flex items-center gap-0">
        {/* null pointer at start (represents prev=null initially) */}
        {prevIdx === null && phase !== 'done' && (
          <div className="flex items-center mr-1">
            <div className="flex flex-col items-center">
              <span className="text-xs text-blue-400 mb-1">prev</span>
              <div className="w-10 h-10 flex items-center justify-center text-xs text-gray-600 border border-dashed border-gray-700 rounded">
                null
              </div>
            </div>
            <ArrowRight reversed={false} />
          </div>
        )}

        {nodes.map((val, idx) => {
          const pointers = getPointerLabels(idx);
          const isReversed = idx < reversedUpTo && idx < nodes.length - 1;
          const isFirst = idx === 0;
          const isLast = idx === nodes.length - 1;

          return (
            <div key={idx} className="flex items-center">
              <motion.div
                className="flex flex-col items-center"
                animate={{ scale: idx === currIdx ? 1.05 : 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                {/* Pointer labels above */}
                <div className="flex gap-1 mb-1.5 min-h-5">
                  <AnimatePresence>
                    {pointers.map(({ label, color }) => (
                      <motion.span
                        key={label}
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className={`text-xs font-medium ${color}`}
                      >
                        {label}
                      </motion.span>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Node box: value | next */}
                <div
                  className={`flex border-2 rounded-lg overflow-hidden transition-colors duration-300 ${getNodeColor(idx)}`}
                >
                  <div className="w-12 h-12 flex items-center justify-center text-lg font-bold border-r-2 border-current/30">
                    {val}
                  </div>
                  <div className="w-8 h-12 flex items-center justify-center text-xs text-gray-500">
                    →
                  </div>
                </div>

                {/* Index */}
                <span className="text-xs text-gray-600 mt-1">[{idx}]</span>
              </motion.div>

              {/* Arrow between nodes */}
              {!isLast && (
                <ArrowRight reversed={isReversed} />
              )}

              {/* Null at the end */}
              {isLast && (
                <div className="flex items-center ml-1">
                  <ArrowRight reversed={phase === 'done'} />
                  <div className="flex flex-col items-center">
                    {phase === 'done' && (
                      <span className="text-xs text-blue-400 mb-1">head</span>
                    )}
                    {isFirst && phase !== 'done' && prevIdx === null ? null : (
                      <div className="w-10 h-10 flex items-center justify-center text-xs text-gray-600 border border-dashed border-gray-700 rounded">
                        null
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-5 text-xs">
        <LegendItem color="border-yellow-400 bg-yellow-500/15" label="curr" />
        <LegendItem color="border-blue-400 bg-blue-500/15" label="prev" />
        <LegendItem color="border-orange-400 bg-orange-500/15" label="next" />
        <LegendItem color="border-emerald-500 bg-emerald-500/10" label="reversed" />
      </div>
    </div>
  );
}

function ArrowRight({ reversed }: { reversed: boolean }) {
  return (
    <div className="flex items-center mx-0.5">
      <motion.div
        animate={{ scaleX: reversed ? -1 : 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className={`text-lg ${reversed ? 'text-emerald-400' : 'text-gray-600'}`}
      >
        →
      </motion.div>
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className={`w-4 h-4 rounded border-2 ${color}`} />
      <span className="text-gray-400">{label}</span>
    </div>
  );
}
