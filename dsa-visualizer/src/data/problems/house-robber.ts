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
    highlightLines: [2, 3],
    visualState: { houses, dp: [...dp], currentIndex: null, maxLoot: 0, phase: 'init', robbed: null } satisfies HouseRobberVisualState,
  });

  // Base cases
  dp[0] = houses[0];
  steps.push({
    stepIndex: steps.length,
    description: `Base case: dp[0] = houses[0] = ${houses[0]}. Only one house — rob it.`,
    highlightLines: [4, 5],
    visualState: { houses, dp: [...dp], currentIndex: 0, maxLoot: dp[0], phase: 'filling', robbed: true } satisfies HouseRobberVisualState,
  });

  if (n === 1) {
    steps.push({
      stepIndex: steps.length,
      description: `Only one house — answer is ${dp[0]}. Return ${dp[0]}.`,
      highlightLines: [10],
      visualState: { houses, dp: [...dp], currentIndex: 0, maxLoot: dp[0]!, phase: 'done', robbed: null } satisfies HouseRobberVisualState,
    });
    return steps;
  }

  dp[1] = Math.max(houses[0], houses[1]);
  const robbedHouse1 = houses[1] > houses[0];
  steps.push({
    stepIndex: steps.length,
    description: `Base case: dp[1] = max(houses[0], houses[1]) = max(${houses[0]}, ${houses[1]}) = ${dp[1]}. Rob the more valuable of the first two houses.`,
    highlightLines: [6, 7],
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
      highlightLines: [8, 9],
      visualState: { houses, dp: [...dp], currentIndex: i, maxLoot: dp[i]!, phase: 'filling', robbed } satisfies HouseRobberVisualState,
    });
  }

  const result = dp[n - 1]!;
  steps.push({
    stepIndex: steps.length,
    description: `All houses evaluated. Maximum loot = dp[${n-1}] = ${result}. Return ${result}.`,
    highlightLines: [10],
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
  solution: {
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
};
