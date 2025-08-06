
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
  Copy,
  ExternalLink,
  Search,
  Filter,
  Share
} from 'lucide-react';
import { toast } from 'sonner';

interface IPFSFileManagerProps {
  groupId?: string;
}

const IPFSFileManager = ({ groupId }: IPFSFileManagerProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  
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

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || file.type.startsWith(filterType);
    return matchesSearch && matchesType;
  });

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

  const shareFile = (cid: string, fileName: string) => {
    const shareUrl = `https://ipfs.io/ipfs/${cid}`;
    if (navigator.share) {
      navigator.share({
        title: fileName,
        text: `Check out this file on IPFS: ${fileName}`,
        url: shareUrl
      });
    } else {
      copyToClipboard(shareUrl);
      toast.success('Share URL copied to clipboard');
    }
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

  const getFileTypeFilter = () => {
    const types = new Set(files.map(file => file.type.split('/')[0]));
    return Array.from(types);
  };

  return (
    <div className="space-y-6">
      {/* Header with Search and Filters */}
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

        {/* Search and Filter Controls */}
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border rounded-md text-sm"
          >
            <option value="all">All Types</option>
            <option value="image">Images</option>
            <option value="video">Videos</option>
            <option value="audio">Audio</option>
            <option value="application">Documents</option>
          </select>
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
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-gray-900">Stored Documents</h4>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>{filteredFiles.length} files found</span>
          </div>
        </div>
        
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading documents...</p>
          </div>
        ) : filteredFiles.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">
              {searchTerm || filterType !== 'all' ? 'No documents match your search' : 'No documents uploaded yet'}
            </p>
          </div>
        ) : (
          <div className="grid gap-3">
            {filteredFiles.map((file) => (
              <div
                key={file.cid}
                className="flex items-center justify-between p-4 border rounded-lg hover:shadow-sm transition-shadow bg-white"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {getFileIcon(file.type)}
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-900 truncate">{file.name}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
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
                    onClick={() => shareFile(file.cid, file.name)}
                    title="Share file"
                  >
                    <Share className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(file.cid)}
                    title="Copy CID"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDownload(file.cid, file.name)}
                    title="Download file"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => pinFile(file.cid)}
                    disabled={isPinning}
                    title="Pin file"
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
                    title="Open in new tab"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* IPFS Statistics and Info */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Storage Statistics</h4>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Files:</span>
              <span className="font-medium">{files.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Storage Used:</span>
              <span className="font-medium">
                {formatFileSize(files.reduce((total, file) => total + file.size, 0))}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Network:</span>
              <span className="font-medium text-green-600">IPFS Mainnet</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">DID Authentication</h4>
          <div className="text-sm">
            <p className="text-gray-600 mb-2">Your DID Key:</p>
            <p className="font-mono text-xs bg-gray-100 p-2 rounded break-all">{didKey}</p>
            <div className="mt-3 flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-green-600 text-sm">Authenticated & Verified</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default IPFSFileManager;
