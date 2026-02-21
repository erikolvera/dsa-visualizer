import type { Problem, Category } from '../types';
import { problems } from '../data';

interface SidebarProps {
  selectedId: string | null;
  onSelect: (id: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const CATEGORY_ORDER: Category[] = ['Arrays', 'Binary Search', 'Linked Lists', 'Stacks', 'Dynamic Programming', 'Trees', 'Sorting'];

const CATEGORY_ICONS: Record<Category, string> = {
  Arrays: '▦',
  'Binary Search': '⌖',
  'Linked Lists': '⬡',
  Stacks: '⬚',
  'Dynamic Programming': '◈',
  Trees: '⌥',
  Sorting: '⇅',
};

const DIFFICULTY_COLORS: Record<string, string> = {
  Easy: 'text-emerald-400',
  Medium: 'text-yellow-400',
  Hard: 'text-red-400',
};

function groupByCategory(problems: Problem[]): Record<Category, Problem[]> {
  return problems.reduce(
    (acc, p) => {
      if (!acc[p.category]) acc[p.category] = [];
      acc[p.category].push(p);
      return acc;
    },
    {} as Record<Category, Problem[]>
  );
}

export function Sidebar({ selectedId, onSelect, isOpen, onToggle }: SidebarProps) {
  const grouped = groupByCategory(problems);

  return (
    <aside
      className="shrink-0 bg-gray-900 border-r border-gray-700 flex flex-col overflow-hidden transition-all duration-300 ease-in-out"
      style={{ width: isOpen ? '14rem' : '2.75rem' }}
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
      <nav className="flex-1 py-2 overflow-y-auto overflow-x-hidden">
        {CATEGORY_ORDER.filter((cat) => grouped[cat]).map((category) => (
          <div key={category} className="mb-1">
            <div className="flex items-center gap-2 px-3 py-1.5">
              <span className="text-gray-400 text-xs shrink-0">{CATEGORY_ICONS[category]}</span>
              {isOpen && (
                <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">
                  {category}
                </span>
              )}
            </div>

            {grouped[category].map((problem) => {
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
          </div>
        ))}
      </nav>

      {isOpen && (
        <div className="px-3 py-3 border-t border-gray-700 shrink-0">
          <p className="text-sm text-gray-500">{problems.length} problems · Blind 75</p>
        </div>
      )}
    </aside>
  );
}
