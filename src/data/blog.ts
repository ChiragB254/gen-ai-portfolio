import { BlogPost } from '@/types';

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: "I'm Teaching Myself Triton - Here's What's Actually Happening",
    date: '2025-09-12',
    description: 'Part-1 Describes how I got started with triton, why you should and How to get started',
    category: 'Triton',
    tags: ['Nvidia', 'Triton', 'GPU Programming'],
    author: 'Sahibpreet Singh',
    pinned: true,
    published: true,
    slug: 'teaching-myself-triton-whats-happening',
    content: `Starting from the beginning, July 2025 - super scared and tense. I was doing everything left, right, and center to secure a job. In the middle of all this, I felt super helpless, and during that time I got the idea to teach myself something I always feared: GPU programming.

## Why You Should Care (The Honest Answer)

Look, I won't sell you dreams. Triton isn't going to magically 10x your career overnight. But here's what it actually did for me: it removed the fear. That intimidating gap between "I use PyTorch" and "I understand what my GPU is doing"? Triton at least helps bridge that.

### 1. Write Custom GPU Kernels
You can write custom functions (kernels) and control certain aspects of your GPU, preventing it from sitting idle most of the time.

### 2. The Code Is Actually Readable
Here's the shocking part - Triton kernels look like NumPy code. Not 200 lines of CUDA with thread management and synchronization barriers.`
  },
  {
    id: '2',
    title: 'What is Triton and Getting Started - Day 1',
    date: '2025-08-10',
    description: 'What is Triton, How to get started and Why I started?',
    category: 'Triton',
    tags: ['LLM Inference', 'Triton', 'Inference Optimization'],
    author: 'Sahibpreet Singh',
    pinned: false,
    published: true,
    slug: 'what-is-triton-getting-started',
    content: `Welcome to my journey into GPU kernel programming. This isn't just another tutorial—it's my real-time exploration of how parallel computing works, driven by curiosity and the dream of creating blazing-fast ML kernels.

## Why I Started This Journey

I wasn't trying to solve a specific performance problem. I was driven by pure curiosity: **How does the world of parallel computing actually work?**

Every time I see libraries like Unsloth achieving 2x-5x speedups on language models with their "custom Triton kernels," I wonder: *What magic are they doing under the hood?*`
  },
  {
    id: '3',
    title: 'Building High-Performance ML Kernels',
    date: '2025-07-15',
    description: 'Deep dive into optimizing machine learning operations with custom GPU kernels',
    category: 'Machine Learning',
    tags: ['ML', 'GPU', 'Performance', 'CUDA'],
    author: 'Chirag Rana',
    pinned: false,
    published: true,
    slug: 'building-high-performance-ml-kernels'
  },
  {
    id: '4',
    title: 'Next.js 14 and the Future of React',
    date: '2025-06-20',
    description: 'Exploring the latest features in Next.js 14 and what they mean for React development',
    category: 'Web Development',
    tags: ['Next.js', 'React', 'TypeScript', 'Performance'],
    author: 'Chirag Rana',
    pinned: false,
    published: true,
    slug: 'nextjs-14-future-of-react'
  },
  {
    id: '5',
    title: 'AI-Powered Code Generation: The Reality',
    date: '2025-05-10',
    description: 'A honest look at the current state of AI-powered development tools and their limitations',
    category: 'AI',
    tags: ['AI', 'Code Generation', 'Development Tools', 'Productivity'],
    author: 'Chirag Rana',
    pinned: false,
    published: true,
    slug: 'ai-powered-code-generation-reality'
  }
];

export const blogCategories = [
  'All',
  'Triton',
  'Machine Learning',
  'Web Development',
  'AI'
];