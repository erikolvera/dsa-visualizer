import type { ProblemTestRunner } from '../types';

export interface RunResult {
  label: string;
  inputDisplay: string;
  expectedDisplay: string;
  got: string;
  passed: boolean;
  error?: string;
  runtime?: number;
}

function deepEqual(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export function runUserCode(
  userCode: string,
  runner: ProblemTestRunner
): RunResult[] {
  return runner.cases.map(({ label, callExpression, expectedValue, inputDisplay, expectedDisplay }) => {
    const t0 = performance.now();
    try {
      // Inject setup helpers + user code, then evaluate the call expression
      const fullCode = `
"use strict";
${runner.setup}
${userCode}
return (${callExpression});
      `.trim();

      // eslint-disable-next-line no-new-func
      const fn = new Function(fullCode);
      const result: unknown = fn();
      const elapsed = Math.round(performance.now() - t0);
      const passed = deepEqual(result, expectedValue);

      return {
        label,
        inputDisplay,
        expectedDisplay,
        got: JSON.stringify(result),
        passed,
        runtime: elapsed,
      };
    } catch (e) {
      return {
        label,
        inputDisplay,
        expectedDisplay,
        got: '',
        passed: false,
        error: (e as Error).message,
      };
    }
  });
}
