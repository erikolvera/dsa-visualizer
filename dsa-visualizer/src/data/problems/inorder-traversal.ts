import type { Problem, Step } from '../../types';

export interface InorderInput {
  tree: (number | null)[];  // 1-indexed level-order array
}

export interface TreeVisualState {
  tree: (number | null)[];  // 1-indexed, index 0 unused
  currentNodeIdx: number | null;
  visitedIds: number[];     // indices of fully visited nodes
  activeStack: number[];    // indices in the recursive call stack
  result: number[];
  phase: 'init' | 'traversing' | 'visiting' | 'done';
}

interface TreeNode {
  val: number;
  idx: number;  // 1-indexed position in tree array
  left: number | null;
  right: number | null;
}

function buildNode(tree: (number | null)[], idx: number): TreeNode | null {
  if (idx >= tree.length || tree[idx] == null) return null;
  return {
    val: tree[idx] as number,
    idx,
    left: 2 * idx < tree.length && tree[2 * idx] != null ? 2 * idx : null,
    right: 2 * idx + 1 < tree.length && tree[2 * idx + 1] != null ? 2 * idx + 1 : null,
  };
}

export function generateInorderSteps(input: Record<string, unknown>): Step[] {
  // 1-indexed level-order: index 1 is root, 2i=left, 2i+1=right
  const treeRaw = (input.tree as (number | null)[]) ?? [null, 4, 2, 6, 1, 3, 5, 7];
  // Normalize: ensure index 0 is null (unused), rest are the tree
  const tree: (number | null)[] = treeRaw[0] === null ? treeRaw : [null, ...treeRaw];

  const steps: Step[] = [];
  const visitedIds: number[] = [];
  const result: number[] = [];

  steps.push({
    stepIndex: 0,
    description: `Starting inorder traversal (Left → Root → Right). We recursively go as far left as possible before visiting the current node.`,
    highlightLines: [2],
    visualState: {
      tree,
      currentNodeIdx: null,
      visitedIds: [],
      activeStack: [],
      result: [],
      phase: 'init',
    } satisfies TreeVisualState,
  });

  // Simulate recursive inorder traversal
  function traverse(idx: number, callStack: number[]) {
    const node = buildNode(tree, idx);
    if (!node) return;

    const newStack = [...callStack, idx];

    // Entering node — going left
    steps.push({
      stepIndex: steps.length,
      description: node.left !== null
        ? `At node ${node.val}. Has left child (${tree[node.left!]}). Recurse left first.`
        : `At node ${node.val}. No left child. Visit this node next.`,
      highlightLines: [4, 5],
      visualState: {
        tree,
        currentNodeIdx: idx,
        visitedIds: [...visitedIds],
        activeStack: newStack,
        result: [...result],
        phase: 'traversing',
      } satisfies TreeVisualState,
    });

    // Go left
    if (node.left !== null) {
      traverse(node.left, newStack);
    }

    // Visit current node
    result.push(node.val);
    visitedIds.push(idx);

    steps.push({
      stepIndex: steps.length,
      description: `Visit node ${node.val} — add to result. Result so far: [${result.join(', ')}]`,
      highlightLines: [6],
      visualState: {
        tree,
        currentNodeIdx: idx,
        visitedIds: [...visitedIds],
        activeStack: newStack,
        result: [...result],
        phase: 'visiting',
      } satisfies TreeVisualState,
    });

    // Go right
    if (node.right !== null) {
      steps.push({
        stepIndex: steps.length,
        description: `Node ${node.val} has right child (${tree[node.right]}). Recurse right.`,
        highlightLines: [7, 8],
        visualState: {
          tree,
          currentNodeIdx: idx,
          visitedIds: [...visitedIds],
          activeStack: newStack,
          result: [...result],
          phase: 'traversing',
        } satisfies TreeVisualState,
      });
      traverse(node.right, newStack);
    }
  }

  if (tree.length > 1 && tree[1] != null) {
    traverse(1, []);
  }

  // Final step
  steps.push({
    stepIndex: steps.length,
    description: `Traversal complete! Inorder result: [${result.join(', ')}]. This is the sorted order for a Binary Search Tree.`,
    highlightLines: [9],
    visualState: {
      tree,
      currentNodeIdx: null,
      visitedIds: [...visitedIds],
      activeStack: [],
      result: [...result],
      phase: 'done',
    } satisfies TreeVisualState,
  });

  return steps;
}

export const inorderTraversal: Problem = {
  id: 'inorder-traversal',
  title: 'Binary Tree Inorder Traversal',
  category: 'Trees',
  difficulty: 'Easy',
  description:
    'Given the root of a binary tree, return the inorder traversal of its nodes\' values (Left → Root → Right).',
  examples: [
    { input: 'root = [4,2,6,1,3,5,7]', output: '[1,2,3,4,5,6,7]' },
    { input: 'root = [1,null,2,null,null,null,3]', output: '[1,2,3]' },
  ],
  defaultInput: { tree: [null, 4, 2, 6, 1, 3, 5, 7] },
  generateSteps: generateInorderSteps,
  solution: {
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    code: `def inorderTraversal(root):
    result = []
    def inorder(node):
        if not node:          # base case: null node
            return
        inorder(node.left)    # 1. recurse left
        result.append(node.val)  # 2. visit current
        inorder(node.right)   # 3. recurse right
    inorder(root)
    return result`,
  },
};
