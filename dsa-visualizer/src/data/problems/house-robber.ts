import type { Problem, Step } from '../../types';

export interface HouseRobberVisualState {
  houses: number[];
  dp: (number | null)[];
  currentIndex: number | null;
  maxLoot: number;
  phase: 'init' | 'filling' | 'done';
  robbed: boolean | null; // did we rob currentIndex?
}

export function generateHouseRobberSteps(input: Record<string, unknown>): Step[] {
  const houses = (input.houses as number[]) ?? [2, 7, 9, 3, 1];
  const n = houses.length;
  const steps: Step[] = [];
  const dp: (number | null)[] = new Array(n).fill(null);

  steps.push({
    stepIndex: 0,
    description: `House Robber on [${houses.join(', ')}]. dp[i] = max loot we can collect from houses 0..i without robbing two adjacent houses. Recurrence: dp[i] = max(dp[i−1], dp[i−2] + houses[i]).`,
    highlightLines: { python: [2, 3], javascript: [2, 3], java: [3, 4], cpp: [8, 9] },
    visualState: { houses, dp: [...dp], currentIndex: null, maxLoot: 0, phase: 'init', robbed: null } satisfies HouseRobberVisualState,
  });

  // Base cases
  dp[0] = houses[0];
  steps.push({
    stepIndex: steps.length,
    description: `Base case: dp[0] = houses[0] = ${houses[0]}. Only one house — rob it.`,
    highlightLines: { python: [4, 5], javascript: [4, 5], java: [5, 6], cpp: [10, 11] },
    visualState: { houses, dp: [...dp], currentIndex: 0, maxLoot: dp[0], phase: 'filling', robbed: true } satisfies HouseRobberVisualState,
  });

  if (n === 1) {
    steps.push({
      stepIndex: steps.length,
      description: `Only one house — answer is ${dp[0]}. Return ${dp[0]}.`,
      highlightLines: { python: [10], javascript: [11], java: [12], cpp: [15] },
      visualState: { houses, dp: [...dp], currentIndex: 0, maxLoot: dp[0]!, phase: 'done', robbed: null } satisfies HouseRobberVisualState,
    });
    return steps;
  }

  dp[1] = Math.max(houses[0], houses[1]);
  const robbedHouse1 = houses[1] > houses[0];
  steps.push({
    stepIndex: steps.length,
    description: `Base case: dp[1] = max(houses[0], houses[1]) = max(${houses[0]}, ${houses[1]}) = ${dp[1]}. Rob the more valuable of the first two houses.`,
    highlightLines: { python: [6, 7], javascript: [6, 7], java: [7, 8], cpp: [12, 13] },
    visualState: { houses, dp: [...dp], currentIndex: 1, maxLoot: dp[1], phase: 'filling', robbed: robbedHouse1 } satisfies HouseRobberVisualState,
  });

  for (let i = 2; i < n; i++) {
    const skipCurrent = dp[i - 1]!;
    const robCurrent = dp[i - 2]! + houses[i];
    dp[i] = Math.max(skipCurrent, robCurrent);
    const robbed = robCurrent > skipCurrent;

    steps.push({
      stepIndex: steps.length,
      description: `i=${i} (house=${houses[i]}): skip → dp[${i-1}]=${skipCurrent}; rob → dp[${i-2}]+${houses[i]}=${robCurrent}. dp[${i}] = max(${skipCurrent}, ${robCurrent}) = ${dp[i]}. ${robbed ? `Rob house ${i}!` : `Skip house ${i}.`}`,
      highlightLines: { python: [8, 9], javascript: [8, 9, 10], java: [9, 10, 11], cpp: [14, 15] },
      visualState: { houses, dp: [...dp], currentIndex: i, maxLoot: dp[i]!, phase: 'filling', robbed } satisfies HouseRobberVisualState,
    });
  }

  const result = dp[n - 1]!;
  steps.push({
    stepIndex: steps.length,
    description: `All houses evaluated. Maximum loot = dp[${n-1}] = ${result}. Return ${result}.`,
    highlightLines: { python: [10], javascript: [11], java: [12], cpp: [15] },
    visualState: { houses, dp: [...dp], currentIndex: null, maxLoot: result, phase: 'done', robbed: null } satisfies HouseRobberVisualState,
  });

  return steps;
}

export const houseRobber: Problem = {
  id: 'house-robber',
  title: 'House Robber',
  category: 'Dynamic Programming',
  difficulty: 'Medium',
  description:
    'You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed. The only constraint stopping you from robbing each of them is that adjacent houses have security systems connected, and it will automatically contact the police if two adjacent houses were broken into on the same night. Given an integer array nums representing the amount of money of each house, return the maximum amount of money you can rob tonight without alerting the police.',
  examples: [
    { input: 'nums = [1,2,3,1]', output: '4' },
    { input: 'nums = [2,7,9,3,1]', output: '12' },
  ],
  defaultInput: { houses: [2, 7, 9, 3, 1] },
  generateSteps: generateHouseRobberSteps,
  testRunner: {
    setup: '',
    cases: [
      { label: 'Example 1', inputDisplay: '[1,2,3,1]',   callExpression: 'rob([1,2,3,1])',   expectedDisplay: '4',  expectedValue: 4  },
      { label: 'Example 2', inputDisplay: '[2,7,9,3,1]', callExpression: 'rob([2,7,9,3,1])', expectedDisplay: '12', expectedValue: 12 },
      { label: 'Two houses', inputDisplay: '[2,1]',       callExpression: 'rob([2,1])',        expectedDisplay: '2',  expectedValue: 2  },
    ],
  },
  starterCode: {
    python: `def rob(nums: list[int]) -> int:
    pass`,
    javascript: `function rob(nums) {

}`,
    java: `class Solution {
    public int rob(int[] nums) {

    }
}`,
    cpp: `class Solution {
public:
    int rob(vector<int>& nums) {

    }
};`,
  },
  solutions: {
    python: {
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      code: `def rob(nums: list[int]) -> int:
    if len(nums) == 1:
        return nums[0]
    prev2 = nums[0]
    prev1 = max(nums[0], nums[1])
    for i in range(2, len(nums)):
        curr = max(prev1, prev2 + nums[i])
        prev2, prev1 = prev1, curr
    return prev1`,
    },
    javascript: {
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      code: `function rob(nums) {
    if (nums.length === 1) return nums[0];
    let prev2 = nums[0];
    let prev1 = Math.max(nums[0], nums[1]);
    for (let i = 2; i < nums.length; i++) {
        const curr = Math.max(prev1, prev2 + nums[i]);
        prev2 = prev1;
        prev1 = curr;
    }
    return prev1;
}`,
    },
    java: {
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      code: `class Solution {
    public int rob(int[] nums) {
        if (nums.length == 1) return nums[0];
        int prev2 = nums[0];
        int prev1 = Math.max(nums[0], nums[1]);
        for (int i = 2; i < nums.length; i++) {
            int curr = Math.max(prev1, prev2 + nums[i]);
            prev2 = prev1;
            prev1 = curr;
        }
        return prev1;
    }
}`,
    },
    cpp: {
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      code: `class Solution {
public:
    int rob(vector<int>& nums) {
        if (nums.size() == 1) return nums[0];
        int prev2 = nums[0];
        int prev1 = max(nums[0], nums[1]);
        for (int i = 2; i < (int)nums.size(); i++) {
            int curr = max(prev1, prev2 + nums[i]);
            prev2 = prev1;
            prev1 = curr;
        }
        return prev1;
    }
};`,
    },
  },
};
