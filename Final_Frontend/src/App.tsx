import { Toaster } from "@/components/ui/toaster";
// import { Toaster as Sonner } from "@/components/ui/sonner"; // Decide which one to use
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ThemeProvider } from "./components/ThemeProvider";
import Auth from "./pages/Auth";
import Lobby from "./pages/Lobby";
import ProjectManagement from "./pages/ProjectManagement";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// This component handles the initial redirect logic
function RootRedirect() {
  const { user, loading } = useAuth();

  if (loading) {
    // You can show a global spinner here while checking the auth session
    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  }

  return <Navigate to={user ? "/lobby" : "/auth"} replace />;
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (user) {
    return <Navigate to="/lobby" replace />;
  }
  
  return <>{children}</>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ThemeProvider defaultTheme="system" storageKey="workwire-theme">
        <TooltipProvider>
          <Toaster />
          {/* <Sonner /> */}
          <BrowserRouter>
            <Routes>
              <Route path="/auth" element={
                <PublicRoute>
                  <Auth />
                </PublicRoute>
              } />
              <Route path="/lobby" element={
                <ProtectedRoute>
                  <Lobby />
                </ProtectedRoute>
              } />
              {/* This route is now dynamic to handle different projects */}
              <Route path="/project/:projectId" element={
                <ProtectedRoute>
                  <ProjectManagement />
                </ProtectedRoute>
              } />
              {/* The root path now uses the RootRedirect component */}
              <Route path="/" element={<RootRedirect />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;