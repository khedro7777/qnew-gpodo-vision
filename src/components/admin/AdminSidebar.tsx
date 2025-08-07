
import React from 'react';
import { cn } from '@/lib/utils';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  Link as LinkIcon, 
  Settings,
  Key,
  BarChart3,
  Shield,
  HelpCircle
} from 'lucide-react';

const AdminSidebar = () => {
  const location = useLocation();
  
  const navigation = [
    {
      name: 'Overview',
      href: '/admin/overview',
      icon: LayoutDashboard,
      current: location.pathname === '/admin/overview'
    },
    {
      name: 'Users',
      href: '/admin/users',
      icon: Users,
      current: location.pathname === '/admin/users'
    },
    {
      name: 'Groups & Portals',
      href: '/admin/portals',
      icon: Building2,
      current: location.pathname === '/admin/portals'
    },
    {
      name: 'APIs',
      href: '/admin/apis',
      icon: Key,
      current: location.pathname === '/admin/apis'
    },
    {
      name: 'Referral Links',
      href: '/admin/referrals',
      icon: LinkIcon,
      current: location.pathname === '/admin/referrals'
    }
  ];

  return (
    <div className="w-64 bg-white shadow-sm border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="flex items-center px-6 py-4 border-b border-gray-200">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <div className="ml-3">
            <h2 className="text-lg font-semibold text-gray-900">gpodo5</h2>
            <p className="text-xs text-gray-500">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                item.current
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <Icon className="w-5 h-5 mr-3" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-gray-200">
        <div className="flex items-center text-sm text-gray-500">
          <BarChart3 className="w-4 h-4 mr-2" />
          <span>System Status: Online</span>
        </div>
        <div className="flex items-center text-sm text-gray-500 mt-2">
          <HelpCircle className="w-4 h-4 mr-2" />
          <span>Need help?</span>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
