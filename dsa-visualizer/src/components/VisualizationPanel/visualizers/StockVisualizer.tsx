import { motion, AnimatePresence } from 'framer-motion';
import type { StockVisualState } from '../../../data/problems/best-time-to-buy-stock';

interface Props { visualState: Record<string, unknown>; }

export function StockVisualizer({ visualState }: Props) {
  const state = visualState as unknown as StockVisualState;
  const { prices, currentDay, minPriceDay, maxProfit, currentProfit, phase } = state;

  if (prices.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500 text-sm">
        No prices to display
      </div>
    );
  }

  const maxPrice = Math.max(...prices);
  const BAR_MAX_HEIGHT = 140;

  const barColor = (idx: number) => {
    if (idx === currentDay && phase === 'new_min') return 'bg-emerald-400';
    if (idx === currentDay && phase === 'new_profit') return 'bg-yellow-400';
    if (idx === currentDay) return 'bg-yellow-400/80';
    if (idx === minPriceDay) return 'bg-emerald-500';
    return 'bg-blue-500/50';
  };

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 p-6">
      {/* Stats row */}
      <div className="flex items-center gap-8 text-sm">
        <div className="text-center">
          <p className="text-gray-500 text-xs uppercase tracking-wider mb-0.5">Buy price</p>
          <p className="text-emerald-400 font-bold text-lg">${prices[minPriceDay]}</p>
          <p className="text-gray-600 text-xs">day {minPriceDay}</p>
        </div>
        <div className="text-center">
          <p className="text-gray-500 text-xs uppercase tracking-wider mb-0.5">Current profit</p>
          <p className={`font-bold text-lg ${currentProfit > 0 ? 'text-yellow-400' : 'text-gray-500'}`}>
            ${currentProfit}
          </p>
        </div>
        <div className="text-center">
          <p className="text-gray-500 text-xs uppercase tracking-wider mb-0.5">Max profit</p>
          <p className="text-blue-400 font-bold text-lg">${maxProfit}</p>
        </div>
      </div>

      {/* Bar chart */}
      <div className="flex items-end gap-3">
        {prices.map((price, idx) => {
          const height = Math.max(20, (price / maxPrice) * BAR_MAX_HEIGHT);
          const isBuyDay = idx === minPriceDay;
          const isCurrent = idx === currentDay;
          return (
            <motion.div
              key={idx}
              className="flex flex-col items-center gap-1.5"
              animate={{ scale: isCurrent ? 1.08 : 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              {/* Price label above bar */}
              <span className={`text-xs font-mono font-medium ${isCurrent ? 'text-yellow-300' : isBuyDay ? 'text-emerald-300' : 'text-gray-500'}`}>
                ${price}
              </span>

              {/* Bar */}
              <motion.div
                className={`w-10 rounded-t-md transition-colors duration-300 ${barColor(idx)}`}
                animate={{ height }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />

              {/* Day label */}
              <span className="text-xs text-gray-600">D{idx}</span>

              {/* Pointer label */}
              <div className="h-4">
                {isBuyDay && <span className="text-xs text-emerald-400 font-semibold">buy</span>}
                {isCurrent && !isBuyDay && <span className="text-xs text-yellow-400 font-semibold">→</span>}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-5 text-xs text-gray-500">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-emerald-500" />
          <span>min price (buy)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-yellow-400/80" />
          <span>current day</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-blue-500/50" />
          <span>other days</span>
        </div>
      </div>

      {/* Result banner */}
      <AnimatePresence>
        {phase === 'done' && (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`flex items-center gap-2 rounded-lg px-5 py-2.5 border ${
              maxProfit > 0
                ? 'bg-emerald-500/15 border-emerald-500/40'
                : 'bg-gray-700/30 border-gray-600/40'
            }`}
          >
            <span className={`text-sm font-semibold ${maxProfit > 0 ? 'text-emerald-400' : 'text-gray-400'}`}>
              {maxProfit > 0 ? `Max profit: $${maxProfit} — return ${maxProfit}` : 'No profitable trade — return 0'}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
