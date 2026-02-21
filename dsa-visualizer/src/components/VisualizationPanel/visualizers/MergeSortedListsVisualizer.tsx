import { motion, AnimatePresence } from 'framer-motion';
import type { MergeSortedListsVisualState } from '../../../data/problems/merge-two-sorted-lists';

interface Props { visualState: Record<string, unknown>; }

function ListRow({
  label,
  values,
  activeIdx,
  color,
}: {
  label: string;
  values: number[];
  activeIdx: number | null;
  color: 'blue' | 'purple';
}) {
  const colorMap = {
    blue:   { active: 'bg-blue-500/20 border-blue-400 text-blue-300',     idle: 'bg-gray-800 border-gray-700 text-gray-300' },
    purple: { active: 'bg-purple-500/20 border-purple-400 text-purple-300', idle: 'bg-gray-800 border-gray-700 text-gray-300' },
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-gray-500 w-14 shrink-0 text-right font-mono">{label}</span>
      <div className="flex items-center gap-1.5">
        {values.length === 0 ? (
          <span className="text-sm text-gray-600 italic">empty</span>
        ) : (
          values.map((v, i) => (
            <div key={i} className="flex items-center gap-1">
              <motion.div
                animate={{ scale: i === activeIdx ? 1.15 : 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className={`w-11 h-11 flex items-center justify-center rounded-lg border-2 text-base font-bold font-mono transition-colors duration-300 ${
                  i === activeIdx ? colorMap[color].active : colorMap[color].idle
                }`}
              >
                {v}
              </motion.div>
              {i < values.length - 1 && (
                <span className="text-gray-700 text-sm">→</span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export function MergeSortedListsVisualizer({ visualState }: Props) {
  const state = visualState as unknown as MergeSortedListsVisualState;
  const { list1, list2, merged, ptr1, ptr2, phase } = state;

  return (
    <div className="flex flex-col items-center justify-center h-full gap-8 p-6">
      {/* Input lists */}
      <div className="flex flex-col gap-4">
        <ListRow label="list1" values={list1} activeIdx={ptr1} color="blue" />
        <ListRow label="list2" values={list2} activeIdx={ptr2} color="purple" />
      </div>

      {/* Arrow down */}
      <div className="flex flex-col items-center gap-1">
        <div className="w-px h-6 bg-gray-700" />
        <svg className="w-4 h-4 text-gray-600" viewBox="0 0 24 24" fill="currentColor">
          <path d="M7 10l5 5 5-5z" />
        </svg>
      </div>

      {/* Merged list */}
      <div className="flex flex-col items-center gap-2">
        <span className="text-xs text-gray-500 uppercase tracking-wider">Merged</span>
        <div className="flex items-center gap-1.5 min-h-[3rem]">
          <AnimatePresence>
            {merged.length === 0 ? (
              <motion.span key="empty" className="text-sm text-gray-600 italic">
                empty
              </motion.span>
            ) : (
              merged.map((v, i) => (
                <motion.div
                  key={`${i}-${v}`}
                  initial={{ opacity: 0, scale: 0.7, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className="flex items-center gap-1"
                >
                  <div className="w-11 h-11 flex items-center justify-center rounded-lg border-2 bg-emerald-500/15 border-emerald-500/40 text-emerald-300 text-base font-bold font-mono">
                    {v}
                  </div>
                  {i < merged.length - 1 && (
                    <span className="text-gray-700 text-sm">→</span>
                  )}
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Done banner */}
      <AnimatePresence>
        {phase === 'done' && merged.length > 0 && (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 bg-emerald-500/15 border border-emerald-500/40 rounded-lg px-4 py-2"
          >
            <span className="text-emerald-400 text-sm font-medium">
              Merged: [{merged.join(' → ')}]
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
