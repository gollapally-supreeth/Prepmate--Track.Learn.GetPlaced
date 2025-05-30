import React from 'react';
import { useFocusTimer } from './FocusTimerContext';
import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Play, Pause, RotateCcw, SkipForward, PlayCircle, PauseCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TimerDisplayProps {
  className?: string;
  compact?: boolean;
}

export function TimerDisplay({ className, compact = false }: TimerDisplayProps) {
  const { 
    state, 
    startTimer, 
    pauseTimer, 
    resetTimer, 
    skipTimer, 
    formatTime 
  } = useFocusTimer();
  
  const { currentMode, remainingTime, isRunning, settings } = state;
  
  // Calculate progress percentage
  const totalTime = currentMode === 'work' 
    ? settings.workDuration * 60 
    : currentMode === 'break' 
      ? settings.breakDuration * 60 
      : settings.longBreakDuration * 60;
      
  const progress = Math.max(0, Math.min(100, ((totalTime - remainingTime) / totalTime) * 100));
  
  // Color based on current mode
  const getTimerColor = () => {
    switch (currentMode) {
      case 'work':
        return 'var(--focus-purple)';
      case 'break':
        return 'var(--focus-green)';
      case 'longBreak':
        return 'var(--focus-blue)';
      default:
        return 'var(--focus-purple)';
    }
  };
  
  const getModeLabel = () => {
    switch (currentMode) {
      case 'work':
        return 'Focus Time';
      case 'break':
        return 'Short Break';
      case 'longBreak':
        return 'Long Break';
      default:
        return 'Focus Timer';
    }
  };
  
  // Handle button clicks
  const handleActionClick = () => {
    if (isRunning) {
      pauseTimer();
    } else {
      startTimer();
    }
  };
  
  if (compact) {
    return (
      <div className={cn("flex items-center gap-2 p-2", className)}>
        <div className="w-10 h-10">
          <CircularProgressbarWithChildren
            value={progress}
            strokeWidth={8}
            styles={buildStyles({
              pathColor: getTimerColor(),
              trailColor: 'var(--secondary)'
            })}
          >
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 rounded-full"
              onClick={handleActionClick}
            >
              {isRunning ? 
                <Pause className="h-3 w-3" /> : 
                <Play className="h-3 w-3" />
              }
            </Button>
          </CircularProgressbarWithChildren>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground">{getModeLabel()}</span>
          <span className="text-sm font-medium">{formatTime(remainingTime)}</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      <h2 className="text-lg font-semibold">{getModeLabel()}</h2>
      
      <div className="w-60 h-60">
        <CircularProgressbarWithChildren
          value={progress}
          strokeWidth={5}
          styles={buildStyles({
            pathColor: getTimerColor(),
            trailColor: 'rgba(229, 231, 235, 0.2)',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            pathTransition: 'stroke-dashoffset 0.5s ease'
          })}
          background
        >
          <div className="flex flex-col items-center justify-center">
            <span className="text-4xl font-bold text-zinc-900 dark:text-zinc-50">{formatTime(remainingTime)}</span>
            <span className="text-sm text-muted-foreground mt-2">
              {currentMode === 'work' ? 'Focus' : 'Break'} Session
            </span>
          </div>
        </CircularProgressbarWithChildren>
      </div>
      
      <div className="flex items-center gap-4 mt-6">
        <Button 
          variant="outline"
          size="icon"
          onClick={resetTimer}
          aria-label="Reset Timer"
          className="rounded-full h-10 w-10 bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700"
        >
          <RotateCcw className="h-5 w-5 text-zinc-700 dark:text-zinc-300" />
        </Button>
        
        <Button
          variant="default"
          size="lg"
          onClick={handleActionClick}
          aria-label={isRunning ? "Pause Timer" : "Start Timer"}
          className="rounded-full w-16 h-16 bg-white dark:bg-black border-2 border-zinc-300 dark:border-zinc-700 shadow-sm"
        >
          <div className="flex flex-col items-center justify-center">
            {isRunning ? (
              <>
                <Pause className="h-8 w-8 text-black dark:text-white" />
                <span className="text-[10px] mt-1 text-zinc-500 dark:text-zinc-400">Pause</span>
              </>
            ) : (
              <>
                <Play className="h-8 w-8 text-black dark:text-white" />
                <span className="text-[10px] mt-1 text-zinc-500 dark:text-zinc-400">Play</span>
              </>
            )}
          </div>
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          onClick={skipTimer}
          aria-label="Skip Timer"
          className="rounded-full h-10 w-10 bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700"
        >
          <SkipForward className="h-5 w-5 text-zinc-700 dark:text-zinc-300" />
        </Button>
      </div>
    </div>
  );
}
