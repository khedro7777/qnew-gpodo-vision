
import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import SellerManagement from '@/components/admin/SellerManagement';

const SellerManagementPage = () => {
  return (
    <ProtectedRoute requiredRole="admin">
      <SellerManagement />
    </ProtectedRoute>
  );
};

export default SellerManagementPage;
