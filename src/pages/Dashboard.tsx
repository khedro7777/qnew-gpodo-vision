
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useKYCStatus } from '@/hooks/useKYCStatus';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import EnhancedStats from '@/components/enhanced/EnhancedStats';
import QuickActions from '@/components/dashboard/QuickActions';
import RecentActivity from '@/components/dashboard/RecentActivity';
import WelcomeSection from '@/components/dashboard/WelcomeSection';
import UpcomingEvents from '@/components/dashboard/UpcomingEvents';
import KYCVerification from '@/components/kyc/KYCVerification';
import EnhancedPomodoroTimer from '@/components/enhanced/EnhancedPomodoroTimer';
import EnhancedTaskList from '@/components/enhanced/EnhancedTaskList';
import NotificationCenter from '@/components/enhanced/NotificationCenter';
import GoalsTracker from '@/components/enhanced/GoalsTracker';
import { Card } from '@/components/ui/card';
import { Loader2, Shield, AlertCircle } from 'lucide-react';

const Dashboard = () => {
  const { user, profile, loading: authLoading } = useAuth();
  const { data: kycStatus, isLoading: kycLoading, error: kycError } = useKYCStatus();

  console.log('Dashboard render state:', {
    user: !!user,
    profile: !!profile,
    authLoading,
    kycLoading,
    kycError,
    kycStatus
  });

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-productivity-blue mx-auto mb-4" />
          <p className="text-gray-600">Loading authentication...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-4" />
          <p className="text-red-600">Authentication required. Please log in.</p>
        </div>
      </div>
    );
  }

  // If KYC check is loading, show a simple loading message but don't block the dashboard
  if (kycLoading) {
    console.log('KYC status loading...');
  }

  // If there's a KYC error, log it but don't block the dashboard
  if (kycError) {
    console.error('KYC status error:', kycError);
  }

  // Show KYC verification only if we have a clear indication that KYC is incomplete
  // and the user is not an API user
  const shouldShowKYC = profile?.role !== 'api' && 
                        kycStatus?.isKYCComplete === false && 
                        !kycLoading && 
                        !kycError;

  if (shouldShowKYC) {
    return <KYCVerification />;
  }

  // Show the main dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Header />
      <main className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* API User Special Banner */}
          {profile?.role === 'api' && (
            <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-blue-900">API Administrator Access</h3>
                  <p className="text-sm text-blue-700">Full system privileges enabled • KYC bypassed</p>
                </div>
              </div>
            </Card>
          )}
          
          {/* Welcome Section */}
          <WelcomeSection />
          
          {/* Enhanced Stats Overview */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Today's Overview</h2>
            <EnhancedStats />
          </section>

          {/* Main Dashboard Grid */}
          <div className="grid lg:grid-cols-12 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-8 space-y-8">
              {/* Quick Actions */}
              <QuickActions />
              
              {/* Enhanced Task Management */}
              <EnhancedTaskList />
              
              {/* Recent Activity */}
              <RecentActivity />
            </div>
            
            {/* Right Column - Sidebar */}
            <div className="lg:col-span-4 space-y-8">
              {/* Enhanced Pomodoro Timer */}
              <EnhancedPomodoroTimer />
              
              {/* Goals Tracker */}
              <GoalsTracker />
              
              {/* Notifications */}
              <NotificationCenter />
              
              {/* Upcoming Events */}
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
