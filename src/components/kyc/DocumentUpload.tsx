
import React, { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Upload, File, CheckCircle, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const DocumentUpload = () => {
  const { user, profile } = useAuth();
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState<string | null>(null);

  const { data: documents, isLoading } = useQuery({
    queryKey: ['kyc-documents', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('kyc_documents')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const uploadMutation = useMutation({
    mutationFn: async ({ file, documentType }: { file: File; documentType: string }) => {
      if (!user) throw new Error('No user found');

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${documentType}-${Date.now()}.${fileExt}`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('kyc-documents')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('kyc-documents')
        .getPublicUrl(fileName);

      // Save to database
      const { error: dbError } = await supabase
        .from('kyc_documents')
        .insert({
          user_id: user.id,
          document_type: documentType as any,
          file_url: publicUrl,
          file_name: file.name,
          status: 'submitted'
        });

      if (dbError) throw dbError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kyc-documents'] });
      toast.success('Document uploaded successfully');
      setUploading(null);
    },
    onError: (error) => {
      toast.error('Upload failed: ' + error.message);
      setUploading(null);
    },
  });

  const handleFileUpload = useCallback(
    (documentType: string) => async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please upload a PDF, JPEG, or PNG file');
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }

      setUploading(documentType);
      uploadMutation.mutate({ file, documentType });
    },
    [uploadMutation]
  );

  const getRequiredDocumentTypes = () => {
    switch (profile?.role) {
      case 'supplier':
        return [
          { type: 'company_registration', label: 'Company Registration' },
          { type: 'business_license', label: 'Business License' }
        ];
      default:
        return [
          { type: 'id_card', label: 'ID Card' },
          { type: 'passport', label: 'Passport' }
        ];
    }
  };

  const getDocumentStatus = (documentType: string) => {
    return documents?.find(doc => doc.document_type === documentType);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-productivity-blue" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Documents</h3>
        <p className="text-gray-600 text-sm">
          Please upload clear, readable copies of your documents. Accepted formats: PDF, JPEG, PNG (max 5MB)
        </p>
      </div>

      <div className="grid gap-4">
        {getRequiredDocumentTypes().map(({ type, label }) => {
          const existingDoc = getDocumentStatus(type);
          const isUploading = uploading === type;

          return (
            <Card key={type} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <File className="w-5 h-5 text-gray-400" />
                  <div>
                    <h4 className="font-medium text-gray-900">{label}</h4>
                    {existingDoc && (
                      <p className="text-sm text-gray-500">{existingDoc.file_name}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {existingDoc ? (
                    <div className="flex items-center gap-2">
                      {existingDoc.status === 'submitted' && (
                        <span className="text-sm text-yellow-600">Under Review</span>
                      )}
                      {existingDoc.status === 'approved' && (
                        <>
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-green-600">Approved</span>
                        </>
                      )}
                      {existingDoc.status === 'rejected' && (
                        <>
                          <X className="w-4 h-4 text-red-500" />
                          <span className="text-sm text-red-600">Rejected</span>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="relative">
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleFileUpload(type)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        disabled={isUploading}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={isUploading}
                        className="relative"
                      >
                        {isUploading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4 mr-2" />
                            Upload
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {existingDoc?.status === 'rejected' && existingDoc.reviewer_notes && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-700">
                    <strong>Rejection reason:</strong> {existingDoc.reviewer_notes}
                  </p>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default DocumentUpload;
