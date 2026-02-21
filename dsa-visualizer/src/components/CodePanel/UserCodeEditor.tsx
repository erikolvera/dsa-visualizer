import { useState, useRef, useCallback } from 'react';
import { Highlight, themes, type Language as PrismLang } from 'prism-react-renderer';
import type { Problem } from '../../types';
import { useProblemStore } from '../../store/useProblemStore';
import { runUserCode } from '../../utils/testRunner';
import type { RunResult } from '../../utils/testRunner';

interface UserCodeEditorProps {
  problem: Problem;
}

const LANGUAGE_MAP: Record<string, PrismLang> = {
  python: 'python',
  javascript: 'javascript',
  java: 'java',
  cpp: 'cpp',
};

const FONT = "'JetBrains Mono', 'Fira Code', Consolas, monospace";

export function UserCodeEditor({ problem }: UserCodeEditorProps) {
  const { language } = useProblemStore();
  const [code, setCode] = useState<string>(problem.starterCode[language]);
  const [results, setResults] = useState<RunResult[] | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);

  // Keep starter code in sync when language changes
  const prevLanguageRef = useRef(language);
  if (prevLanguageRef.current !== language) {
    prevLanguageRef.current = language;
    setCode(problem.starterCode[language]);
    setResults(null);
  }

  const handleScroll = useCallback(() => {
    if (preRef.current && textareaRef.current) {
      preRef.current.scrollTop = textareaRef.current.scrollTop;
      preRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const ta = e.currentTarget;
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const indent = '    ';
      const newCode = code.substring(0, start) + indent + code.substring(end);
      setCode(newCode);
      requestAnimationFrame(() => {
        ta.selectionStart = ta.selectionEnd = start + indent.length;
      });
    }
  }, [code]);

  const handleRun = useCallback(() => {
    setIsRunning(true);
    setResults(null);
    setTimeout(() => {
      const r = runUserCode(code, problem.testRunner);
      setResults(r);
      setIsRunning(false);
    }, 50);
  }, [code, problem.testRunner]);

  const passed = results ? results.filter((r) => r.passed).length : 0;
  const total = results ? results.length : 0;
  const allPassed = results !== null && passed === total;

  return (
    <div className="flex flex-col h-full">
      {/* Editor area */}
      <div className="flex-1 min-h-0 relative overflow-hidden">
        {/* Prism highlighted background */}
        <Highlight
          theme={themes.vsDark}
          code={code || ' '}
          language={LANGUAGE_MAP[language] ?? 'python'}
        >
          {({ style, tokens, getLineProps, getTokenProps }) => (
            <pre
              ref={preRef}
              aria-hidden
              className="absolute inset-0 overflow-auto m-0 py-4 px-4 text-sm leading-6 pointer-events-none"
              style={{
                ...style,
                background: 'transparent',
                fontFamily: FONT,
                tabSize: 4,
                whiteSpace: 'pre',
              }}
            >
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({ line })}>
                  <span className="select-none w-10 pr-3 text-right text-xs leading-6 text-gray-600 inline-block shrink-0">
                    {i + 1}
                  </span>
                  {line.map((token, j) => (
                    <span key={j} {...getTokenProps({ token })} />
                  ))}
                </div>
              ))}
            </pre>
          )}
        </Highlight>

        {/* Transparent textarea on top */}
        <textarea
          ref={textareaRef}
          value={code}
          onChange={(e) => { setCode(e.target.value); setResults(null); }}
          onKeyDown={handleKeyDown}
          onScroll={handleScroll}
          spellCheck={false}
          autoCorrect="off"
          autoCapitalize="off"
          className="absolute inset-0 w-full h-full resize-none bg-transparent outline-none py-4 text-sm leading-6"
          style={{
            fontFamily: FONT,
            tabSize: 4,
            color: 'transparent',
            caretColor: '#60a5fa',
            paddingLeft: '3rem', // match the line-number width
            whiteSpace: 'pre',
            overflowWrap: 'normal',
          }}
        />
      </div>

      {/* Run button bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-t border-gray-700 bg-gray-900/60 shrink-0">
        <div className="text-xs text-gray-500">
          {language === 'python' || language === 'javascript'
            ? 'Write your solution above and click Run'
            : 'Note: only JS & Python are executable in the browser'}
        </div>
        <button
          onClick={handleRun}
          disabled={isRunning || (language !== 'javascript' && language !== 'python')}
          className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isRunning ? (
            <>
              <span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin inline-block" />
              Running…
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
              Run Code
            </>
          )}
        </button>
      </div>

      {/* Test results */}
      {results && (
        <div className="shrink-0 border-t border-gray-700 bg-gray-950">
          {/* Summary bar */}
          <div className={`flex items-center gap-2 px-4 py-2 border-b border-gray-800 text-sm font-medium ${
            allPassed ? 'text-emerald-400' : 'text-red-400'
          }`}>
            {allPassed ? (
              <>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
                All {total} tests passed
              </>
            ) : (
              <>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
                {passed}/{total} tests passed
              </>
            )}
          </div>

          {/* Individual results */}
          <div className="max-h-40 overflow-y-auto">
            {results.map((r, i) => (
              <div key={i} className="flex items-start gap-3 px-4 py-2.5 border-b border-gray-800/50 last:border-0">
                <span className={`shrink-0 mt-0.5 text-sm ${r.passed ? 'text-emerald-400' : 'text-red-400'}`}>
                  {r.passed ? '✓' : '✗'}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-medium text-gray-300">{r.label}</span>
                    {r.runtime !== undefined && (
                      <span className="text-[10px] text-gray-600">{r.runtime}ms</span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 font-mono truncate">
                    Input: {r.inputDisplay}
                  </div>
                  {r.error ? (
                    <div className="text-xs text-red-400 font-mono mt-0.5 break-all">{r.error}</div>
                  ) : !r.passed ? (
                    <div className="text-xs font-mono mt-0.5">
                      <span className="text-gray-500">Expected: </span>
                      <span className="text-emerald-400">{r.expectedDisplay}</span>
                      <span className="text-gray-600 mx-1">·</span>
                      <span className="text-gray-500">Got: </span>
                      <span className="text-red-400">{r.got}</span>
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
