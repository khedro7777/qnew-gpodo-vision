
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
import MCPPresentationManager from '@/components/group/MCPPresentationManager';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const GroupProfile = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const { user } = useAuth();

  const { data: group, isLoading } = useQuery({
    queryKey: ['group', groupId],
    queryFn: async () => {
      if (!groupId) return null;
      
      const { data, error } = await supabase
        .from('groups')
        .select(`
          *,
          industry_sectors(name, icon),
          countries(name, flag_emoji)
        `)
        .eq('id', groupId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!groupId,
  });

  if (!groupId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <Header />
        <main className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold text-gray-900">Group Not Found</h2>
              <p className="text-gray-600 mt-2">The group you're looking for doesn't exist or you don't have access to it.</p>
              <Link to="/">
                <Button className="mt-4">Back to Home</Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
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
              
              {/* MCP Presentations Section */}
              {groupId && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Group Presentations</h2>
                  <MCPPresentationManager />
                </div>
              )}
              
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
