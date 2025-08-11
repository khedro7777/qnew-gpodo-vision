
import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { SupplierOffersWorkflow } from '@/components/supplier/SupplierOffersWorkflow';

const SellerBoard = () => {
  console.log('SellerBoard rendering');
  
  return (
    <ProtectedRoute requiredRole="supplier">
      <div className="min-h-screen bg-background">
        <SupplierOffersWorkflow />
      </div>
    </ProtectedRoute>
  );
};

export default SellerBoard;
