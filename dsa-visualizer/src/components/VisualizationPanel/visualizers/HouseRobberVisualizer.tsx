import { motion, AnimatePresence } from 'framer-motion';
import type { HouseRobberVisualState } from '../../../data/problems/house-robber';

interface Props { visualState: Record<string, unknown>; }

export function HouseRobberVisualizer({ visualState }: Props) {
  const state = visualState as unknown as HouseRobberVisualState;
  const { houses, dp, currentIndex, maxLoot, phase, robbed } = state;

  return (
    <div className="flex flex-col items-center justify-center h-full gap-8 p-6">
      {/* Max loot tracker */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-400">Max loot:</span>
        <AnimatePresence mode="wait">
          <motion.span
            key={maxLoot}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="text-2xl font-bold text-emerald-400 font-mono"
          >
            ${maxLoot}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Houses row */}
      <div className="flex flex-col items-center gap-1">
        <span className="text-xs text-gray-500 uppercase tracking-wider mb-1">Houses</span>
        <div className="flex items-end gap-3">
          {houses.map((val, idx) => {
            const isCurrent = idx === currentIndex;
            const isRobbed = isCurrent && robbed === true;
            const isSkipped = isCurrent && robbed === false;
            const isDone = phase === 'done';

            return (
              <motion.div
                key={idx}
                animate={{ scale: isCurrent ? 1.1 : 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="flex flex-col items-center gap-1.5"
              >
                {/* Pointer */}
                <div className="h-5 flex items-center">
                  {isCurrent && (
                    <span className={`text-[10px] font-bold ${isRobbed ? 'text-emerald-400' : isSkipped ? 'text-gray-500' : 'text-yellow-400'}`}>
                      {isRobbed ? 'ROB!' : isSkipped ? 'skip' : `i=${idx}`}
                    </span>
                  )}
                </div>

                {/* House icon box */}
                <div className={`w-14 h-14 flex flex-col items-center justify-center rounded-lg border-2 text-sm font-bold transition-colors duration-300 ${
                  isDone
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : isRobbed
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                      : isSkipped
                        ? 'bg-gray-900 border-gray-700 text-gray-500'
                        : isCurrent
                          ? 'bg-yellow-500/20 border-yellow-400 text-yellow-300'
                          : 'bg-gray-800 border-gray-700 text-gray-300'
                }`}>
                  <span className="text-base font-mono">${val}</span>
                </div>

                <span className="text-xs text-gray-600">{idx}</span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* DP row */}
      <div className="flex flex-col items-center gap-1">
        <span className="text-xs text-gray-500 uppercase tracking-wider mb-1">dp[ ] = max loot at each house</span>
        <div className="flex items-center gap-3">
          {dp.map((val, idx) => {
            const isCurrent = idx === currentIndex;
            return (
              <motion.div
                key={idx}
                animate={{ scale: isCurrent ? 1.1 : 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="flex flex-col items-center gap-1"
              >
                <div className={`w-14 h-11 flex items-center justify-center rounded-lg border-2 text-base font-bold font-mono transition-colors duration-300 ${
                  val === null
                    ? 'bg-gray-900 border-gray-800 text-gray-700'
                    : isCurrent
                      ? 'bg-blue-500/20 border-blue-400 text-blue-300'
                      : 'bg-blue-500/10 border-blue-500/30 text-blue-200'
                }`}>
                  {val !== null ? val : '?'}
                </div>
                <span className="text-[10px] text-gray-600 font-mono">dp[{idx}]</span>
              </motion.div>
            );
          })}
        </div>
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
              Maximum loot = ${maxLoot}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
