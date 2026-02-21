import type { Problem, Step } from '../../types';

export interface BinarySearchVisualState {
  nums: number[];
  target: number;
  left: number;
  right: number;
  mid: number | null;
  phase: 'init' | 'checking' | 'found' | 'not_found' | 'done';
  resultIndex: number | null;
}

export function generateBinarySearchSteps(input: Record<string, unknown>): Step[] {
  const nums = (input.nums as number[]) ?? [-1, 0, 3, 5, 9, 12];
  const target = (input.target as number) ?? 9;
  const steps: Step[] = [];

  steps.push({
    stepIndex: 0,
    description: `Binary search on [${nums.join(', ')}], target = ${target}. We maintain two pointers: left and right. Each step we compute mid and cut the search space in half.`,
    highlightLines: { python: [2, 3], javascript: [2, 3], java: [3, 4], cpp: [8, 9] },
    visualState: {
      nums, target, left: 0, right: nums.length - 1, mid: null,
      phase: 'init', resultIndex: null,
    } satisfies BinarySearchVisualState,
  });

  let left = 0;
  let right = nums.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    steps.push({
      stepIndex: steps.length,
      description: `left=${left}, right=${right} → mid=${mid}, nums[mid]=${nums[mid]}. Compare with target ${target}.`,
      highlightLines: { python: [4, 5], javascript: [4, 5], java: [5, 6], cpp: [10, 11] },
      visualState: {
        nums, target, left, right, mid, phase: 'checking', resultIndex: null,
      } satisfies BinarySearchVisualState,
    });

    if (nums[mid] === target) {
      steps.push({
        stepIndex: steps.length,
        description: `nums[${mid}] = ${nums[mid]} equals target! Return index ${mid}.`,
        highlightLines: { python: [6, 7], javascript: [6, 7], java: [7, 8], cpp: [12, 13] },
        visualState: {
          nums, target, left, right, mid, phase: 'found', resultIndex: mid,
        } satisfies BinarySearchVisualState,
      });
      return steps;
    } else if (nums[mid] < target) {
      steps.push({
        stepIndex: steps.length,
        description: `nums[${mid}] = ${nums[mid]} < ${target}. Target is in the right half — move left pointer to mid+1 = ${mid + 1}.`,
        highlightLines: { python: [8, 9], javascript: [8, 9], java: [9, 10], cpp: [14, 15] },
        visualState: {
          nums, target, left, right: right, mid, phase: 'checking', resultIndex: null,
        } satisfies BinarySearchVisualState,
      });
      left = mid + 1;
    } else {
      steps.push({
        stepIndex: steps.length,
        description: `nums[${mid}] = ${nums[mid]} > ${target}. Target is in the left half — move right pointer to mid−1 = ${mid - 1}.`,
        highlightLines: { python: [10, 11], javascript: [10, 11], java: [11, 12], cpp: [16, 17] },
        visualState: {
          nums, target, left, right, mid, phase: 'checking', resultIndex: null,
        } satisfies BinarySearchVisualState,
      });
      right = mid - 1;
    }
  }

  steps.push({
    stepIndex: steps.length,
    description: `left (${left}) > right (${right}) — search space exhausted. Target ${target} not found. Return −1.`,
    highlightLines: { python: [12], javascript: [13], java: [14], cpp: [18] },
    visualState: {
      nums, target, left, right, mid: null, phase: 'not_found', resultIndex: null,
    } satisfies BinarySearchVisualState,
  });

  return steps;
}

export const binarySearch: Problem = {
  id: 'binary-search',
  title: 'Binary Search',
  category: 'Binary Search',
  difficulty: 'Easy',
  description:
    'Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, return its index. Otherwise, return -1. You must write an algorithm with O(log n) runtime complexity.',
  examples: [
    { input: 'nums = [-1,0,3,5,9,12], target = 9', output: '4' },
    { input: 'nums = [-1,0,3,5,9,12], target = 2', output: '-1' },
  ],
  defaultInput: { nums: [-1, 0, 3, 5, 9, 12], target: 9 },
  generateSteps: generateBinarySearchSteps,
  testRunner: {
    setup: '',
    cases: [
      { label: 'Target found',     inputDisplay: '[-1,0,3,5,9,12], target=9', callExpression: 'search([-1,0,3,5,9,12], 9)',  expectedDisplay: '4',  expectedValue: 4  },
      { label: 'Target not found', inputDisplay: '[-1,0,3,5,9,12], target=2', callExpression: 'search([-1,0,3,5,9,12], 2)',  expectedDisplay: '-1', expectedValue: -1 },
      { label: 'Single element',   inputDisplay: '[5], target=5',             callExpression: 'search([5], 5)',               expectedDisplay: '0',  expectedValue: 0  },
    ],
  },
  starterCode: {
    python: `def search(nums: list[int], target: int) -> int:
    pass`,
    javascript: `function search(nums, target) {

}`,
    java: `class Solution {
    public int search(int[] nums, int target) {

    }
}`,
    cpp: `class Solution {
public:
    int search(vector<int>& nums, int target) {

    }
};`,
  },
  solutions: {
    python: {
      timeComplexity: 'O(log n)',
      spaceComplexity: 'O(1)',
      code: `def search(nums: list[int], target: int) -> int:
    left, right = 0, len(nums) - 1
    while left <= right:
        mid = (left + right) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1`,
    },
    javascript: {
      timeComplexity: 'O(log n)',
      spaceComplexity: 'O(1)',
      code: `function search(nums, target) {
    let left = 0, right = nums.length - 1;
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        if (nums[mid] === target) {
            return mid;
        } else if (nums[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    return -1;
}`,
    },
    java: {
      timeComplexity: 'O(log n)',
      spaceComplexity: 'O(1)',
      code: `class Solution {
    public int search(int[] nums, int target) {
        int left = 0, right = nums.length - 1;
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (nums[mid] == target) {
                return mid;
            } else if (nums[mid] < target) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        return -1;
    }
}`,
    },
    cpp: {
      timeComplexity: 'O(log n)',
      spaceComplexity: 'O(1)',
      code: `class Solution {
public:
    int search(vector<int>& nums, int target) {
        int left = 0, right = nums.size() - 1;
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (nums[mid] == target) {
                return mid;
            } else if (nums[mid] < target) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        return -1;
    }
};`,
    },
  },
};
