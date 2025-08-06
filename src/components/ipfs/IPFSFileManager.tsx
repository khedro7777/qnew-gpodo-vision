
import React, { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useIPFS } from '@/hooks/useIPFS';
import { 
  Upload, 
  Download, 
  Pin, 
  FileText, 
  Image, 
  Video, 
  Music,
  Archive,
  Trash2,
  Copy,
  ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';

interface IPFSFileManagerProps {
  groupId?: string;
}

const IPFSFileManager = ({ groupId }: IPFSFileManagerProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const { 
    uploadFile, 
    uploadProgress, 
    isUploading,
    retrieveFile,
    isRetrieving,
    pinFile,
    isPinning,
    getGroupFiles,
    didKey,
    getFileUrl
  } = useIPFS();

  const { data: files = [], isLoading } = getGroupFiles(groupId || 'default');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadFile({ file, groupId });
    }
  };

  const handleDownload = async (cid: string, fileName: string) => {
    try {
      const url = await getFileUrl(cid);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      toast.error('Failed to download file');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="w-4 h-4" />;
    if (type.startsWith('video/')) return <Video className="w-4 h-4" />;
    if (type.startsWith('audio/')) return <Music className="w-4 h-4" />;
    if (type.includes('zip') || type.includes('rar')) return <Archive className="w-4 h-4" />;
    return <FileText className="w-4 h-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">IPFS Document Vault</h3>
            <p className="text-sm text-gray-600">Decentralized document storage with DID authentication</p>
          </div>
          <Badge variant="outline" className="font-mono text-xs">
            {didKey.substring(0, 20)}...
          </Badge>
        </div>

        {/* Upload Section */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileUpload}
            className="hidden"
            multiple={false}
          />
          
          {isUploading ? (
            <div className="space-y-3">
              <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
              <p className="text-sm text-gray-600">Uploading to IPFS...</p>
              <Progress value={uploadProgress} className="w-full max-w-md mx-auto" />
            </div>
          ) : (
            <div className="space-y-3">
              <Upload className="w-12 h-12 text-gray-400 mx-auto" />
              <div>
                <p className="text-lg font-medium text-gray-900">Upload to IPFS</p>
                <p className="text-sm text-gray-600">Drag and drop or click to upload documents</p>
              </div>
              <Button onClick={() => fileInputRef.current?.click()}>
                Select Files
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Files List */}
      <Card className="p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Stored Documents</h4>
        
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading documents...</p>
          </div>
        ) : files.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No documents uploaded yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {files.map((file) => (
              <div
                key={file.cid}
                className="flex items-center justify-between p-4 border rounded-lg hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {getFileIcon(file.type)}
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-900 truncate">{file.name}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>{formatFileSize(file.size)}</span>
                      <span>Uploaded: {new Date(file.uploadedAt).toLocaleDateString()}</span>
                      <span className="font-mono">CID: {file.cid.substring(0, 12)}...</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(file.cid)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDownload(file.cid, file.name)}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => pinFile(file.cid)}
                    disabled={isPinning}
                  >
                    <Pin className="w-4 h-4" />
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={async () => {
                      const url = await getFileUrl(file.cid);
                      window.open(url, '_blank');
                    }}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* IPFS Info */}
      <Card className="p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">IPFS Information</h4>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-medium text-gray-900">DID Key:</p>
            <p className="font-mono text-gray-600 break-all">{didKey}</p>
          </div>
          <div>
            <p className="font-medium text-gray-900">Network:</p>
            <p className="text-gray-600">IPFS Mainnet</p>
          </div>
          <div>
            <p className="font-medium text-gray-900">Total Files:</p>
            <p className="text-gray-600">{files.length}</p>
          </div>
          <div>
            <p className="font-medium text-gray-900">Storage Used:</p>
            <p className="text-gray-600">
              {formatFileSize(files.reduce((total, file) => total + file.size, 0))}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default IPFSFileManager;
