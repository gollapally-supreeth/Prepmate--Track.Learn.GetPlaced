import { ToastProvider } from "@/hooks/toast/toast-context";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "./components/AppLayout";
import Login from "./pages/Login";
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
import { AnimatePresence } from "framer-motion";

const queryClient = new QueryClient();

const App = () => {
  // Check if user is logged in (for now, just check localStorage)
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ToastProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/login" element={
                  isLoggedIn ? <Navigate to="/dashboard" replace /> : <Login />
                } />
                <Route path="/" element={
                  isLoggedIn ? <AppLayout /> : <Navigate to="/login" replace />
                }>
                  <Route index element={<Navigate to="/dashboard" replace />} />
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
