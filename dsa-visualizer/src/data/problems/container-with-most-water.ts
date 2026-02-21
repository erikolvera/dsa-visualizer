import type { Problem, Step } from '../../types';

export interface ContainerWaterVisualState {
  heights: number[];
  left: number;
  right: number;
  currentArea: number;
  maxArea: number;
  phase: 'init' | 'checking' | 'move_left' | 'move_right' | 'done';
}

export function generateContainerWaterSteps(input: Record<string, unknown>): Step[] {
  const heights = (input.heights as number[]) ?? [1, 8, 6, 2, 5, 4, 8, 3, 7];
  const steps: Step[] = [];

  steps.push({
    stepIndex: 0,
    description: `Container With Most Water on [${heights.join(', ')}]. Two pointers start at both ends. Each step: compute area, then move the shorter pointer inward (moving the taller one can only decrease area).`,
    highlightLines: { python: [2, 3, 4], javascript: [2, 3, 4], java: [3, 4, 5], cpp: [8, 9, 10] },
    visualState: { heights, left: 0, right: heights.length - 1, currentArea: 0, maxArea: 0, phase: 'init' } satisfies ContainerWaterVisualState,
  });

  let left = 0;
  let right = heights.length - 1;
  let maxArea = 0;

  while (left < right) {
    const width = right - left;
    const h = Math.min(heights[left], heights[right]);
    const area = h * width;
    const isNewMax = area > maxArea;
    if (isNewMax) maxArea = area;

    steps.push({
      stepIndex: steps.length,
      description: `L=${left} (h=${heights[left]}), R=${right} (h=${heights[right]}): width=${width}, min height=${h}. Area = ${h}×${width} = ${area}.${isNewMax ? ` New max! Update max area to ${area}.` : ` Not better than current max (${maxArea}).`}`,
      highlightLines: { python: [5, 6], javascript: [5, 6], java: [6, 7], cpp: [11, 12] },
      visualState: { heights, left, right, currentArea: area, maxArea, phase: 'checking' } satisfies ContainerWaterVisualState,
    });

    if (heights[left] < heights[right]) {
      steps.push({
        stepIndex: steps.length,
        description: `heights[${left}]=${heights[left]} < heights[${right}]=${heights[right]}: left bar is shorter. Move left pointer right to find a taller bar.`,
        highlightLines: { python: [7, 8], javascript: [7, 8], java: [8, 9], cpp: [13, 14] },
        visualState: { heights, left, right, currentArea: area, maxArea, phase: 'move_left' } satisfies ContainerWaterVisualState,
      });
      left++;
    } else {
      steps.push({
        stepIndex: steps.length,
        description: `heights[${right}]=${heights[right]} ≤ heights[${left}]=${heights[left]}: right bar is shorter (or equal). Move right pointer left to find a taller bar.`,
        highlightLines: { python: [9, 10], javascript: [9, 10], java: [10, 11], cpp: [15, 16] },
        visualState: { heights, left, right, currentArea: area, maxArea, phase: 'move_right' } satisfies ContainerWaterVisualState,
      });
      right--;
    }
  }

  steps.push({
    stepIndex: steps.length,
    description: `Pointers met — all pairs checked. Maximum water container holds area = ${maxArea}. Return ${maxArea}.`,
    highlightLines: { python: [11], javascript: [12], java: [13], cpp: [17] },
    visualState: { heights, left, right, currentArea: 0, maxArea, phase: 'done' } satisfies ContainerWaterVisualState,
  });

  return steps;
}

export const containerWithMostWater: Problem = {
  id: 'container-with-most-water',
  title: 'Container With Most Water',
  category: 'Arrays',
  difficulty: 'Medium',
  description:
    'You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]). Find two lines that together with the x-axis form a container, such that the container contains the most water. Return the maximum amount of water a container can store.',
  examples: [
    { input: 'height = [1,8,6,2,5,4,8,3,7]', output: '49' },
    { input: 'height = [1,1]', output: '1' },
  ],
  defaultInput: { heights: [1, 8, 6, 2, 5, 4, 8, 3, 7] },
  generateSteps: generateContainerWaterSteps,
  testRunner: {
    setup: '',
    cases: [
      { label: 'Example 1', inputDisplay: '[1,8,6,2,5,4,8,3,7]', callExpression: 'maxArea([1,8,6,2,5,4,8,3,7])', expectedDisplay: '49', expectedValue: 49 },
      { label: 'Example 2', inputDisplay: '[1,1]',                callExpression: 'maxArea([1,1])',                expectedDisplay: '1',  expectedValue: 1  },
      { label: 'Descending', inputDisplay: '[4,3,2,1,4]',          callExpression: 'maxArea([4,3,2,1,4])',          expectedDisplay: '16', expectedValue: 16 },
    ],
  },
  starterCode: {
    python: `def maxArea(height: list[int]) -> int:
    pass`,
    javascript: `function maxArea(height) {

}`,
    java: `class Solution {
    public int maxArea(int[] height) {

    }
}`,
    cpp: `class Solution {
public:
    int maxArea(vector<int>& height) {

    }
};`,
  },
  solutions: {
    python: {
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      code: `def maxArea(height: list[int]) -> int:
    left, right = 0, len(height) - 1
    max_area = 0
    while left < right:
        area = min(height[left], height[right]) * (right - left)
        max_area = max(max_area, area)
        if height[left] < height[right]:
            left += 1
        else:
            right -= 1
    return max_area`,
    },
    javascript: {
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      code: `function maxArea(height) {
    let left = 0, right = height.length - 1;
    let maxArea = 0;
    while (left < right) {
        const area = Math.min(height[left], height[right]) * (right - left);
        maxArea = Math.max(maxArea, area);
        if (height[left] < height[right]) {
            left++;
        } else {
            right--;
        }
    }
    return maxArea;
}`,
    },
    java: {
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      code: `class Solution {
    public int maxArea(int[] height) {
        int left = 0, right = height.length - 1;
        int maxArea = 0;
        while (left < right) {
            int area = Math.min(height[left], height[right]) * (right - left);
            maxArea = Math.max(maxArea, area);
            if (height[left] < height[right]) {
                left++;
            } else {
                right--;
            }
        }
        return maxArea;
    }
}`,
    },
    cpp: {
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      code: `class Solution {
public:
    int maxArea(vector<int>& height) {
        int left = 0, right = height.size() - 1;
        int maxArea = 0;
        while (left < right) {
            int area = min(height[left], height[right]) * (right - left);
            maxArea = max(maxArea, area);
            if (height[left] < height[right]) {
                left++;
            } else {
                right--;
            }
        }
        return maxArea;
    }
};`,
    },
  },
};
