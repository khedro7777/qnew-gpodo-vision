
// Build optimization utilities
export const lazyImports = {
  // Lazy load heavy components
  AdminContent: () => import('@/pages/admin/AdminContent'),
  ContentBuilder: () => import('@/components/admin/ContentBuilder'),
  GroupRoom: () => import('@/pages/GroupRoom'),
  Dashboard: () => import('@/pages/Dashboard'),
};

// Code splitting helper
export const createLazyComponent = <T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  fallback?: React.ComponentType
) => {
  const LazyComponent = React.lazy(importFn);
  
  return (props: React.ComponentProps<T>) => (
    <React.Suspense fallback={fallback ? <fallback /> : <div>Loading...</div>}>
      <LazyComponent {...props} />
    </React.Suspense>
  );
};

// Resource preloading
export const preloadResources = {
  images: (urls: string[]) => {
    urls.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = url;
      document.head.appendChild(link);
    });
  },
  
  fonts: (urls: string[]) => {
    urls.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'font';
      link.type = 'font/woff2';
      link.crossOrigin = 'anonymous';
      link.href = url;
      document.head.appendChild(link);
    });
  },
  
  scripts: (urls: string[]) => {
    urls.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'script';
      link.href = url;
      document.head.appendChild(link);
    });
  }
};

// Bundle analyzer helper
export const bundleAnalyzer = {
  logChunkSizes: () => {
    if (typeof window !== 'undefined' && 'performance' in window) {
      const entries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
      const navigationEntry = entries[0];
      
      console.log('Bundle Performance:', {
        domContentLoaded: navigationEntry.domContentLoadedEventEnd - navigationEntry.domContentLoadedEventStart,
        loadComplete: navigationEntry.loadEventEnd - navigationEntry.loadEventStart,
        totalTime: navigationEntry.loadEventEnd - navigationEntry.fetchStart,
      });
    }
  }
};

// Import React for lazy component creation
import React from 'react';
