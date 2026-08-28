import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIsSmallScreen } from '../hooks/useIsSmallScreen';

export function SmallScreenNotice() {
  const isSmall = useIsSmallScreen();
  const [dismissed, setDismissed] = useState(false);

  return (
    <AnimatePresence>
      {isSmall && !dismissed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/90 px-6"
        >
          <div className="max-w-sm rounded-xl border border-gray-700 bg-gray-900 p-6 text-center shadow-xl">
            <h2 className="text-lg font-semibold text-gray-100">Built for a bigger screen</h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-400">
              The step-by-step algorithm animations are designed for a desktop layout. Come back on a
              laptop for the full thing — it's worth it.
            </p>
            <button
              onClick={() => setDismissed(true)}
              className="mt-5 w-full rounded-lg border border-blue-500/50 bg-blue-600/30 px-4 py-2 text-sm font-medium text-blue-300 transition-colors duration-150 hover:bg-blue-600/50"
            >
              Look around anyway
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
