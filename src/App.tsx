
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext";

// Lazy load components
const Index = lazy(() => import("@/pages/Index"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const ClientDashboard = lazy(() => import("@/pages/ClientDashboard"));
const UserProfile = lazy(() => import("@/pages/UserProfile"));
const AccountSettings = lazy(() => import("@/pages/AccountSettings"));
const GroupRoom = lazy(() => import("@/pages/GroupRoom"));
const GatewayLanding = lazy(() => import("@/pages/GatewayLanding"));
const GroupProfile = lazy(() => import("@/pages/GroupProfile"));
const OfferDetails = lazy(() => import("@/pages/OfferDetails"));
const NotFound = lazy(() => import("@/pages/NotFound"));

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
      <AuthProvider>
        <AdminAuthProvider>
          <TooltipProvider>
            <Toaster />
            <BrowserRouter>
              <Suspense fallback={<div>Loading...</div>}>
                <Routes>
                  {/* Main app routes */}
                  <Route path="/" element={<Index />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/client-dashboard" element={<ClientDashboard />} />
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
    </QueryClientProvider>
  );
}

export default App;
