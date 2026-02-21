import type { Language } from '../../types';
import { useProblemStore } from '../../store/useProblemStore';

const LANGUAGES: Array<{ id: Language; label: string }> = [
  { id: 'python', label: 'Python' },
  { id: 'javascript', label: 'JavaScript' },
  { id: 'java', label: 'Java' },
  { id: 'cpp', label: 'C++' },
];

export function LanguageSelector() {
  const { language, setLanguage } = useProblemStore();

  return (
    <div className="flex items-center gap-1 p-1 bg-gray-900 rounded-lg border border-gray-800">
      {LANGUAGES.map(({ id, label }) => (
        <button
          key={id}
          onClick={() => setLanguage(id)}
          className={`
            px-3 py-1.5 rounded text-xs font-medium transition-all duration-150
            ${language === id
              ? 'bg-blue-600/30 text-blue-300 border border-blue-500/50 shadow-sm'
              : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800/60'}
          `}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
