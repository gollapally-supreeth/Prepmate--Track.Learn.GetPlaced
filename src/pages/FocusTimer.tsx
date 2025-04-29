import React, { useMemo, useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FocusTimerProvider, useFocusTimer } from '@/components/focus-timer/FocusTimerContext';
import { TimerDisplay } from '@/components/focus-timer/TimerDisplay';
import { TaskList } from '@/components/focus-timer/TaskList';
import { TimerSettings } from '@/components/focus-timer/TimerSettings';
import { StatsDisplay } from '@/components/focus-timer/StatsDisplay';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Timer } from 'lucide-react';

const MUSIC_BACKGROUNDS = {
  '/music/lofi.mp3': 'url(/backgrounds/lofi.jpg)',
  '/music/rain.mp3': 'url(/backgrounds/rain.jpg)',
  '/music/piano.mp3': 'url(/backgrounds/piano.jpg)',
};

function FocusTimerContent() {
  const MOTIVATIONAL_QUOTES = [
    "Stay focused, stay sharp!",
    "Every minute counts. You got this!",
    "Small steps every day lead to big results.",
    "Discipline is the bridge between goals and accomplishment.",
    "Your future is created by what you do today, not tomorrow.",
    "Focus on being productive, not busy.",
    "Great things are done by a series of small things brought together."
  ];

  // Pick a random motivational quote for each mount
  const quote = useMemo(() => {
    return MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
  }, []);

  // Dynamic sizing logic
  const rightCardRef = useRef(null);
  const timerBoxRef = useRef(null);
  const [timerBoxSize, setTimerBoxSize] = useState(undefined);
  const [activeTab, setActiveTab] = useState('tasks');

  // Music and background logic
  const { state } = useFocusTimer();
  const { isRunning, sound } = state;
  const audioRef = useRef(null);
  const [bgImage, setBgImage] = useState('');
  const [showBg, setShowBg] = useState(false);

  function updateSize() {
    if (rightCardRef.current && window.innerWidth >= 1024) { // lg breakpoint
      const height = rightCardRef.current.offsetHeight;
      setTimerBoxSize(height);
    } else {
      setTimerBoxSize(undefined);
    }
  }

  useEffect(() => {
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useEffect(() => {
    // Update size when tab changes
    setTimeout(updateSize, 50); // slight delay to allow DOM update
  }, [activeTab]);

  // Update background image based on music
  useEffect(() => {
    if (isRunning && sound && MUSIC_BACKGROUNDS[sound]) {
      setBgImage(MUSIC_BACKGROUNDS[sound]);
      setShowBg(true);
    } else {
      setShowBg(false);
    }
  }, [isRunning, sound]);

  // Music playback control
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isRunning && sound) {
      audio.src = sound;
      audio.loop = true;
      audio.volume = 0.7;
      audio.play().catch(() => {});
    } else {
      audio.pause();
      audio.currentTime = 0;
    }
  }, [isRunning, sound]);

  return (
    <>
      {/* Modern, consistent background */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-indigo-900/20" aria-hidden="true" />
      {/* Optional: animated/floating shapes for extra polish, as in Signup/Login */}
      {/* Main content (above background) */}
      <motion.div 
        className="container mx-auto py-8 px-2 md:px-0 space-y-6 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Timer className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-3xl font-bold gradient-heading">Focus Timer</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Timer and Motivation */}
          <div className="lg:col-span-5 flex flex-col items-center space-y-6">
            <motion.div 
              ref={timerBoxRef}
              style={timerBoxSize ? { minHeight: timerBoxSize, transition: 'min-height 0.3s' } : {}}
              className="rounded-2xl shadow-2xl p-8 border flex flex-col items-center w-full justify-center backdrop-blur-lg bg-white/40 dark:bg-black/30 border-white/30 dark:border-white/20 max-w-xl mx-auto overflow-auto"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <TimerDisplay />
              <div className="mt-6 text-center">
                <span className="italic text-muted-foreground text-base animate-fade-in">{quote}</span>
              </div>
            </motion.div>
            {/* Optional: Session history or quick stats here */}
          </div>

          {/* Tabs: Tasks | Stats | Settings */}
          <div className="lg:col-span-7">
            <motion.div 
              ref={rightCardRef}
              className="rounded-2xl shadow-2xl border overflow-hidden backdrop-blur-lg bg-white/40 dark:bg-black/30 border-white/30 dark:border-white/20"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Tabs defaultValue="tasks" className="w-full" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="w-full grid grid-cols-3">
                  <TabsTrigger value="tasks">Tasks</TabsTrigger>
                  <TabsTrigger value="stats">Stats</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>
                <TabsContent value="tasks" className="m-0 p-6">
                  <TaskList />
                </TabsContent>
                <TabsContent value="stats" className="m-0 p-6">
                  <StatsDisplay />
                </TabsContent>
                <TabsContent value="settings" className="m-0 p-6">
                  <TimerSettings />
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </>
  );
}

const FocusTimer = () => {
  return (
    <FocusTimerProvider>
      <FocusTimerContent />
    </FocusTimerProvider>
  );
};

export default FocusTimer;
