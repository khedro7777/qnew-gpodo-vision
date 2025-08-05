
import React from 'react';
import { FileText, Download, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GroupDocumentsProps {
  groupId: string;
}

const GroupDocuments = ({ groupId }: GroupDocumentsProps) => {
  // Mock data for now - this would come from Supabase storage in a real implementation
  const documents = [
    {
      id: '1',
      name: 'Letter of Intent (LOI)',
      type: 'PDF',
      size: '2.3 MB',
      uploadedAt: '2024-01-15',
      uploadedBy: 'Group Admin'
    },
    {
      id: '2',
      name: 'Group Presentation',
      type: 'PDF',
      size: '5.7 MB',
      uploadedAt: '2024-01-10',
      uploadedBy: 'Group Admin'
    },
    {
      id: '3',
      name: 'Terms and Conditions',
      type: 'PDF',
      size: '1.2 MB',
      uploadedAt: '2024-01-08',
      uploadedBy: 'Group Admin'
    }
  ];

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Attached Documents</h2>
      
      <div className="space-y-4">
        {documents.map((doc) => (
          <div key={doc.id} className="flex items-center justify-between p-4 bg-gray-50/80 rounded-xl border border-gray-200/50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{doc.name}</h3>
                <p className="text-sm text-gray-500">
                  {doc.type} • {doc.size} • Uploaded on {new Date(doc.uploadedAt).toLocaleDateString()}
                </p>
                <p className="text-xs text-gray-400">by {doc.uploadedBy}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Eye className="w-4 h-4 mr-1" />
                View
              </Button>
              <Button variant="ghost" size="sm">
                <Download className="w-4 h-4 mr-1" />
                Download
              </Button>
            </div>
          </div>
        ))}
      </div>
      
      {documents.length === 0 && (
        <div className="text-center py-8">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">No documents available yet</p>
        </div>
      )}
    </div>
  );
};

export default GroupDocuments;
