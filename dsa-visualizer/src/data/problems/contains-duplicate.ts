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
    highlightLines: { python: [2], javascript: [2], java: [3], cpp: [8] },
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
      highlightLines: {
        python: isDuplicate ? [3, 4, 5] : [3, 4],
        javascript: isDuplicate ? [3, 4, 5] : [3, 4],
        java: isDuplicate ? [4, 5, 6] : [4, 5],
        cpp: isDuplicate ? [9, 10, 11] : [9, 10],
      },
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
      highlightLines: { python: [6], javascript: [7], java: [8], cpp: [13] },
      visualState: {
        nums, currentIndex: i, seen: [...seen], duplicateValue: null, phase: 'stored',
      } satisfies ContainsDuplicateVisualState,
    });
  }

  steps.push({
    stepIndex: steps.length,
    description: `All ${nums.length} elements checked — no duplicates found. Return false.`,
    highlightLines: { python: [7], javascript: [9], java: [10], cpp: [15] },
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
  testRunner: {
    setup: '',
    cases: [
      { label: 'Has duplicate',    inputDisplay: '[1,2,3,1]',          callExpression: 'containsDuplicate([1,2,3,1])',          expectedDisplay: 'true',  expectedValue: true  },
      { label: 'No duplicate',     inputDisplay: '[1,2,3,4]',          callExpression: 'containsDuplicate([1,2,3,4])',          expectedDisplay: 'false', expectedValue: false },
      { label: 'Many duplicates',  inputDisplay: '[1,1,1,3,3,4,3,2]', callExpression: 'containsDuplicate([1,1,1,3,3,4,3,2])', expectedDisplay: 'true',  expectedValue: true  },
    ],
  },
  starterCode: {
    python: `def containsDuplicate(nums: list[int]) -> bool:
    pass`,
    javascript: `function containsDuplicate(nums) {

}`,
    java: `class Solution {
    public boolean containsDuplicate(int[] nums) {

    }
}`,
    cpp: `class Solution {
public:
    bool containsDuplicate(vector<int>& nums) {

    }
};`,
  },
  solutions: {
    python: {
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
    javascript: {
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
      code: `function containsDuplicate(nums) {
    const seen = new Set();
    for (const num of nums) {
        if (seen.has(num)) {
            return true;
        }
        seen.add(num);
    }
    return false;
}`,
    },
    java: {
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
      code: `import java.util.HashSet;
import java.util.Set;

class Solution {
    public boolean containsDuplicate(int[] nums) {
        Set<Integer> seen = new HashSet<>();
        for (int num : nums) {
            if (seen.contains(num)) {
                return true;
            }
            seen.add(num);
        }
        return false;
    }
}`,
    },
    cpp: {
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
      code: `#include <unordered_set>
#include <vector>
using namespace std;

class Solution {
public:
    bool containsDuplicate(vector<int>& nums) {
        unordered_set<int> seen;
        for (int num : nums) {
            if (seen.count(num)) {
                return true;
            }
            seen.insert(num);
        }
        return false;
    }
};`,
    },
  },
};
