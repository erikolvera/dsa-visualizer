import { useState, useEffect, useCallback } from 'react';
import type { Problem, Step } from '../types';
import { useProblemStore } from '../store/useProblemStore';
import { VisualizationPanel } from './VisualizationPanel/VisualizationPanel';
import { CodePanel } from './CodePanel/CodePanel';

interface ProblemPageProps {
  problem: Problem;
}

export function ProblemPage({ problem }: ProblemPageProps) {
  // Generate steps synchronously on first render — no blank flash
  const [steps, setSteps] = useState<Step[]>(() =>
    problem.generateSteps(problem.defaultInput)
  );

  // Sync initial steps to Zustand store after first render
  useEffect(() => {
    useProblemStore.getState().setProblem(problem.id, steps);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [problem.id]);

  const handleInputChange = useCallback(
    (newInput: Record<string, unknown>) => {
      try {
        const newSteps = problem.generateSteps(newInput);
        if (newSteps.length > 0) {
          setSteps(newSteps);
          useProblemStore.getState().setSteps(newSteps);
        }
      } catch {
        // invalid input — keep current steps
      }
    },
    [problem]
  );

  return (
    <div className="flex flex-col h-full">
      {/* Visualization Panel: 60% height */}
      <div className="flex flex-col" style={{ flex: '0 0 60%', minHeight: 0 }}>
        <VisualizationPanel
          problem={problem}
          steps={steps}
          onInputChange={handleInputChange}
        />
      </div>

      {/* Code Panel: 40% height */}
      <div className="flex flex-col border-t border-gray-800" style={{ flex: '0 0 40%', minHeight: 0 }}>
        <CodePanel problem={problem} />
      </div>
    </div>
  );
}
