import { motion, AnimatePresence } from 'framer-motion';

interface StepAnnotationProps {
  description: string;
  stepIndex: number;
  totalSteps: number;
}

export function StepAnnotation({ description, stepIndex, totalSteps }: StepAnnotationProps) {
  return (
    <div className="px-6 py-3 border-t border-gray-700 bg-gray-900/70 shrink-0">
      {/* Progress bar */}
      <div className="flex items-center gap-3 mb-2">
        <span className="text-sm text-gray-400 shrink-0">
          Step {stepIndex + 1} / {totalSteps}
        </span>
        <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-blue-500 rounded-full"
            animate={{ width: `${((stepIndex + 1) / totalSteps) * 100}%` }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
        </div>
      </div>

      {/* Description */}
      <AnimatePresence mode="wait">
        <motion.p
          key={stepIndex}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
          className="text-[15px] text-gray-200 leading-relaxed"
        >
          {description}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
