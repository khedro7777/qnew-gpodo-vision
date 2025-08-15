
import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { EnhancedSupplierDashboard } from '@/components/supplier/EnhancedSupplierDashboard';

const SupplierDashboardPage = () => {
  console.log('SupplierDashboardPage rendering');
  
  return (
    <ProtectedRoute requiredRole="supplier">
      <div className="min-h-screen">
        <EnhancedSupplierDashboard />
      </div>
    </ProtectedRoute>
  );
};

export default SupplierDashboardPage;
