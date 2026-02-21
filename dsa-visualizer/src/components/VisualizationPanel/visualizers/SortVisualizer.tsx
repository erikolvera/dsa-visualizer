import { motion } from 'framer-motion';
import type { SortVisualState } from '../../../data/problems/bubble-sort';

interface SortVisualizerProps {
  visualState: Record<string, unknown>;
}

export function SortVisualizer({ visualState }: SortVisualizerProps) {
  const state = visualState as unknown as SortVisualState;
  const { arr, compareLeft, compareRight, sortedFrom, swapping, phase } = state;

  const maxVal = Math.max(...arr, 1);

  const getBarColor = (idx: number) => {
    if (idx >= sortedFrom) {
      return { bg: 'bg-emerald-500', border: 'border-emerald-400', text: 'text-emerald-300' };
    }
    if (idx === compareLeft || idx === compareRight) {
      if (swapping) {
        return { bg: 'bg-red-500', border: 'border-red-400', text: 'text-red-300' };
      }
      return { bg: 'bg-yellow-500', border: 'border-yellow-400', text: 'text-yellow-300' };
    }
    return { bg: 'bg-blue-600', border: 'border-blue-500', text: 'text-blue-200' };
  };

  const BAR_MAX_HEIGHT = 160;

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 p-6">
      {/* Pass indicator */}
      <div className="flex items-center gap-3 text-sm">
        <span className="text-gray-500">Pass:</span>
        <span className="text-blue-400 font-bold">{state.pass}</span>
        {phase === 'done' && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-emerald-400 text-xs bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full"
          >
            Sorted ✓
          </motion.span>
        )}
      </div>

      {/* Bar chart */}
      <div className="flex items-end gap-2.5 w-full justify-center">
        {arr.map((val, idx) => {
          const { bg, border, text } = getBarColor(idx);
          const height = Math.max((val / maxVal) * BAR_MAX_HEIGHT, 20);
          const isComparing = idx === compareLeft || idx === compareRight;

          return (
            <motion.div
              key={idx}
              className="flex flex-col items-center gap-1"
              layout
            >
              {/* Value label */}
              <motion.span
                className={`text-xs font-bold font-mono ${text}`}
                animate={{ y: isComparing ? -4 : 0 }}
              >
                {val}
              </motion.span>

              {/* Bar */}
              <motion.div
                layout
                animate={{ height }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className={`
                  w-10 rounded-t-md border-2 border-b-0
                  ${bg} ${border}
                  ${isComparing ? 'shadow-lg' : ''}
                `}
                style={{ height }}
              />

              {/* Index */}
              <span className="text-xs text-gray-600">{idx}</span>

              {/* Compare arrows */}
              {isComparing && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`text-xs ${swapping ? 'text-red-400' : 'text-yellow-400'}`}
                >
                  {swapping ? '⇄' : '?'}
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Compare annotation */}
      {compareLeft !== null && compareRight !== null && (
        <motion.div
          key={`${compareLeft}-${compareRight}-${swapping}`}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-gray-400"
        >
          {swapping ? (
            <span>
              Swapping{' '}
              <span className="text-red-300 font-semibold">{arr[compareLeft]}</span>
              {' '}and{' '}
              <span className="text-red-300 font-semibold">{arr[compareRight]}</span>
            </span>
          ) : (
            <span>
              Comparing{' '}
              <span className="text-yellow-300 font-semibold">{arr[compareLeft]}</span>
              {' '}vs{' '}
              <span className="text-yellow-300 font-semibold">{arr[compareRight]}</span>
              {arr[compareLeft] > arr[compareRight] ? (
                <span className="text-red-400 ml-2">→ swap</span>
              ) : (
                <span className="text-emerald-400 ml-2">→ ok</span>
              )}
            </span>
          )}
        </motion.div>
      )}

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs">
        <LegendBar color="bg-yellow-500" label="comparing" />
        <LegendBar color="bg-red-500" label="swapping" />
        <LegendBar color="bg-emerald-500" label="sorted" />
        <LegendBar color="bg-blue-600" label="unsorted" />
      </div>
    </div>
  );
}

function LegendBar({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className={`w-3 h-4 rounded-sm ${color}`} />
      <span className="text-gray-400">{label}</span>
    </div>
  );
}
