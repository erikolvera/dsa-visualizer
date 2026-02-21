import { motion, AnimatePresence } from 'framer-motion';
import type { StackVisualState } from '../../../data/problems/valid-parentheses';

interface StackVisualizerProps {
  visualState: Record<string, unknown>;
}

const BRACKET_PAIR_COLORS: Record<string, string> = {
  '(': 'text-blue-400',
  ')': 'text-blue-400',
  '[': 'text-purple-400',
  ']': 'text-purple-400',
  '{': 'text-orange-400',
  '}': 'text-orange-400',
};

export function StackVisualizer({ visualState }: StackVisualizerProps) {
  const state = visualState as unknown as StackVisualState;
  const { chars, currentIdx, stack, phase, isOpening, isMatching } = state;

  const getCharColor = (idx: number) => {
    if (idx === currentIdx) {
      if (phase === 'invalid' || isMatching === false) return 'bg-red-500/25 border-red-400 text-red-300';
      if (isOpening) return 'bg-yellow-500/25 border-yellow-400 text-yellow-300';
      if (isMatching) return 'bg-emerald-500/25 border-emerald-400 text-emerald-300';
      return 'bg-yellow-500/25 border-yellow-400 text-yellow-300';
    }
    if (idx < (currentIdx ?? -1)) {
      return 'bg-gray-800/50 border-gray-700/50 text-gray-500';
    }
    return 'bg-gray-800 border-gray-700 text-gray-400';
  };

  return (
    <div className="flex flex-col items-center justify-center h-full gap-8 p-6">
      {/* Input string display */}
      <div className="flex flex-col items-center gap-3">
        <span className="text-xs text-gray-500 uppercase tracking-wider">Input String</span>
        <div className="flex items-center gap-1.5">
          {chars.map((char, idx) => (
            <motion.div
              key={idx}
              animate={{
                scale: idx === currentIdx ? 1.15 : 1,
                y: idx === currentIdx ? -4 : 0,
              }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className={`
                w-11 h-11 flex items-center justify-center rounded-lg border-2
                text-lg font-bold font-mono transition-colors duration-200
                ${getCharColor(idx)}
              `}
            >
              {char}
            </motion.div>
          ))}
        </div>

        {/* Current pointer */}
        <div className="flex gap-1.5">
          {chars.map((_, idx) => (
            <div key={idx} className="w-11 flex justify-center">
              {idx === currentIdx && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-yellow-400 text-sm"
                >
                  ▲
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Stack */}
      <div className="flex gap-12 items-end">
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs text-gray-500 uppercase tracking-wider">Stack</span>

          {/* Stack frame */}
          <div className="relative w-20 min-h-32 flex flex-col-reverse border-2 border-t-0 border-gray-700 rounded-b-lg px-1.5 pb-1.5 pt-0 bg-gray-900/50">
            {/* Bottom label */}
            <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs text-gray-600">
              bottom
            </div>
            <AnimatePresence>
              {stack.map((bracket, idx) => (
                <motion.div
                  key={`${bracket}-${idx}`}
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  exit={{ opacity: 0, height: 0, scale: 0.8 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  className={`
                    flex items-center justify-center h-10 rounded border-2
                    text-lg font-bold font-mono mb-1
                    ${BRACKET_PAIR_COLORS[bracket] ?? 'text-gray-300'}
                    bg-gray-800 border-gray-600
                  `}
                >
                  {bracket}
                </motion.div>
              ))}
            </AnimatePresence>
            {stack.length === 0 && (
              <div className="h-10 flex items-center justify-center">
                <span className="text-xs text-gray-700 italic">empty</span>
              </div>
            )}
          </div>
        </div>

        {/* Result */}
        <div className="flex flex-col items-center gap-2 mb-6">
          <span className="text-xs text-gray-500 uppercase tracking-wider">Result</span>
          <AnimatePresence mode="wait">
            {phase === 'valid' && (
              <motion.div
                key="valid"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-1"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-2xl">
                  ✓
                </div>
                <span className="text-emerald-400 text-sm font-medium">true</span>
              </motion.div>
            )}
            {phase === 'invalid' && (
              <motion.div
                key="invalid"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-1"
              >
                <div className="w-16 h-16 rounded-full bg-red-500/20 border-2 border-red-400 flex items-center justify-center text-2xl">
                  ✗
                </div>
                <span className="text-red-400 text-sm font-medium">false</span>
              </motion.div>
            )}
            {phase !== 'valid' && phase !== 'invalid' && (
              <motion.div
                key="pending"
                className="w-16 h-16 rounded-full border-2 border-dashed border-gray-700 flex items-center justify-center"
              >
                <span className="text-gray-600 text-xs">?</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
