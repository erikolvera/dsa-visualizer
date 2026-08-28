import type { Problem, Step } from '../../types';

export interface ProductArrayVisualState {
  nums: number[];
  result: (number | null)[];
  currentIndex: number | null;
  phase: 'init' | 'prefix' | 'suffix' | 'done';
  prefixVal: number;
  suffixVal: number;
}

export function generateProductArraySteps(input: Record<string, unknown>): Step[] {
  const nums = (input.nums as number[]) ?? [1, 2, 3, 4];
  const n = nums.length;
  const steps: Step[] = [];
  const result: (number | null)[] = new Array(n).fill(null);

  steps.push({
    stepIndex: 0,
    description: `Product of Array Except Self on [${nums.join(', ')}]. Two-pass approach: left pass builds prefix products, right pass multiplies in suffix products. No division used — O(n) time, O(1) extra space.`,
    highlightLines: [2, 3],
    visualState: { nums, result: [...result], currentIndex: null, phase: 'init', prefixVal: 1, suffixVal: 1 } satisfies ProductArrayVisualState,
  });

  // Left pass: result[i] = product of all elements to the LEFT of i
  let prefix = 1;
  for (let i = 0; i < n; i++) {
    result[i] = prefix;
    steps.push({
      stepIndex: steps.length,
      description: `Left pass, i=${i}: result[${i}] = prefix = ${prefix}. (Product of all elements before index ${i}${i === 0 ? ', which is 1 by convention' : `: ${nums.slice(0, i).join(' × ')}`}.) Then prefix × nums[${i}] = ${prefix} × ${nums[i]} = ${prefix * nums[i]}.`,
      highlightLines: [4, 5, 6],
      visualState: { nums, result: [...result], currentIndex: i, phase: 'prefix', prefixVal: prefix, suffixVal: 1 } satisfies ProductArrayVisualState,
    });
    prefix *= nums[i];
  }

  // Right pass: multiply result[i] by suffix (product of all elements to the RIGHT)
  let suffix = 1;
  for (let i = n - 1; i >= 0; i--) {
    result[i] = (result[i] as number) * suffix;
    steps.push({
      stepIndex: steps.length,
      description: `Right pass, i=${i}: result[${i}] = result[${i}] × suffix = ${(result[i] as number) / suffix} × ${suffix} = ${result[i]}. Suffix now = ${suffix} × nums[${i}] = ${suffix * nums[i]}.`,
      highlightLines: [8, 9, 10],
      visualState: { nums, result: [...result], currentIndex: i, phase: 'suffix', prefixVal: prefix, suffixVal: suffix } satisfies ProductArrayVisualState,
    });
    suffix *= nums[i];
  }

  steps.push({
    stepIndex: steps.length,
    description: `Done! result = [${result.join(', ')}]. Each element is the product of all other elements. Return result.`,
    highlightLines: [11],
    visualState: { nums, result: [...result], currentIndex: null, phase: 'done', prefixVal: prefix, suffixVal: suffix } satisfies ProductArrayVisualState,
  });

  return steps;
}

export const productOfArrayExceptSelf: Problem = {
  id: 'product-of-array-except-self',
  title: 'Product of Array Except Self',
  category: 'Arrays',
  difficulty: 'Medium',
  description:
    'Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i]. The product of any prefix or suffix of nums is guaranteed to fit in a 32-bit integer. You must write an algorithm that runs in O(n) time and without using the division operation.',
  examples: [
    { input: 'nums = [1,2,3,4]', output: '[24,12,8,6]' },
    { input: 'nums = [-1,1,0,-3,3]', output: '[0,0,9,0,0]' },
  ],
  defaultInput: { nums: [1, 2, 3, 4] },
  generateSteps: generateProductArraySteps,
  solution: {
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    code: `def productExceptSelf(nums: list[int]) -> list[int]:
    n = len(nums)
    result = [1] * n
    prefix = 1              # left pass
    for i in range(n):
        result[i] = prefix
        prefix *= nums[i]
    suffix = 1              # right pass
    for i in range(n - 1, -1, -1):
        result[i] *= suffix
        suffix *= nums[i]
    return result`,
  },
};
