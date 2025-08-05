
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
        {/* Back to Home Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
        </div>
        
        <GatewayIntro gatewayType={gatewayType} />
        <GatewayGroups gatewayType={gatewayType} />
      </main>
      <Footer />
    </div>
  );
};

export default GatewayLanding;
