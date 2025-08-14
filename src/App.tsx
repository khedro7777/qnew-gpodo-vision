
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { DemoProvider } from "@/contexts/DemoContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import GroupProfile from "@/pages/GroupProfile";
import GroupRoom from "@/pages/GroupRoom";
import UserProfile from "@/pages/UserProfile";
import AccountSettings from "@/pages/AccountSettings";
import GatewayLanding from "@/pages/GatewayLanding";
import NotFound from "@/pages/NotFound";
import OfferDetails from "@/pages/OfferDetails";
import ClientDashboard from "@/pages/ClientDashboard";
import AdminLogin from "@/pages/AdminLogin";

// Dashboard Pages
import BuyerDashboard from "@/pages/dashboard/BuyerDashboard";
import SupplierDashboard from "@/pages/dashboard/SupplierDashboard";
import SellerDashboard from "@/pages/dashboard/SellerDashboard";
import FreelancerDashboard from "@/pages/dashboard/FreelancerDashboard";

// Admin Pages
import AdminOverview from "@/pages/admin/AdminOverview";
import AdminUsers from "@/pages/admin/AdminUsers";
import AdminContent from "@/pages/admin/AdminContent";
import AdminAPIs from "@/pages/admin/AdminAPIs";
import AdminPortals from "@/pages/admin/AdminPortals";
import AdminReferrals from "@/pages/admin/AdminReferrals";
import SellerManagement from "@/pages/admin/SellerManagement";

// New Pages
import SellerOfferBoardPage from "@/pages/SellerOfferBoardPage";
import HowItWorks from "@/pages/HowItWorks";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <DemoProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <BrowserRouter>
              <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1">
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/dashboard/buyer" element={<BuyerDashboard />} />
                    <Route path="/dashboard/supplier" element={<SupplierDashboard />} />
                    <Route path="/dashboard/seller" element={<SellerDashboard />} />
                    <Route path="/dashboard/freelancer" element={<FreelancerDashboard />} />
                    
                    <Route path="/group/:groupId/profile" element={<GroupProfile />} />
                    <Route path="/group/:groupId/room" element={<GroupRoom />} />
                    <Route path="/offer/:offerId" element={<OfferDetails />} />
                    <Route path="/seller-offer/:offerId" element={<SellerOfferBoardPage />} />
                    <Route path="/how-it-works" element={<HowItWorks />} />
                    
                    <Route path="/profile" element={<UserProfile />} />
                    <Route path="/settings" element={<AccountSettings />} />
                    <Route path="/client" element={<ClientDashboard />} />
                    
                    <Route path="/:gatewayType" element={<GatewayLanding />} />
                    
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route path="/admin/overview" element={<AdminOverview />} />
                    <Route path="/admin/users" element={<AdminUsers />} />
                    <Route path="/admin/sellers" element={<SellerManagement />} />
                    <Route path="/admin/content" element={<AdminContent />} />
                    <Route path="/admin/apis" element={<AdminAPIs />} />
                    <Route path="/admin/portals" element={<AdminPortals />} />
                    <Route path="/admin/referrals" element={<AdminReferrals />} />
                    
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </DemoProvider>
    </QueryClientProvider>
  );
}

export default App;
