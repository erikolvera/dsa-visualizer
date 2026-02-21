import type { Problem, Step } from '../../types';

export interface MergeSortedListsVisualState {
  list1: number[];
  list2: number[];
  merged: number[];
  ptr1: number | null;  // index into list1 currently being compared
  ptr2: number | null;  // index into list2 currently being compared
  phase: 'init' | 'comparing' | 'appended' | 'drain1' | 'drain2' | 'done';
}

export function generateMergeSortedListsSteps(input: Record<string, unknown>): Step[] {
  const list1 = (input.list1 as number[]) ?? [1, 2, 4];
  const list2 = (input.list2 as number[]) ?? [1, 3, 4];
  const steps: Step[] = [];
  const merged: number[] = [];

  steps.push({
    stepIndex: 0,
    description: `Merge two sorted lists: [${list1.join('→')}] and [${list2.join('→')}]. We compare the front of each list, append the smaller value to the merged list, and advance that pointer.`,
    highlightLines: { python: [2, 3, 4], javascript: [2, 3, 4], java: [3, 4, 5], cpp: [8, 9, 10] },
    visualState: {
      list1, list2, merged: [], ptr1: list1.length > 0 ? 0 : null,
      ptr2: list2.length > 0 ? 0 : null, phase: 'init',
    } satisfies MergeSortedListsVisualState,
  });

  let i = 0;
  let j = 0;

  while (i < list1.length && j < list2.length) {
    const pick1 = list1[i] <= list2[j];

    steps.push({
      stepIndex: steps.length,
      description: `Compare list1[${i}]=${list1[i]} vs list2[${j}]=${list2[j]}. ${pick1 ? `${list1[i]} ≤ ${list2[j]}, pick from list1.` : `${list2[j]} < ${list1[i]}, pick from list2.`}`,
      highlightLines: { python: [5, 6], javascript: [5, 6], java: [6, 7], cpp: [11, 12] },
      visualState: {
        list1, list2, merged: [...merged], ptr1: i, ptr2: j, phase: 'comparing',
      } satisfies MergeSortedListsVisualState,
    });

    if (pick1) {
      merged.push(list1[i]);
      i++;
    } else {
      merged.push(list2[j]);
      j++;
    }

    steps.push({
      stepIndex: steps.length,
      description: `Appended ${merged[merged.length - 1]} to merged list: [${merged.join('→')}].`,
      highlightLines: { python: [7, 8], javascript: [7, 8], java: [8, 9], cpp: [13, 14] },
      visualState: {
        list1, list2, merged: [...merged],
        ptr1: i < list1.length ? i : null,
        ptr2: j < list2.length ? j : null,
        phase: 'appended',
      } satisfies MergeSortedListsVisualState,
    });
  }

  if (i < list1.length) {
    const remaining = list1.slice(i);
    steps.push({
      stepIndex: steps.length,
      description: `list2 exhausted. Append remaining list1 elements: [${remaining.join('→')}].`,
      highlightLines: { python: [9, 10], javascript: [9, 10], java: [10, 11], cpp: [15, 16] },
      visualState: {
        list1, list2, merged: [...merged, ...remaining], ptr1: i, ptr2: null, phase: 'drain1',
      } satisfies MergeSortedListsVisualState,
    });
    merged.push(...remaining);
  }

  if (j < list2.length) {
    const remaining = list2.slice(j);
    steps.push({
      stepIndex: steps.length,
      description: `list1 exhausted. Append remaining list2 elements: [${remaining.join('→')}].`,
      highlightLines: { python: [11, 12], javascript: [11, 12], java: [12, 13], cpp: [17, 18] },
      visualState: {
        list1, list2, merged: [...merged, ...remaining], ptr1: null, ptr2: j, phase: 'drain2',
      } satisfies MergeSortedListsVisualState,
    });
    merged.push(...remaining);
  }

  steps.push({
    stepIndex: steps.length,
    description: `Done! Merged list: [${merged.join('→')}]. Return the head of the merged linked list.`,
    highlightLines: { python: [13], javascript: [14], java: [15], cpp: [19] },
    visualState: {
      list1, list2, merged: [...merged], ptr1: null, ptr2: null, phase: 'done',
    } satisfies MergeSortedListsVisualState,
  });

  return steps;
}

const LISTNODE_SETUP = `
class ListNode {
  constructor(val, next = null) { this.val = val; this.next = next; }
}
function _toList(arr) {
  let head = null, tail = null;
  for (const v of arr) {
    const node = new ListNode(v);
    if (!tail) { head = tail = node; } else { tail.next = node; tail = node; }
  }
  return head;
}
function _toArray(node) {
  const result = [];
  while (node) { result.push(node.val); node = node.next; }
  return result;
}
`;

export const mergeTwoSortedLists: Problem = {
  id: 'merge-two-sorted-lists',
  title: 'Merge Two Sorted Lists',
  category: 'Linked Lists',
  difficulty: 'Easy',
  description:
    'You are given the heads of two sorted linked lists list1 and list2. Merge the two lists into one sorted list. The list should be made by splicing together the nodes of the first two lists. Return the head of the merged linked list.',
  examples: [
    { input: 'list1 = [1,2,4], list2 = [1,3,4]', output: '[1,1,2,3,4,4]' },
    { input: 'list1 = [], list2 = []', output: '[]' },
  ],
  defaultInput: { list1: [1, 2, 4], list2: [1, 3, 4] },
  generateSteps: generateMergeSortedListsSteps,
  testRunner: {
    setup: LISTNODE_SETUP,
    cases: [
      { label: 'Example 1', inputDisplay: '[1,2,4] + [1,3,4]', callExpression: '_toArray(mergeTwoLists(_toList([1,2,4]), _toList([1,3,4])))', expectedDisplay: '[1,1,2,3,4,4]', expectedValue: [1,1,2,3,4,4] },
      { label: 'Both empty', inputDisplay: '[] + []',           callExpression: '_toArray(mergeTwoLists(_toList([]), _toList([])))',         expectedDisplay: '[]',          expectedValue: []          },
      { label: 'One empty',  inputDisplay: '[] + [0]',          callExpression: '_toArray(mergeTwoLists(_toList([]), _toList([0])))',         expectedDisplay: '[0]',         expectedValue: [0]         },
    ],
  },
  starterCode: {
    python: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def mergeTwoLists(list1, list2):
    pass`,
    javascript: `function mergeTwoLists(list1, list2) {

}`,
    java: `class Solution {
    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {

    }
}`,
    cpp: `class Solution {
public:
    ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {

    }
};`,
  },
  solutions: {
    python: {
      timeComplexity: 'O(m + n)',
      spaceComplexity: 'O(1)',
      code: `def mergeTwoLists(list1, list2):
    dummy = ListNode(0)
    cur = dummy
    while list1 and list2:
        if list1.val <= list2.val:
            cur.next = list1
            list1 = list1.next
        else:
            cur.next = list2
            list2 = list2.next
        cur = cur.next
    cur.next = list1 or list2
    return dummy.next`,
    },
    javascript: {
      timeComplexity: 'O(m + n)',
      spaceComplexity: 'O(1)',
      code: `function mergeTwoLists(list1, list2) {
    const dummy = new ListNode(0);
    let cur = dummy;
    while (list1 && list2) {
        if (list1.val <= list2.val) {
            cur.next = list1;
            list1 = list1.next;
        } else {
            cur.next = list2;
            list2 = list2.next;
        }
        cur = cur.next;
    }
    cur.next = list1 || list2;
    return dummy.next;
}`,
    },
    java: {
      timeComplexity: 'O(m + n)',
      spaceComplexity: 'O(1)',
      code: `class Solution {
    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {
        ListNode dummy = new ListNode(0);
        ListNode cur = dummy;
        while (list1 != null && list2 != null) {
            if (list1.val <= list2.val) {
                cur.next = list1;
                list1 = list1.next;
            } else {
                cur.next = list2;
                list2 = list2.next;
            }
            cur = cur.next;
        }
        cur.next = (list1 != null) ? list1 : list2;
        return dummy.next;
    }
}`,
    },
    cpp: {
      timeComplexity: 'O(m + n)',
      spaceComplexity: 'O(1)',
      code: `class Solution {
public:
    ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {
        ListNode dummy(0);
        ListNode* cur = &dummy;
        while (list1 && list2) {
            if (list1->val <= list2->val) {
                cur->next = list1;
                list1 = list1->next;
            } else {
                cur->next = list2;
                list2 = list2->next;
            }
            cur = cur->next;
        }
        cur->next = list1 ? list1 : list2;
        return dummy.next;
    }
};`,
    },
  },
};
