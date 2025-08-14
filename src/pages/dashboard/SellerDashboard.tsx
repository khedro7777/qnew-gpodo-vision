
import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import SellerDashboard from '@/components/seller/SellerDashboard';

const SellerDashboardPage = () => {
  return (
    <ProtectedRoute requiredRole="supplier">
      <SellerDashboard />
    </ProtectedRoute>
  );
};

export default SellerDashboardPage;
