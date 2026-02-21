import { motion, AnimatePresence } from 'framer-motion';
import type { ContainsDuplicateVisualState } from '../../../data/problems/contains-duplicate';

interface Props { visualState: Record<string, unknown>; }

function boxColor(idx: number, state: ContainsDuplicateVisualState) {
  const { currentIndex, duplicateValue, nums, phase } = state;
  if (duplicateValue !== null && nums[idx] === duplicateValue && idx <= (currentIndex ?? -1)) {
    return 'bg-red-500/20 border-red-400 text-red-300';
  }
  if (idx === currentIndex) {
    if (phase === 'found') return 'bg-red-500/20 border-red-400 text-red-300';
    if (phase === 'stored') return 'bg-blue-500/20 border-blue-400 text-blue-300';
    return 'bg-yellow-500/20 border-yellow-400 text-yellow-300';
  }
  return 'bg-gray-800 border-gray-700 text-gray-300';
}

export function ContainsDuplicateVisualizer({ visualState }: Props) {
  const state = visualState as unknown as ContainsDuplicateVisualState;
  const { nums, currentIndex, seen, duplicateValue, phase } = state;

  return (
    <div className="flex flex-col items-center justify-center h-full gap-8 p-6">
      {/* Array */}
      <div className="flex items-end gap-3 flex-wrap justify-center">
        {nums.map((num, idx) => {
          const isCurrent = idx === currentIndex;
          const isDup = duplicateValue !== null && nums[idx] === duplicateValue && idx <= (currentIndex ?? -1);
          return (
            <motion.div
              key={idx}
              animate={{ scale: isCurrent || isDup ? 1.08 : 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="flex flex-col items-center gap-1.5"
            >
              <div className="h-5 flex items-center justify-center">
                {isCurrent && !isDup && (
                  <span className="text-xs text-yellow-400 font-medium">i={idx}</span>
                )}
                {isDup && (
                  <span className="text-xs text-red-400 font-semibold">dup!</span>
                )}
              </div>
              <div className={`w-14 h-14 flex items-center justify-center rounded-lg border-2 text-xl font-bold font-mono transition-colors duration-300 ${boxColor(idx, state)}`}>
                {num}
              </div>
              <span className="text-xs text-gray-600">{idx}</span>
            </motion.div>
          );
        })}
      </div>

      {/* Seen set */}
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs text-gray-500 uppercase tracking-wider">Seen Set</span>
          <div className="flex-1 h-px bg-gray-800" />
        </div>
        {seen.length === 0 ? (
          <p className="text-xs text-gray-600 italic">empty</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            <AnimatePresence>
              {seen.map((val) => (
                <motion.div
                  key={val}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className={`px-3 py-1 rounded-full text-sm font-mono border ${
                    val === duplicateValue
                      ? 'bg-red-500/20 border-red-400 text-red-300'
                      : 'bg-gray-800 border-gray-700 text-gray-300'
                  }`}
                >
                  {val}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Result banner */}
      <AnimatePresence>
        {phase === 'found' && (
          <motion.div
            key="found"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex items-center gap-2 bg-red-500/15 border border-red-500/40 rounded-lg px-5 py-2.5"
          >
            <span className="text-red-400 text-sm font-semibold">Duplicate found — return true</span>
          </motion.div>
        )}
        {phase === 'no_duplicate' && (
          <motion.div
            key="no_dup"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex items-center gap-2 bg-emerald-500/15 border border-emerald-500/40 rounded-lg px-5 py-2.5"
          >
            <span className="text-emerald-400 text-sm font-semibold">No duplicates — return false</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
