
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, FileText, Image } from 'lucide-react';
import { toast } from 'sonner';

interface FileUploadProps {
  onFilesChange: (files: File[]) => void;
  maxFiles?: number;
  acceptedTypes?: string[];
  maxSizeInMB?: number;
}

const FileUpload = ({ 
  onFilesChange, 
  maxFiles = 5, 
  acceptedTypes = ['.jpg', '.jpeg', '.png', '.pdf', '.doc', '.docx', '.xls', '.xlsx'],
  maxSizeInMB = 10 
}: FileUploadProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    
    // Validate file types
    const validFiles = selectedFiles.filter(file => {
      const extension = '.' + file.name.split('.').pop()?.toLowerCase();
      return acceptedTypes.includes(extension);
    });

    if (validFiles.length !== selectedFiles.length) {
      toast.error('Some files have unsupported formats');
    }

    // Validate file sizes
    const validSizeFiles = validFiles.filter(file => {
      return file.size <= maxSizeInMB * 1024 * 1024;
    });

    if (validSizeFiles.length !== validFiles.length) {
      toast.error(`Some files exceed ${maxSizeInMB}MB limit`);
    }

    // Check total file count
    const totalFiles = [...files, ...validSizeFiles].slice(0, maxFiles);
    
    if (totalFiles.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} files allowed`);
    }

    setFiles(totalFiles);
    onFilesChange(totalFiles);
  };

  const removeFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    onFilesChange(updatedFiles);
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png'].includes(extension || '')) {
      return <Image className="w-4 h-4" />;
    }
    return <FileText className="w-4 h-4" />;
  };

  return (
    <div className="space-y-4">
      <Button
        type="button"
        variant="outline"
        onClick={() => fileInputRef.current?.click()}
        className="w-full"
      >
        <Upload className="w-4 h-4 mr-2" />
        Upload Files
      </Button>
      
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={acceptedTypes.join(',')}
        onChange={handleFileSelect}
        className="hidden"
      />

      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm text-gray-600">Selected files ({files.length}/{maxFiles}):</p>
          {files.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <div className="flex items-center gap-2">
                {getFileIcon(file.name)}
                <span className="text-sm truncate">{file.name}</span>
                <span className="text-xs text-gray-500">
                  ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeFile(index)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
