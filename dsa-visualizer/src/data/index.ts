import type { Problem } from '../types';
import { twoSum } from './problems/two-sum';
import { containsDuplicate } from './problems/contains-duplicate';
import { bestTimeToBuyStock } from './problems/best-time-to-buy-stock';
import { maximumSubarray } from './problems/maximum-subarray';
import { majorityElement } from './problems/majority-element';
import { binarySearch } from './problems/binary-search';
import { reverseLinkedList } from './problems/reverse-linked-list';
import { mergeTwoSortedLists } from './problems/merge-two-sorted-lists';
import { validParentheses } from './problems/valid-parentheses';
import { climbingStairs } from './problems/climbing-stairs';
import { inorderTraversal } from './problems/inorder-traversal';
import { maximumDepthBinaryTree } from './problems/maximum-depth-binary-tree';
import { bubbleSort } from './problems/bubble-sort';

export const problems: Problem[] = [
  // Arrays
  twoSum,
  containsDuplicate,
  bestTimeToBuyStock,
  maximumSubarray,
  majorityElement,
  // Binary Search
  binarySearch,
  // Linked Lists
  reverseLinkedList,
  mergeTwoSortedLists,
  // Stacks
  validParentheses,
  // Dynamic Programming
  climbingStairs,
  // Trees
  inorderTraversal,
  maximumDepthBinaryTree,
  // Sorting
  bubbleSort,
];

export const problemsById: Record<string, Problem> = Object.fromEntries(
  problems.map((p) => [p.id, p])
);
