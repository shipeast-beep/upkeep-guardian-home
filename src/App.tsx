
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AddMaintenance from "./pages/AddMaintenance";
import MaintenanceHistory from "./pages/MaintenanceHistory";
import MaintenanceDetail from "./pages/MaintenanceDetail";
import Notifications from "./pages/Notifications";
import Properties from "./pages/Properties";
import Settings from "./pages/Settings";
import Pricing from "./pages/Pricing";
import ExportPDF from "./pages/ExportPDF";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import AuthCallback from "./pages/AuthCallback";
import { AuthProvider } from "./contexts/AuthContext";
import { useEffect } from "react";
import { useStore } from "./store/useStore";
import { ThemeProvider } from "@/components/ThemeProvider";

const queryClient = new QueryClient();

const AppContent = () => {
  const { isDarkMode } = useStore();
  
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);
  
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/add" element={<AddMaintenance />} />
      <Route path="/history" element={<MaintenanceHistory />} />
      <Route path="/maintenance/:id" element={<MaintenanceDetail />} />
      <Route path="/notifications" element={<Notifications />} />
      <Route path="/properties" element={<Properties />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/export-pdf" element={<ExportPDF />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
