
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext";
import { DemoProvider } from "@/contexts/DemoContext";
import { DemoToggle } from "@/components/demo/DemoToggle";

// Lazy load components
const Index = lazy(() => import("@/pages/Index"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const ClientDashboard = lazy(() => import("@/pages/ClientDashboard"));
const EnhancedClientDashboard = lazy(() => import("@/components/dashboard/EnhancedClientDashboard"));
const UserProfile = lazy(() => import("@/pages/UserProfile"));
const AccountSettings = lazy(() => import("@/pages/AccountSettings"));
const GroupRoom = lazy(() => import("@/pages/GroupRoom"));
const GatewayLanding = lazy(() => import("@/pages/GatewayLanding"));
const GroupProfile = lazy(() => import("@/pages/GroupProfile"));
const OfferDetails = lazy(() => import("@/pages/OfferDetails"));
const NotFound = lazy(() => import("@/pages/NotFound"));

// Board Selector and Role-based Dashboards
const BoardSelector = lazy(() => import("@/components/dashboard/BoardSelector"));
const SupplierDashboard = lazy(() => import("@/pages/dashboard/SupplierDashboard"));
const BuyerDashboard = lazy(() => import("@/pages/dashboard/BuyerDashboard"));
const FreelancerDashboard = lazy(() => import("@/pages/dashboard/FreelancerDashboard"));

// New Seller Board
const SellerBoard = lazy(() => import("@/pages/SellerBoard"));

// Admin components
const AdminLogin = lazy(() => import("@/pages/AdminLogin"));
const AdminLayout = lazy(() => import("@/components/admin/AdminLayout"));
const AdminOverview = lazy(() => import("@/pages/admin/AdminOverview"));
const AdminUsers = lazy(() => import("@/pages/admin/AdminUsers"));
const AdminPortals = lazy(() => import("@/pages/admin/AdminPortals"));
const AdminReferrals = lazy(() => import("@/pages/admin/AdminReferrals"));
const AdminAPIs = lazy(() => import("@/pages/admin/AdminAPIs"));

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <DemoProvider>
        <AuthProvider>
          <AdminAuthProvider>
            <TooltipProvider>
              <Toaster />
              <DemoToggle />
              <BrowserRouter>
                <Suspense fallback={<div>Loading...</div>}>
                  <Routes>
                    {/* Main app routes */}
                    <Route path="/" element={<Index />} />
                    
                    {/* Board Selector - main dashboard entry point */}
                    <Route path="/dashboard" element={<BoardSelector />} />
                    
                    {/* New Seller Board - dedicated supplier control panel */}
                    <Route path="/seller-board" element={<SellerBoard />} />
                    
                    {/* Role-specific dashboards */}
                    <Route path="/dashboard/supplier" element={<SupplierDashboard />} />
                    <Route path="/dashboard/buyer" element={<BuyerDashboard />} />
                    <Route path="/dashboard/freelancer" element={<FreelancerDashboard />} />
                    <Route path="/dashboard/group-buying" element={<EnhancedClientDashboard />} />
                    <Route path="/dashboard/investor" element={<EnhancedClientDashboard />} />
                    <Route path="/dashboard/judge" element={<EnhancedClientDashboard />} />
                    <Route path="/dashboard/ai-agent" element={<EnhancedClientDashboard />} />
                    
                    {/* Legacy routes - now using EnhancedClientDashboard */}
                    <Route path="/client-dashboard" element={<EnhancedClientDashboard />} />
                    <Route path="/profile" element={<UserProfile />} />
                    <Route path="/settings" element={<AccountSettings />} />
                    <Route path="/group-room/:groupId" element={<GroupRoom />} />
                    <Route path="/gateway/:gatewayType" element={<GatewayLanding />} />
                    <Route path="/group/:groupId/profile" element={<GroupProfile />} />
                    <Route path="/offer/:offerId" element={<OfferDetails />} />
                    
                    {/* Admin routes */}
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route path="/admin" element={<AdminLayout />}>
                      <Route path="overview" element={<AdminOverview />} />
                      <Route path="users" element={<AdminUsers />} />
                      <Route path="portals" element={<AdminPortals />} />
                      <Route path="referrals" element={<AdminReferrals />} />
                      <Route path="apis" element={<AdminAPIs />} />
                    </Route>
                    
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </BrowserRouter>
            </TooltipProvider>
          </AdminAuthProvider>
        </AuthProvider>
      </DemoProvider>
    </QueryClientProvider>
  );
}

export default App;
