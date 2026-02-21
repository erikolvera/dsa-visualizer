import type { Problem, Step } from '../../types';

export interface MaxSubarrayVisualState {
  nums: number[];
  currentIndex: number | null;
  currentSum: number;
  maxSum: number;
  subarrayStart: number;
  subarrayEnd: number;
  maxStart: number;
  maxEnd: number;
  phase: 'init' | 'extending' | 'restarting' | 'done';
}

export function generateMaxSubarraySteps(input: Record<string, unknown>): Step[] {
  const nums = (input.nums as number[]) ?? [-2, 1, -3, 4, -1, 2, 1, -5, 4];
  const steps: Step[] = [];

  if (nums.length === 0) {
    steps.push({
      stepIndex: 0,
      description: 'Empty array — return 0.',
      highlightLines: { python: [2], javascript: [2], java: [3], cpp: [7] },
      visualState: { nums: [], currentIndex: null, currentSum: 0, maxSum: 0, subarrayStart: 0, subarrayEnd: 0, maxStart: 0, maxEnd: 0, phase: 'done' } satisfies MaxSubarrayVisualState,
    });
    return steps;
  }

  let currentSum = nums[0];
  let maxSum = nums[0];
  let subarrayStart = 0;
  let subarrayEnd = 0;
  let maxStart = 0;
  let maxEnd = 0;

  steps.push({
    stepIndex: 0,
    description: `Kadane's Algorithm: initialize current_sum = max_sum = nums[0] = ${nums[0]}. The subarray [${nums[0]}] is our starting candidate.`,
    highlightLines: { python: [2, 3], javascript: [2, 3], java: [3, 4], cpp: [7, 8] },
    visualState: { nums, currentIndex: 0, currentSum, maxSum, subarrayStart: 0, subarrayEnd: 0, maxStart: 0, maxEnd: 0, phase: 'init' } satisfies MaxSubarrayVisualState,
  });

  for (let i = 1; i < nums.length; i++) {
    const extendSum = currentSum + nums[i];
    const extending = extendSum >= nums[i];

    if (extending) {
      currentSum = extendSum;
      subarrayEnd = i;
      steps.push({
        stepIndex: steps.length,
        description: `nums[${i}] = ${nums[i]}. Extending is better: ${currentSum - nums[i]} + ${nums[i]} = ${currentSum} ≥ ${nums[i]}. Extend subarray → [${nums.slice(subarrayStart, subarrayEnd + 1).join(', ')}].`,
        highlightLines: { python: [4, 5], javascript: [4, 5], java: [5, 6], cpp: [10, 11] },
        visualState: { nums, currentIndex: i, currentSum, maxSum, subarrayStart, subarrayEnd, maxStart, maxEnd, phase: 'extending' } satisfies MaxSubarrayVisualState,
      });
    } else {
      subarrayStart = i;
      subarrayEnd = i;
      currentSum = nums[i];
      steps.push({
        stepIndex: steps.length,
        description: `nums[${i}] = ${nums[i]}. Restarting is better: ${nums[i]} > ${extendSum}. Start a fresh subarray at index ${i}.`,
        highlightLines: { python: [4, 5], javascript: [4, 5], java: [5, 6], cpp: [10, 11] },
        visualState: { nums, currentIndex: i, currentSum, maxSum, subarrayStart, subarrayEnd, maxStart, maxEnd, phase: 'restarting' } satisfies MaxSubarrayVisualState,
      });
    }

    if (currentSum > maxSum) {
      maxSum = currentSum;
      maxStart = subarrayStart;
      maxEnd = subarrayEnd;
      steps.push({
        stepIndex: steps.length,
        description: `New maximum! current_sum = ${maxSum}. Max subarray is now [${nums.slice(maxStart, maxEnd + 1).join(', ')}].`,
        highlightLines: { python: [6], javascript: [6], java: [7], cpp: [12] },
        visualState: { nums, currentIndex: i, currentSum, maxSum, subarrayStart, subarrayEnd, maxStart, maxEnd, phase: 'extending' } satisfies MaxSubarrayVisualState,
      });
    }
  }

  steps.push({
    stepIndex: steps.length,
    description: `Done! Maximum subarray: [${nums.slice(maxStart, maxEnd + 1).join(', ')}] (indices ${maxStart}–${maxEnd}), sum = ${maxSum}. Return ${maxSum}.`,
    highlightLines: { python: [7], javascript: [8], java: [9], cpp: [14] },
    visualState: { nums, currentIndex: null, currentSum, maxSum, subarrayStart: maxStart, subarrayEnd: maxEnd, maxStart, maxEnd, phase: 'done' } satisfies MaxSubarrayVisualState,
  });

  return steps;
}

export const maximumSubarray: Problem = {
  id: 'maximum-subarray',
  title: 'Maximum Subarray',
  category: 'Arrays',
  difficulty: 'Medium',
  description:
    "Given an integer array nums, find the subarray with the largest sum, and return its sum. A subarray is a contiguous non-empty sequence of elements within an array.",
  examples: [
    { input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', output: '6' },
    { input: 'nums = [1]', output: '1' },
  ],
  defaultInput: { nums: [-2, 1, -3, 4, -1, 2, 1, -5, 4] },
  generateSteps: generateMaxSubarraySteps,
  testRunner: {
    setup: '',
    cases: [
      { label: 'Example 1', inputDisplay: '[-2,1,-3,4,-1,2,1,-5,4]', callExpression: 'maxSubArray([-2,1,-3,4,-1,2,1,-5,4])', expectedDisplay: '6',  expectedValue: 6  },
      { label: 'Example 2', inputDisplay: '[1]',                      callExpression: 'maxSubArray([1])',                      expectedDisplay: '1',  expectedValue: 1  },
      { label: 'Example 3', inputDisplay: '[5,4,-1,7,8]',             callExpression: 'maxSubArray([5,4,-1,7,8])',             expectedDisplay: '23', expectedValue: 23 },
    ],
  },
  starterCode: {
    python: `def maxSubArray(nums: list[int]) -> int:
    pass`,
    javascript: `function maxSubArray(nums) {

}`,
    java: `class Solution {
    public int maxSubArray(int[] nums) {

    }
}`,
    cpp: `class Solution {
public:
    int maxSubArray(vector<int>& nums) {

    }
};`,
  },
  solutions: {
    python: {
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      code: `def maxSubArray(nums: list[int]) -> int:
    max_sum = nums[0]      # best subarray sum seen
    current_sum = nums[0]  # best sum ending at current position
    for num in nums[1:]:
        current_sum = max(num, current_sum + num)  # extend or restart
        max_sum = max(max_sum, current_sum)        # update global best
    return max_sum`,
    },
    javascript: {
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      code: `function maxSubArray(nums) {
    let maxSum = nums[0];       // best subarray sum seen
    let currentSum = nums[0];   // best sum ending at current position
    for (let i = 1; i < nums.length; i++) {
        currentSum = Math.max(nums[i], currentSum + nums[i]); // extend or restart
        maxSum = Math.max(maxSum, currentSum);                 // update global best
    }
    return maxSum;
}`,
    },
    java: {
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      code: `class Solution {
    public int maxSubArray(int[] nums) {
        int maxSum = nums[0];     // best subarray sum seen
        int currentSum = nums[0]; // best sum ending at current position
        for (int i = 1; i < nums.length; i++) {
            currentSum = Math.max(nums[i], currentSum + nums[i]); // extend or restart
            maxSum = Math.max(maxSum, currentSum);                 // update global best
        }
        return maxSum;
    }
}`,
    },
    cpp: {
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      code: `#include <algorithm>
#include <vector>
using namespace std;

class Solution {
public:
    int maxSubArray(vector<int>& nums) {
        int maxSum = nums[0];     // best subarray sum seen
        int currentSum = nums[0]; // best sum ending at current position
        for (int i = 1; i < (int)nums.size(); i++) {
            currentSum = max(nums[i], currentSum + nums[i]); // extend or restart
            maxSum = max(maxSum, currentSum);                 // update global best
        }
        return maxSum;
    }
};`,
    },
  },
};
