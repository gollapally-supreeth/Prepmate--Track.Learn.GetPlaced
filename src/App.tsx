
import { ToastProvider } from "@/hooks/toast/toast-context";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "./components/AppLayout";
import Dashboard from "./pages/Dashboard";
import Planner from "./pages/Planner";
import ResourcesHub from "./pages/ResourcesHub";
import InterviewChatbot from "./pages/InterviewChatbot";
import Progress from "./pages/Progress";
import Notes from "./pages/Notes";
import Quizzes from "./pages/Quizzes";
import ResumeBuilder from "./pages/ResumeBuilder";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ToastProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AppLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="/planner" element={<Planner />} />
              <Route path="/resources" element={<ResourcesHub />} />
              <Route path="/notes" element={<Notes />} />
              <Route path="/progress" element={<Progress />} />
              <Route path="/quizzes" element={<Quizzes />} />
              <Route path="/interview" element={<InterviewChatbot />} />
              <Route path="/resume" element={<ResumeBuilder />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
