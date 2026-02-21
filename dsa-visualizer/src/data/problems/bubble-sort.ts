import type { Problem, Step } from '../../types';

export interface BubbleSortInput {
  arr: number[];
}

export interface SortVisualState {
  arr: number[];
  compareLeft: number | null;
  compareRight: number | null;
  sortedFrom: number;      // elements at index >= sortedFrom are in final position
  swapping: boolean;
  pass: number;
  phase: 'init' | 'comparing' | 'swapping' | 'done';
}

export function generateBubbleSortSteps(input: Record<string, unknown>): Step[] {
  const arr = [...((input.arr as number[]) ?? [64, 34, 25, 12, 22, 11, 90])];
  const steps: Step[] = [];
  const n = arr.length;

  steps.push({
    stepIndex: 0,
    description: `Starting Bubble Sort on [${arr.join(', ')}]. We'll repeatedly compare adjacent pairs and "bubble" larger values to the right. After each full pass, the largest unsorted element settles into its correct position.`,
    highlightLines: {
      python: [2],
      javascript: [2],
      java: [3],
      cpp: [4],
    },
    visualState: {
      arr: [...arr],
      compareLeft: null,
      compareRight: null,
      sortedFrom: n,
      swapping: false,
      pass: 0,
      phase: 'init',
    } satisfies SortVisualState,
  });

  for (let pass = 0; pass < n - 1; pass++) {
    let swappedAny = false;

    for (let j = 0; j < n - pass - 1; j++) {
      // Compare step
      steps.push({
        stepIndex: steps.length,
        description: `Pass ${pass + 1}, comparing arr[${j}]=${arr[j]} and arr[${j + 1}]=${arr[j + 1]}. ${arr[j] > arr[j + 1] ? `${arr[j]} > ${arr[j + 1]} → need to swap.` : `${arr[j]} ≤ ${arr[j + 1]} → already in order.`}`,
        highlightLines: {
          python: [3, 4, 5],
          javascript: [3, 4, 5],
          java: [4, 5, 6],
          cpp: [5, 6, 7],
        },
        visualState: {
          arr: [...arr],
          compareLeft: j,
          compareRight: j + 1,
          sortedFrom: n - pass,
          swapping: false,
          pass,
          phase: 'comparing',
        } satisfies SortVisualState,
      });

      if (arr[j] > arr[j + 1]) {
        // Swap step
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swappedAny = true;

        steps.push({
          stepIndex: steps.length,
          description: `Swapping ${arr[j + 1]} and ${arr[j]}. Array is now: [${arr.join(', ')}]`,
          highlightLines: {
            python: [6],
            javascript: [6],
            java: [7],
            cpp: [8],
          },
          visualState: {
            arr: [...arr],
            compareLeft: j,
            compareRight: j + 1,
            sortedFrom: n - pass,
            swapping: true,
            pass,
            phase: 'swapping',
          } satisfies SortVisualState,
        });
      }
    }

    // After pass: rightmost element is settled
    steps.push({
      stepIndex: steps.length,
      description: `Pass ${pass + 1} complete. ${arr[n - pass - 1]} is now in its final position (index ${n - pass - 1}). ${swappedAny ? `Continue to pass ${pass + 2}.` : 'No swaps this pass — array is already sorted!'}`,
      highlightLines: {
        python: [3],
        javascript: [3],
        java: [4],
        cpp: [5],
      },
      visualState: {
        arr: [...arr],
        compareLeft: null,
        compareRight: null,
        sortedFrom: n - pass - 1,
        swapping: false,
        pass: pass + 1,
        phase: swappedAny ? 'comparing' : 'done',
      } satisfies SortVisualState,
    });

    if (!swappedAny) break;
  }

  // Final step
  steps.push({
    stepIndex: steps.length,
    description: `Sorting complete! Final array: [${arr.join(', ')}]`,
    highlightLines: {
      python: [7],
      javascript: [7],
      java: [8],
      cpp: [9],
    },
    visualState: {
      arr: [...arr],
      compareLeft: null,
      compareRight: null,
      sortedFrom: 0,
      swapping: false,
      pass: n - 1,
      phase: 'done',
    } satisfies SortVisualState,
  });

  return steps;
}

export const bubbleSort: Problem = {
  id: 'bubble-sort',
  title: 'Bubble Sort',
  category: 'Sorting',
  difficulty: 'Easy',
  description:
    'Sort an array of integers using the Bubble Sort algorithm. Repeatedly compare adjacent elements and swap them if they are in the wrong order. After each pass, the largest unsorted element "bubbles up" to its correct position.',
  examples: [
    { input: 'arr = [64,34,25,12,22,11,90]', output: '[11,12,22,25,34,64,90]' },
    { input: 'arr = [5,1,4,2,8]', output: '[1,2,4,5,8]' },
  ],
  defaultInput: { arr: [64, 34, 25, 12, 22, 11, 90] },
  generateSteps: generateBubbleSortSteps,
  testRunner: {
    setup: '',
    cases: [
      { label: 'Example 1',    inputDisplay: '[64,34,25,12,22,11,90]', callExpression: 'bubbleSort([64,34,25,12,22,11,90])', expectedDisplay: '[11,12,22,25,34,64,90]', expectedValue: [11,12,22,25,34,64,90] },
      { label: 'Example 2',    inputDisplay: '[5,1,4,2,8]',            callExpression: 'bubbleSort([5,1,4,2,8])',            expectedDisplay: '[1,2,4,5,8]',           expectedValue: [1,2,4,5,8]           },
      { label: 'Already sorted', inputDisplay: '[1,2,3]',              callExpression: 'bubbleSort([1,2,3])',               expectedDisplay: '[1,2,3]',               expectedValue: [1,2,3]               },
    ],
  },
  starterCode: {
    python: `def bubbleSort(arr: list[int]) -> list[int]:
    # Your solution here
    return arr`,
    javascript: `function bubbleSort(arr) {
    // Your solution here
    return arr;
}`,
    java: `class Solution {
    public int[] bubbleSort(int[] arr) {

    }
}`,
    cpp: `class Solution {
public:
    vector<int> bubbleSort(vector<int>& arr) {

    }
};`,
  },
  solutions: {
    python: {
      timeComplexity: 'O(n²)',
      spaceComplexity: 'O(1)',
      code: `def bubbleSort(arr):
    n = len(arr)
    for i in range(n - 1):           # outer: n-1 passes needed
        for j in range(n - i - 1):   # inner: shrinks each pass
            if arr[j] > arr[j + 1]:  # out of order?
                arr[j], arr[j + 1] = arr[j + 1], arr[j]  # swap
    return arr                        # sorted in-place`,
    },
    javascript: {
      timeComplexity: 'O(n²)',
      spaceComplexity: 'O(1)',
      code: `function bubbleSort(arr) {
    const n = arr.length;
    for (let i = 0; i < n - 1; i++) {           // outer: n-1 passes
        for (let j = 0; j < n - i - 1; j++) {   // inner: shrinks each pass
            if (arr[j] > arr[j + 1]) {           // out of order?
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]; // swap
            }
        }
    }
    return arr;                                  // sorted in-place
}`,
    },
    java: {
      timeComplexity: 'O(n²)',
      spaceComplexity: 'O(1)',
      code: `class Solution {
    public int[] bubbleSort(int[] arr) {
        int n = arr.length;
        for (int i = 0; i < n - 1; i++) {         // outer: n-1 passes
            for (int j = 0; j < n - i - 1; j++) { // inner: shrinks each pass
                if (arr[j] > arr[j + 1]) {         // out of order?
                    int tmp = arr[j];               // swap
                    arr[j] = arr[j + 1];
                    arr[j + 1] = tmp;
                }
            }
        }
        return arr;
    }
}`,
    },
    cpp: {
      timeComplexity: 'O(n²)',
      spaceComplexity: 'O(1)',
      code: `#include <vector>
using namespace std;

class Solution {
public:
    vector<int> bubbleSort(vector<int>& arr) {
        int n = arr.size();
        for (int i = 0; i < n - 1; i++) {         // outer: n-1 passes
            for (int j = 0; j < n - i - 1; j++) { // inner: shrinks each pass
                if (arr[j] > arr[j + 1])           // out of order?
                    swap(arr[j], arr[j + 1]);       // swap
            }
        }
        return arr;
    }
};`,
    },
  },
};
