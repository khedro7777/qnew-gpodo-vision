
import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import ContentBuilder from '@/components/admin/ContentBuilder';

const AdminContent = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="border-b pb-4">
          <h1 className="text-3xl font-bold">Content Management</h1>
          <p className="text-muted-foreground mt-2">
            Create and manage dynamic content types for your application
          </p>
        </div>
        
        <ContentBuilder />
      </div>
    </AdminLayout>
  );
};

export default AdminContent;
