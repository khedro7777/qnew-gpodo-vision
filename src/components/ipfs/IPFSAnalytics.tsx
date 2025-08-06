
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  FileText, 
  Image, 
  Video, 
  Music, 
  Archive,
  TrendingUp,
  HardDrive,
  Users
} from 'lucide-react';

interface IPFSAnalyticsProps {
  stats: {
    totalFiles: number;
    totalSize: number;
    types: Record<string, number>;
  };
  groupId: string;
}

const IPFSAnalytics = ({ stats, groupId }: IPFSAnalyticsProps) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'image': return <Image className="w-5 h-5 text-blue-500" />;
      case 'video': return <Video className="w-5 h-5 text-red-500" />;
      case 'audio': return <Music className="w-5 h-5 text-green-500" />;
      case 'application': return <Archive className="w-5 h-5 text-purple-500" />;
      default: return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getTypePercentage = (count: number) => {
    return stats.totalFiles > 0 ? Math.round((count / stats.totalFiles) * 100) : 0;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Storage Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HardDrive className="w-5 h-5 text-blue-600" />
            Storage Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{formatBytes(stats.totalSize)}</p>
            <p className="text-sm text-gray-600">Total Storage Used</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Files Stored:</span>
              <span className="font-medium">{stats.totalFiles}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Average Size:</span>
              <span className="font-medium">
                {stats.totalFiles > 0 ? formatBytes(Math.round(stats.totalSize / stats.totalFiles)) : '0 Bytes'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* File Types Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            File Types
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {Object.entries(stats.types).map(([type, count]) => (
            <div key={type} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getTypeIcon(type)}
                  <span className="text-sm font-medium capitalize">{type}</span>
                </div>
                <Badge variant="secondary">{count}</Badge>
              </div>
              <Progress value={getTypePercentage(count)} className="h-2" />
              <p className="text-xs text-gray-600">{getTypePercentage(count)}% of total files</p>
            </div>
          ))}
          
          {Object.keys(stats.types).length === 0 && (
            <div className="text-center py-4">
              <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">No files uploaded yet</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Network Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-600" />
            Network Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">IPFS Network:</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-green-600">Connected</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Pinning Status:</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium text-blue-600">Active</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Gateway Access:</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-green-600">Available</span>
              </div>
            </div>
          </div>
          
          <div className="pt-3 border-t">
            <p className="text-xs text-gray-600 mb-2">Group ID:</p>
            <p className="font-mono text-xs bg-gray-100 p-2 rounded break-all">{groupId}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IPFSAnalytics;
