import { motion, AnimatePresence } from 'framer-motion';
import type { TwoSumVisualState } from '../../../data/problems/two-sum';

interface ArrayVisualizerProps {
  visualState: Record<string, unknown>;
}

function getBoxColor(
  idx: number,
  state: TwoSumVisualState
): { bg: string; border: string; text: string } {
  const { resultIndices, currentIndex, phase } = state;
  if (resultIndices && (resultIndices[0] === idx || resultIndices[1] === idx)) {
    return { bg: 'bg-emerald-500/20', border: 'border-emerald-400', text: 'text-emerald-300' };
  }
  if (idx === currentIndex) {
    if (phase === 'found') {
      return { bg: 'bg-emerald-500/20', border: 'border-emerald-400', text: 'text-emerald-300' };
    }
    if (phase === 'storing') {
      return { bg: 'bg-blue-500/20', border: 'border-blue-400', text: 'text-blue-300' };
    }
    return { bg: 'bg-yellow-500/20', border: 'border-yellow-400', text: 'text-yellow-300' };
  }
  return { bg: 'bg-gray-800', border: 'border-gray-700', text: 'text-gray-300' };
}

export function ArrayVisualizer({ visualState }: ArrayVisualizerProps) {
  const state = visualState as unknown as TwoSumVisualState;
  const { nums, target, currentIndex, map, resultIndices, phase } = state;

  return (
    <div className="flex flex-col items-center justify-center h-full gap-8 p-6">
      {/* Target display */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-400">target =</span>
        <span className="text-2xl font-bold text-blue-400">{target}</span>
      </div>

      {/* Array boxes */}
      <div className="flex items-end gap-3">
        {nums.map((num, idx) => {
          const { bg, border, text } = getBoxColor(idx, state);
          const isResult = !!(resultIndices && (resultIndices[0] === idx || resultIndices[1] === idx));
          const isCurrent = idx === currentIndex;

          return (
            <motion.div
              key={idx}
              animate={{ scale: isResult ? 1.1 : isCurrent ? 1.05 : 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="flex flex-col items-center gap-1.5"
            >
              {/* Pointer label — simple conditional, no AnimatePresence inside a loop */}
              <div className="h-5 flex items-center justify-center">
                {isCurrent && (
                  <span className="text-xs text-yellow-400 font-medium">i={idx}</span>
                )}
                {isResult && !isCurrent && (
                  <span className="text-xs text-emerald-400 font-medium">✓</span>
                )}
              </div>

              {/* Box */}
              <div
                className={`
                  w-14 h-14 flex items-center justify-center rounded-lg border-2
                  text-xl font-bold font-mono transition-colors duration-300
                  ${bg} ${border} ${text}
                `}
              >
                {num}
              </div>

              {/* Index label */}
              <span className="text-xs text-gray-600">{idx}</span>
            </motion.div>
          );
        })}
      </div>

      {/* Complement annotation */}
      {currentIndex !== null && phase === 'checking' && (
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-gray-400"
        >
          Looking for{' '}
          <span className="text-yellow-300 font-semibold">
            {target} − {nums[currentIndex]} = {target - nums[currentIndex]}
          </span>
        </motion.div>
      )}

      {/* Hash map */}
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs text-gray-500 uppercase tracking-wider">Hash Map</span>
          <div className="flex-1 h-px bg-gray-800" />
        </div>
        {Object.keys(map).length === 0 ? (
          <p className="text-xs text-gray-600 italic">empty</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            <AnimatePresence>
              {Object.entries(map).map(([val, entryIdx]) => (
                <motion.div
                  key={val}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center gap-1 bg-gray-800 border border-gray-700 rounded px-2.5 py-1 text-xs font-mono"
                >
                  <span className="text-purple-400">{val}</span>
                  <span className="text-gray-600">→</span>
                  <span className="text-gray-300">idx {entryIdx}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Found result */}
      <AnimatePresence>
        {phase === 'found' && resultIndices && (
          <motion.div
            key="found"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex items-center gap-2 bg-emerald-500/15 border border-emerald-500/40 rounded-lg px-4 py-2"
          >
            <span className="text-emerald-400 text-sm font-medium">
              Return [{resultIndices[0]}, {resultIndices[1]}]
            </span>
          </motion.div>
        )}
        {phase === 'not_found' && (
          <motion.div
            key="not_found"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex items-center gap-2 bg-red-500/15 border border-red-500/40 rounded-lg px-4 py-2"
          >
            <span className="text-red-400 text-sm font-medium">
              No solution — return []
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
