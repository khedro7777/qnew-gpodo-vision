
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useKYCStatus } from '@/hooks/useKYCStatus';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import EnhancedStats from '@/components/enhanced/EnhancedStats';
import QuickActions from '@/components/dashboard/QuickActions';
import RecentActivity from '@/components/dashboard/RecentActivity';
import WelcomeSection from '@/components/dashboard/WelcomeSection';
import UpcomingEvents from '@/components/dashboard/UpcomingEvents';
import EnhancedPomodoroTimer from '@/components/enhanced/EnhancedPomodoroTimer';
import EnhancedTaskList from '@/components/enhanced/EnhancedTaskList';
import NotificationCenter from '@/components/enhanced/NotificationCenter';
import GoalsTracker from '@/components/enhanced/GoalsTracker';

const Dashboard = () => {
  const { user, loading } = useAuth();

  console.log('Dashboard render:', {
    user: !!user,
    loading,
  });

  // Show the main dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Header />
      <main className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
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
