
import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import SupplierDashboard from '@/components/supplier/SupplierDashboard';

const SupplierDashboardPage = () => {
  return (
    <ProtectedRoute requiredRole="supplier">
      <SupplierDashboard />
    </ProtectedRoute>
  );
};

export default SupplierDashboardPage;
