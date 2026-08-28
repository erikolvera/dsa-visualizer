import type { Problem, Step } from '../../types';

export interface CoinChangeVisualState {
  coins: number[];
  amount: number;
  dp: (number | null)[];
  currentAmount: number | null;
  currentCoin: number | null;
  phase: 'init' | 'filling' | 'done';
  result: number;
}

const INF = Infinity;

export function generateCoinChangeSteps(input: Record<string, unknown>): Step[] {
  const coins = (input.coins as number[]) ?? [1, 2, 5];
  const amount = (input.amount as number) ?? 7;
  const steps: Step[] = [];
  const dp: (number | null)[] = [null, ...new Array(amount).fill(null)];

  steps.push({
    stepIndex: 0,
    description: `Coin Change: find minimum coins to make amount ${amount} using coins [${coins.join(', ')}]. dp[i] = minimum coins to make amount i. dp[0] = 0 (base case: 0 coins for amount 0). All others start at ∞.`,
    highlightLines: [2, 3],
    visualState: { coins, amount, dp: [...dp], currentAmount: null, currentCoin: null, phase: 'init', result: -1 } satisfies CoinChangeVisualState,
  });

  const dpVals: number[] = new Array(amount + 1).fill(INF);
  dpVals[0] = 0;
  dp[0] = 0;

  steps.push({
    stepIndex: steps.length,
    description: 'Base case: dp[0] = 0. It takes 0 coins to make amount 0.',
    highlightLines: [4],
    visualState: { coins, amount, dp: [...dp], currentAmount: 0, currentCoin: null, phase: 'filling', result: -1 } satisfies CoinChangeVisualState,
  });

  for (let i = 1; i <= amount; i++) {
    let bestCoin: number | null = null;

    for (const coin of coins) {
      if (coin <= i && dpVals[i - coin] + 1 < dpVals[i]) {
        dpVals[i] = dpVals[i - coin] + 1;
        bestCoin = coin;
      }
    }

    dp[i] = dpVals[i] === INF ? null : dpVals[i];

    steps.push({
      stepIndex: steps.length,
      description: dpVals[i] === INF
        ? `Amount ${i}: no combination of coins [${coins.join(', ')}] reaches exactly ${i}. dp[${i}] = ∞.`
        : `Amount ${i}: best = dp[${i - bestCoin!}] + 1 coin (${bestCoin}) = ${dpVals[i - bestCoin!]} + 1 = ${dpVals[i]}. dp[${i}] = ${dpVals[i]}.`,
      highlightLines: [5, 6, 7],
      visualState: { coins, amount, dp: [...dp], currentAmount: i, currentCoin: bestCoin, phase: 'filling', result: -1 } satisfies CoinChangeVisualState,
    });
  }

  const result = dpVals[amount] === INF ? -1 : dpVals[amount];
  steps.push({
    stepIndex: steps.length,
    description: result === -1
      ? `dp[${amount}] = ∞ — cannot make amount ${amount} with coins [${coins.join(', ')}]. Return −1.`
      : `dp[${amount}] = ${result}. Minimum ${result} coin(s) needed to make ${amount}. Return ${result}.`,
    highlightLines: [8],
    visualState: { coins, amount, dp: [...dp], currentAmount: null, currentCoin: null, phase: 'done', result } satisfies CoinChangeVisualState,
  });

  return steps;
}

export const coinChange: Problem = {
  id: 'coin-change',
  title: 'Coin Change',
  category: 'Dynamic Programming',
  difficulty: 'Medium',
  description:
    'You are given an integer array coins representing coins of various denominations and an integer amount representing a total amount of money. Return the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return -1. You may assume that you have an infinite number of each kind of coin.',
  examples: [
    { input: 'coins = [1,2,5], amount = 11', output: '3' },
    { input: 'coins = [2], amount = 3', output: '-1' },
  ],
  defaultInput: { coins: [1, 2, 5], amount: 7 },
  generateSteps: generateCoinChangeSteps,
  solution: {
    timeComplexity: 'O(amount × coins)',
    spaceComplexity: 'O(amount)',
    code: `def coinChange(coins: list[int], amount: int) -> int:
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    for i in range(1, amount + 1):
        for coin in coins:
            if coin <= i:
                dp[i] = min(dp[i], dp[i - coin] + 1)
    return dp[amount] if dp[amount] != float('inf') else -1`,
  },
};
