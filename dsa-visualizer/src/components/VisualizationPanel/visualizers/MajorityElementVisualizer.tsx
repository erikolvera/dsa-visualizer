import { motion, AnimatePresence } from 'framer-motion';
import type { MajorityElementVisualState } from '../../../data/problems/majority-element';

interface Props { visualState: Record<string, unknown>; }

export function MajorityElementVisualizer({ visualState }: Props) {
  const state = visualState as unknown as MajorityElementVisualState;
  const { nums, currentIndex, candidate, count, phase, result } = state;

  function getBoxStyle(idx: number) {
    if (phase === 'done' && nums[idx] === result) {
      return { bg: 'bg-emerald-500/20', border: 'border-emerald-400', text: 'text-emerald-300' };
    }
    if (idx === currentIndex) {
      if (phase === 'reset')      return { bg: 'bg-purple-500/20', border: 'border-purple-400', text: 'text-purple-300' };
      if (phase === 'increment')  return { bg: 'bg-emerald-500/20', border: 'border-emerald-400', text: 'text-emerald-300' };
      if (phase === 'decrement')  return { bg: 'bg-red-500/20',    border: 'border-red-400',    text: 'text-red-300'    };
    }
    return { bg: 'bg-gray-800', border: 'border-gray-700', text: 'text-gray-300' };
  }

  return (
    <div className="flex flex-col items-center justify-center h-full gap-8 p-6">
      {/* Array */}
      <div className="flex items-end gap-3">
        {nums.map((num, idx) => {
          const { bg, border, text } = getBoxStyle(idx);
          const isCurrent = idx === currentIndex;
          return (
            <motion.div
              key={idx}
              animate={{ scale: isCurrent ? 1.1 : 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="flex flex-col items-center gap-1.5"
            >
              <div className="h-5 flex items-center justify-center">
                {isCurrent && (
                  <span className="text-[10px] font-bold text-yellow-400">i={idx}</span>
                )}
              </div>
              <div
                className={`w-14 h-14 flex items-center justify-center rounded-lg border-2 text-xl font-bold font-mono transition-colors duration-300 ${bg} ${border} ${text}`}
              >
                {num}
              </div>
              <span className="text-xs text-gray-600">{idx}</span>
            </motion.div>
          );
        })}
      </div>

      {/* Candidate & count tracker */}
      <div className="flex items-center gap-8">
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs text-gray-500 uppercase tracking-wider">Candidate</span>
          <AnimatePresence mode="wait">
            <motion.div
              key={String(candidate)}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className={`w-16 h-16 flex items-center justify-center rounded-xl border-2 text-2xl font-bold font-mono transition-colors ${
                candidate !== null
                  ? 'bg-purple-500/20 border-purple-400 text-purple-300'
                  : 'bg-gray-800 border-gray-700 text-gray-600'
              }`}
            >
              {candidate !== null ? candidate : '—'}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex flex-col items-center gap-1">
          <span className="text-xs text-gray-500 uppercase tracking-wider">Count</span>
          <AnimatePresence mode="wait">
            <motion.div
              key={count}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              className={`w-16 h-16 flex items-center justify-center rounded-xl border-2 text-2xl font-bold font-mono transition-colors ${
                count > 0
                  ? 'bg-blue-500/20 border-blue-400 text-blue-300'
                  : 'bg-gray-800 border-gray-700 text-gray-500'
              }`}
            >
              {count}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-5 text-xs text-gray-400">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-purple-500/20 border border-purple-400 inline-block" />
          <span>New candidate</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-emerald-500/20 border border-emerald-400 inline-block" />
          <span>Match (+1)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-red-500/20 border border-red-400 inline-block" />
          <span>No match (−1)</span>
        </div>
      </div>

      {/* Result */}
      <AnimatePresence>
        {phase === 'done' && result !== null && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 bg-emerald-500/15 border border-emerald-500/40 rounded-lg px-4 py-2"
          >
            <span className="text-emerald-400 text-sm font-medium">
              Majority element = {result}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
