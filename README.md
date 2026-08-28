# DSA Visualizer

An interactive data structures and algorithms visualizer built for learners preparing for technical interviews. Each problem features a step-by-step animated visualization paired with a Python solution that highlights as the algorithm runs.

🔗 **Live Demo:** [dsa-visualizer-ebon.vercel.app](https://dsa-visualizer-ebon.vercel.app)

---

## Features

- **18 Blind 75 problems** across 7 categories — Arrays, Binary Search, Linked Lists, Stacks, Dynamic Programming, Trees, and Sorting
- **Step-by-step animations** — play, pause, step forward/backward, and adjust speed (0.5x / 1x / 2x)
- **Python solutions** — syntax highlighted, with per-line execution highlighting synced to the animation
- **Custom input editor** — modify algorithm inputs and watch the visualization update live
- **Collapsible sidebar** — each category has a unique color accent and can be collapsed independently
- **Difficulty tags** — Easy and Medium problems labeled throughout

---

## Tech Stack

| Tool | Purpose |
|---|---|
| **React 19** + **TypeScript** | Component-based UI with full type safety |
| **Vite** | Instant HMR in development, optimized production builds |
| **Tailwind CSS v3** | Utility-first dark-mode styling |
| **Framer Motion** | Smooth step-transition and collapse animations |
| **prism-react-renderer** | Syntax-highlighted code display |
| **Zustand** | Lightweight global state for playback and step navigation |

---

## Problems Covered (18 total)

| Category | Problem | Difficulty |
|---|---|---|
| Arrays | Two Sum | Easy |
| Arrays | Contains Duplicate | Easy |
| Arrays | Best Time to Buy and Sell Stock | Easy |
| Arrays | Maximum Subarray | Medium |
| Arrays | Majority Element | Easy |
| Arrays | Product of Array Except Self | Medium |
| Arrays | Container With Most Water | Medium |
| Binary Search | Binary Search | Easy |
| Binary Search | Find Minimum in Rotated Sorted Array | Medium |
| Linked Lists | Reverse a Linked List | Easy |
| Linked Lists | Merge Two Sorted Lists | Easy |
| Stacks | Valid Parentheses | Easy |
| Dynamic Programming | Climbing Stairs | Easy |
| Dynamic Programming | House Robber | Medium |
| Dynamic Programming | Coin Change | Medium |
| Trees | Binary Tree Inorder Traversal | Easy |
| Trees | Maximum Depth of Binary Tree | Easy |
| Sorting | Bubble Sort | Easy |

---

## Getting Started

```bash
cd dsa-visualizer
npm install
npm run dev
```

Or visit the live app at [dsa-visualizer-ebon.vercel.app](https://dsa-visualizer-ebon.vercel.app).

---

## Project Structure

```
src/
├── components/
│   ├── CodePanel/          # Description and Solution tabs
│   ├── VisualizationPanel/ # Visualizers, controls, step annotations
│   └── Sidebar.tsx         # Collapsible category navigation
├── data/
│   └── problems/           # Step generators + problem definitions (18 files)
├── store/
│   └── useProblemStore.ts  # Zustand global state
└── types/
    └── index.ts            # Shared TypeScript interfaces
```

---

## Deployment

Deployed on Vercel. The `vercel.json` at the repo root handles SPA routing and subdirectory builds automatically — no manual configuration needed.
