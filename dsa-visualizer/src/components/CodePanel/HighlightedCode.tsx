import { Highlight, themes, type Language as PrismLang } from 'prism-react-renderer';

interface HighlightedCodeProps {
  code: string;
  language: string;
  highlightLines: number[];
}

const LANGUAGE_MAP: Record<string, PrismLang> = {
  python: 'python',
  javascript: 'javascript',
  java: 'java',
  cpp: 'cpp',
};

export function HighlightedCode({ code, language, highlightLines }: HighlightedCodeProps) {
  const prismLang = LANGUAGE_MAP[language] ?? 'python';
  const highlightSet = new Set(highlightLines);

  return (
    <Highlight theme={themes.vsDark} code={code.trim()} language={prismLang}>
      {({ style, tokens, getLineProps, getTokenProps }) => (
        <pre
          className="text-sm leading-6 overflow-auto flex-1 py-4"
          style={{
            ...style,
            background: 'transparent',
            margin: 0,
            fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
          }}
        >
          {tokens.map((line, lineIndex) => {
            const lineNumber = lineIndex + 1;
            const isHighlighted = highlightSet.has(lineNumber);
            const lineProps = getLineProps({ line });

            return (
              <div
                key={lineIndex}
                {...lineProps}
                className={`flex transition-all duration-200 ${
                  isHighlighted ? 'highlight-line' : 'normal-line'
                }`}
              >
                {/* Line number */}
                <span
                  className={`
                    select-none shrink-0 w-10 pr-3 text-right text-xs leading-6
                    ${isHighlighted ? 'text-yellow-400/80' : 'text-gray-600'}
                  `}
                >
                  {lineNumber}
                </span>

                {/* Code tokens */}
                <span className="flex-1">
                  {line.map((token, tokenIndex) => (
                    <span key={tokenIndex} {...getTokenProps({ token })} />
                  ))}
                </span>
              </div>
            );
          })}
        </pre>
      )}
    </Highlight>
  );
}
