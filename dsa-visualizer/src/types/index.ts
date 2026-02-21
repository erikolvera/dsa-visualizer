export type Language = 'python' | 'javascript' | 'java' | 'cpp';
export type Difficulty = 'Easy' | 'Medium' | 'Hard';
export type Category = 'Arrays' | 'Binary Search' | 'Linked Lists' | 'Stacks' | 'Trees' | 'Dynamic Programming' | 'Sorting';

export interface HighlightLines {
  python: number[];
  javascript: number[];
  java: number[];
  cpp: number[];
}

export interface Step {
  stepIndex: number;
  description: string;
  highlightLines: HighlightLines;
  visualState: Record<string, unknown>;
}

export interface Solution {
  code: string;
  timeComplexity: string;
  spaceComplexity: string;
}

export interface TestCase {
  label: string;
  inputDisplay: string;
  expectedDisplay: string;
  expectedValue: unknown;
  // JS expression that calls the function and returns the value to compare
  // Has full access to setup helpers. E.g. "twoSum([2,7,11,15], 9)"
  callExpression: string;
}

export interface ProblemTestRunner {
  setup: string;   // helper code injected before user code (e.g. ListNode class)
  cases: TestCase[];
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
  starterCode: Record<Language, string>;
  testRunner: ProblemTestRunner;
  solutions: Record<Language, Solution>;
}
