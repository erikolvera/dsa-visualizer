import type { Problem, Step } from '../../types';

export interface ClimbingStairsVisualState {
  n: number;
  dp: (number | null)[];
  currentStep: number | null;
  phase: 'init' | 'filling' | 'done';
  result: number | null;
}

export function generateClimbingStairsSteps(input: Record<string, unknown>): Step[] {
  const n = (input.n as number) ?? 5;
  const steps: Step[] = [];
  const dp: (number | null)[] = new Array(n + 1).fill(null);

  steps.push({
    stepIndex: 0,
    description: `Count distinct ways to climb ${n} stairs (1 or 2 steps at a time). We use dynamic programming: dp[i] = number of ways to reach stair i. Base cases: dp[1]=1, dp[2]=2.`,
    highlightLines: [2, 3],
    visualState: {
      n, dp: [...dp], currentStep: null, phase: 'init', result: null,
    } satisfies ClimbingStairsVisualState,
  });

  if (n === 1) {
    dp[1] = 1;
    steps.push({
      stepIndex: steps.length,
      description: 'n=1: only one way to reach the top — take 1 step. Return 1.',
      highlightLines: [4, 5],
      visualState: { n, dp: [...dp], currentStep: 1, phase: 'done', result: 1 } satisfies ClimbingStairsVisualState,
    });
    return steps;
  }

  dp[1] = 1;
  dp[2] = 2;

  steps.push({
    stepIndex: steps.length,
    description: 'Base cases: dp[1] = 1 (only one way: take 1 step), dp[2] = 2 (ways: {1+1} or {2}).',
    highlightLines: [4, 5, 6],
    visualState: {
      n, dp: [...dp], currentStep: 2, phase: 'filling', result: null,
    } satisfies ClimbingStairsVisualState,
  });

  for (let i = 3; i <= n; i++) {
    dp[i] = dp[i - 1]! + dp[i - 2]!;
    steps.push({
      stepIndex: steps.length,
      description: `dp[${i}] = dp[${i - 1}] + dp[${i - 2}] = ${dp[i - 1]} + ${dp[i - 2]} = ${dp[i]}. (From stair ${i} you could have come from stair ${i - 1} or ${i - 2}.)`,
      highlightLines: [7, 8],
      visualState: {
        n, dp: [...dp], currentStep: i, phase: 'filling', result: null,
      } satisfies ClimbingStairsVisualState,
    });
  }

  steps.push({
    stepIndex: steps.length,
    description: `dp[${n}] = ${dp[n]}. There are ${dp[n]} distinct ways to climb ${n} stairs. Return ${dp[n]}.`,
    highlightLines: [9],
    visualState: {
      n, dp: [...dp], currentStep: n, phase: 'done', result: dp[n]!,
    } satisfies ClimbingStairsVisualState,
  });

  return steps;
}

export const climbingStairs: Problem = {
  id: 'climbing-stairs',
  title: 'Climbing Stairs',
  category: 'Dynamic Programming',
  difficulty: 'Easy',
  description:
    'You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?',
  examples: [
    { input: 'n = 2', output: '2' },
    { input: 'n = 3', output: '3' },
  ],
  defaultInput: { n: 5 },
  generateSteps: generateClimbingStairsSteps,
  solution: {
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    code: `def climbStairs(n: int) -> int:
    if n == 1:
        return 1
    dp = [0] * (n + 1)
    dp[1] = 1
    dp[2] = 2
    for i in range(3, n + 1):
        dp[i] = dp[i - 1] + dp[i - 2]
    return dp[n]`,
  },
};
