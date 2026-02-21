import type { Problem, Step } from '../../types';

export interface ReverseListInput {
  values: number[];
}

export interface LinkedListVisualState {
  nodes: number[];
  prevIdx: number | null;   // -1 = null pointer
  currIdx: number | null;
  nextIdx: number | null;
  reversedUpTo: number;     // first `reversedUpTo` nodes have reversed arrows
  phase: 'init' | 'processing' | 'done';
}

export function generateReverseListSteps(input: Record<string, unknown>): Step[] {
  const values = (input.values as number[]) ?? [1, 2, 3, 4, 5];
  const steps: Step[] = [];

  // Edge case: empty list
  if (values.length === 0) {
    steps.push({
      stepIndex: 0,
      description: 'Input list is empty. Return null — there is nothing to reverse.',
      highlightLines: { python: [2, 3], javascript: [2, 3], java: [3, 4], cpp: [4, 5] },
      visualState: {
        nodes: [],
        prevIdx: null,
        currIdx: null,
        nextIdx: null,
        reversedUpTo: 0,
        phase: 'done',
      } satisfies LinkedListVisualState,
    });
    return steps;
  }

  // Step 0: Show original list
  steps.push({
    stepIndex: 0,
    description: `Starting with linked list: ${values.join(' → ')}. We'll use three pointers — prev, curr, and next — to reverse one link at a time.`,
    highlightLines: {
      python: [2, 3],
      javascript: [2, 3],
      java: [3, 4],
      cpp: [4, 5],
    },
    visualState: {
      nodes: [...values],
      prevIdx: null,
      currIdx: 0,
      nextIdx: null,
      reversedUpTo: 0,
      phase: 'init',
    } satisfies LinkedListVisualState,
  });

  let reversedUpTo = 0;

  for (let currIdx = 0; currIdx < values.length; currIdx++) {
    const nextIdx = currIdx + 1 < values.length ? currIdx + 1 : null;
    const prevIdx = currIdx - 1 >= 0 ? currIdx - 1 : null;

    // Save next pointer
    steps.push({
      stepIndex: steps.length,
      description:
        nextIdx !== null
          ? `Save next = node(${values[nextIdx]}) before we overwrite the link. curr = node(${values[currIdx]}), prev = ${prevIdx !== null ? `node(${values[prevIdx]})` : 'null'}.`
          : `curr = node(${values[currIdx]}), next = null (end of list). prev = ${prevIdx !== null ? `node(${values[prevIdx]})` : 'null'}.`,
      highlightLines: {
        python: [5],
        javascript: [5],
        java: [6],
        cpp: [7],
      },
      visualState: {
        nodes: [...values],
        prevIdx,
        currIdx,
        nextIdx,
        reversedUpTo,
        phase: 'processing',
      } satisfies LinkedListVisualState,
    });

    // Reverse link
    steps.push({
      stepIndex: steps.length,
      description: `Reverse the link: node(${values[currIdx]}).next = ${prevIdx !== null ? `node(${values[prevIdx]})` : 'null'}. Arrow now points backward.`,
      highlightLines: {
        python: [6],
        javascript: [6],
        java: [7],
        cpp: [8],
      },
      visualState: {
        nodes: [...values],
        prevIdx,
        currIdx,
        nextIdx,
        reversedUpTo: currIdx + 1,
        phase: 'processing',
      } satisfies LinkedListVisualState,
    });

    reversedUpTo = currIdx + 1;

    // Advance pointers
    steps.push({
      stepIndex: steps.length,
      description: `Advance pointers: prev = node(${values[currIdx]}), curr = ${nextIdx !== null ? `node(${values[nextIdx]})` : 'null'}.`,
      highlightLines: {
        python: [7, 8],
        javascript: [7, 8],
        java: [8, 9],
        cpp: [9, 10],
      },
      visualState: {
        nodes: [...values],
        prevIdx: currIdx,
        currIdx: nextIdx,
        nextIdx: null,
        reversedUpTo,
        phase: nextIdx === null ? 'done' : 'processing',
      } satisfies LinkedListVisualState,
    });
  }

  // Final step: return
  steps.push({
    stepIndex: steps.length,
    description: `curr is null — we've processed all nodes. Return prev, which points to the new head: node(${values[values.length - 1]}). Reversed list: ${[...values].reverse().join(' → ')}.`,
    highlightLines: {
      python: [9],
      javascript: [10],
      java: [11],
      cpp: [12],
    },
    visualState: {
      nodes: [...values],
      prevIdx: values.length - 1,
      currIdx: null,
      nextIdx: null,
      reversedUpTo: values.length,
      phase: 'done',
    } satisfies LinkedListVisualState,
  });

  return steps;
}

export const reverseLinkedList: Problem = {
  id: 'reverse-linked-list',
  title: 'Reverse a Linked List',
  category: 'Linked Lists',
  difficulty: 'Easy',
  description:
    'Given the head of a singly linked list, reverse the list, and return the reversed list.',
  examples: [
    { input: 'head = [1,2,3,4,5]', output: '[5,4,3,2,1]' },
    { input: 'head = [1,2]', output: '[2,1]' },
  ],
  defaultInput: { values: [1, 2, 3, 4, 5] },
  generateSteps: generateReverseListSteps,
  testRunner: {
    setup: `
function ListNode(val, next) { this.val = (val===undefined ? 0 : val); this.next = (next===undefined ? null : next); }
function _toList(arr) { if (!arr || !arr.length) return null; let h = new ListNode(arr[0]); let c = h; for (let i=1;i<arr.length;i++){c.next=new ListNode(arr[i]);c=c.next;} return h; }
function _toArray(head) { let a=[]; while(head){a.push(head.val);head=head.next;} return a; }
    `.trim(),
    cases: [
      { label: 'Example 1', inputDisplay: '[1,2,3,4,5]', callExpression: '_toArray(reverseList(_toList([1,2,3,4,5])))', expectedDisplay: '[5,4,3,2,1]', expectedValue: [5,4,3,2,1] },
      { label: 'Example 2', inputDisplay: '[1,2]',        callExpression: '_toArray(reverseList(_toList([1,2])))',         expectedDisplay: '[2,1]',       expectedValue: [2,1]       },
      { label: 'Example 3', inputDisplay: '[1]',          callExpression: '_toArray(reverseList(_toList([1])))',           expectedDisplay: '[1]',         expectedValue: [1]         },
    ],
  },
  starterCode: {
    python: `def reverseList(head):
    pass`,
    javascript: `function reverseList(head) {

}`,
    java: `class Solution {
    public ListNode reverseList(ListNode head) {

    }
}`,
    cpp: `class Solution {
public:
    ListNode* reverseList(ListNode* head) {

    }
};`,
  },
  solutions: {
    python: {
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      code: `def reverseList(head):
    prev = None          # will become new tail
    curr = head          # start at the head
    while curr:
        next_node = curr.next   # save next before overwriting
        curr.next = prev        # reverse the link
        prev = curr             # advance prev
        curr = next_node        # advance curr
    return prev          # prev is the new head`,
    },
    javascript: {
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      code: `function reverseList(head) {
    let prev = null;          // will become new tail
    let curr = head;          // start at the head
    while (curr !== null) {
        const next = curr.next;    // save next before overwriting
        curr.next = prev;          // reverse the link
        prev = curr;               // advance prev
        curr = next;               // advance curr
    }
    return prev;              // prev is the new head
}`,
    },
    java: {
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      code: `class Solution {
    public ListNode reverseList(ListNode head) {
        ListNode prev = null;        // will become new tail
        ListNode curr = head;        // start at the head
        while (curr != null) {
            ListNode next = curr.next;  // save next before overwriting
            curr.next = prev;           // reverse the link
            prev = curr;               // advance prev
            curr = next;               // advance curr
        }
        return prev;                 // prev is the new head
    }
}`,
    },
    cpp: {
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      code: `class Solution {
public:
    ListNode* reverseList(ListNode* head) {
        ListNode* prev = nullptr;      // will become new tail
        ListNode* curr = head;         // start at the head
        while (curr != nullptr) {
            ListNode* next = curr->next;  // save next before overwriting
            curr->next = prev;            // reverse the link
            prev = curr;                  // advance prev
            curr = next;                  // advance curr
        }
        return prev;                   // prev is the new head
    }
};`,
    },
  },
};
