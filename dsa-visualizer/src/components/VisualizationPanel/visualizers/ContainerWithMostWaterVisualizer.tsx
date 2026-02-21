import { motion, AnimatePresence } from 'framer-motion';
import type { ContainerWaterVisualState } from '../../../data/problems/container-with-most-water';

interface Props { visualState: Record<string, unknown>; }

export function ContainerWithMostWaterVisualizer({ visualState }: Props) {
  const state = visualState as unknown as ContainerWaterVisualState;
  const { heights, left, right, currentArea, maxArea, phase } = state;

  const maxHeight = Math.max(...heights);
  const BAR_W = 32;
  const MAX_BAR_H = 140;
  const waterLevel = Math.min(heights[left], heights[right]);

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 p-6">
      {/* Stats */}
      <div className="flex items-center gap-8">
        <div className="flex flex-col items-center gap-0.5">
          <span className="text-xs text-gray-500 uppercase tracking-wider">Current area</span>
          <span className="text-2xl font-bold text-blue-400 font-mono">{currentArea}</span>
        </div>
        <div className="w-px h-8 bg-gray-700" />
        <div className="flex flex-col items-center gap-0.5">
          <span className="text-xs text-gray-500 uppercase tracking-wider">Max area</span>
          <span className="text-2xl font-bold text-emerald-400 font-mono">{maxArea}</span>
        </div>
      </div>

      {/* Bar chart */}
      <div className="flex items-end gap-1.5 relative">
        {heights.map((h, idx) => {
          const barH = Math.round((h / maxHeight) * MAX_BAR_H);
          const isLeft = idx === left;
          const isRight = idx === right;
          const isInRange = idx >= left && idx <= right;
          const isWaterBar = isLeft || isRight;
          const waterH = Math.round((waterLevel / maxHeight) * MAX_BAR_H);

          return (
            <div key={idx} className="flex flex-col items-center gap-1">
              {/* Pointer label */}
              <div className="h-5 flex items-center justify-center">
                {isLeft && <span className="text-[10px] font-bold text-blue-400">L</span>}
                {isRight && <span className="text-[10px] font-bold text-purple-400">R</span>}
              </div>

              {/* Bar */}
              <div className="relative" style={{ width: BAR_W, height: MAX_BAR_H }}>
                {/* Water fill between L and R */}
                {isInRange && !isWaterBar && phase !== 'done' && (
                  <motion.div
                    key={`water-${left}-${right}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute bottom-0 left-0 right-0 bg-blue-400/15 border-t border-blue-400/30"
                    style={{ height: waterH }}
                  />
                )}

                {/* The bar itself */}
                <motion.div
                  animate={{ height: barH }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  className={`absolute bottom-0 left-0 right-0 rounded-t transition-colors duration-200 ${
                    isLeft
                      ? 'bg-blue-500/70 border border-blue-400'
                      : isRight
                        ? 'bg-purple-500/70 border border-purple-400'
                        : isInRange && phase !== 'done'
                          ? 'bg-gray-700 border border-gray-600'
                          : 'bg-gray-800 border border-gray-700'
                  }`}
                />
              </div>

              {/* Value label */}
              <span className="text-xs text-gray-500 font-mono">{h}</span>
              <span className="text-[10px] text-gray-700">{idx}</span>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-5 text-xs text-gray-400">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-blue-500/70 border border-blue-400 inline-block" />
          <span className="text-blue-400 font-mono">L</span>
          <span>= left</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-purple-500/70 border border-purple-400 inline-block" />
          <span className="text-purple-400 font-mono">R</span>
          <span>= right</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-blue-400/15 border-t border-blue-400/30 inline-block" />
          <span>water</span>
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
            <span className="text-emerald-400 text-sm font-medium">
              Maximum water = {maxArea}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
