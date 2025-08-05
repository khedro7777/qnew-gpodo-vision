
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import ClientDashboard from "./pages/ClientDashboard";
import GatewayLanding from "./pages/GatewayLanding";
import GroupProfile from "./pages/GroupProfile";
import GroupRoom from "./pages/GroupRoom";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/client-dashboard" element={<ClientDashboard />} />
            <Route path="/gateway/:type" element={<GatewayLanding />} />
            <Route path="/group/:groupId" element={<GroupRoom />} />
            <Route path="/group/:groupId/profile" element={<GroupProfile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
