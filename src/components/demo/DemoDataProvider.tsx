
import React from 'react';
import { useDemo } from '@/contexts/DemoContext';

// Mock data for demo mode
export const demoUserProfile = {
  id: 'demo-user',
  email: 'demo@example.com',
  full_name: 'Demo User',
  kyc_status: 'approved' as const,
  is_verified: true,
  company_name: 'Demo Company',
  country_code: 'US',
  industry_sector: 'Technology',
  role: 'user' as const
};

export const demoGroups = [
  {
    id: 'demo-group-1',
    name: 'Tech Startups Collective',
    description: 'A group for technology startups to collaborate and share resources',
    gateway_type: 'formation' as const,
    current_members: 45,
    max_members: 100,
    status: 'active',
    is_public: true,
    created_at: '2024-01-15T10:00:00Z',
    countries: { name: 'United States', flag_emoji: '🇺🇸' },
    industry_sectors: { name: 'Technology', icon: '💻' }
  },
  {
    id: 'demo-group-2',
    name: 'Global Purchasing Network',
    description: 'Bulk purchasing group for better deals on office supplies',
    gateway_type: 'purchasing' as const,
    current_members: 32,
    max_members: 50,
    status: 'active',
    is_public: true,
    created_at: '2024-01-20T14:30:00Z',
    countries: { name: 'Global', flag_emoji: '🌍' },
    industry_sectors: { name: 'Retail', icon: '🛒' }
  }
];

export const demoOffers = [
  {
    id: 'demo-offer-1',
    title: 'Premium Software Licenses',
    description: 'Get 40% off premium software licenses when we reach 50 members',
    category: 'Software',
    base_price: 299,
    minimum_joiners: 20,
    current_participants: 35,
    deadline: '2024-12-31T23:59:59Z',
    status: 'active' as const,
    supplier_id: 'demo-supplier',
    visibility: 'public' as const,
    kyc_required: false,
    points_required: 0,
    created_at: '2024-01-10T09:00:00Z',
    updated_at: '2024-01-10T09:00:00Z'
  }
];

export const useDemoData = () => {
  const { isDemoMode } = useDemo();
  
  return {
    isDemoMode,
    demoUserProfile,
    demoGroups,
    demoOffers
  };
};
