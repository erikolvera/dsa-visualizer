import type { Problem, Step } from '../../types';

export interface ValidParenthesesInput {
  s: string;
}

export interface StackVisualState {
  chars: string[];
  currentIdx: number | null;
  stack: string[];
  phase: 'init' | 'pushing' | 'popping' | 'invalid' | 'valid';
  isOpening: boolean | null;
  isMatching: boolean | null;
}

const MATCHING: Record<string, string> = { ')': '(', ']': '[', '}': '{' };
const OPENERS = new Set(['(', '[', '{']);

export function generateValidParenthesesSteps(input: Record<string, unknown>): Step[] {
  const s = (input.s as string) ?? '({[]})';
  const chars = s.split('');
  const steps: Step[] = [];
  const stack: string[] = [];

  // Step 0: Initialize
  steps.push({
    stepIndex: 0,
    description: `Starting with string "${s}". We'll use a stack: push opening brackets, and for closing brackets, check that they match the top of the stack.`,
    highlightLines: {
      python: [2, 3],
      javascript: [2, 3],
      java: [3, 4],
      cpp: [4, 5],
    },
    visualState: {
      chars,
      currentIdx: null,
      stack: [],
      phase: 'init',
      isOpening: null,
      isMatching: null,
    } satisfies StackVisualState,
  });

  let valid = true;

  for (let i = 0; i < chars.length; i++) {
    const char = chars[i];
    const isOpening = OPENERS.has(char);

    if (isOpening) {
      // Push step
      stack.push(char);
      steps.push({
        stepIndex: steps.length,
        description: `'${char}' is an opening bracket. Push it onto the stack. Stack: [${stack.map(c => `'${c}'`).join(', ')}]`,
        highlightLines: {
          python: [4, 5, 6],
          javascript: [4, 5, 6],
          java: [5, 6, 7],
          cpp: [6, 7, 8],
        },
        visualState: {
          chars,
          currentIdx: i,
          stack: [...stack],
          phase: 'pushing',
          isOpening: true,
          isMatching: null,
        } satisfies StackVisualState,
      });
    } else {
      // Closing bracket
      const expected = MATCHING[char];
      const top = stack[stack.length - 1];
      const matches = stack.length > 0 && top === expected;

      if (!matches) {
        valid = false;
        steps.push({
          stepIndex: steps.length,
          description: `'${char}' is a closing bracket. Expected '${expected}' on top of stack, but found ${stack.length === 0 ? 'an empty stack' : `'${top}'`}. INVALID — return false.`,
          highlightLines: {
            python: [4, 7, 8],
            javascript: [4, 7, 8],
            java: [5, 8, 9],
            cpp: [6, 9, 10],
          },
          visualState: {
            chars,
            currentIdx: i,
            stack: [...stack],
            phase: 'invalid',
            isOpening: false,
            isMatching: false,
          } satisfies StackVisualState,
        });
        break;
      } else {
        stack.pop();
        steps.push({
          stepIndex: steps.length,
          description: `'${char}' is a closing bracket. Top of stack is '${top}' — it matches! Pop it. Stack: [${stack.map(c => `'${c}'`).join(', ') || 'empty'}]`,
          highlightLines: {
            python: [4, 7, 9, 10],
            javascript: [4, 7, 9, 10],
            java: [5, 8, 10, 11],
            cpp: [6, 9, 11, 12],
          },
          visualState: {
            chars,
            currentIdx: i,
            stack: [...stack],
            phase: 'popping',
            isOpening: false,
            isMatching: true,
          } satisfies StackVisualState,
        });
      }
    }
  }

  // Final result
  if (valid) {
    steps.push({
      stepIndex: steps.length,
      description: stack.length === 0
        ? `All characters processed. Stack is empty — every opening bracket was matched. Return true ✓`
        : `All characters processed, but stack still has [${stack.map(c => `'${c}'`).join(', ')}] unmatched. Return false ✗`,
      highlightLines: {
        python: [11],
        javascript: [11],
        java: [12],
        cpp: [13],
      },
      visualState: {
        chars,
        currentIdx: null,
        stack: [...stack],
        phase: stack.length === 0 ? 'valid' : 'invalid',
        isOpening: null,
        isMatching: null,
      } satisfies StackVisualState,
    });
  }

  return steps;
}

export const validParentheses: Problem = {
  id: 'valid-parentheses',
  title: 'Valid Parentheses',
  category: 'Stacks',
  difficulty: 'Easy',
  description:
    'Given a string s containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid. An input string is valid if: open brackets are closed by the same type of brackets, and open brackets are closed in the correct order.',
  examples: [
    { input: 's = "({[]})"', output: 'true' },
    { input: 's = "([)]"', output: 'false' },
  ],
  defaultInput: { s: '({[]})' },
  generateSteps: generateValidParenthesesSteps,
  testRunner: {
    setup: '',
    cases: [
      { label: 'Example 1', inputDisplay: '"({[]})"', callExpression: 'isValid("({[]})")',  expectedDisplay: 'true',  expectedValue: true  },
      { label: 'Example 2', inputDisplay: '"([)]"',   callExpression: 'isValid("([)]")',    expectedDisplay: 'false', expectedValue: false },
      { label: 'Example 3', inputDisplay: '"{[]}"',   callExpression: 'isValid("{[]}")',    expectedDisplay: 'true',  expectedValue: true  },
      { label: 'Example 4', inputDisplay: '"(]"',     callExpression: 'isValid("(]")',      expectedDisplay: 'false', expectedValue: false },
    ],
  },
  starterCode: {
    python: `def isValid(s: str) -> bool:
    pass`,
    javascript: `function isValid(s) {

}`,
    java: `class Solution {
    public boolean isValid(String s) {

    }
}`,
    cpp: `class Solution {
public:
    bool isValid(string s) {

    }
};`,
  },
  solutions: {
    python: {
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
      code: `def isValid(s: str) -> bool:
    stack = []
    mapping = {')': '(', ']': '[', '}': '{'}
    for char in s:
        if char not in mapping:          # opening bracket
            stack.append(char)           # push it
        elif not stack or stack[-1] != mapping[char]:  # no match
            return False                 # mismatch → invalid
        else:
            stack.pop()                  # matched → pop
    return not stack                     # valid if stack is empty`,
    },
    javascript: {
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
      code: `function isValid(s) {
    const stack = [];
    const mapping = {')': '(', ']': '[', '}': '{'};
    for (const char of s) {
        if (!(char in mapping)) {                    // opening bracket
            stack.push(char);                        // push it
        } else if (!stack.length || stack[stack.length-1] !== mapping[char]) {
            return false;                            // mismatch → invalid
        } else {
            stack.pop();                             // matched → pop
        }
    }
    return stack.length === 0;                       // valid if empty
}`,
    },
    java: {
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
      code: `import java.util.*;

class Solution {
    public boolean isValid(String s) {
        Deque<Character> stack = new ArrayDeque<>();
        Map<Character,Character> map = Map.of(')',  '(', ']', '[', '}', '{');
        for (char c : s.toCharArray()) {
            if (!map.containsKey(c)) {               // opening bracket
                stack.push(c);                       // push it
            } else if (stack.isEmpty() || stack.peek() != map.get(c)) {
                return false;                        // mismatch → invalid
            } else {
                stack.pop();                         // matched → pop
            }
        }
        return stack.isEmpty();                      // valid if empty
    }
}`,
    },
    cpp: {
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
      code: `#include <stack>
#include <unordered_map>
using namespace std;

class Solution {
public:
    bool isValid(string s) {
        stack<char> st;
        unordered_map<char,char> mp = {{')', '('}, {']', '['}, {'}', '{'}};
        for (char c : s) {
            if (!mp.count(c)) {                      // opening bracket
                st.push(c);                          // push it
            } else if (st.empty() || st.top() != mp[c]) {
                return false;                        // mismatch → invalid
            } else {
                st.pop();                            // matched → pop
            }
        }
        return st.empty();                           // valid if empty
    }
};`,
    },
  },
};
