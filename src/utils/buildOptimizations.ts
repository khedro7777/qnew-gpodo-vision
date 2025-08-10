
import React from 'react';

// Build optimization utilities
export const lazyImports = {
  // Lazy imports configuration
  enableLazyLoading: true,
  chunkSize: 'medium',
  preloadStrategy: 'viewport',
  
  // Component lazy loading configuration
  components: {
    dashboard: () => import('@/pages/Dashboard'),
    clientDashboard: () => import('@/pages/ClientDashboard'),
    groupRoom: () => import('@/pages/GroupRoom'),
    userProfile: () => import('@/pages/UserProfile'),
  },
  
  // Route-based code splitting
  routes: {
    '/dashboard': 'dashboard',
    '/client-dashboard': 'clientDashboard',
    '/group-room': 'groupRoom',
    '/profile': 'userProfile',
  }
};

// Memory management utilities
export const memoryUtils = {
  // Memory cleanup functions
  clearCache: () => {
    if (typeof window !== 'undefined' && 'caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => {
          caches.delete(name);
        });
      });
    }
  },
  
  // Component cleanup
  cleanupComponent: (componentName: string) => {
    console.log(`Cleaning up component: ${componentName}`);
    // Cleanup logic for specific components
  },
  
  // Memory usage monitoring
  getMemoryUsage: () => {
    if (typeof window !== 'undefined' && 'performance' in window && 'memory' in performance) {
      const memory = (performance as any).memory;
      return {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        limit: memory.jsHeapSizeLimit
      };
    }
    return null;
  }
};

// Lazy component wrapper with proper TypeScript support
export const createLazyComponent = (
  importFn: () => Promise<{ default: React.ComponentType<any> }>,
  fallback?: React.ComponentType
) => {
  const LazyComponent = React.lazy(importFn);
  
  return React.forwardRef((props: any, ref: React.ForwardedRef<any>) => 
    React.createElement(
      React.Suspense,
      { 
        fallback: fallback 
          ? React.createElement(fallback) 
          : React.createElement('div', {}, 'Loading...')
      },
      React.createElement(LazyComponent, { ...props, ref })
    )
  );
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
    }
  }
};
