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
    highlightLines: [2, 3, 4],
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
      highlightLines: [5, 6],
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
      highlightLines: [7, 8],
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
      highlightLines: [9, 10],
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
      highlightLines: [11, 12],
      visualState: {
        list1, list2, merged: [...merged, ...remaining], ptr1: null, ptr2: j, phase: 'drain2',
      } satisfies MergeSortedListsVisualState,
    });
    merged.push(...remaining);
  }

  steps.push({
    stepIndex: steps.length,
    description: `Done! Merged list: [${merged.join('→')}]. Return the head of the merged linked list.`,
    highlightLines: [13],
    visualState: {
      list1, list2, merged: [...merged], ptr1: null, ptr2: null, phase: 'done',
    } satisfies MergeSortedListsVisualState,
  });

  return steps;
}

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
  solution: {
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
};
