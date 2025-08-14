
import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import { Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const AdminLayout = () => {
  const { adminUser, loading } = useAdminAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  // TEMPORARILY BYPASS AUTH CHECK - Allow access without authentication
  // if (!adminUser) {
  //   return <Navigate to="/admin/login" replace />;
  // }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
