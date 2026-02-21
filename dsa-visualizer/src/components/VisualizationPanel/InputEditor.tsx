import { useState, useCallback } from 'react';
import type { Problem } from '../../types';

interface InputEditorProps {
  problem: Problem;
  onInputChange: (newInput: Record<string, unknown>) => void;
}

export function InputEditor({ problem, onInputChange }: InputEditorProps) {
  const [value, setValue] = useState(() =>
    JSON.stringify(problem.defaultInput, null, 2)
  );
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = useCallback(
    (raw: string) => {
      setValue(raw);
      try {
        const parsed = JSON.parse(raw);
        setError(null);
        onInputChange(parsed);
      } catch {
        setError('Invalid JSON');
      }
    },
    [onInputChange]
  );

  const handleReset = () => {
    const defaultStr = JSON.stringify(problem.defaultInput, null, 2);
    setValue(defaultStr);
    setError(null);
    onInputChange(problem.defaultInput);
  };

  return (
    // `relative` so the floating panel is positioned relative to this bar
    <div className="border-t border-gray-800 shrink-0 relative">
      {/* Floating panel — rendered above the toggle bar, no layout impact */}
      {isOpen && (
        <div className="absolute bottom-full left-0 right-0 z-30 bg-gray-900 border border-gray-800 border-b-0 shadow-xl">
          <div className="p-3">
            <textarea
              value={value}
              onChange={(e) => handleChange(e.target.value)}
              spellCheck={false}
              rows={8}
              className="w-full bg-gray-950 border border-gray-700 rounded text-xs text-gray-300 font-mono p-2.5 resize-none focus:outline-none focus:border-blue-500/50 transition-colors"
            />
            <div className="flex items-center justify-between mt-2">
              {error ? (
                <span className="text-red-400 text-xs">{error}</span>
              ) : (
                <span className="text-xs text-gray-600">Valid JSON</span>
              )}
              <button
                onClick={handleReset}
                className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
              >
                Reset to default
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toggle bar */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-2 text-xs text-gray-400 hover:text-gray-200 hover:bg-gray-800/40 transition-colors"
      >
        <div className="flex items-center gap-2">
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
          <span>Edit Input</span>
          {error && <span className="text-red-400">· error</span>}
        </div>
        <svg
          className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
    </div>
  );
}
