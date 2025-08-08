
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import ClientDashboard from "./pages/ClientDashboard";
import ClientAuth from "./pages/ClientAuth";
import AdminLogin from "./pages/AdminLogin";
import AdminOverview from "./pages/admin/AdminOverview";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminAPIs from "./pages/admin/AdminAPIs";
import AdminPortals from "./pages/admin/AdminPortals";
import AdminReferrals from "./pages/admin/AdminReferrals";
import GroupRoom from "./pages/GroupRoom";
import GroupProfile from "./pages/GroupProfile";
import GatewayLanding from "./pages/GatewayLanding";
import OfferDetails from "./pages/OfferDetails";
import UserProfile from "./pages/UserProfile";
import AccountSettings from "./pages/AccountSettings";
import NotFound from "./pages/NotFound";
import { Loader2 } from "lucide-react";

const queryClient = new QueryClient();

// Protected Route Component for regular users
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">جاري التحقق من المصادقة...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <AdminAuthProvider>
            <BrowserRouter>
              <div className="min-h-screen bg-background text-foreground">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<ClientAuth />} />
                  <Route path="/gateway/:type" element={<GatewayLanding />} />
                  
                  {/* Admin Routes */}
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route path="/admin/overview" element={<AdminOverview />} />
                  <Route path="/admin/users" element={<AdminUsers />} />
                  <Route path="/admin/apis" element={<AdminAPIs />} />
                  <Route path="/admin/portals" element={<AdminPortals />} />
                  <Route path="/admin/referrals" element={<AdminReferrals />} />
                  
                  {/* Protected User Routes */}
                  <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                  <Route path="/client-dashboard" element={<ProtectedRoute><ClientDashboard /></ProtectedRoute>} />
                  <Route path="/group/:id" element={<ProtectedRoute><GroupProfile /></ProtectedRoute>} />
                  <Route path="/group/:id/room" element={<ProtectedRoute><GroupRoom /></ProtectedRoute>} />
                  <Route path="/offer/:id" element={<ProtectedRoute><OfferDetails /></ProtectedRoute>} />
                  <Route path="/profile/:id" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
                  <Route path="/settings" element={<ProtectedRoute><AccountSettings /></ProtectedRoute>} />
                  
                  {/* 404 Route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
              <Toaster />
            </BrowserRouter>
          </AdminAuthProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
