import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { ProblemPage } from './components/ProblemPage';
import { SmallScreenNotice } from './components/SmallScreenNotice';
import { useIsSmallScreen } from './hooks/useIsSmallScreen';
import { problemsById, problems } from './data';

export default function App() {
  const isSmall = useIsSmallScreen();
  const [selectedId, setSelectedId] = useState<string>(problems[0].id);
  const [sidebarOpen, setSidebarOpen] = useState(() => !isSmall);

  // Collapse when the viewport crosses into small widths. Adjusted during render
  // rather than in an effect to avoid a cascading re-render. Deliberately
  // one-way: re-opening on the way back up would override a user's own toggle.
  const [prevIsSmall, setPrevIsSmall] = useState(isSmall);
  if (isSmall !== prevIsSmall) {
    setPrevIsSmall(isSmall);
    if (isSmall) setSidebarOpen(false);
  }

  const selectedProblem = problemsById[selectedId];

  return (
    <div className="dark flex h-screen overflow-hidden bg-gray-950 text-gray-100">
      <Sidebar
        selectedId={selectedId}
        onSelect={setSelectedId}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen((v) => !v)}
      />

      <main className="flex-1 min-w-0 overflow-hidden flex flex-col">
        {selectedProblem ? (
          <ProblemPage key={selectedId} problem={selectedProblem} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a problem from the sidebar
          </div>
        )}
      </main>

      <SmallScreenNotice />
    </div>
  );
}
