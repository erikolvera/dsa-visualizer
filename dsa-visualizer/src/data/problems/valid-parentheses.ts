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
    highlightLines: [2, 3],
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
        highlightLines: [4, 5, 6],
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
          highlightLines: [4, 7, 8],
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
          highlightLines: [4, 7, 9, 10],
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
      highlightLines: [11],
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
  solution: {
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
};
