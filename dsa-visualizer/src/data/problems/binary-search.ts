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
    highlightLines: [2, 3],
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
      highlightLines: [4, 5],
      visualState: {
        nums, target, left, right, mid, phase: 'checking', resultIndex: null,
      } satisfies BinarySearchVisualState,
    });

    if (nums[mid] === target) {
      steps.push({
        stepIndex: steps.length,
        description: `nums[${mid}] = ${nums[mid]} equals target! Return index ${mid}.`,
        highlightLines: [6, 7],
        visualState: {
          nums, target, left, right, mid, phase: 'found', resultIndex: mid,
        } satisfies BinarySearchVisualState,
      });
      return steps;
    } else if (nums[mid] < target) {
      steps.push({
        stepIndex: steps.length,
        description: `nums[${mid}] = ${nums[mid]} < ${target}. Target is in the right half — move left pointer to mid+1 = ${mid + 1}.`,
        highlightLines: [8, 9],
        visualState: {
          nums, target, left, right: right, mid, phase: 'checking', resultIndex: null,
        } satisfies BinarySearchVisualState,
      });
      left = mid + 1;
    } else {
      steps.push({
        stepIndex: steps.length,
        description: `nums[${mid}] = ${nums[mid]} > ${target}. Target is in the left half — move right pointer to mid−1 = ${mid - 1}.`,
        highlightLines: [10, 11],
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
    highlightLines: [12],
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
  solution: {
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
};
