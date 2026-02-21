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
    highlightLines: { python: [2, 3], javascript: [2, 3], java: [3, 4], cpp: [8, 9] },
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
      highlightLines: { python: [4, 5, 6], javascript: [4, 5, 6], java: [5, 6, 7], cpp: [10, 11, 12] },
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
    highlightLines: { python: [7], javascript: [8], java: [9], cpp: [13] },
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

const TREENODE_SETUP = `
class TreeNode {
  constructor(val, left = null, right = null) { this.val = val; this.left = left; this.right = right; }
}
function _toTree(arr) {
  if (!arr || arr.length === 0 || arr[0] === null) return null;
  const root = new TreeNode(arr[0]);
  const queue = [root];
  let i = 1;
  while (queue.length > 0 && i < arr.length) {
    const node = queue.shift();
    if (i < arr.length && arr[i] !== null) { node.left = new TreeNode(arr[i]); queue.push(node.left); }
    i++;
    if (i < arr.length && arr[i] !== null) { node.right = new TreeNode(arr[i]); queue.push(node.right); }
    i++;
  }
  return root;
}
`;

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
  testRunner: {
    setup: TREENODE_SETUP,
    cases: [
      { label: 'Example 1', inputDisplay: '[3,9,20,null,null,15,7]', callExpression: 'maxDepth(_toTree([3,9,20,null,null,15,7]))', expectedDisplay: '3', expectedValue: 3 },
      { label: 'Example 2', inputDisplay: '[1,null,2]',              callExpression: 'maxDepth(_toTree([1,null,2]))',              expectedDisplay: '2', expectedValue: 2 },
      { label: 'Single',    inputDisplay: '[1]',                     callExpression: 'maxDepth(_toTree([1]))',                    expectedDisplay: '1', expectedValue: 1 },
    ],
  },
  starterCode: {
    python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val; self.left = left; self.right = right

def maxDepth(root) -> int:
    pass`,
    javascript: `function maxDepth(root) {

}`,
    java: `class Solution {
    public int maxDepth(TreeNode root) {

    }
}`,
    cpp: `class Solution {
public:
    int maxDepth(TreeNode* root) {

    }
};`,
  },
  solutions: {
    python: {
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(h)',
      code: `def maxDepth(root) -> int:
    if not root:
        return 0
    left = maxDepth(root.left)
    right = maxDepth(root.right)
    return 1 + max(left, right)`,
    },
    javascript: {
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(h)',
      code: `function maxDepth(root) {
    if (!root) return 0;
    const left = maxDepth(root.left);
    const right = maxDepth(root.right);
    return 1 + Math.max(left, right);
}`,
    },
    java: {
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(h)',
      code: `class Solution {
    public int maxDepth(TreeNode root) {
        if (root == null) return 0;
        int left = maxDepth(root.left);
        int right = maxDepth(root.right);
        return 1 + Math.max(left, right);
    }
}`,
    },
    cpp: {
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(h)',
      code: `class Solution {
public:
    int maxDepth(TreeNode* root) {
        if (!root) return 0;
        int left = maxDepth(root->left);
        int right = maxDepth(root->right);
        return 1 + max(left, right);
    }
};`,
    },
  },
};
