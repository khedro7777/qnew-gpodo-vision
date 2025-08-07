
import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  BarChart3, Users, Building2, Settings, FileText, 
  CreditCard, Link, HeadphonesIcon, Bell, Shield,
  TestTube, Home, Briefcase, MessageSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';

const AdminSidebar = () => {
  const menuItems = [
    { to: '/admin/overview', icon: BarChart3, label: 'Overview' },
    { to: '/admin/users', icon: Users, label: 'Users' },
    { to: '/admin/groups', icon: Building2, label: 'Groups' },
    { to: '/admin/portals', icon: Home, label: 'Portals' },
    { to: '/admin/offers', icon: Briefcase, label: 'Offers' },
    { to: '/admin/disputes', icon: MessageSquare, label: 'Disputes' },
    { to: '/admin/files', icon: FileText, label: 'Files' },
    { to: '/admin/pages', icon: FileText, label: 'Pages' },
    { to: '/admin/settings', icon: Settings, label: 'Settings' },
    { to: '/admin/payments', icon: CreditCard, label: 'Payments' },
    { to: '/admin/referrals', icon: Link, label: 'Referrals' },
    { to: '/admin/support', icon: HeadphonesIcon, label: 'Support' },
    { to: '/admin/notifications', icon: Bell, label: 'Notifications' },
    { to: '/admin/access', icon: Shield, label: 'Access' },
    { to: '/admin/lab', icon: TestTube, label: 'Lab' },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8 text-blue-600" />
          <div>
            <h2 className="text-lg font-semibold">GPODO Admin</h2>
            <p className="text-sm text-gray-500">Platform Management</p>
          </div>
        </div>
      </div>
      
      <nav className="p-4">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-50'
                )
              }
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default AdminSidebar;
