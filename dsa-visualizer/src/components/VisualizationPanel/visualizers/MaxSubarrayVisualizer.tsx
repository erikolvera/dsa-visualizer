import { motion, AnimatePresence } from 'framer-motion';
import type { MaxSubarrayVisualState } from '../../../data/problems/maximum-subarray';

interface Props { visualState: Record<string, unknown>; }

function boxColor(idx: number, state: MaxSubarrayVisualState): string {
  const { currentIndex, subarrayStart, subarrayEnd, maxStart, maxEnd, phase } = state;
  const inCurrent = idx >= subarrayStart && idx <= subarrayEnd;
  const inMax = idx >= maxStart && idx <= maxEnd;

  if (idx === currentIndex && phase !== 'done') {
    return 'bg-yellow-500/20 border-yellow-400 text-yellow-300';
  }
  if (inCurrent && inMax) {
    return 'bg-emerald-500/20 border-emerald-400 text-emerald-300';
  }
  if (inMax) {
    return 'bg-emerald-500/10 border-emerald-600 text-emerald-400';
  }
  if (inCurrent) {
    return 'bg-blue-500/20 border-blue-400 text-blue-300';
  }
  return 'bg-gray-800 border-gray-700 text-gray-400';
}

export function MaxSubarrayVisualizer({ visualState }: Props) {
  const state = visualState as unknown as MaxSubarrayVisualState;
  const { nums, currentIndex, currentSum, maxSum, subarrayStart, subarrayEnd, maxStart, maxEnd, phase } = state;

  return (
    <div className="flex flex-col items-center justify-center h-full gap-7 p-6">
      {/* Running totals */}
      <div className="flex items-center gap-10 text-sm">
        <div className="text-center">
          <p className="text-gray-500 text-xs uppercase tracking-wider mb-0.5">Current sum</p>
          <p className="text-blue-400 font-bold text-2xl">{currentSum}</p>
          {currentIndex !== null && phase !== 'done' && (
            <p className="text-gray-600 text-xs mt-0.5">
              [{nums.slice(subarrayStart, subarrayEnd + 1).join(', ')}]
            </p>
          )}
        </div>
        <div className="text-center">
          <p className="text-gray-500 text-xs uppercase tracking-wider mb-0.5">Max sum</p>
          <p className="text-emerald-400 font-bold text-2xl">{maxSum}</p>
          <p className="text-gray-600 text-xs mt-0.5">
            [{nums.slice(maxStart, maxEnd + 1).join(', ')}]
          </p>
        </div>
      </div>

      {/* Array boxes */}
      <div className="flex items-end gap-2.5 flex-wrap justify-center">
        {nums.map((num, idx) => {
          const isCurrent = idx === currentIndex && phase !== 'done';
          const inMax = idx >= maxStart && idx <= maxEnd;
          return (
            <motion.div
              key={idx}
              animate={{ scale: isCurrent ? 1.08 : inMax ? 1.03 : 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="flex flex-col items-center gap-1.5"
            >
              <div className="h-5 flex items-center">
                {isCurrent && (
                  <span className="text-xs text-yellow-400 font-medium">↓</span>
                )}
              </div>
              <div className={`w-13 h-13 w-12 h-12 flex items-center justify-center rounded-lg border-2 text-lg font-bold font-mono transition-colors duration-300 ${boxColor(idx, state)}`}>
                {num}
              </div>
              <span className="text-xs text-gray-600">{idx}</span>
            </motion.div>
          );
        })}
      </div>

      {/* Phase indicator */}
      <AnimatePresence mode="wait">
        {phase === 'restarting' && (
          <motion.p
            key="restart"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="text-sm text-orange-400"
          >
            Starting fresh subarray at index {currentIndex}
          </motion.p>
        )}
        {phase === 'extending' && (
          <motion.p
            key="extend"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="text-sm text-blue-400"
          >
            Extending subarray → sum = {currentSum}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Legend */}
      <div className="flex items-center gap-5 text-xs text-gray-500">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded border-2 border-yellow-400 bg-yellow-500/20" />
          <span>current</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded border-2 border-blue-400 bg-blue-500/20" />
          <span>current subarray</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded border-2 border-emerald-400 bg-emerald-500/20" />
          <span>max subarray</span>
        </div>
      </div>

      {/* Done banner */}
      <AnimatePresence>
        {phase === 'done' && (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-emerald-500/15 border border-emerald-500/40 rounded-lg px-5 py-2.5"
          >
            <span className="text-emerald-400 text-sm font-semibold">
              Max subarray sum = {maxSum} — return {maxSum}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
