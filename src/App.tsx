
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";

const Index = lazy(() => import("@/pages/Index"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const ClientDashboard = lazy(() => import("@/pages/ClientDashboard"));
const GroupRoom = lazy(() => import("@/pages/GroupRoom"));
const GatewayLanding = lazy(() => import("@/pages/GatewayLanding"));
const GroupProfile = lazy(() => import("@/pages/GroupProfile"));
const OfferDetails = lazy(() => import("@/pages/OfferDetails"));
const NotFound = lazy(() => import("@/pages/NotFound"));

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <Suspense fallback={<div>Loading...</div>}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/client-dashboard" element={<ClientDashboard />} />
                <Route path="/group-room/:groupId" element={<GroupRoom />} />
                <Route path="/gateway/:gatewayType" element={<GatewayLanding />} />
                <Route path="/group/:groupId/profile" element={<GroupProfile />} />
                <Route path="/offer/:offerId" element={<OfferDetails />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
