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
      highlightLines: [2],
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
    highlightLines: [2, 3],
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
        highlightLines: [4, 5],
        visualState: { nums, currentIndex: i, currentSum, maxSum, subarrayStart, subarrayEnd, maxStart, maxEnd, phase: 'extending' } satisfies MaxSubarrayVisualState,
      });
    } else {
      subarrayStart = i;
      subarrayEnd = i;
      currentSum = nums[i];
      steps.push({
        stepIndex: steps.length,
        description: `nums[${i}] = ${nums[i]}. Restarting is better: ${nums[i]} > ${extendSum}. Start a fresh subarray at index ${i}.`,
        highlightLines: [4, 5],
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
        highlightLines: [6],
        visualState: { nums, currentIndex: i, currentSum, maxSum, subarrayStart, subarrayEnd, maxStart, maxEnd, phase: 'extending' } satisfies MaxSubarrayVisualState,
      });
    }
  }

  steps.push({
    stepIndex: steps.length,
    description: `Done! Maximum subarray: [${nums.slice(maxStart, maxEnd + 1).join(', ')}] (indices ${maxStart}–${maxEnd}), sum = ${maxSum}. Return ${maxSum}.`,
    highlightLines: [7],
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
  solution: {
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
};
