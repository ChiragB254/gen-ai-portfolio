---
title: "Optimizing Next.js Portfolio Performance: From 3s to 0.8s Load Time"
date: "2024-12-10"
description: "How I optimized my Next.js portfolio website to achieve sub-1-second load times with modern web performance techniques."
category: "Web Development"
tags: ["Next.js", "Performance", "Optimization", "React", "TypeScript"]
author: "Chirag Bansal"
pinned: false
published: true
readTime: 6
---

# Optimizing Next.js Portfolio Performance: From 3s to 0.8s Load Time

When I first deployed my Next.js portfolio, it was taking over 3 seconds to load. For a portfolio website, that's unacceptable. Here's how I optimized it to load in under 1 second.

## The Performance Audit

First, I used several tools to understand the bottlenecks:

- **Lighthouse**: Identified render-blocking resources
- **Next.js Bundle Analyzer**: Found oversized bundles
- **Web Vitals**: Measured real user metrics

### Initial Performance Metrics
- **FCP**: 2.1s
- **LCP**: 3.2s 
- **CLS**: 0.15
- **Bundle Size**: 847KB

## Optimization Strategies

### 1. Image Optimization

Images were the biggest culprit. Next.js Image component saved the day:

```tsx
// Before: Regular img tags
<img src="/profile.jpg" alt="Profile" />

// After: Next.js optimized images
import Image from 'next/image'

<Image
  src="/profile.jpg"
  alt="Profile"
  width={400}
  height={400}
  priority
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ..."
/>
```

**Results**: 60% reduction in image payload size

### 2. Code Splitting and Dynamic Imports

Lazy loading non-critical components:

```tsx
// Heavy animation components
const AnimatedBackground = dynamic(
  () => import('../components/AnimatedBackground'),
  { ssr: false }
)

const AdvancedCharts = dynamic(
  () => import('../components/Charts'),
  { 
    loading: () => <ChartSkeleton />,
    ssr: false 
  }
)
```

### 3. Bundle Analysis and Tree Shaking

Found and eliminated unused dependencies:

```bash
# Analyzed bundle composition
npm run analyze

# Removed unused imports
- import _ from 'lodash'  // 69KB
+ import debounce from 'lodash.debounce'  // 2KB

- import * as icons from 'react-icons'  // 124KB
+ import { FaGithub, FaLinkedin } from 'react-icons/fa'  // 4KB
```

### 4. Font Optimization

Optimized web fonts loading:

```tsx
// next/font optimization
import { Inter, JetBrains_Mono } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  fallback: ['system-ui', 'arial']
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono'
})
```

### 5. Critical CSS Inlining

Inlined critical styles to prevent render blocking:

```tsx
// components/CriticalStyles.tsx
export const CriticalStyles = () => (
  <style jsx global>{`
    body {
      margin: 0;
      padding: 0;
      font-family: ${inter.style.fontFamily};
    }
    .hero {
      min-height: 100vh;
      display: flex;
      align-items: center;
    }
  `}</style>
)
```

## Advanced Performance Techniques

### 1. Service Worker Caching

Implemented aggressive caching strategy:

```typescript
// sw.ts
import { precacheAndRoute } from 'workbox-precaching'
import { registerRoute } from 'workbox-routing'
import { StaleWhileRevalidate, CacheFirst } from 'workbox-strategies'

precacheAndRoute(self.__WB_MANIFEST)

// Cache API responses
registerRoute(
  /^https:\/\/api\.github\.com/,
  new StaleWhileRevalidate({
    cacheName: 'github-api',
    plugins: [{
      cacheKeyWillBeUsed: async ({ request }) => {
        return `${request.url}?timestamp=${Date.now()}`
      }
    }]
  })
)
```

### 2. Resource Preloading

Strategic resource preloading:

```tsx
export default function Layout({ children }) {
  return (
    <Head>
      <link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossOrigin="" />
      <link rel="prefetch" href="/api/github-stats" />
      <link rel="dns-prefetch" href="//api.github.com" />
    </Head>
  )
}
```

### 3. Component-Level Optimizations

Micro-optimizations that add up:

```tsx
// Memoized expensive components
const BlogCard = memo(({ post }: { post: BlogPost }) => {
  return <div>...</div>
})

// Virtualized long lists
import { FixedSizeList } from 'react-window'

const VirtualizedProjectList = ({ projects }) => (
  <FixedSizeList
    height={600}
    itemCount={projects.length}
    itemSize={120}
  >
    {({ index, style }) => (
      <div style={style}>
        <ProjectCard project={projects[index]} />
      </div>
    )}
  </FixedSizeList>
)
```

## Monitoring and Continuous Improvement

### Real User Monitoring

Implemented Web Vitals tracking:

```tsx
// _app.tsx
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals'

function sendToAnalytics(metric) {
  gtag('event', metric.name, {
    event_category: 'Web Vitals',
    event_label: metric.id,
    value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
    non_interaction: true,
  })
}

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    getCLS(sendToAnalytics)
    getFID(sendToAnalytics)
    getFCP(sendToAnalytics)
    getLCP(sendToAnalytics)
    getTTFB(sendToAnalytics)
  }, [])

  return <Component {...pageProps} />
}
```

## Final Performance Metrics

After optimization:

- **FCP**: 0.6s (-75%)
- **LCP**: 0.8s (-75%) 
- **CLS**: 0.02 (-87%)
- **Bundle Size**: 234KB (-72%)
- **Lighthouse Score**: 98/100

## Key Takeaways

1. **Measure First**: Don't optimize blindly
2. **Images Matter**: They're often the biggest performance bottleneck
3. **Bundle Analysis**: Know what you're shipping
4. **Progressive Loading**: Load what's needed, when it's needed
5. **Real User Metrics**: Lab metrics don't tell the full story

## Tools That Made the Difference

- **Next.js Bundle Analyzer**: Visualize bundle composition
- **Lighthouse CI**: Automated performance testing
- **Web Vitals**: Real user experience metrics
- **Chrome DevTools**: Network and performance profiling

Performance optimization is an ongoing process, not a one-time task. Regular audits and monitoring ensure your site stays fast as it grows.

---

*Want to see the optimizations in action? Check out the [source code](https://github.com/chiragbansal/portfolio) or run your own performance audit with Lighthouse.*