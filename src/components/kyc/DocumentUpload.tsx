import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload, FileText, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

interface DocumentUploadProps {
  documentType: string;
  onUploadComplete: (url: string) => void;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({ documentType, onUploadComplete }) => {
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const { user } = useAuth();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setUploadError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setUploadError('Please select a file to upload.');
      return;
    }

    if (!user) {
      setUploadError('You must be logged in to upload files.');
      return;
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}-${documentType}-${Date.now()}.${fileExt}`;
    const filePath = `kyc-documents/${fileName}`;

    try {
      // Mock upload progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setUploadProgress(i);
      }

      // Simulate successful upload
      const fileURL = `https://example.com/uploads/${filePath}`;
      onUploadComplete(fileURL);
      toast.success(`${documentType} uploaded successfully!`);
    } catch (error: any) {
      console.error('Upload error:', error);
      setUploadError(`Upload failed: ${error.message}`);
      toast.error(`Failed to upload ${documentType}`);
    } finally {
      setUploadProgress(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload {documentType}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {uploadProgress !== null && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Uploading...</p>
            <Progress value={uploadProgress} />
          </div>
        )}

        {uploadError && (
          <div className="text-red-500 text-sm">
            {uploadError}
          </div>
        )}

        <input
          type="file"
          id="document-upload"
          className="hidden"
          onChange={handleFileChange}
        />
        <Label htmlFor="document-upload" className="cursor-pointer">
          <Button variant="outline" asChild>
            <div className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              <span>Select File</span>
            </div>
          </Button>
        </Label>
        {file && (
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-gray-500" />
            <span>{file.name}</span>
          </div>
        )}

        <Button onClick={handleUpload} disabled={uploadProgress !== null}>
          Upload
        </Button>
      </CardContent>
    </Card>
  );
};

export default DocumentUpload;
