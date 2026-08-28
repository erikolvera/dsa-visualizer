import type { Problem, Step } from '../../types';

export interface MajorityElementVisualState {
  nums: number[];
  currentIndex: number | null;
  candidate: number | null;
  count: number;
  phase: 'init' | 'reset' | 'increment' | 'decrement' | 'done';
  result: number | null;
}

export function generateMajorityElementSteps(input: Record<string, unknown>): Step[] {
  const nums = (input.nums as number[]) ?? [2, 2, 1, 1, 1, 2, 2];
  const steps: Step[] = [];

  steps.push({
    stepIndex: 0,
    description: `Boyer-Moore Voting on [${nums.join(', ')}]. We track a "candidate" and a "count". When count hits 0, we adopt the current element as the new candidate. The majority element (appears > n/2 times) always survives.`,
    highlightLines: [2, 3],
    visualState: {
      nums, currentIndex: null, candidate: null, count: 0, phase: 'init', result: null,
    } satisfies MajorityElementVisualState,
  });

  let candidate: number | null = null;
  let count = 0;

  for (let i = 0; i < nums.length; i++) {
    const num = nums[i];

    if (count === 0) {
      candidate = num;
      count = 1;
      steps.push({
        stepIndex: steps.length,
        description: `count = 0 → adopt nums[${i}] = ${num} as new candidate. count = 1.`,
        highlightLines: [5, 6, 7],
        visualState: {
          nums, currentIndex: i, candidate, count, phase: 'reset', result: null,
        } satisfies MajorityElementVisualState,
      });
    } else if (num === candidate) {
      count++;
      steps.push({
        stepIndex: steps.length,
        description: `nums[${i}] = ${num} matches candidate ${candidate} → increment count to ${count}.`,
        highlightLines: [8, 9],
        visualState: {
          nums, currentIndex: i, candidate, count, phase: 'increment', result: null,
        } satisfies MajorityElementVisualState,
      });
    } else {
      count--;
      steps.push({
        stepIndex: steps.length,
        description: `nums[${i}] = ${num} differs from candidate ${candidate} → decrement count to ${count}.`,
        highlightLines: [10, 11],
        visualState: {
          nums, currentIndex: i, candidate, count, phase: 'decrement', result: null,
        } satisfies MajorityElementVisualState,
      });
    }
  }

  steps.push({
    stepIndex: steps.length,
    description: `All elements processed. Candidate ${candidate} is the majority element — it appears more than ⌊n/2⌋ times. Return ${candidate}.`,
    highlightLines: [12],
    visualState: {
      nums, currentIndex: null, candidate, count, phase: 'done', result: candidate,
    } satisfies MajorityElementVisualState,
  });

  return steps;
}

export const majorityElement: Problem = {
  id: 'majority-element',
  title: 'Majority Element',
  category: 'Arrays',
  difficulty: 'Easy',
  description:
    'Given an array nums of size n, return the majority element. The majority element is the element that appears more than ⌊n/2⌋ times. You may assume that the majority element always exists in the array.',
  examples: [
    { input: 'nums = [3,2,3]', output: '3' },
    { input: 'nums = [2,2,1,1,1,2,2]', output: '2' },
  ],
  defaultInput: { nums: [2, 2, 1, 1, 1, 2, 2] },
  generateSteps: generateMajorityElementSteps,
  solution: {
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    code: `def majorityElement(nums: list[int]) -> int:
    candidate = None
    count = 0
    for num in nums:
        if count == 0:
            candidate = num
            count = 1
        elif num == candidate:
            count += 1
        else:
            count -= 1
    return candidate`,
  },
};
