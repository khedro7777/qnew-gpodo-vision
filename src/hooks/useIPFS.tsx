
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ipfsService, IPFSDocument, IPFSUploadResult } from '@/services/ipfsService';
import { toast } from 'sonner';

export const useIPFS = () => {
  const queryClient = useQueryClient();
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const uploadFileMutation = useMutation({
    mutationFn: async ({ file, groupId }: { file: File; groupId?: string }) => {
      setUploadProgress(0);
      const result = await ipfsService.uploadFile(file, groupId);
      setUploadProgress(100);
      return result;
    },
    onSuccess: (result: IPFSUploadResult) => {
      toast.success(`File uploaded to IPFS: ${result.cid.substring(0, 12)}...`);
      queryClient.invalidateQueries({ queryKey: ['ipfs-files'] });
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
    onError: (error: Error) => {
      toast.error(`Retrieval failed: ${error.message}`);
    },
  });

  const pinFileMutation = useMutation({
    mutationFn: ipfsService.pinFile.bind(ipfsService),
    onSuccess: () => {
      toast.success('File pinned successfully');
    },
    onError: (error: Error) => {
      toast.error(`Pin failed: ${error.message}`);
    },
  });

  const getGroupFiles = (groupId: string) => {
    return useQuery({
      queryKey: ['ipfs-files', groupId],
      queryFn: () => ipfsService.listGroupFiles(groupId),
      enabled: !!groupId,
    });
  };

  return {
    uploadFile: uploadFileMutation.mutate,
    uploadProgress,
    isUploading: uploadFileMutation.isPending,
    retrieveFile: retrieveFileMutation.mutate,
    isRetrieving: retrieveFileMutation.isPending,
    pinFile: pinFileMutation.mutate,
    isPinning: pinFileMutation.isPending,
    getGroupFiles,
    didKey: ipfsService.getDIDKey(),
    getFileUrl: ipfsService.getFileUrl.bind(ipfsService),
  };
};
