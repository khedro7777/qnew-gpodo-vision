
import React from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import MainPortals from '@/components/MainPortals';
import LiveGroups from '@/components/LiveGroups';
import GroupOffersSection from '@/components/offers/GroupOffersSection';
import GroupPurchasingSection from '@/components/purchasing/GroupPurchasingSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Header />
      <main>
        <HeroSection />
        <MainPortals />
        <GroupPurchasingSection />
        <GroupOffersSection />
        <LiveGroups />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
