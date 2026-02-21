import { motion, AnimatePresence } from 'framer-motion';
import type { ProductArrayVisualState } from '../../../data/problems/product-of-array-except-self';

interface Props { visualState: Record<string, unknown>; }

export function ProductOfArrayVisualizer({ visualState }: Props) {
  const state = visualState as unknown as ProductArrayVisualState;
  const { nums, result, currentIndex, phase } = state;

  function getResultStyle(idx: number) {
    const val = result[idx];
    if (val === null) return { bg: 'bg-gray-900', border: 'border-gray-800', text: 'text-gray-600' };
    if (phase === 'done') return { bg: 'bg-emerald-500/20', border: 'border-emerald-400', text: 'text-emerald-300' };
    if (idx === currentIndex) {
      if (phase === 'prefix') return { bg: 'bg-blue-500/20', border: 'border-blue-400', text: 'text-blue-300' };
      return { bg: 'bg-purple-500/20', border: 'border-purple-400', text: 'text-purple-300' };
    }
    if (phase === 'suffix' && val !== null) return { bg: 'bg-emerald-500/15', border: 'border-emerald-500/40', text: 'text-emerald-300' };
    return { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-200' };
  }

  return (
    <div className="flex flex-col items-center justify-center h-full gap-8 p-6">
      {/* Pass indicator */}
      <div className="flex items-center gap-6 text-sm">
        <div className={`px-3 py-1 rounded-full border text-xs font-medium transition-colors ${
          phase === 'prefix' || phase === 'init'
            ? 'bg-blue-500/20 border-blue-400 text-blue-300'
            : 'bg-gray-800 border-gray-700 text-gray-500'
        }`}>
          ← Left pass (prefix)
        </div>
        <div className={`px-3 py-1 rounded-full border text-xs font-medium transition-colors ${
          phase === 'suffix'
            ? 'bg-purple-500/20 border-purple-400 text-purple-300'
            : 'bg-gray-800 border-gray-700 text-gray-500'
        }`}>
          Right pass (suffix) →
        </div>
      </div>

      {/* Original array */}
      <div className="flex flex-col items-center gap-2">
        <span className="text-xs text-gray-500 uppercase tracking-wider">Input</span>
        <div className="flex items-center gap-3">
          {nums.map((num, idx) => (
            <motion.div
              key={idx}
              animate={{ scale: idx === currentIndex ? 1.08 : 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="flex flex-col items-center gap-1"
            >
              {idx === currentIndex && (
                <span className="text-[10px] text-yellow-400 font-bold">i={idx}</span>
              )}
              {idx !== currentIndex && <span className="text-[10px] text-transparent">i</span>}
              <div className={`w-14 h-14 flex items-center justify-center rounded-lg border-2 text-xl font-bold font-mono transition-colors ${
                idx === currentIndex
                  ? 'bg-yellow-500/20 border-yellow-400 text-yellow-300'
                  : 'bg-gray-800 border-gray-700 text-gray-300'
              }`}>
                {num}
              </div>
              <span className="text-xs text-gray-600">{idx}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Result array */}
      <div className="flex flex-col items-center gap-2">
        <span className="text-xs text-gray-500 uppercase tracking-wider">Result</span>
        <div className="flex items-center gap-3">
          {result.map((val, idx) => {
            const { bg, border, text } = getResultStyle(idx);
            return (
              <motion.div
                key={idx}
                animate={{ scale: idx === currentIndex ? 1.08 : 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="flex flex-col items-center gap-1"
              >
                <span className="text-[10px] text-transparent">i</span>
                <div className={`w-14 h-14 flex items-center justify-center rounded-lg border-2 text-lg font-bold font-mono transition-colors duration-300 ${bg} ${border} ${text}`}>
                  {val !== null ? val : '?'}
                </div>
                <span className="text-xs text-gray-600">{idx}</span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Done banner */}
      <AnimatePresence>
        {phase === 'done' && (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 bg-emerald-500/15 border border-emerald-500/40 rounded-lg px-4 py-2"
          >
            <span className="text-emerald-400 text-sm font-medium font-mono">
              [{result.join(', ')}]
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
