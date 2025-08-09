
import { supabase } from '@/integrations/supabase/client';

// Connection pool management
class ConnectionManager {
  private static instance: ConnectionManager;
  private connectionCount = 0;
  private readonly maxConnections = 10;
  private activeQueries = new Set<string>();

  static getInstance() {
    if (!ConnectionManager.instance) {
      ConnectionManager.instance = new ConnectionManager();
    }
    return ConnectionManager.instance;
  }

  acquireConnection(queryId: string): boolean {
    if (this.connectionCount >= this.maxConnections) {
      console.warn('Max connections reached, queuing request:', queryId);
      return false;
    }
    
    this.connectionCount++;
    this.activeQueries.add(queryId);
    return true;
  }

  releaseConnection(queryId: string) {
    if (this.activeQueries.has(queryId)) {
      this.connectionCount--;
      this.activeQueries.delete(queryId);
    }
  }

  getStats() {
    return {
      activeConnections: this.connectionCount,
      maxConnections: this.maxConnections,
      activeQueries: Array.from(this.activeQueries),
    };
  }
}

export const connectionManager = ConnectionManager.getInstance();

// Optimized Supabase client with better error handling
export const createOptimizedClient = () => {
  const client = supabase;
  
  // Add connection monitoring
  const originalFrom = client.from;
  client.from = function(table: string) {
    const queryId = `${table}-${Date.now()}-${Math.random()}`;
    const builder = originalFrom.call(this, table);
    
    // Override select to add connection management
    const originalSelect = builder.select;
    builder.select = function(...args: any[]) {
      const selectBuilder = originalSelect.apply(this, args);
      
      // Add connection tracking
      const originalThen = selectBuilder.then;
      selectBuilder.then = function(onFulfilled?: any, onRejected?: any) {
        connectionManager.acquireConnection(queryId);
        
        return originalThen.call(this, 
          (result: any) => {
            connectionManager.releaseConnection(queryId);
            return onFulfilled?.(result) || result;
          },
          (error: any) => {
            connectionManager.releaseConnection(queryId);
            console.error(`Query error for ${table}:`, error);
            return onRejected?.(error) || Promise.reject(error);
          }
        );
      };
      
      return selectBuilder;
    };
    
    return builder;
  };
  
  return client;
};

// Performance monitoring
export const performanceMonitor = {
  startTiming: (label: string) => {
    performance.mark(`${label}-start`);
  },
  
  endTiming: (label: string) => {
    performance.mark(`${label}-end`);
    try {
      performance.measure(label, `${label}-start`, `${label}-end`);
      const measure = performance.getEntriesByName(label)[0];
      console.log(`${label} took ${measure.duration.toFixed(2)}ms`);
      return measure.duration;
    } catch (error) {
      console.warn(`Could not measure performance for ${label}:`, error);
      return 0;
    }
  },
  
  clearTimings: () => {
    performance.clearMarks();
    performance.clearMeasures();
  }
};

// Memory management
export const memoryManager = {
  cleanup: () => {
    // Clear any cached data that's no longer needed
    if (typeof window !== 'undefined') {
      // Clear expired localStorage items
      const now = Date.now();
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('translation_cache_')) {
          const item = localStorage.getItem(key);
          if (item) {
            try {
              const data = JSON.parse(item);
              if (data.expiry && now > data.expiry) {
                localStorage.removeItem(key);
              }
            } catch {
              localStorage.removeItem(key);
            }
          }
        }
      });
    }
  },
  
  getMemoryUsage: () => {
    if ('memory' in performance) {
      const memInfo = (performance as any).memory;
      return {
        used: Math.round(memInfo.usedJSHeapSize / 1024 / 1024),
        total: Math.round(memInfo.totalJSHeapSize / 1024 / 1024),
        limit: Math.round(memInfo.jsHeapSizeLimit / 1024 / 1024),
      };
    }
    return null;
  }
};

// Auto cleanup on page visibility change
if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      memoryManager.cleanup();
    }
  });
}
