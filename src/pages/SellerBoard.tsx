
import React from 'react';
import { SupplierOffersWorkflow } from '@/components/supplier/SupplierOffersWorkflow';

const SellerBoard = () => {
  console.log('SellerBoard rendering');
  
  return (
    <div className="min-h-screen bg-background">
      <SupplierOffersWorkflow />
    </div>
  );
};

export default SellerBoard;
