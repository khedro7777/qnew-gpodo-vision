
import AuthModal from "@/components/auth/AuthModal";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import MainPortals from "@/components/MainPortals";
import LiveGroups from "@/components/LiveGroups";
import Stats from "@/components/Stats";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useDemo } from "@/contexts/DemoContext";
import { useNavigate } from "react-router-dom";
import { Play } from "lucide-react";

const Index = () => {
  const { enterDemoMode } = useDemo();
  const navigate = useNavigate();

  const handleWatchDemo = () => {
    enterDemoMode();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <Header />
      <main>
        <HeroSection />
        
        {/* Watch Demo Section */}
        <section className="py-12 bg-primary/5">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Experience the Platform</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Explore all features with our interactive demo. See how our platform can transform your business collaboration.
            </p>
            <Button 
              onClick={handleWatchDemo}
              size="lg"
              className="text-lg px-8 py-6 flex items-center gap-3 mx-auto"
            >
              <Play className="w-6 h-6" />
              Watch Demo
            </Button>
          </div>
        </section>

        <MainPortals />
        <LiveGroups />
        <Stats />
      </main>
      <Footer />
      <AuthModal />
    </div>
  );
};

export default Index;
