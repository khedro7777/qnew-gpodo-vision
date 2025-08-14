
import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import SupplierOffersWorkflow from '@/components/supplier/SupplierOffersWorkflow';

const SupplierDashboardPage = () => {
  console.log('SupplierDashboardPage rendering - redirecting to SellerBoard workflow');
  
  return (
    <ProtectedRoute requiredRole="supplier">
      <div className="min-h-screen bg-background">
        <SupplierOffersWorkflow />
      </div>
    </ProtectedRoute>
  );
};

export default SupplierDashboardPage;
