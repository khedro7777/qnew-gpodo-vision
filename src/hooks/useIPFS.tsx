
import { useState, useCallback } from 'react';
import { uploadFile, retrieveFile, pinFile, unpinFile, getFileUrl } from '@/services/ipfsService';

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

      const hash = await uploadFile(file, groupId, progressCallback);
      
      // Store metadata
      const metadata: FileMetadata = {
        name: file.name,
        size: file.size,
        type: file.type,
        hash,
        uploadedAt: new Date().toISOString()
      };

      const existing = localStorage.getItem(`ipfs_files_${groupId}`);
      const files = existing ? JSON.parse(existing) : [];
      files.push(metadata);
      localStorage.setItem(`ipfs_files_${groupId}`, JSON.stringify(files));

      return hash;
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
      return await retrieveFile(hash);
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
      return await pinFile(hash);
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
      return await unpinFile(hash);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unpin failed';
      options?.onError?.(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const getUrl = useCallback((hash: string) => {
    return getFileUrl(hash);
  }, []);

  const getFiles = useCallback((groupId: string): FileMetadata[] => {
    const stored = localStorage.getItem(`ipfs_files_${groupId}`);
    return stored ? JSON.parse(stored) : [];
  }, []);

  const getStorageStats = useCallback((groupId: string) => {
    return {
      data: {
        totalFiles: getFiles(groupId).length,
        totalSize: getFiles(groupId).reduce((sum, file) => sum + file.size, 0),
        pinnedFiles: getFiles(groupId).length, // Simplified for demo
        recentUploads: getFiles(groupId).slice(-5)
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
