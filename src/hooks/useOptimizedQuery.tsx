
import { useQuery, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { useCallback, useRef, useEffect } from 'react';

interface OptimizedQueryOptions<T> extends Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'> {
  queryKey: readonly unknown[];
  queryFn: () => Promise<T>;
  debounceMs?: number;
  enableOfflineSupport?: boolean;
}

export const useOptimizedQuery = <T,>({
  queryKey,
  queryFn,
  debounceMs = 300,
  enableOfflineSupport = true,
  ...options
}: OptimizedQueryOptions<T>) => {
  const queryClient = useQueryClient();
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  
  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  // Optimized query function with debouncing
  const debouncedQueryFn = useCallback(() => {
    return new Promise<T>((resolve, reject) => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      
      debounceRef.current = setTimeout(async () => {
        try {
          const result = await queryFn();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      }, debounceMs);
    });
  }, [queryFn, debounceMs]);

  return useQuery({
    queryKey,
    queryFn: debouncedQueryFn,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    retry: (failureCount, error: any) => {
      // Don't retry on 4xx errors
      if (error?.statusCode >= 400 && error?.statusCode < 500) {
        return false;
      }
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    networkMode: enableOfflineSupport ? 'offlineFirst' : 'online',
    ...options,
  });
};

// Hook for batch operations
export const useBatchOperations = () => {
  const queryClient = useQueryClient();
  
  const invalidateQueries = useCallback((patterns: string[]) => {
    patterns.forEach(pattern => {
      queryClient.invalidateQueries({ queryKey: [pattern] });
    });
  }, [queryClient]);

  const prefetchQueries = useCallback(async (queries: Array<{ key: readonly unknown[], fn: () => Promise<any> }>) => {
    const promises = queries.map(({ key, fn }) =>
      queryClient.prefetchQuery({
        queryKey: key,
        queryFn: fn,
        staleTime: 5 * 60 * 1000,
      })
    );
    
    await Promise.allSettled(promises);
  }, [queryClient]);

  return {
    invalidateQueries,
    prefetchQueries,
  };
};
