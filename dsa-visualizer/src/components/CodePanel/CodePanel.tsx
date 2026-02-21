import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Problem } from '../../types';
import { useProblemStore } from '../../store/useProblemStore';
import { LanguageSelector } from './LanguageSelector';
import { HighlightedCode } from './HighlightedCode';
import { UserCodeEditor } from './UserCodeEditor';

interface CodePanelProps {
  problem: Problem;
}

type Tab = 'description' | 'solution' | 'practice';

export function CodePanel({ problem }: CodePanelProps) {
  const { language, stepIndex, steps } = useProblemStore();
  const [activeTab, setActiveTab] = useState<Tab>('solution');

  const currentStep = steps[stepIndex];
  const highlightLines = currentStep ? (currentStep.highlightLines[language] ?? []) : [];
  const solution = problem.solutions[language];

  return (
    <div className="flex flex-col h-full bg-gray-950">
      {/* Tab bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-700 bg-gray-900/60 shrink-0">
        <div className="flex items-center gap-1">
          <TabButton active={activeTab === 'description'} onClick={() => setActiveTab('description')}>
            Description
          </TabButton>
          <TabButton active={activeTab === 'solution'} onClick={() => setActiveTab('solution')}>
            Solution
          </TabButton>
          <TabButton active={activeTab === 'practice'} onClick={() => setActiveTab('practice')}>
            Practice
          </TabButton>
        </div>

        {(activeTab === 'solution' || activeTab === 'practice') && solution && (
          <div className="flex items-center gap-3">
            {activeTab === 'solution' && (
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <span>
                  Time:{' '}
                  <span className="text-blue-400 font-medium">{solution.timeComplexity}</span>
                </span>
                <span className="text-gray-600">·</span>
                <span>
                  Space:{' '}
                  <span className="text-purple-400 font-medium">{solution.spaceComplexity}</span>
                </span>
              </div>
            )}
            <LanguageSelector />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 overflow-hidden relative">
        <AnimatePresence mode="wait">
          {activeTab === 'description' ? (
            <motion.div
              key="description"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="absolute inset-0 overflow-y-auto px-6 py-4"
            >
              <div className="flex items-center gap-2 mb-3">
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
                <span className="text-xs text-gray-600 border border-gray-800 px-2 py-0.5 rounded-full">
                  {problem.category}
                </span>
              </div>

              <p className="text-[15px] text-gray-200 leading-relaxed mb-5">
                {problem.description}
              </p>

              {problem.examples.length > 0 && (
                <div className="space-y-3">
                  {problem.examples.map((ex, i) => (
                    <div key={i} className="rounded-lg bg-gray-900 border border-gray-800 p-3">
                      <p className="text-xs text-gray-500 font-medium mb-2">Example {i + 1}</p>
                      <div className="font-mono text-xs space-y-1">
                        <div>
                          <span className="text-gray-500">Input: </span>
                          <span className="text-gray-300">{ex.input}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Output: </span>
                          <span className="text-gray-300">{ex.output}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ) : activeTab === 'solution' ? (
            <motion.div
              key="solution"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="absolute inset-0 overflow-auto px-4"
            >
              {solution && (
                <HighlightedCode
                  code={solution.code}
                  language={language}
                  highlightLines={highlightLines}
                />
              )}
            </motion.div>
          ) : (
            <motion.div
              key="practice"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="absolute inset-0 flex flex-col"
            >
              <UserCodeEditor problem={problem} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        px-3 py-1.5 text-sm font-medium rounded transition-all duration-150
        ${active
          ? 'bg-gray-700 text-gray-100 border border-gray-600'
          : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/60'}
      `}
    >
      {children}
    </button>
  );
}
