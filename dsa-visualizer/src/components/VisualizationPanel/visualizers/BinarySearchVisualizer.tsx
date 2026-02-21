import { motion, AnimatePresence } from 'framer-motion';
import type { BinarySearchVisualState } from '../../../data/problems/binary-search';

interface Props { visualState: Record<string, unknown>; }

export function BinarySearchVisualizer({ visualState }: Props) {
  const state = visualState as unknown as BinarySearchVisualState;
  const { nums, target, left, right, mid, phase, resultIndex } = state;

  function getBoxStyle(idx: number) {
    if (phase === 'found' && idx === resultIndex) {
      return { bg: 'bg-emerald-500/20', border: 'border-emerald-400', text: 'text-emerald-300' };
    }
    if (phase === 'not_found' && (idx < left || idx > right)) {
      return { bg: 'bg-gray-900', border: 'border-gray-800', text: 'text-gray-600' };
    }
    if (idx === mid) {
      return { bg: 'bg-yellow-500/20', border: 'border-yellow-400', text: 'text-yellow-300' };
    }
    if (idx >= left && idx <= right) {
      return { bg: 'bg-blue-500/10', border: 'border-blue-500/40', text: 'text-gray-200' };
    }
    return { bg: 'bg-gray-900', border: 'border-gray-800', text: 'text-gray-600' };
  }

  return (
    <div className="flex flex-col items-center justify-center h-full gap-8 p-6">
      {/* Target */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-400">target =</span>
        <span className="text-2xl font-bold text-blue-400">{target}</span>
      </div>

      {/* Array */}
      <div className="flex flex-col items-center gap-3">
        {/* Pointer labels */}
        <div className="flex items-end gap-3">
          {nums.map((_, idx) => (
            <div key={idx} className="w-14 h-6 flex items-center justify-center gap-0.5">
              {idx === left && (
                <span className="text-[10px] font-bold text-blue-400">L</span>
              )}
              {idx === mid && (
                <span className="text-[10px] font-bold text-yellow-400">M</span>
              )}
              {idx === right && (
                <span className="text-[10px] font-bold text-purple-400">R</span>
              )}
            </div>
          ))}
        </div>

        {/* Boxes */}
        <div className="flex items-center gap-3">
          {nums.map((num, idx) => {
            const { bg, border, text } = getBoxStyle(idx);
            const isEliminated = phase !== 'done' && phase !== 'found' && (idx < left || idx > right);
            return (
              <motion.div
                key={idx}
                animate={{ scale: idx === mid && phase !== 'found' ? 1.1 : 1, opacity: isEliminated ? 0.3 : 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className={`w-14 h-14 flex items-center justify-center rounded-lg border-2 text-xl font-bold font-mono transition-colors duration-300 ${bg} ${border} ${text}`}
              >
                {num}
              </motion.div>
            );
          })}
        </div>

        {/* Index labels */}
        <div className="flex items-center gap-3">
          {nums.map((_, idx) => (
            <div key={idx} className="w-14 flex justify-center">
              <span className="text-xs text-gray-600">{idx}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Pointer legend */}
      <div className="flex items-center gap-5 text-sm">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-blue-500/20 border border-blue-400 inline-block" />
          <span className="text-blue-400 font-mono">L</span>
          <span className="text-gray-400">= left</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-yellow-500/20 border border-yellow-400 inline-block" />
          <span className="text-yellow-400 font-mono">M</span>
          <span className="text-gray-400">= mid</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-purple-500/20 border border-purple-400 inline-block" />
          <span className="text-purple-400 font-mono">R</span>
          <span className="text-gray-400">= right</span>
        </div>
      </div>

      {/* Result banner */}
      <AnimatePresence>
        {phase === 'found' && resultIndex !== null && (
          <motion.div
            key="found"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 bg-emerald-500/15 border border-emerald-500/40 rounded-lg px-4 py-2"
          >
            <span className="text-emerald-400 text-sm font-medium">
              Found at index {resultIndex} — return {resultIndex}
            </span>
          </motion.div>
        )}
        {phase === 'not_found' && (
          <motion.div
            key="not_found"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 bg-red-500/15 border border-red-500/40 rounded-lg px-4 py-2"
          >
            <span className="text-red-400 text-sm font-medium">
              Target {target} not found — return −1
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
