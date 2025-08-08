
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import MainPortals from "@/components/MainPortals";
import LiveGroups from "@/components/LiveGroups";
import Stats from "@/components/Stats";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LogIn, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Auth Section for non-authenticated users */}
      {!user && (
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4">
          <div className="container mx-auto px-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-right">
                <h3 className="text-lg font-semibold mb-1">ابدأ رحلتك معنا اليوم</h3>
                <p className="text-blue-100 text-sm">انضم إلى آلاف المستخدمين في منصة GPODO</p>
              </div>
              <div className="flex gap-3">
                <Link to="/auth">
                  <Button variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50">
                    <LogIn className="w-4 h-4 ml-2" />
                    تسجيل الدخول
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                    <UserPlus className="w-4 h-4 ml-2" />
                    إنشاء حساب
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      <HeroSection />
      <MainPortals />
      <LiveGroups />
      <Stats />
      <Footer />
    </div>
  );
};

export default Index;
