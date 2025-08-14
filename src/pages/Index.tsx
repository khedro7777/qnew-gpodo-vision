
import { useState } from "react";
import AuthModal from "@/components/auth/AuthModal";
import Header from "@/components/Header";
import ModernHeroSection from "@/components/homepage/ModernHeroSection";
import GatewayShowcase from "@/components/homepage/GatewayShowcase";
import PlatformStats from "@/components/homepage/PlatformStats";
import FeaturesSection from "@/components/homepage/FeaturesSection";
import LiveGroups from "@/components/LiveGroups";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useDemo } from "@/contexts/DemoContext";
import { useNavigate } from "react-router-dom";
import { Play } from "lucide-react";

const Index = () => {
  const { enterDemoMode } = useDemo();
  const navigate = useNavigate();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleWatchDemo = () => {
    enterDemoMode();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <ModernHeroSection />
        
        {/* Watch Demo Section - Integrated into hero */}
        <section className="py-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Experience the Platform</h2>
            <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
              Explore all features with our interactive demo. See how our platform can transform your business collaboration.
            </p>
            <Button 
              onClick={handleWatchDemo}
              size="lg"
              variant="secondary"
              className="text-lg px-8 py-6 flex items-center gap-3 mx-auto bg-white text-blue-600 hover:bg-gray-100"
            >
              <Play className="w-6 h-6" />
              Watch Interactive Demo
            </Button>
          </div>
        </section>

        <GatewayShowcase />
        <PlatformStats />
        <FeaturesSection />
        <LiveGroups />
      </main>
      <Footer />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
};

export default Index;
