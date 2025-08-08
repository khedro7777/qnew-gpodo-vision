
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Upload, FileText, CheckCircle, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const DocumentUpload = () => {
  const { user } = useAuth();
  const [files, setFiles] = useState<{ [key: string]: File | null }>({
    passport: null,
    national_id: null,
    proof_of_address: null,
  });
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [uploading, setUploading] = useState(false);

  const documentTypes = [
    { key: 'passport', label: 'Passport', accept: '.pdf,.jpg,.jpeg,.png' },
    { key: 'national_id', label: 'National ID', accept: '.pdf,.jpg,.jpeg,.png' },
    { key: 'proof_of_address', label: 'Proof of Address', accept: '.pdf,.jpg,.jpeg,.png' },
  ];

  const handleFileChange = (documentType: string, file: File | null) => {
    setFiles(prev => ({ ...prev, [documentType]: file }));
  };

  const uploadDocument = async (documentType: string, file: File) => {
    if (!user) return;

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}_${documentType}_${Date.now()}.${fileExt}`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('kyc-documents')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('kyc-documents')
      .getPublicUrl(fileName);

    // Save document record
    const { error: dbError } = await supabase
      .from('kyc_documents')
      .insert({
        user_id: user.id,
        document_type: documentType as any,
        file_name: file.name,
        file_url: urlData.publicUrl,
        status: 'pending',
      });

    if (dbError) throw dbError;
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error('Please log in to upload documents');
      return;
    }

    const filesToUpload = Object.entries(files).filter(([_, file]) => file !== null);
    
    if (filesToUpload.length === 0) {
      toast.error('Please select at least one document to upload');
      return;
    }

    setUploading(true);

    try {
      for (const [documentType, file] of filesToUpload) {
        if (file) {
          setUploadProgress(prev => ({ ...prev, [documentType]: 0 }));
          await uploadDocument(documentType, file);
          setUploadProgress(prev => ({ ...prev, [documentType]: 100 }));
        }
      }

      toast.success('Documents uploaded successfully! Your KYC application is under review.');
      
      // Reset form
      setFiles({
        passport: null,
        national_id: null,
        proof_of_address: null,
      });
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error('Failed to upload documents: ' + error.message);
    } finally {
      setUploading(false);
      setUploadProgress({});
    }
  };

  if (!user) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Please log in to upload KYC documents.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Upload KYC Documents
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {documentTypes.map(({ key, label, accept }) => (
          <div key={key} className="space-y-2">
            <Label htmlFor={key}>{label}</Label>
            <Input
              id={key}
              type="file"
              accept={accept}
              onChange={(e) => handleFileChange(key, e.target.files?.[0] || null)}
              disabled={uploading}
            />
            {files[key] && (
              <p className="text-sm text-gray-600">
                Selected: {files[key]?.name}
              </p>
            )}
            {uploadProgress[key] !== undefined && (
              <Progress value={uploadProgress[key]} className="w-full" />
            )}
          </div>
        ))}

        <Button
          onClick={handleSubmit}
          disabled={uploading || Object.values(files).every(file => file === null)}
          className="w-full"
        >
          {uploading ? (
            <>
              <Upload className="w-4 h-4 mr-2 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Upload Documents
            </>
          )}
        </Button>

        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            Supported formats: PDF, JPG, JPEG, PNG. Maximum file size: 10MB per file.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};

export default DocumentUpload;
