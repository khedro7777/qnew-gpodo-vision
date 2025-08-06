
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ipfsService, IPFSDocument, IPFSUploadResult } from '@/services/ipfsService';
import { toast } from 'sonner';

export const useIPFS = () => {
  const queryClient = useQueryClient();
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const uploadFileMutation = useMutation({
    mutationFn: async ({ 
      file, 
      groupId, 
      metadata 
    }: { 
      file: File; 
      groupId?: string; 
      metadata?: { tags?: string[]; description?: string; }
    }) => {
      setUploadProgress(0);
      
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + Math.random() * 20;
        });
      }, 200);
      
      const result = await ipfsService.uploadFile(file, groupId, metadata);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      return result;
    },
    onSuccess: (result: IPFSUploadResult) => {
      toast.success(`File uploaded to IPFS: ${result.cid.substring(0, 12)}...`, {
        description: 'Your file is now available on the decentralized network'
      });
      queryClient.invalidateQueries({ queryKey: ['ipfs-files'] });
      setTimeout(() => setUploadProgress(0), 1000);
    },
    onError: (error: Error) => {
      toast.error(`Upload failed: ${error.message}`);
      setUploadProgress(0);
    },
  });

  const retrieveFileMutation = useMutation({
    mutationFn: async (cid: string) => {
      const data = await ipfsService.retrieveFile(cid);
      return { cid, data };
    },
    onSuccess: (result) => {
      toast.success(`File retrieved: ${result.cid.substring(0, 12)}...`);
    },
    onError: (error: Error) => {
      toast.error(`Retrieval failed: ${error.message}`);
    },
  });

  const pinFileMutation = useMutation({
    mutationFn: ipfsService.pinFile.bind(ipfsService),
    onSuccess: (_, cid) => {
      toast.success(`File pinned: ${cid.substring(0, 12)}...`, {
        description: 'File is now permanently available on IPFS'
      });
    },
    onError: (error: Error) => {
      toast.error(`Pin failed: ${error.message}`);
    },
  });

  const unpinFileMutation = useMutation({
    mutationFn: ipfsService.unpinFile.bind(ipfsService),
    onSuccess: (_, cid) => {
      toast.success(`File unpinned: ${cid.substring(0, 12)}...`);
    },
    onError: (error: Error) => {
      toast.error(`Unpin failed: ${error.message}`);
    },
  });

  const deleteFileMutation = useMutation({
    mutationFn: async ({ cid, groupId }: { cid: string; groupId: string }) => {
      return await ipfsService.deleteFile(cid, groupId);
    },
    onSuccess: (success, { cid }) => {
      if (success) {
        toast.success(`File deleted: ${cid.substring(0, 12)}...`);
        queryClient.invalidateQueries({ queryKey: ['ipfs-files'] });
      } else {
        toast.error('Failed to delete file');
      }
    },
    onError: (error: Error) => {
      toast.error(`Delete failed: ${error.message}`);
    },
  });

  const addTagsMutation = useMutation({
    mutationFn: async ({ cid, groupId, tags }: { cid: string; groupId: string; tags: string[] }) => {
      return await ipfsService.addFileTags(cid, groupId, tags);
    },
    onSuccess: (success, { cid }) => {
      if (success) {
        toast.success(`Tags added to ${cid.substring(0, 12)}...`);
        queryClient.invalidateQueries({ queryKey: ['ipfs-files'] });
      } else {
        toast.error('Failed to add tags');
      }
    },
    onError: (error: Error) => {
      toast.error(`Add tags failed: ${error.message}`);
    },
  });

  const getGroupFiles = (groupId: string) => {
    return useQuery({
      queryKey: ['ipfs-files', groupId],
      queryFn: () => ipfsService.listGroupFiles(groupId),
      enabled: !!groupId,
      refetchInterval: 30000, // Refresh every 30 seconds
    });
  };

  const getStorageStats = (groupId: string) => {
    return useQuery({
      queryKey: ['ipfs-stats', groupId],
      queryFn: () => ipfsService.getStorageStats(groupId),
      enabled: !!groupId,
    });
  };

  const searchFiles = useMutation({
    mutationFn: async ({ groupId, query }: { groupId: string; query: string }) => {
      return await ipfsService.searchFiles(groupId, query);
    },
  });

  return {
    // Upload functionality
    uploadFile: uploadFileMutation.mutate,
    uploadProgress,
    isUploading: uploadFileMutation.isPending,
    
    // File operations
    retrieveFile: retrieveFileMutation.mutate,
    isRetrieving: retrieveFileMutation.isPending,
    deleteFile: deleteFileMutation.mutate,
    isDeleting: deleteFileMutation.isPending,
    
    // Pinning operations
    pinFile: pinFileMutation.mutate,
    isPinning: pinFileMutation.isPending,
    unpinFile: unpinFileMutation.mutate,
    isUnpinning: unpinFileMutation.isPending,
    
    // Metadata operations
    addTags: addTagsMutation.mutate,
    isAddingTags: addTagsMutation.isPending,
    
    // Search functionality
    searchFiles: searchFiles.mutate,
    isSearching: searchFiles.isPending,
    searchResults: searchFiles.data,
    
    // Data queries
    getGroupFiles,
    getStorageStats,
    
    // Utility functions
    didKey: ipfsService.getDIDKey(),
    getFileUrl: ipfsService.getFileUrl.bind(ipfsService),
    verifyDIDKey: ipfsService.verifyDIDKey.bind(ipfsService),
  };
};
