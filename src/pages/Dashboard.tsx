
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useKYCStatus } from '@/hooks/useKYCStatus';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Stats from '@/components/Stats';
import QuickActions from '@/components/dashboard/QuickActions';
import RecentActivity from '@/components/dashboard/RecentActivity';
import ProductivitySection from '@/components/dashboard/ProductivitySection';
import WelcomeSection from '@/components/dashboard/WelcomeSection';
import UpcomingEvents from '@/components/dashboard/UpcomingEvents';
import KYCVerification from '@/components/kyc/KYCVerification';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const Dashboard = () => {
  const { user, profile } = useAuth();
  const { data: kycStatus, isLoading: kycLoading } = useKYCStatus();

  if (!user) {
    return null; // This should be handled by route protection
  }

  // Show loading while checking KYC status
  if (kycLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-productivity-blue mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Show KYC verification if not complete
  if (!kycStatus?.isKYCComplete) {
    return <KYCVerification />;
  }

  // Show normal dashboard if KYC is complete
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Header />
      <main className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Welcome Section */}
          <WelcomeSection />
          
          {/* Stats Overview */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Overview</h2>
            <Stats />
          </section>

          {/* Main Dashboard Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              <QuickActions />
              <RecentActivity />
            </div>
            
            {/* Right Column */}
            <div className="space-y-8">
              <ProductivitySection />
              <UpcomingEvents />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
