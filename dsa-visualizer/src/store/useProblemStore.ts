import { create } from 'zustand';
import type { Language, Step } from '../types';

interface ProblemStore {
  currentProblemId: string | null;
  steps: Step[];
  stepIndex: number;
  isPlaying: boolean;
  speed: number; // 0.5 | 1 | 2
  language: Language;

  setProblem: (problemId: string, steps: Step[]) => void;
  setSteps: (steps: Step[]) => void;
  setStepIndex: (index: number) => void;
  setLanguage: (lang: Language) => void;
  setIsPlaying: (playing: boolean) => void;
  setSpeed: (speed: number) => void;
  stepForward: () => void;
  stepBackward: () => void;
  resetPlayback: () => void;
}

export const useProblemStore = create<ProblemStore>((set) => ({
  currentProblemId: null,
  steps: [],
  stepIndex: 0,
  isPlaying: false,
  speed: 1,
  language: 'python',

  setProblem: (problemId, steps) =>
    set({ currentProblemId: problemId, steps, stepIndex: 0, isPlaying: false }),

  setSteps: (steps) => set({ steps, stepIndex: 0, isPlaying: false }),

  setStepIndex: (index) => set({ stepIndex: index }),

  setLanguage: (language) => set({ language }),

  setIsPlaying: (isPlaying) => set({ isPlaying }),

  setSpeed: (speed) => set({ speed }),

  stepForward: () =>
    set((state) => ({
      stepIndex: Math.min(state.stepIndex + 1, state.steps.length - 1),
    })),

  stepBackward: () =>
    set((state) => ({
      stepIndex: Math.max(state.stepIndex - 1, 0),
    })),

  resetPlayback: () => set({ stepIndex: 0, isPlaying: false }),
}));
