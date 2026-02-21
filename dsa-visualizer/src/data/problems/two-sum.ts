import type { Problem, Step } from '../../types';

export interface TwoSumInput {
  nums: number[];
  target: number;
}

export interface TwoSumVisualState {
  nums: number[];
  target: number;
  currentIndex: number | null;
  map: Record<number, number>;
  resultIndices: [number, number] | null;
  phase: 'init' | 'checking' | 'storing' | 'found' | 'not_found';
}

export function generateTwoSumSteps(input: Record<string, unknown>): Step[] {
  const nums = (input.nums as number[]) ?? [2, 7, 11, 15];
  const target = (input.target as number) ?? 9;
  const steps: Step[] = [];
  const map: Record<number, number> = {};
  let solutionFound = false;

  // Step 0: Initialization
  steps.push({
    stepIndex: 0,
    description: `Initialize an empty hash map. We'll iterate through the array, and for each number, check if its complement (${target} − num) is already stored.`,
    highlightLines: {
      python: [2],
      javascript: [2],
      java: [6],
      cpp: [8],
    },
    visualState: {
      nums,
      target,
      currentIndex: null,
      map: {},
      resultIndices: null,
      phase: 'init',
    } satisfies TwoSumVisualState,
  });

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    const found = complement in map;

    // Checking step
    steps.push({
      stepIndex: steps.length,
      description: found
        ? `Checking nums[${i}] = ${nums[i]}. Complement needed: ${target} − ${nums[i]} = ${complement}. ✓ Found ${complement} in the map at index ${map[complement]}!`
        : `Checking nums[${i}] = ${nums[i]}. Complement needed: ${target} − ${nums[i]} = ${complement}. ${complement} is not in the map yet.`,
      highlightLines: {
        python: [3, 4, 5],
        javascript: [3, 4, 5],
        java: [7, 8, 9],
        cpp: [9, 10, 11],
      },
      visualState: {
        nums,
        target,
        currentIndex: i,
        map: { ...map },
        resultIndices: found ? [map[complement], i] : null,
        phase: found ? 'found' : 'checking',
      } satisfies TwoSumVisualState,
    });

    if (found) {
      solutionFound = true;
      // Return step
      steps.push({
        stepIndex: steps.length,
        description: `Answer found! nums[${map[complement]}] + nums[${i}] = ${nums[map[complement]]} + ${nums[i]} = ${target}. Return indices [${map[complement]}, ${i}].`,
        highlightLines: {
          python: [6],
          javascript: [6],
          java: [10],
          cpp: [12],
        },
        visualState: {
          nums,
          target,
          currentIndex: i,
          map: { ...map },
          resultIndices: [map[complement], i],
          phase: 'found',
        } satisfies TwoSumVisualState,
      });
      break;
    } else {
      // Store step
      map[nums[i]] = i;
      steps.push({
        stepIndex: steps.length,
        description: `${complement} not found. Store ${nums[i]} → index ${i} in the map for future lookups.`,
        highlightLines: {
          python: [7],
          javascript: [8],
          java: [12],
          cpp: [14],
        },
        visualState: {
          nums,
          target,
          currentIndex: i,
          map: { ...map },
          resultIndices: null,
          phase: 'storing',
        } satisfies TwoSumVisualState,
      });
    }
  }

  // No pair was found — add an explicit "not found" terminal step
  if (!solutionFound) {
    steps.push({
      stepIndex: steps.length,
      description: `Checked all ${nums.length} numbers — no two values sum to ${target}. Return [] (no solution exists for this input).`,
      highlightLines: {
        python: [8],
        javascript: [10],
        java: [14],
        cpp: [16],
      },
      visualState: {
        nums,
        target,
        currentIndex: null,
        map: { ...map },
        resultIndices: null,
        phase: 'not_found',
      } satisfies TwoSumVisualState,
    });
  }

  return steps;
}

export const twoSum: Problem = {
  id: 'two-sum',
  title: 'Two Sum',
  category: 'Arrays',
  difficulty: 'Easy',
  description:
    'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution.',
  examples: [
    { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]' },
    { input: 'nums = [3,2,4], target = 6', output: '[1,2]' },
  ],
  defaultInput: { nums: [2, 7, 11, 15], target: 9 },
  generateSteps: generateTwoSumSteps,
  testRunner: {
    setup: '',
    cases: [
      { label: 'Example 1', inputDisplay: 'nums=[2,7,11,15], target=9', callExpression: 'twoSum([2,7,11,15], 9)', expectedDisplay: '[0,1]', expectedValue: [0,1] },
      { label: 'Example 2', inputDisplay: 'nums=[3,2,4], target=6',     callExpression: 'twoSum([3,2,4], 6)',     expectedDisplay: '[1,2]', expectedValue: [1,2] },
      { label: 'Example 3', inputDisplay: 'nums=[3,3], target=6',       callExpression: 'twoSum([3,3], 6)',       expectedDisplay: '[0,1]', expectedValue: [0,1] },
    ],
  },
  starterCode: {
    python: `def twoSum(nums: list[int], target: int) -> list[int]:
    pass`,
    javascript: `function twoSum(nums, target) {

}`,
    java: `class Solution {
    public int[] twoSum(int[] nums, int target) {

    }
}`,
    cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {

    }
};`,
  },
  solutions: {
    python: {
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
      code: `def twoSum(nums: list[int], target: int) -> list[int]:
    seen = {}                        # num → index map
    for i in range(len(nums)):
        complement = target - nums[i]  # what we need to find
        if complement in seen:          # have we seen it?
            return [seen[complement], i]
        seen[nums[i]] = i              # store current number
    return []`,
    },
    javascript: {
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
      code: `function twoSum(nums, target) {
    const seen = {};                    // num → index map
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i]; // what we need
        if (complement in seen) {            // have we seen it?
            return [seen[complement], i];
        }
        seen[nums[i]] = i;                   // store current number
    }
    return [];
}`,
    },
    java: {
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
      code: `import java.util.HashMap;
import java.util.Map;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> seen = new HashMap<>(); // num → index
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];       // what we need
            if (seen.containsKey(complement)) {      // have we seen it?
                return new int[]{seen.get(complement), i};
            }
            seen.put(nums[i], i);                    // store current number
        }
        return new int[]{};
    }
}`,
    },
    cpp: {
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
      code: `#include <unordered_map>
#include <vector>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int,int> seen;       // num → index
        for (int i = 0; i < (int)nums.size(); i++) {
            int complement = target - nums[i]; // what we need
            if (seen.count(complement)) {      // have we seen it?
                return {seen[complement], i};
            }
            seen[nums[i]] = i;                 // store current number
        }
        return {};
    }
};`,
    },
  },
};
