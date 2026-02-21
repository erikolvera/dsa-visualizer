# DSA Visualizer

An interactive data structures and algorithms visualizer built for learners preparing for technical interviews. Each problem features a step-by-step animated visualization, multi-language solution display, and an in-browser practice editor.

## Features

- **13 Blind 75 problems** across Arrays, Binary Search, Linked Lists, Stacks, Dynamic Programming, Trees, and Sorting
- **Step-by-step animations** — play/pause/step-forward/step-backward with configurable speed
- **Multi-language support** — Python, JavaScript, Java, C++ with syntax highlighting
- **Practice mode** — write your own solution in-browser and run test cases instantly (JS/Python)
- **Custom input editor** — modify algorithm inputs and watch the visualization update live
- **Collapsible sidebar** with problem categories

## Tech Stack

- **React 19** + **TypeScript** — component-based UI with full type safety
- **Vite** — instant HMR in development, optimized production builds
- **Tailwind CSS v3** — utility-first dark-mode styling
- **Framer Motion** — smooth step-transition animations
- **prism-react-renderer** — syntax-highlighted code display and editor overlay
- **Zustand** — lightweight global state for playback and language selection

## Problems Covered

| Category | Problems |
|---|---|
| Arrays | Two Sum, Contains Duplicate, Best Time to Buy/Sell Stock, Maximum Subarray, Majority Element |
| Binary Search | Binary Search |
| Linked Lists | Reverse Linked List, Merge Two Sorted Lists |
| Stacks | Valid Parentheses |
| Dynamic Programming | Climbing Stairs |
| Trees | Binary Tree Inorder Traversal, Maximum Depth of Binary Tree |
| Sorting | Bubble Sort |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the app.

## Deployment

This project is configured for Vercel deployment. Push to a GitHub repository and import it in the Vercel dashboard — zero configuration required.
