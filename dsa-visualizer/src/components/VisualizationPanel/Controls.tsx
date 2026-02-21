import { useProblemStore } from '../../store/useProblemStore';

export function Controls() {
  const {
    stepIndex, steps, isPlaying, speed,
    setIsPlaying, setSpeed, stepForward, stepBackward, resetPlayback,
  } = useProblemStore();

  const totalSteps = steps.length;
  const atStart = stepIndex === 0;
  const atEnd = stepIndex === totalSteps - 1;
  const SPEEDS = [0.5, 1, 2];

  return (
    <div className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-700 bg-gray-900/40 shrink-0">
      {/* Reset */}
      <button onClick={resetPlayback} disabled={atStart} title="Reset"
        className="p-2 rounded text-gray-400 hover:text-gray-100 hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
          <path d="M3 3v5h5" />
        </svg>
      </button>

      {/* Step backward */}
      <button onClick={stepBackward} disabled={atStart} title="Step backward"
        className="p-2 rounded text-gray-400 hover:text-gray-100 hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z" />
        </svg>
      </button>

      {/* Play / Pause */}
      <button onClick={() => setIsPlaying(!isPlaying)} disabled={atEnd} title={isPlaying ? 'Pause' : 'Play'}
        className="p-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
        {isPlaying ? (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
          </svg>
        ) : (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>

      {/* Step forward */}
      <button onClick={stepForward} disabled={atEnd} title="Step forward"
        className="p-2 rounded text-gray-400 hover:text-gray-100 hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M6 18l8.5-6L6 6v12zm2.5-6 5.5 3.9V8.1L8.5 12zM16 6h2v12h-2z" />
        </svg>
      </button>

      <div className="w-px h-5 bg-gray-600 mx-1" />

      {/* Speed selector */}
      <div className="flex items-center gap-1">
        <span className="text-sm text-gray-400 mr-1">Speed</span>
        {SPEEDS.map((s) => (
          <button key={s} onClick={() => setSpeed(s)}
            className={`px-2.5 py-1 rounded text-sm font-medium transition-colors ${
              speed === s
                ? 'bg-blue-600/30 text-blue-300 border border-blue-500/50'
                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
            }`}
          >
            {s}x
          </button>
        ))}
      </div>

      {/* Step counter */}
      <div className="ml-auto text-sm text-gray-400 font-medium">
        {stepIndex + 1} / {totalSteps}
      </div>
    </div>
  );
}
