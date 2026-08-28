import type { Problem, Step } from '../../types';

export interface ContainsDuplicateVisualState {
  nums: number[];
  currentIndex: number | null;
  seen: number[];
  duplicateValue: number | null;
  phase: 'init' | 'checking' | 'found' | 'stored' | 'no_duplicate';
}

export function generateContainsDuplicateSteps(input: Record<string, unknown>): Step[] {
  const nums = (input.nums as number[]) ?? [1, 2, 3, 1];
  const steps: Step[] = [];
  const seen = new Set<number>();

  steps.push({
    stepIndex: 0,
    description: `Check if [${nums.join(', ')}] contains any duplicates. We'll use a hash set: for each element, if it's already in the set we immediately return true.`,
    highlightLines: [2],
    visualState: {
      nums, currentIndex: null, seen: [], duplicateValue: null, phase: 'init',
    } satisfies ContainsDuplicateVisualState,
  });

  for (let i = 0; i < nums.length; i++) {
    const num = nums[i];
    const isDuplicate = seen.has(num);

    steps.push({
      stepIndex: steps.length,
      description: isDuplicate
        ? `nums[${i}] = ${num}. ${num} is already in the seen set — duplicate found! Return true.`
        : `nums[${i}] = ${num}. ${num} is not in the seen set yet.`,
      highlightLines: isDuplicate ? [3, 4, 5] : [3, 4],
      visualState: {
        nums, currentIndex: i, seen: [...seen],
        duplicateValue: isDuplicate ? num : null,
        phase: isDuplicate ? 'found' : 'checking',
      } satisfies ContainsDuplicateVisualState,
    });

    if (isDuplicate) return steps;

    seen.add(num);

    steps.push({
      stepIndex: steps.length,
      description: `${num} is new — add it to the seen set. Set: {${[...seen].join(', ')}}.`,
      highlightLines: [6],
      visualState: {
        nums, currentIndex: i, seen: [...seen], duplicateValue: null, phase: 'stored',
      } satisfies ContainsDuplicateVisualState,
    });
  }

  steps.push({
    stepIndex: steps.length,
    description: `All ${nums.length} elements checked — no duplicates found. Return false.`,
    highlightLines: [7],
    visualState: {
      nums, currentIndex: null, seen: [...seen], duplicateValue: null, phase: 'no_duplicate',
    } satisfies ContainsDuplicateVisualState,
  });

  return steps;
}

export const containsDuplicate: Problem = {
  id: 'contains-duplicate',
  title: 'Contains Duplicate',
  category: 'Arrays',
  difficulty: 'Easy',
  description:
    'Given an integer array nums, return true if any value appears more than once in the array, otherwise return false.',
  examples: [
    { input: 'nums = [1,2,3,1]', output: 'true' },
    { input: 'nums = [1,2,3,4]', output: 'false' },
  ],
  defaultInput: { nums: [1, 2, 3, 1] },
  generateSteps: generateContainsDuplicateSteps,
  solution: {
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    code: `def containsDuplicate(nums: list[int]) -> bool:
    seen = set()
    for num in nums:
        if num in seen:
            return True
        seen.add(num)
    return False`,
  },
};
