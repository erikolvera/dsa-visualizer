import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Problem, Category } from '../types';
import { problems } from '../data';

interface SidebarProps {
  selectedId: string | null;
  onSelect: (id: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const CATEGORY_ORDER: Category[] = [
  'Arrays', 'Binary Search', 'Linked Lists', 'Stacks', 'Dynamic Programming', 'Trees', 'Sorting',
];

const CATEGORY_CONFIG: Record<Category, {
  icon: string;
  border: string;
  iconColor: string;
  labelColor: string;
  bg: string;
}> = {
  Arrays:                { icon: '▦', border: 'border-blue-500',    iconColor: 'text-blue-400',    labelColor: 'text-blue-300',    bg: 'bg-blue-500/8'    },
  'Binary Search':       { icon: '⌖', border: 'border-violet-500',  iconColor: 'text-violet-400',  labelColor: 'text-violet-300',  bg: 'bg-violet-500/8'  },
  'Linked Lists':        { icon: '⬡', border: 'border-cyan-500',    iconColor: 'text-cyan-400',    labelColor: 'text-cyan-300',    bg: 'bg-cyan-500/8'    },
  Stacks:                { icon: '⬚', border: 'border-orange-500',  iconColor: 'text-orange-400',  labelColor: 'text-orange-300',  bg: 'bg-orange-500/8'  },
  'Dynamic Programming': { icon: '◈', border: 'border-emerald-500', iconColor: 'text-emerald-400', labelColor: 'text-emerald-300', bg: 'bg-emerald-500/8' },
  Trees:                 { icon: '⌥', border: 'border-teal-500',    iconColor: 'text-teal-400',    labelColor: 'text-teal-300',    bg: 'bg-teal-500/8'    },
  Sorting:               { icon: '⇅', border: 'border-amber-500',   iconColor: 'text-amber-400',   labelColor: 'text-amber-300',   bg: 'bg-amber-500/8'   },
};

const DIFFICULTY_COLORS: Record<string, string> = {
  Easy: 'text-emerald-400',
  Medium: 'text-yellow-400',
  Hard: 'text-red-400',
};

function groupByCategory(ps: Problem[]): Record<Category, Problem[]> {
  return ps.reduce((acc, p) => {
    if (!acc[p.category]) acc[p.category] = [];
    acc[p.category].push(p);
    return acc;
  }, {} as Record<Category, Problem[]>);
}

export function Sidebar({ selectedId, onSelect, isOpen, onToggle }: SidebarProps) {
  const grouped = groupByCategory(problems);
  const [collapsed, setCollapsed] = useState<Set<Category>>(new Set());

  const toggleCat = (cat: Category) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  return (
    <aside
      className="shrink-0 bg-gray-900 border-r border-gray-700 flex flex-col overflow-hidden transition-all duration-300 ease-in-out"
      style={{ width: isOpen ? '15rem' : '2.75rem' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-4 border-b border-gray-700 shrink-0">
        {isOpen && (
          <div className="min-w-0">
            <h1 className="text-sm font-semibold text-gray-100 tracking-wider uppercase truncate">
              DSA Visualizer
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">Learn algorithms visually</p>
          </div>
        )}
        <button
          onClick={onToggle}
          className="shrink-0 p-1 rounded text-gray-400 hover:text-gray-100 hover:bg-gray-700 transition-colors"
          title={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          <svg
            className={`w-4 h-4 transition-transform duration-300 ${isOpen ? '' : 'rotate-180'}`}
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
          >
            <path d="M11 19l-7-7 7-7" />
            <path d="M19 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* Problem list */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-2">
        {CATEGORY_ORDER.filter((cat) => grouped[cat]).map((category, idx) => {
          const cfg = CATEGORY_CONFIG[category];
          const isCollapsed = collapsed.has(category);
          const catProblems = grouped[category];

          return (
            <div key={category} className={idx > 0 ? 'mt-2' : ''}>
              {/* Divider line above each section (except first) */}
              {idx > 0 && <div className="h-px bg-gray-800 mb-2" />}

              {/* Category header */}
              <button
                onClick={() => isOpen && toggleCat(category)}
                title={!isOpen ? category : undefined}
                className={`
                  w-full flex items-center gap-2 px-3 py-2
                  border-l-2 ${cfg.border} ${cfg.bg}
                  transition-colors duration-150
                  ${isOpen ? 'hover:bg-gray-700/30 cursor-pointer' : 'cursor-default'}
                `}
              >
                <span className={`shrink-0 text-sm ${cfg.iconColor}`}>{cfg.icon}</span>
                {isOpen && (
                  <>
                    <span className={`text-xs font-bold ${cfg.labelColor} uppercase tracking-wider whitespace-nowrap flex-1 text-left`}>
                      {category}
                    </span>
                    <svg
                      className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-200 ${isCollapsed ? '' : 'rotate-180'}`}
                      viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}
                    >
                      <path d="M18 15l-6-6-6 6" />
                    </svg>
                  </>
                )}
              </button>

              {/* Problems list */}
              <AnimatePresence initial={false}>
                {!isCollapsed && (
                  <motion.div
                    key="problems"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.18, ease: 'easeInOut' }}
                    style={{ overflow: 'hidden' }}
                  >
                    {catProblems.map((problem) => {
                      const isSelected = problem.id === selectedId;
                      return (
                        <button
                          key={problem.id}
                          onClick={() => onSelect(problem.id)}
                          title={!isOpen ? problem.title : undefined}
                          className={`w-full text-left px-3 py-2 flex items-center gap-2 transition-colors duration-150 ${
                            isSelected
                              ? 'bg-blue-500/15 border-r-2 border-blue-400 text-blue-300'
                              : 'text-gray-400 hover:text-gray-100 hover:bg-gray-800/60'
                          }`}
                        >
                          <span className={`shrink-0 w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-blue-400' : 'bg-gray-600'}`} />
                          {isOpen && (
                            <>
                              <span className="text-sm truncate flex-1">{problem.title}</span>
                              <span className={`text-xs shrink-0 ${DIFFICULTY_COLORS[problem.difficulty]}`}>
                                {problem.difficulty}
                              </span>
                            </>
                          )}
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </nav>

      {isOpen && (
        <div className="px-3 py-3 border-t border-gray-700 shrink-0">
          <p className="text-sm text-gray-500">{problems.length} problems · Blind 75</p>
        </div>
      )}
    </aside>
  );
}
