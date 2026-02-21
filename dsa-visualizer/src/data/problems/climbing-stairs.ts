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
    highlightLines: { python: [2, 3], javascript: [2, 3], java: [3, 4], cpp: [8, 9] },
    visualState: {
      n, dp: [...dp], currentStep: null, phase: 'init', result: null,
    } satisfies ClimbingStairsVisualState,
  });

  if (n === 1) {
    dp[1] = 1;
    steps.push({
      stepIndex: steps.length,
      description: 'n=1: only one way to reach the top — take 1 step. Return 1.',
      highlightLines: { python: [4, 5], javascript: [4, 5], java: [5, 6], cpp: [10, 11] },
      visualState: { n, dp: [...dp], currentStep: 1, phase: 'done', result: 1 } satisfies ClimbingStairsVisualState,
    });
    return steps;
  }

  dp[1] = 1;
  dp[2] = 2;

  steps.push({
    stepIndex: steps.length,
    description: 'Base cases: dp[1] = 1 (only one way: take 1 step), dp[2] = 2 (ways: {1+1} or {2}).',
    highlightLines: { python: [4, 5, 6], javascript: [4, 5, 6], java: [5, 6, 7], cpp: [10, 11, 12] },
    visualState: {
      n, dp: [...dp], currentStep: 2, phase: 'filling', result: null,
    } satisfies ClimbingStairsVisualState,
  });

  for (let i = 3; i <= n; i++) {
    dp[i] = dp[i - 1]! + dp[i - 2]!;
    steps.push({
      stepIndex: steps.length,
      description: `dp[${i}] = dp[${i - 1}] + dp[${i - 2}] = ${dp[i - 1]} + ${dp[i - 2]} = ${dp[i]}. (From stair ${i} you could have come from stair ${i - 1} or ${i - 2}.)`,
      highlightLines: { python: [7, 8], javascript: [7, 8], java: [8, 9], cpp: [13, 14] },
      visualState: {
        n, dp: [...dp], currentStep: i, phase: 'filling', result: null,
      } satisfies ClimbingStairsVisualState,
    });
  }

  steps.push({
    stepIndex: steps.length,
    description: `dp[${n}] = ${dp[n]}. There are ${dp[n]} distinct ways to climb ${n} stairs. Return ${dp[n]}.`,
    highlightLines: { python: [9], javascript: [10], java: [11], cpp: [15] },
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
  testRunner: {
    setup: '',
    cases: [
      { label: 'n = 2', inputDisplay: 'n = 2', callExpression: 'climbStairs(2)', expectedDisplay: '2', expectedValue: 2 },
      { label: 'n = 3', inputDisplay: 'n = 3', callExpression: 'climbStairs(3)', expectedDisplay: '3', expectedValue: 3 },
      { label: 'n = 5', inputDisplay: 'n = 5', callExpression: 'climbStairs(5)', expectedDisplay: '8', expectedValue: 8 },
    ],
  },
  starterCode: {
    python: `def climbStairs(n: int) -> int:
    pass`,
    javascript: `function climbStairs(n) {

}`,
    java: `class Solution {
    public int climbStairs(int n) {

    }
}`,
    cpp: `class Solution {
public:
    int climbStairs(int n) {

    }
};`,
  },
  solutions: {
    python: {
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
    javascript: {
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
      code: `function climbStairs(n) {
    if (n === 1) return 1;
    const dp = new Array(n + 1).fill(0);
    dp[1] = 1;
    dp[2] = 2;
    for (let i = 3; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    return dp[n];
}`,
    },
    java: {
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
      code: `class Solution {
    public int climbStairs(int n) {
        if (n == 1) return 1;
        int[] dp = new int[n + 1];
        dp[1] = 1;
        dp[2] = 2;
        for (int i = 3; i <= n; i++) {
            dp[i] = dp[i - 1] + dp[i - 2];
        }
        return dp[n];
    }
}`,
    },
    cpp: {
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
      code: `class Solution {
public:
    int climbStairs(int n) {
        if (n == 1) return 1;
        vector<int> dp(n + 1, 0);
        dp[1] = 1;
        dp[2] = 2;
        for (int i = 3; i <= n; i++) {
            dp[i] = dp[i - 1] + dp[i - 2];
        }
        return dp[n];
    }
};`,
    },
  },
};
