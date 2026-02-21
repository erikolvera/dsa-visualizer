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
    highlightLines: { python: [2, 3], javascript: [2, 3], java: [3, 4], cpp: [8, 9] },
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
        highlightLines: { python: [5, 6, 7], javascript: [5, 6, 7], java: [6, 7, 8], cpp: [11, 12, 13] },
        visualState: {
          nums, currentIndex: i, candidate, count, phase: 'reset', result: null,
        } satisfies MajorityElementVisualState,
      });
    } else if (num === candidate) {
      count++;
      steps.push({
        stepIndex: steps.length,
        description: `nums[${i}] = ${num} matches candidate ${candidate} → increment count to ${count}.`,
        highlightLines: { python: [8, 9], javascript: [8, 9], java: [9, 10], cpp: [14, 15] },
        visualState: {
          nums, currentIndex: i, candidate, count, phase: 'increment', result: null,
        } satisfies MajorityElementVisualState,
      });
    } else {
      count--;
      steps.push({
        stepIndex: steps.length,
        description: `nums[${i}] = ${num} differs from candidate ${candidate} → decrement count to ${count}.`,
        highlightLines: { python: [10, 11], javascript: [10, 11], java: [11, 12], cpp: [16, 17] },
        visualState: {
          nums, currentIndex: i, candidate, count, phase: 'decrement', result: null,
        } satisfies MajorityElementVisualState,
      });
    }
  }

  steps.push({
    stepIndex: steps.length,
    description: `All elements processed. Candidate ${candidate} is the majority element — it appears more than ⌊n/2⌋ times. Return ${candidate}.`,
    highlightLines: { python: [12], javascript: [13], java: [14], cpp: [18] },
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
  testRunner: {
    setup: '',
    cases: [
      { label: 'Simple',    inputDisplay: '[3,2,3]',         callExpression: 'majorityElement([3,2,3])',         expectedDisplay: '3', expectedValue: 3 },
      { label: 'Example 2', inputDisplay: '[2,2,1,1,1,2,2]', callExpression: 'majorityElement([2,2,1,1,1,2,2])', expectedDisplay: '2', expectedValue: 2 },
      { label: 'All same',  inputDisplay: '[1,1,1]',          callExpression: 'majorityElement([1,1,1])',          expectedDisplay: '1', expectedValue: 1 },
    ],
  },
  starterCode: {
    python: `def majorityElement(nums: list[int]) -> int:
    pass`,
    javascript: `function majorityElement(nums) {

}`,
    java: `class Solution {
    public int majorityElement(int[] nums) {

    }
}`,
    cpp: `class Solution {
public:
    int majorityElement(vector<int>& nums) {

    }
};`,
  },
  solutions: {
    python: {
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
    javascript: {
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      code: `function majorityElement(nums) {
    let candidate = null;
    let count = 0;
    for (const num of nums) {
        if (count === 0) {
            candidate = num;
            count = 1;
        } else if (num === candidate) {
            count++;
        } else {
            count--;
        }
    }
    return candidate;
}`,
    },
    java: {
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      code: `class Solution {
    public int majorityElement(int[] nums) {
        int candidate = nums[0];
        int count = 0;
        for (int num : nums) {
            if (count == 0) {
                candidate = num;
                count = 1;
            } else if (num == candidate) {
                count++;
            } else {
                count--;
            }
        }
        return candidate;
    }
}`,
    },
    cpp: {
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      code: `class Solution {
public:
    int majorityElement(vector<int>& nums) {
        int candidate = nums[0];
        int count = 0;
        for (int num : nums) {
            if (count == 0) {
                candidate = num;
                count = 1;
            } else if (num == candidate) {
                count++;
            } else {
                count--;
            }
        }
        return candidate;
    }
};`,
    },
  },
};
