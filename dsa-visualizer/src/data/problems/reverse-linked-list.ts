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
      highlightLines: [2, 3],
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
    highlightLines: [2, 3],
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
      highlightLines: [5],
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
      highlightLines: [6],
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
      highlightLines: [7, 8],
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
    highlightLines: [9],
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
  solution: {
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
};
