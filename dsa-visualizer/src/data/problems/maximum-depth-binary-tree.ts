import type { Problem, Step } from '../../types';

export interface MaxDepthVisualState {
  // Tree represented as level-order array (null = missing node)
  tree: (number | null)[];
  // Which node index (level-order) is currently being visited
  currentNode: number | null;
  // Depth recorded for each node index
  nodeDepths: Record<number, number>;
  maxDepth: number;
  phase: 'init' | 'visiting' | 'done';
}

function levelOrderToTree(arr: (number | null)[]): (number | null)[] {
  return arr;
}

export function generateMaxDepthSteps(input: Record<string, unknown>): Step[] {
  const tree = (input.tree as (number | null)[]) ?? [3, 9, 20, null, null, 15, 7];
  const steps: Step[] = [];

  steps.push({
    stepIndex: 0,
    description: `Find max depth of binary tree [${tree.map(v => v === null ? 'null' : v).join(', ')}]. We use DFS: recursively compute depth(node) = 1 + max(depth(left), depth(right)). Base case: null node returns 0.`,
    highlightLines: [2, 3],
    visualState: {
      tree: levelOrderToTree(tree), currentNode: null, nodeDepths: {}, maxDepth: 0, phase: 'init',
    } satisfies MaxDepthVisualState,
  });

  const nodeDepths: Record<number, number> = {};

  function dfsWithSteps(idx: number): number {
    if (idx >= tree.length || tree[idx] === null) return 0;

    const leftDepth = dfsWithSteps(2 * idx + 1);
    const rightDepth = dfsWithSteps(2 * idx + 2);
    const depth = 1 + Math.max(leftDepth, rightDepth);
    nodeDepths[idx] = depth;

    steps.push({
      stepIndex: steps.length,
      description: `Node ${tree[idx]} (index ${idx}): left depth = ${leftDepth}, right depth = ${rightDepth} → depth = 1 + max(${leftDepth}, ${rightDepth}) = ${depth}.`,
      highlightLines: [4, 5, 6],
      visualState: {
        tree: levelOrderToTree(tree),
        currentNode: idx,
        nodeDepths: { ...nodeDepths },
        maxDepth: Math.max(...Object.values(nodeDepths), 0),
        phase: 'visiting',
      } satisfies MaxDepthVisualState,
    });

    return depth;
  }

  const result = dfsWithSteps(0);

  steps.push({
    stepIndex: steps.length,
    description: `DFS complete. Maximum depth of the tree is ${result}. Return ${result}.`,
    highlightLines: [7],
    visualState: {
      tree: levelOrderToTree(tree),
      currentNode: null,
      nodeDepths: { ...nodeDepths },
      maxDepth: result,
      phase: 'done',
    } satisfies MaxDepthVisualState,
  });

  return steps;
}

export const maximumDepthBinaryTree: Problem = {
  id: 'maximum-depth-binary-tree',
  title: 'Maximum Depth of Binary Tree',
  category: 'Trees',
  difficulty: 'Easy',
  description:
    'Given the root of a binary tree, return its maximum depth. A binary tree\'s maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.',
  examples: [
    { input: 'root = [3,9,20,null,null,15,7]', output: '3' },
    { input: 'root = [1,null,2]', output: '2' },
  ],
  defaultInput: { tree: [3, 9, 20, null, null, 15, 7] },
  generateSteps: generateMaxDepthSteps,
  solution: {
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(h)',
    code: `def maxDepth(root) -> int:
    if not root:
        return 0
    left = maxDepth(root.left)
    right = maxDepth(root.right)
    return 1 + max(left, right)`,
  },
};
