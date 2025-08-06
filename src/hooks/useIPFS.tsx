
import { useState, useCallback } from 'react';
import { ipfsService } from '@/services/ipfsService';

interface UseIPFSOptions {
  onProgress?: (progress: number) => void;
  onError?: (error: string) => void;
}

interface FileMetadata {
  name: string;
  size: number;
  type: string;
  hash: string;
  uploadedAt: string;
  tags?: string[];
  description?: string;
}

interface StorageStats {
  totalFiles: number;
  totalSize: number;
  pinnedFiles: number;
  recentUploads: FileMetadata[];
  types: Record<string, number>;
}

export const useIPFS = () => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const upload = useCallback(async (
    file: File, 
    groupId: string, 
    options?: UseIPFSOptions
  ) => {
    setLoading(true);
    setProgress(0);
    
    try {
      const progressCallback = (p: number) => {
        setProgress(p);
        options?.onProgress?.(p);
      };

      const result = await ipfsService.uploadFile(file, groupId);
      
      // Store metadata
      const metadata: FileMetadata = {
        name: file.name,
        size: file.size,
        type: file.type,
        hash: result.cid,
        uploadedAt: new Date().toISOString()
      };

      const existing = localStorage.getItem(`ipfs_files_${groupId}`);
      const files = existing ? JSON.parse(existing) : [];
      files.push(metadata);
      localStorage.setItem(`ipfs_files_${groupId}`, JSON.stringify(files));

      return result.cid;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      options?.onError?.(errorMessage);
      throw error;
    } finally {
      setLoading(false);
      setProgress(0);
    }
  }, []);

  const retrieve = useCallback(async (hash: string, options?: UseIPFSOptions) => {
    setLoading(true);
    try {
      return await ipfsService.retrieveFile(hash);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Retrieval failed';
      options?.onError?.(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const pin = useCallback(async (hash: string, options?: UseIPFSOptions) => {
    setLoading(true);
    try {
      return await ipfsService.pinFile(hash);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Pin failed';
      options?.onError?.(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const unpin = useCallback(async (hash: string, options?: UseIPFSOptions) => {
    setLoading(true);
    try {
      return await ipfsService.unpinFile(hash);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unpin failed';
      options?.onError?.(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const getUrl = useCallback((hash: string): string => {
    return `https://ipfs.io/ipfs/${hash}`;
  }, []);

  const getFiles = useCallback((groupId: string): FileMetadata[] => {
    const stored = localStorage.getItem(`ipfs_files_${groupId}`);
    return stored ? JSON.parse(stored) : [];
  }, []);

  const getStorageStats = useCallback((groupId: string) => {
    const files = getFiles(groupId);
    const serviceStats = ipfsService.getStorageStats(groupId);
    
    return {
      data: {
        totalFiles: files.length,
        totalSize: files.reduce((sum, file) => sum + file.size, 0),
        pinnedFiles: files.length, // Simplified for demo
        recentUploads: files.slice(-5),
        types: serviceStats.types
      } as StorageStats
    };
  }, [getFiles]);

  return {
    upload,
    retrieve,
    pin,
    unpin,
    getUrl,
    getFiles,
    getStorageStats,
    loading,
    progress
  };
};
