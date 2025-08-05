
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GroupInfo from '@/components/group/GroupInfo';
import GroupDocuments from '@/components/group/GroupDocuments';
import GroupActivity from '@/components/group/GroupActivity';
import GroupActions from '@/components/group/GroupActions';
import { useAuth } from '@/contexts/AuthContext';

const GroupProfile = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const { user } = useAuth();

  if (!groupId) {
    return <div>Group not found</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Header />
      <main className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Back to Home Navigation */}
          <div className="mb-6">
            <Link to="/">
              <Button variant="ghost" size="sm" className="gap-2 text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Button>
            </Link>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <GroupInfo groupId={groupId} />
              <GroupDocuments groupId={groupId} />
              <GroupActivity groupId={groupId} />
            </div>
            
            {/* Action Sidebar */}
            <div className="lg:col-span-1">
              <GroupActions groupId={groupId} isLoggedIn={!!user} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default GroupProfile;
