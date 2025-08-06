
import React from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GroupRoomInterface from '@/components/workflow/GroupRoomInterface';

const GroupRoom = () => {
  const { groupId } = useParams<{ groupId: string }>();

  if (!groupId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <Header />
        <main className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold text-gray-900">Group Not Found</h1>
              <p className="text-gray-600 mt-2">The group ID is missing or invalid.</p>
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
      <main>
        <GroupRoomInterface groupId={groupId} />
      </main>
      <Footer />
    </div>
  );
};

export default GroupRoom;
