import { motion, AnimatePresence } from 'framer-motion';
import type { ClimbingStairsVisualState } from '../../../data/problems/climbing-stairs';

interface Props { visualState: Record<string, unknown>; }

export function ClimbingStairsVisualizer({ visualState }: Props) {
  const state = visualState as unknown as ClimbingStairsVisualState;
  const { n, dp, currentStep, phase, result } = state;

  return (
    <div className="flex flex-col items-center justify-center h-full gap-10 p-6">
      {/* Title */}
      <div className="text-sm text-gray-400">
        Climbing <span className="text-blue-400 font-semibold">{n}</span> stairs
        {' '}(1 or 2 steps at a time)
      </div>

      {/* DP Table */}
      <div className="flex flex-col items-center gap-3">
        <div className="flex items-end gap-2">
          {Array.from({ length: n + 1 }, (_, i) => i).map((i) => {
            const value = dp[i];
            const isCurrent = i === currentStep;
            const isFilled = value !== null;

            return (
              <motion.div
                key={i}
                animate={{ scale: isCurrent ? 1.12 : 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="flex flex-col items-center gap-1.5"
              >
                {/* Cell label */}
                <span className="text-[10px] text-gray-500 font-mono">dp[{i}]</span>

                {/* Cell value */}
                <div
                  className={`
                    w-14 h-14 flex items-center justify-center rounded-lg border-2
                    text-xl font-bold font-mono transition-colors duration-300
                    ${isCurrent
                      ? 'bg-yellow-500/20 border-yellow-400 text-yellow-300'
                      : isFilled
                        ? i === 0
                          ? 'bg-gray-800 border-gray-600 text-gray-500'
                          : 'bg-blue-500/15 border-blue-500/50 text-blue-300'
                        : 'bg-gray-900 border-gray-800 text-gray-700'
                    }
                  `}
                >
                  {isFilled ? (i === 0 ? '—' : value) : '?'}
                </div>

                {/* Stair index */}
                <span className="text-xs text-gray-600">stair {i}</span>
              </motion.div>
            );
          })}
        </div>

        {/* Fibonacci-like annotation */}
        {currentStep !== null && currentStep >= 3 && phase === 'filling' && (
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-gray-400 mt-2"
          >
            dp[{currentStep}] = dp[{currentStep - 1}]{' '}
            <span className="text-gray-600">+</span>{' '}
            dp[{currentStep - 2}]{' '}
            <span className="text-gray-600">=</span>{' '}
            <span className="text-blue-400 font-semibold">{dp[currentStep - 1]}</span>
            {' '}<span className="text-gray-600">+</span>{' '}
            <span className="text-blue-400 font-semibold">{dp[currentStep - 2]}</span>
            {' '}= <span className="text-yellow-400 font-semibold">{dp[currentStep]}</span>
          </motion.div>
        )}
      </div>

      {/* Visual staircase */}
      <div className="flex items-end gap-0.5">
        {Array.from({ length: n }, (_, i) => (
          <div key={i} className="flex flex-col items-center">
            <div
              className={`w-8 transition-colors duration-500 ${
                currentStep !== null && i < currentStep
                  ? 'bg-blue-500/40 border-t-2 border-blue-400'
                  : 'bg-gray-800 border-t border-gray-700'
              }`}
              style={{ height: `${(i + 1) * 12}px` }}
            />
            <span className="text-[10px] text-gray-600 mt-1">{i + 1}</span>
          </div>
        ))}
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
              {result} distinct ways to climb {n} stairs
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
