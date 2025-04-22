import { ToastProvider } from "@/hooks/toast/toast-context";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AppLayout } from "./components/AppLayout";
import { useAuth } from "./lib/auth";
import Dashboard from "./pages/Dashboard";
import Planner from "./pages/Planner";
import ResourcesHub from "./pages/ResourcesHub";
import InterviewChatbot from "./pages/InterviewChatbot";
import Progress from "./pages/Progress";
import Notes from "./pages/Notes";
import Quizzes from "./pages/Quizzes";
import ResumeBuilder from "./pages/ResumeBuilder";
import PlacementTracker from "./pages/PlacementTracker";
import FocusTimer from "./pages/FocusTimer";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/Login";
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import useAuthStore from "./lib/auth";

const queryClient = new QueryClient();

// Protected Route wrapper
const ProtectedLayout = () => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <AppLayout />;
};

const App = () => {
  const { isAuthenticated } = useAuth();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Hydrate the auth store
    useAuthStore.persist.rehydrate();
    setIsHydrated(true);
  }, []);

  // Don't render until auth store is hydrated
  if (!isHydrated) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ToastProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AnimatePresence mode="wait">
              <Routes>
                {/* Public Routes */}
                <Route
                  path="/login"
                  element={
                    isAuthenticated ? (
                      <Navigate to="/dashboard" replace />
                    ) : (
                      <LoginPage />
                    )
                  }
                />
                
                <Route
                  path="/"
                  element={
                    isAuthenticated ? (
                      <Navigate to="/dashboard" replace />
                    ) : (
                      <Navigate to="/login" replace />
                    )
                  }
                />

                {/* Protected Routes */}
                <Route element={<ProtectedLayout />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/planner" element={<Planner />} />
                  <Route path="/resources" element={<ResourcesHub />} />
                  <Route path="/notes" element={<Notes />} />
                  <Route path="/progress" element={<Progress />} />
                  <Route path="/quizzes" element={<Quizzes />} />
                  <Route path="/interview" element={<InterviewChatbot />} />
                  <Route path="/resume" element={<ResumeBuilder />} />
                  <Route path="/placements" element={<PlacementTracker />} />
                  <Route path="/focus-timer" element={<FocusTimer />} />
                </Route>

                {/* 404 Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AnimatePresence>
          </BrowserRouter>
        </ToastProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
