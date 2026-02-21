import type { Problem, Step } from '../../types';

export interface StockVisualState {
  prices: number[];
  currentDay: number | null;
  minPriceDay: number;
  maxProfit: number;
  currentProfit: number;
  phase: 'init' | 'new_min' | 'checking' | 'new_profit' | 'done';
}

export function generateStockSteps(input: Record<string, unknown>): Step[] {
  const prices = (input.prices as number[]) ?? [7, 1, 5, 3, 6, 4];
  const steps: Step[] = [];

  if (prices.length === 0) {
    steps.push({
      stepIndex: 0,
      description: 'Empty price array — return 0 (no trades possible).',
      highlightLines: { python: [2], javascript: [2], java: [3], cpp: [7] },
      visualState: { prices: [], currentDay: null, minPriceDay: 0, maxProfit: 0, currentProfit: 0, phase: 'done' } satisfies StockVisualState,
    });
    return steps;
  }

  let minPriceDay = 0;
  let maxProfit = 0;

  steps.push({
    stepIndex: 0,
    description: `Prices: [${prices.join(', ')}]. We track the lowest "buy" price seen and the best profit achievable. One pass through the array is enough.`,
    highlightLines: { python: [2, 3], javascript: [2, 3], java: [3, 4], cpp: [7, 8] },
    visualState: { prices, currentDay: 0, minPriceDay: 0, maxProfit: 0, currentProfit: 0, phase: 'init' } satisfies StockVisualState,
  });

  for (let i = 0; i < prices.length; i++) {
    if (prices[i] < prices[minPriceDay]) {
      steps.push({
        stepIndex: steps.length,
        description: `Day ${i}: price = ${prices[i]}. This is lower than our current minimum (${prices[minPriceDay]} on day ${minPriceDay}). Update buy day to day ${i}.`,
        highlightLines: { python: [5, 6], javascript: [5, 6], java: [6, 7], cpp: [11, 12] },
        visualState: { prices, currentDay: i, minPriceDay, maxProfit, currentProfit: 0, phase: 'new_min' } satisfies StockVisualState,
      });
      minPriceDay = i;
    } else {
      const newProfit = prices[i] - prices[minPriceDay];
      const isNewMax = newProfit > maxProfit;

      steps.push({
        stepIndex: steps.length,
        description: isNewMax
          ? `Day ${i}: price = ${prices[i]}. Profit = ${prices[i]} − ${prices[minPriceDay]} = ${newProfit}. New best profit! Update max profit to ${newProfit}.`
          : `Day ${i}: price = ${prices[i]}. Profit = ${prices[i]} − ${prices[minPriceDay]} = ${newProfit}. Not better than current best (${maxProfit}).`,
        highlightLines: {
          python: isNewMax ? [7, 8] : [7],
          javascript: isNewMax ? [7, 8] : [7],
          java: isNewMax ? [8, 9] : [8],
          cpp: isNewMax ? [13, 14] : [13],
        },
        visualState: { prices, currentDay: i, minPriceDay, maxProfit, currentProfit: newProfit, phase: isNewMax ? 'new_profit' : 'checking' } satisfies StockVisualState,
      });

      if (isNewMax) maxProfit = newProfit;
    }
  }

  steps.push({
    stepIndex: steps.length,
    description: maxProfit > 0
      ? `All days scanned. Best trade: buy at day ${minPriceDay} (price ${prices[minPriceDay]}), max profit = ${maxProfit}. Return ${maxProfit}.`
      : `All days scanned. Prices only decrease — no profitable trade exists. Return 0.`,
    highlightLines: { python: [9], javascript: [11], java: [12], cpp: [16] },
    visualState: { prices, currentDay: null, minPriceDay, maxProfit, currentProfit: 0, phase: 'done' } satisfies StockVisualState,
  });

  return steps;
}

export const bestTimeToBuyStock: Problem = {
  id: 'best-time-to-buy-stock',
  title: 'Best Time to Buy and Sell Stock',
  category: 'Arrays',
  difficulty: 'Easy',
  description:
    'You are given an array prices where prices[i] is the price of a given stock on the ith day. You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock. Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.',
  examples: [
    { input: 'prices = [7,1,5,3,6,4]', output: '5' },
    { input: 'prices = [7,6,4,3,1]', output: '0' },
  ],
  defaultInput: { prices: [7, 1, 5, 3, 6, 4] },
  generateSteps: generateStockSteps,
  testRunner: {
    setup: '',
    cases: [
      { label: 'Example 1', inputDisplay: '[7,1,5,3,6,4]', callExpression: 'maxProfit([7,1,5,3,6,4])', expectedDisplay: '5', expectedValue: 5 },
      { label: 'Example 2', inputDisplay: '[7,6,4,3,1]',   callExpression: 'maxProfit([7,6,4,3,1])',   expectedDisplay: '0', expectedValue: 0 },
      { label: 'Example 3', inputDisplay: '[1,2]',          callExpression: 'maxProfit([1,2])',          expectedDisplay: '1', expectedValue: 1 },
    ],
  },
  starterCode: {
    python: `def maxProfit(prices: list[int]) -> int:
    pass`,
    javascript: `function maxProfit(prices) {

}`,
    java: `class Solution {
    public int maxProfit(int[] prices) {

    }
}`,
    cpp: `class Solution {
public:
    int maxProfit(vector<int>& prices) {

    }
};`,
  },
  solutions: {
    python: {
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      code: `def maxProfit(prices: list[int]) -> int:
    min_price = prices[0]         # cheapest buy day seen
    max_profit = 0                # best profit so far
    for price in prices:
        if price < min_price:     # found a cheaper buy?
            min_price = price     # update buy day
        elif price - min_price > max_profit:   # better profit?
            max_profit = price - min_price     # update profit
    return max_profit`,
    },
    javascript: {
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      code: `function maxProfit(prices) {
    let minPrice = prices[0];        // cheapest buy day seen
    let maxProfit = 0;               // best profit so far
    for (const price of prices) {
        if (price < minPrice) {      // found a cheaper buy?
            minPrice = price;        // update buy day
        } else if (price - minPrice > maxProfit) {  // better profit?
            maxProfit = price - minPrice;            // update profit
        }
    }
    return maxProfit;
}`,
    },
    java: {
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      code: `class Solution {
    public int maxProfit(int[] prices) {
        int minPrice = prices[0];     // cheapest buy day seen
        int maxProfit = 0;            // best profit so far
        for (int price : prices) {
            if (price < minPrice) {   // found a cheaper buy?
                minPrice = price;     // update buy day
            } else if (price - minPrice > maxProfit) {  // better profit?
                maxProfit = price - minPrice;            // update profit
            }
        }
        return maxProfit;
    }
}`,
    },
    cpp: {
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      code: `#include <vector>
using namespace std;

class Solution {
public:
    int maxProfit(vector<int>& prices) {
        int minPrice = prices[0];     // cheapest buy day seen
        int maxProfit = 0;            // best profit so far
        for (int price : prices) {
            if (price < minPrice) {   // found a cheaper buy?
                minPrice = price;     // update buy day
            } else if (price - minPrice > maxProfit) {  // better profit?
                maxProfit = price - minPrice;            // update profit
            }
        }
        return maxProfit;
    }
};`,
    },
  },
};
