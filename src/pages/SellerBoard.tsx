
import React from 'react';
import { EnhancedSupplierDashboard } from '@/components/supplier/EnhancedSupplierDashboard';

const SellerBoard = () => {
  console.log('SellerBoard rendering with integrated supplier dashboard');
  
  return (
    <div className="min-h-screen bg-background">
      <EnhancedSupplierDashboard />
    </div>
  );
};

export default SellerBoard;
