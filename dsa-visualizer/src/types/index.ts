export type Difficulty = 'Easy' | 'Medium' | 'Hard';
export type Category = 'Arrays' | 'Binary Search' | 'Linked Lists' | 'Stacks' | 'Trees' | 'Dynamic Programming' | 'Sorting';

export interface Step {
  stepIndex: number;
  description: string;
  highlightLines: number[];
  visualState: Record<string, unknown>;
}

export interface Solution {
  code: string;
  timeComplexity: string;
  spaceComplexity: string;
}

export interface Problem {
  id: string;
  title: string;
  category: Category;
  difficulty: Difficulty;
  description: string;
  examples: Array<{ input: string; output: string }>;
  defaultInput: Record<string, unknown>;
  generateSteps: (input: Record<string, unknown>) => Step[];
  solution: Solution;
}
