import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Problem, Step } from '../../types';
import { useProblemStore } from '../../store/useProblemStore';
import { Controls } from './Controls';
import { InputEditor } from './InputEditor';
import { StepAnnotation } from './StepAnnotation';
import { ArrayVisualizer } from './visualizers/ArrayVisualizer';
import { ContainsDuplicateVisualizer } from './visualizers/ContainsDuplicateVisualizer';
import { StockVisualizer } from './visualizers/StockVisualizer';
import { MaxSubarrayVisualizer } from './visualizers/MaxSubarrayVisualizer';
import { MajorityElementVisualizer } from './visualizers/MajorityElementVisualizer';
import { ProductOfArrayVisualizer } from './visualizers/ProductOfArrayVisualizer';
import { ContainerWithMostWaterVisualizer } from './visualizers/ContainerWithMostWaterVisualizer';
import { BinarySearchVisualizer } from './visualizers/BinarySearchVisualizer';
import { FindMinRotatedVisualizer } from './visualizers/FindMinRotatedVisualizer';
import { LinkedListVisualizer } from './visualizers/LinkedListVisualizer';
import { MergeSortedListsVisualizer } from './visualizers/MergeSortedListsVisualizer';
import { StackVisualizer } from './visualizers/StackVisualizer';
import { ClimbingStairsVisualizer } from './visualizers/ClimbingStairsVisualizer';
import { HouseRobberVisualizer } from './visualizers/HouseRobberVisualizer';
import { CoinChangeVisualizer } from './visualizers/CoinChangeVisualizer';
import { TreeVisualizer } from './visualizers/TreeVisualizer';
import { MaxDepthBinaryTreeVisualizer } from './visualizers/MaxDepthBinaryTreeVisualizer';
import { SortVisualizer } from './visualizers/SortVisualizer';

interface VisualizationPanelProps {
  problem: Problem;
  steps: Step[];
  onInputChange: (newInput: Record<string, unknown>) => void;
}

function VisualizerForProblem({
  problemId,
  category,
  visualState,
}: {
  problemId: string;
  category: string;
  visualState: Record<string, unknown>;
}) {
  switch (problemId) {
    case 'two-sum':                           return <ArrayVisualizer visualState={visualState} />;
    case 'contains-duplicate':                return <ContainsDuplicateVisualizer visualState={visualState} />;
    case 'best-time-to-buy-stock':            return <StockVisualizer visualState={visualState} />;
    case 'maximum-subarray':                  return <MaxSubarrayVisualizer visualState={visualState} />;
    case 'majority-element':                  return <MajorityElementVisualizer visualState={visualState} />;
    case 'product-of-array-except-self':      return <ProductOfArrayVisualizer visualState={visualState} />;
    case 'container-with-most-water':         return <ContainerWithMostWaterVisualizer visualState={visualState} />;
    case 'binary-search':                     return <BinarySearchVisualizer visualState={visualState} />;
    case 'find-minimum-rotated-sorted-array': return <FindMinRotatedVisualizer visualState={visualState} />;
    case 'reverse-linked-list':               return <LinkedListVisualizer visualState={visualState} />;
    case 'merge-two-sorted-lists':            return <MergeSortedListsVisualizer visualState={visualState} />;
    case 'valid-parentheses':                 return <StackVisualizer visualState={visualState} />;
    case 'climbing-stairs':                   return <ClimbingStairsVisualizer visualState={visualState} />;
    case 'house-robber':                      return <HouseRobberVisualizer visualState={visualState} />;
    case 'coin-change':                       return <CoinChangeVisualizer visualState={visualState} />;
    case 'inorder-traversal':                 return <TreeVisualizer visualState={visualState} />;
    case 'maximum-depth-binary-tree':         return <MaxDepthBinaryTreeVisualizer visualState={visualState} />;
    case 'bubble-sort':                       return <SortVisualizer visualState={visualState} />;
    default:
      switch (category) {
        case 'Arrays':              return <ArrayVisualizer visualState={visualState} />;
        case 'Binary Search':       return <BinarySearchVisualizer visualState={visualState} />;
        case 'Linked Lists':        return <LinkedListVisualizer visualState={visualState} />;
        case 'Stacks':              return <StackVisualizer visualState={visualState} />;
        case 'Dynamic Programming': return <ClimbingStairsVisualizer visualState={visualState} />;
        case 'Trees':               return <TreeVisualizer visualState={visualState} />;
        case 'Sorting':             return <SortVisualizer visualState={visualState} />;
        default:                    return <div className="text-gray-500 text-sm">No visualizer found</div>;
      }
  }
}

export function VisualizationPanel({ problem, steps, onInputChange }: VisualizationPanelProps) {
  const { stepIndex, isPlaying, speed, setIsPlaying, stepForward } = useProblemStore();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!isPlaying) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    const intervalMs = 1000 / speed;
    intervalRef.current = setInterval(() => {
      const { stepIndex: idx, steps: s } = useProblemStore.getState();
      if (idx >= s.length - 1) {
        setIsPlaying(false);
      } else {
        stepForward();
      }
    }, intervalMs);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, speed, stepForward, setIsPlaying]);

  const currentStep = steps[stepIndex];
  if (!currentStep) return null;

  const { visualState, description } = currentStep;

  return (
    <div className="flex flex-col h-full bg-gray-950 border-b border-gray-700">
      {/* Problem header */}
      <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-700 bg-gray-900/60 shrink-0">
        <h2 className="text-lg font-semibold text-gray-100">{problem.title}</h2>
        <span
          className={`text-xs px-2 py-0.5 rounded-full border ${
            problem.difficulty === 'Easy'
              ? 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10'
              : problem.difficulty === 'Medium'
              ? 'text-yellow-400 border-yellow-500/40 bg-yellow-500/10'
              : 'text-red-400 border-red-500/40 bg-red-500/10'
          }`}
        >
          {problem.difficulty}
        </span>
        <span className="text-xs text-gray-500 border border-gray-700 px-2 py-0.5 rounded-full">
          {problem.category}
        </span>
      </div>

      {/* Controls */}
      <Controls />

      {/* Visualizer */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={stepIndex}
            initial={{ opacity: 0.7 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15 }}
            className="h-full"
          >
            <VisualizerForProblem
              problemId={problem.id}
              category={problem.category}
              visualState={visualState}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Step annotation */}
      <StepAnnotation
        description={description}
        stepIndex={stepIndex}
        totalSteps={steps.length}
      />

      {/* Input editor */}
      <InputEditor problem={problem} onInputChange={onInputChange} />
    </div>
  );
}
