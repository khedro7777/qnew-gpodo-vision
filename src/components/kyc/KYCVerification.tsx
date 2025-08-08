
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import DocumentUpload from './DocumentUpload';
import MCPTest from './MCPTest';

const KYCVerification = () => {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState('documents');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
      case 'submitted':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Under Review</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800"><AlertCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800"><Upload className="w-3 h-3 mr-1" />Pending</Badge>;
    }
  };

  const getRequiredDocuments = () => {
    switch (profile?.role) {
      case 'supplier':
        return ['Company Registration', 'Business License'];
      case 'freelancer':
        return ['ID Card or Passport'];
      default:
        return ['ID Card or Passport'];
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-productivity-blue to-productivity-purple rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">KYC Verification Required</h1>
          <p className="text-gray-600 mb-4">
            Please complete your verification to access the dashboard
          </p>
          {getStatusBadge(profile?.kyc_status || 'pending')}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Required Documents</h3>
            <div className="space-y-3">
              {getRequiredDocuments().map((doc, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <FileText className="w-5 h-5 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">{doc}</span>
                </div>
              ))}
            </div>

            {profile?.role === 'freelancer' && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Requirements</h3>
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-blue-500" />
                  <span className="text-sm font-medium text-blue-700">MCP AI Skills Test</span>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-2">
            {profile?.role === 'freelancer' ? (
              <div className="space-y-6">
                <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                  <button
                    onClick={() => setActiveTab('documents')}
                    className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                      activeTab === 'documents'
                        ? 'bg-white text-productivity-blue shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Documents
                  </button>
                  <button
                    onClick={() => setActiveTab('test')}
                    className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                      activeTab === 'test'
                        ? 'bg-white text-productivity-blue shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    MCP Test
                  </button>
                </div>

                {activeTab === 'documents' ? <DocumentUpload /> : <MCPTest />}
              </div>
            ) : (
              <DocumentUpload />
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default KYCVerification;
