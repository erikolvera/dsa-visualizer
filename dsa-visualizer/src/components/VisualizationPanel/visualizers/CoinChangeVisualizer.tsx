import { motion, AnimatePresence } from 'framer-motion';
import type { CoinChangeVisualState } from '../../../data/problems/coin-change';

interface Props { visualState: Record<string, unknown>; }

export function CoinChangeVisualizer({ visualState }: Props) {
  const state = visualState as unknown as CoinChangeVisualState;
  const { coins, amount, dp, currentAmount, currentCoin, phase, result } = state;

  return (
    <div className="flex flex-col items-center justify-center h-full gap-8 p-6">
      {/* Coins + Target */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">Coins:</span>
          <div className="flex gap-2">
            {coins.map((c) => (
              <div
                key={c}
                className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm font-bold font-mono transition-colors duration-200 ${
                  c === currentCoin
                    ? 'bg-yellow-500/20 border-yellow-400 text-yellow-300'
                    : 'bg-gray-800 border-gray-600 text-gray-300'
                }`}
              >
                {c}
              </div>
            ))}
          </div>
        </div>
        <div className="w-px h-8 bg-gray-700" />
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">Target:</span>
          <span className="text-2xl font-bold text-blue-400 font-mono">{amount}</span>
        </div>
      </div>

      {/* DP array */}
      <div className="flex flex-col items-center gap-2">
        <span className="text-xs text-gray-500 uppercase tracking-wider">dp[i] = min coins to make amount i</span>
        <div className="flex items-center gap-2 flex-wrap justify-center">
          {dp.map((val, idx) => {
            const isCurrent = idx === currentAmount;
            const isFilled = val !== null;

            return (
              <motion.div
                key={idx}
                animate={{ scale: isCurrent ? 1.15 : 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="flex flex-col items-center gap-1"
              >
                <div
                  className={`w-12 h-12 flex items-center justify-center rounded-lg border-2 text-base font-bold font-mono transition-colors duration-300 ${
                    phase === 'done' && idx === amount
                      ? result === -1
                        ? 'bg-red-500/20 border-red-400 text-red-300'
                        : 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                      : isCurrent
                        ? 'bg-yellow-500/20 border-yellow-400 text-yellow-300'
                        : isFilled
                          ? idx === 0
                            ? 'bg-gray-700 border-gray-600 text-gray-400'
                            : 'bg-blue-500/15 border-blue-500/40 text-blue-300'
                          : 'bg-gray-900 border-gray-800 text-gray-600'
                  }`}
                >
                  {val !== null ? val : '∞'}
                </div>
                <span className="text-[10px] text-gray-600 font-mono">{idx}</span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Current coin highlight annotation */}
      <AnimatePresence mode="wait">
        {currentAmount !== null && currentCoin !== null && phase === 'filling' && (
          <motion.div
            key={`${currentAmount}-${currentCoin}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-sm text-gray-400"
          >
            dp[<span className="text-yellow-400">{currentAmount}</span>] = dp[
            <span className="text-blue-400">{currentAmount - currentCoin}</span>] + 1 coin (
            <span className="text-yellow-400">{currentCoin}</span>) = {dp[currentAmount]}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Result */}
      <AnimatePresence>
        {phase === 'done' && (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 ${
              result === -1
                ? 'bg-red-500/15 border border-red-500/40'
                : 'bg-emerald-500/15 border border-emerald-500/40'
            }`}
          >
            <span className={`text-sm font-medium ${result === -1 ? 'text-red-400' : 'text-emerald-400'}`}>
              {result === -1 ? `Cannot make amount ${amount} — return −1` : `Minimum ${result} coin(s) — return ${result}`}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
