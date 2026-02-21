import type { Problem, Step } from '../../types';

export interface FindMinRotatedVisualState {
  nums: number[];
  left: number;
  right: number;
  mid: number | null;
  currentMin: number;
  resultIndex: number | null;
  phase: 'init' | 'checking' | 'done';
}

export function generateFindMinRotatedSteps(input: Record<string, unknown>): Step[] {
  const nums = (input.nums as number[]) ?? [3, 4, 5, 1, 2];
  const steps: Step[] = [];

  steps.push({
    stepIndex: 0,
    description: `Find minimum in rotated sorted array [${nums.join(', ')}]. Key insight: in a rotated array, the sorted half always has nums[left] ≤ nums[mid]. If nums[mid] > nums[right], the minimum is in the right half; otherwise it's in the left half (including mid).`,
    highlightLines: { python: [2, 3], javascript: [2, 3], java: [3, 4], cpp: [8, 9] },
    visualState: { nums, left: 0, right: nums.length - 1, mid: null, currentMin: nums[0], resultIndex: null, phase: 'init' } satisfies FindMinRotatedVisualState,
  });

  let left = 0;
  let right = nums.length - 1;
  let currentMin = nums[0];
  let resultIndex = 0;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (nums[mid] < currentMin) {
      currentMin = nums[mid];
      resultIndex = mid;
    }

    steps.push({
      stepIndex: steps.length,
      description: `left=${left}, right=${right}, mid=${mid}, nums[mid]=${nums[mid]}. nums[mid] ${nums[mid] > nums[right] ? '>' : '≤'} nums[right]=${nums[right]} → minimum is in the ${nums[mid] > nums[right] ? 'right' : 'left'} half.`,
      highlightLines: { python: [4, 5, 6], javascript: [4, 5, 6], java: [5, 6, 7], cpp: [10, 11, 12] },
      visualState: { nums, left, right, mid, currentMin, resultIndex, phase: 'checking' } satisfies FindMinRotatedVisualState,
    });

    if (nums[mid] > nums[right]) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  steps.push({
    stepIndex: steps.length,
    description: `Search complete. Minimum value is ${currentMin} at index ${resultIndex}. Return ${currentMin}.`,
    highlightLines: { python: [7], javascript: [8], java: [9], cpp: [13] },
    visualState: { nums, left, right, mid: null, currentMin, resultIndex, phase: 'done' } satisfies FindMinRotatedVisualState,
  });

  return steps;
}

export const findMinimumRotatedSortedArray: Problem = {
  id: 'find-minimum-rotated-sorted-array',
  title: 'Find Minimum in Rotated Sorted Array',
  category: 'Binary Search',
  difficulty: 'Medium',
  description:
    'Suppose an array of length n sorted in ascending order is rotated between 1 and n times. Given the rotated array nums of unique elements, return the minimum element of this array. You must write an algorithm that runs in O(log n) time.',
  examples: [
    { input: 'nums = [3,4,5,1,2]', output: '1' },
    { input: 'nums = [4,5,6,7,0,1,2]', output: '0' },
  ],
  defaultInput: { nums: [3, 4, 5, 1, 2] },
  generateSteps: generateFindMinRotatedSteps,
  testRunner: {
    setup: '',
    cases: [
      { label: 'Example 1', inputDisplay: '[3,4,5,1,2]',     callExpression: 'findMin([3,4,5,1,2])',     expectedDisplay: '1', expectedValue: 1 },
      { label: 'Example 2', inputDisplay: '[4,5,6,7,0,1,2]', callExpression: 'findMin([4,5,6,7,0,1,2])', expectedDisplay: '0', expectedValue: 0 },
      { label: 'Not rotated', inputDisplay: '[1,2,3]',        callExpression: 'findMin([1,2,3])',          expectedDisplay: '1', expectedValue: 1 },
    ],
  },
  starterCode: {
    python: `def findMin(nums: list[int]) -> int:
    pass`,
    javascript: `function findMin(nums) {

}`,
    java: `class Solution {
    public int findMin(int[] nums) {

    }
}`,
    cpp: `class Solution {
public:
    int findMin(vector<int>& nums) {

    }
};`,
  },
  solutions: {
    python: {
      timeComplexity: 'O(log n)',
      spaceComplexity: 'O(1)',
      code: `def findMin(nums: list[int]) -> int:
    left, right = 0, len(nums) - 1
    while left < right:
        mid = (left + right) // 2
        if nums[mid] > nums[right]:
            left = mid + 1  # min is in right half
        else:
            right = mid     # min is in left half (including mid)
    return nums[left]`,
    },
    javascript: {
      timeComplexity: 'O(log n)',
      spaceComplexity: 'O(1)',
      code: `function findMin(nums) {
    let left = 0, right = nums.length - 1;
    while (left < right) {
        const mid = Math.floor((left + right) / 2);
        if (nums[mid] > nums[right]) {
            left = mid + 1; // min is in right half
        } else {
            right = mid;    // min is in left half (including mid)
        }
    }
    return nums[left];
}`,
    },
    java: {
      timeComplexity: 'O(log n)',
      spaceComplexity: 'O(1)',
      code: `class Solution {
    public int findMin(int[] nums) {
        int left = 0, right = nums.length - 1;
        while (left < right) {
            int mid = left + (right - left) / 2;
            if (nums[mid] > nums[right]) {
                left = mid + 1; // min is in right half
            } else {
                right = mid;    // min is in left half (including mid)
            }
        }
        return nums[left];
    }
}`,
    },
    cpp: {
      timeComplexity: 'O(log n)',
      spaceComplexity: 'O(1)',
      code: `class Solution {
public:
    int findMin(vector<int>& nums) {
        int left = 0, right = nums.size() - 1;
        while (left < right) {
            int mid = left + (right - left) / 2;
            if (nums[mid] > nums[right]) {
                left = mid + 1; // min is in right half
            } else {
                right = mid;    // min is in left half (including mid)
            }
        }
        return nums[left];
    }
};`,
    },
  },
};
