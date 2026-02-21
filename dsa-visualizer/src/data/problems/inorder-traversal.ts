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
    highlightLines: {
      python: [2],
      javascript: [2],
      java: [4],
      cpp: [5],
    },
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
      highlightLines: {
        python: [4, 5],
        javascript: [4, 5],
        java: [6, 7],
        cpp: [7, 8],
      },
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
      highlightLines: {
        python: [6],
        javascript: [6],
        java: [8],
        cpp: [9],
      },
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
        highlightLines: {
          python: [7, 8],
          javascript: [7, 8],
          java: [9, 10],
          cpp: [10, 11],
        },
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
    highlightLines: {
      python: [9],
      javascript: [9],
      java: [11],
      cpp: [12],
    },
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
  testRunner: {
    setup: `
function TreeNode(val, left, right) { this.val=(val===undefined?0:val); this.left=(left===undefined?null:left); this.right=(right===undefined?null:right); }
function _toTree(arr) { if(!arr||!arr.length)return null; var nodes=arr.map(function(v){return v==null?null:new TreeNode(v);}); for(var i=0;i<nodes.length;i++){if(nodes[i]){nodes[i].left=nodes[2*i+1]!=null?nodes[2*i+1]:null;nodes[i].right=nodes[2*i+2]!=null?nodes[2*i+2]:null;}} return nodes[0]; }
    `.trim(),
    cases: [
      { label: 'Example 1', inputDisplay: '[4,2,6,1,3,5,7]',        callExpression: 'inorderTraversal(_toTree([4,2,6,1,3,5,7]))',        expectedDisplay: '[1,2,3,4,5,6,7]', expectedValue: [1,2,3,4,5,6,7] },
      { label: 'Example 2', inputDisplay: '[1,null,2,null,null,null,3]', callExpression: 'inorderTraversal(_toTree([1,null,2,null,null,null,3]))', expectedDisplay: '[1,2,3]',         expectedValue: [1,2,3]         },
      { label: 'Single',    inputDisplay: '[1]',                     callExpression: 'inorderTraversal(_toTree([1]))',                     expectedDisplay: '[1]',             expectedValue: [1]             },
    ],
  },
  starterCode: {
    python: `def inorderTraversal(root) -> list[int]:
    result = []
    # Your solution here
    return result`,
    javascript: `function inorderTraversal(root) {
    const result = [];
    // Your solution here
    return result;
}`,
    java: `class Solution {
    public List<Integer> inorderTraversal(TreeNode root) {

    }
}`,
    cpp: `class Solution {
public:
    vector<int> inorderTraversal(TreeNode* root) {

    }
};`,
  },
  solutions: {
    python: {
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
    javascript: {
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
      code: `function inorderTraversal(root) {
    const result = [];
    function inorder(node) {
        if (!node) return;        // base case: null node
        inorder(node.left);       // 1. recurse left
        result.push(node.val);    // 2. visit current
        inorder(node.right);      // 3. recurse right
    }
    inorder(root);
    return result;
}`,
    },
    java: {
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
      code: `import java.util.*;

class Solution {
    public List<Integer> inorderTraversal(TreeNode root) {
        List<Integer> result = new ArrayList<>();
        inorder(root, result);
        return result;
    }
    private void inorder(TreeNode node, List<Integer> result) {
        if (node == null) return;   // base case: null node
        inorder(node.left, result); // 1. recurse left
        result.add(node.val);       // 2. visit current
        inorder(node.right, result);// 3. recurse right
    }
}`,
    },
    cpp: {
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
      code: `#include <vector>
using namespace std;

class Solution {
public:
    vector<int> inorderTraversal(TreeNode* root) {
        vector<int> result;
        inorder(root, result);
        return result;
    }
    void inorder(TreeNode* node, vector<int>& result) {
        if (!node) return;              // base case: null node
        inorder(node->left, result);    // 1. recurse left
        result.push_back(node->val);    // 2. visit current
        inorder(node->right, result);   // 3. recurse right
    }
};`,
    },
  },
};
