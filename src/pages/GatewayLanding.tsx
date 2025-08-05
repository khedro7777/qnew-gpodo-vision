
import React from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GatewayIntro from '@/components/gateway/GatewayIntro';
import GatewayGroups from '@/components/gateway/GatewayGroups';

const GatewayLanding = () => {
  const { gatewayType } = useParams<{ gatewayType: string }>();

  if (!gatewayType) {
    return <div>Gateway not found</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Header />
      <main>
        <GatewayIntro gatewayType={gatewayType} />
        <GatewayGroups gatewayType={gatewayType} />
      </main>
      <Footer />
    </div>
  );
};

export default GatewayLanding;
