
import React from 'react';

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
    <React.Suspense fallback={fallback ? React.createElement(fallback) : <div>Loading...</div>}>
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

// Performance monitoring
export const performanceMonitor = {
  measureComponentRender: (componentName: string) => {
    if (typeof window !== 'undefined' && 'performance' in window) {
      performance.mark(`${componentName}-start`);
      return () => {
        performance.mark(`${componentName}-end`);
        performance.measure(`${componentName}-render`, `${componentName}-start`, `${componentName}-end`);
      };
    }
    return () => {};
  },
  
  trackMemoryUsage: () => {
    if (typeof window !== 'undefined' && 'performance' in window && 'memory' in performance) {
      const memory = (performance as any).memory;
      console.log('Memory Usage:', {
        used: Math.round(memory.usedJSHeapSize / 1048576 * 100) / 100,
        total: Math.round(memory.totalJSHeapSize / 1048576 * 100) / 100,
        limit: Math.round(memory.jsHeapSizeLimit / 1048576 * 100) / 100
      });
    }
  }
};

// Image optimization
export const imageOptimization = {
  preloadCriticalImages: (urls: string[]) => {
    urls.forEach(url => {
      const img = new Image();
      img.src = url;
    });
  },
  
  lazyLoadImages: () => {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            const src = img.dataset.src;
            if (src) {
              img.src = src;
              img.classList.remove('lazy');
              imageObserver.unobserve(img);
            }
          }
        });
      });
      
      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    }
  }
};

// Bundle size optimization
export const bundleOptimization = {
  dynamicImports: {
    loadComponent: async (componentPath: string) => {
      try {
        const module = await import(componentPath);
        return module.default;
      } catch (error) {
        console.error(`Failed to load component: ${componentPath}`, error);
        return null;
      }
    },
    
    loadUtility: async (utilityPath: string) => {
      try {
        const module = await import(utilityPath);
        return module;
      } catch (error) {
        console.error(`Failed to load utility: ${utilityPath}`, error);
        return null;
      }
    }
  },
  
  treeShakenImports: {
    loadash: () => import('lodash-es'),
    dateUtils: () => import('date-fns'),
  }
};
