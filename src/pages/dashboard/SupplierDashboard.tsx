
import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { SupplierDashboard } from '@/components/supplier/SupplierDashboard';

const SupplierDashboardPage = () => {
  console.log('SupplierDashboardPage rendering');
  
  return (
    <ProtectedRoute requiredRole="supplier">
      <div className="min-h-screen">
        <SupplierDashboard />
      </div>
    </ProtectedRoute>
  );
};

export default SupplierDashboardPage;
