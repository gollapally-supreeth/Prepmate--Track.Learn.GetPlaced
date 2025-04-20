
import React, { createContext, useContext, useState, useEffect, useCallback, useReducer } from 'react';

// Types
export type TimerMode = 'work' | 'break' | 'longBreak';
export type FocusMode = 'deep' | 'sprint' | 'music';
export type TaskPriority = 'high' | 'medium' | 'low';

export interface FocusTask {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  completed: boolean;
  timeSpent: number; // in seconds
}

export interface TimerSettings {
  workDuration: number; // in minutes
  breakDuration: number; // in minutes
  longBreakDuration: number; // in minutes
  sessionsBeforeLongBreak: number;
}

export interface FocusStats {
  totalFocusTime: number; // in seconds
  todayFocusTime: number; // in seconds
  completedTasks: number;
  totalSessions: number;
  todaySessions: number;
  streak: number; // days in a row with at least one session
  weeklyData: number[]; // focus time for each day of the week
  monthlyData: number[][]; // focus time for each day of the month
}

interface FocusTimerState {
  isRunning: boolean;
  currentMode: TimerMode;
  remainingTime: number; // in seconds
  elapsedTime: number; // in seconds
  completedSessions: number;
  currentTask: FocusTask | null;
  tasks: FocusTask[];
  settings: TimerSettings;
  focusMode: FocusMode;
  stats: FocusStats;
  sound: string | null;
  blockedWebsites: string[];
  goals: {
    dailySessions: number;
    weeklySessions: number;
    dailyFocusTime: number; // in minutes
  };
}

type FocusTimerAction =
  | { type: 'START_TIMER' }
  | { type: 'PAUSE_TIMER' }
  | { type: 'RESET_TIMER' }
  | { type: 'SKIP_TIMER' }
  | { type: 'TICK' }
  | { type: 'COMPLETE_SESSION' }
  | { type: 'CHANGE_MODE'; payload: TimerMode }
  | { type: 'SET_FOCUS_MODE'; payload: FocusMode }
  | { type: 'SET_SOUND'; payload: string | null }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<TimerSettings> }
  | { type: 'ADD_TASK'; payload: Omit<FocusTask, 'id' | 'completed' | 'timeSpent'> }
  | { type: 'EDIT_TASK'; payload: { id: string; updates: Partial<FocusTask> } }
  | { type: 'COMPLETE_TASK'; payload: string }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'SET_CURRENT_TASK'; payload: string | null }
  | { type: 'BLOCK_WEBSITE'; payload: string }
  | { type: 'UNBLOCK_WEBSITE'; payload: string }
  | { type: 'UPDATE_GOALS'; payload: Partial<FocusTimerState['goals']> };

const initialState: FocusTimerState = {
  isRunning: false,
  currentMode: 'work',
  remainingTime: 25 * 60, // 25 minutes in seconds
  elapsedTime: 0,
  completedSessions: 0,
  currentTask: null,
  tasks: [],
  settings: {
    workDuration: 25,
    breakDuration: 5,
    longBreakDuration: 30,
    sessionsBeforeLongBreak: 4,
  },
  focusMode: 'deep',
  stats: {
    totalFocusTime: 0,
    todayFocusTime: 0,
    completedTasks: 0,
    totalSessions: 0,
    todaySessions: 0,
    streak: 0,
    weeklyData: Array(7).fill(0),
    monthlyData: Array(4).fill(Array(7).fill(0)),
  },
  sound: null,
  blockedWebsites: [],
  goals: {
    dailySessions: 5,
    weeklySessions: 25,
    dailyFocusTime: 120, // in minutes
  },
};

// Load state from localStorage if available
const loadState = (): FocusTimerState => {
  try {
    const savedState = localStorage.getItem('focusTimerState');
    if (savedState) {
      return JSON.parse(savedState);
    }
  } catch (error) {
    console.error('Error loading focus timer state:', error);
  }
  return initialState;
};

// Helper function to generate a unique ID
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 11);
};

// Update stats helper
const updateStats = (state: FocusTimerState): FocusStats => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  
  // Deep copy the weeklyData array
  const newWeeklyData = [...state.stats.weeklyData];
  newWeeklyData[dayOfWeek] += state.elapsedTime;
  
  return {
    ...state.stats,
    totalFocusTime: state.stats.totalFocusTime + state.elapsedTime,
    todayFocusTime: state.stats.todayFocusTime + state.elapsedTime,
    totalSessions: state.stats.totalSessions + (state.currentMode === 'work' ? 1 : 0),
    todaySessions: state.stats.todaySessions + (state.currentMode === 'work' ? 1 : 0),
    weeklyData: newWeeklyData,
  };
};

// Reducer function for handling timer state
const focusTimerReducer = (state: FocusTimerState, action: FocusTimerAction): FocusTimerState => {
  switch (action.type) {
    case 'START_TIMER':
      return {
        ...state,
        isRunning: true,
      };
    
    case 'PAUSE_TIMER':
      return {
        ...state,
        isRunning: false,
      };
    
    case 'TICK':
      if (!state.isRunning) return state;
      
      const newRemainingTime = state.remainingTime - 1;
      const newElapsedTime = state.elapsedTime + 1;
      
      // Update task time if a task is active
      const updatedTasks = state.tasks.map(task => 
        task.id === state.currentTask?.id 
          ? { ...task, timeSpent: task.timeSpent + 1 }
          : task
      );
      
      return {
        ...state,
        remainingTime: newRemainingTime,
        elapsedTime: newElapsedTime,
        tasks: updatedTasks,
      };
    
    case 'RESET_TIMER':
      return {
        ...state,
        isRunning: false,
        remainingTime: state.currentMode === 'work' 
          ? state.settings.workDuration * 60
          : state.currentMode === 'break'
            ? state.settings.breakDuration * 60
            : state.settings.longBreakDuration * 60,
        elapsedTime: 0,
      };
    
    case 'COMPLETE_SESSION':
      const completedSessions = state.currentMode === 'work' 
        ? state.completedSessions + 1 
        : state.completedSessions;
      
      const nextMode: TimerMode = state.currentMode === 'work'
        ? (completedSessions % state.settings.sessionsBeforeLongBreak === 0 ? 'longBreak' : 'break')
        : 'work';
      
      const nextDuration = nextMode === 'work'
        ? state.settings.workDuration * 60
        : nextMode === 'break'
          ? state.settings.breakDuration * 60
          : state.settings.longBreakDuration * 60;
      
      const updatedStats = state.currentMode === 'work'
        ? updateStats(state)
        : state.stats;
      
      return {
        ...state,
        isRunning: false,
        currentMode: nextMode,
        remainingTime: nextDuration,
        elapsedTime: 0,
        completedSessions,
        stats: updatedStats,
      };
    
    case 'SKIP_TIMER':
      return {
        ...state,
        isRunning: false,
        currentMode: state.currentMode === 'work' ? 'break' : 'work',
        remainingTime: state.currentMode === 'work'
          ? state.settings.breakDuration * 60
          : state.settings.workDuration * 60,
        elapsedTime: 0,
      };
    
    case 'CHANGE_MODE':
      const duration = action.payload === 'work'
        ? state.settings.workDuration * 60
        : action.payload === 'break'
          ? state.settings.breakDuration * 60
          : state.settings.longBreakDuration * 60;
      
      return {
        ...state,
        isRunning: false,
        currentMode: action.payload,
        remainingTime: duration,
        elapsedTime: 0,
      };
    
    case 'SET_FOCUS_MODE':
      return {
        ...state,
        focusMode: action.payload,
      };
    
    case 'SET_SOUND':
      return {
        ...state,
        sound: action.payload,
      };
    
    case 'UPDATE_SETTINGS':
      const newSettings = {
        ...state.settings,
        ...action.payload,
      };
      
      // Update remaining time if needed
      const updatedRemainingTime = state.currentMode === 'work'
        ? newSettings.workDuration * 60
        : state.currentMode === 'break'
          ? newSettings.breakDuration * 60
          : newSettings.longBreakDuration * 60;
      
      return {
        ...state,
        settings: newSettings,
        remainingTime: state.isRunning ? state.remainingTime : updatedRemainingTime,
      };
    
    case 'ADD_TASK':
      const newTask: FocusTask = {
        id: generateId(),
        title: action.payload.title,
        description: action.payload.description,
        priority: action.payload.priority,
        completed: false,
        timeSpent: 0,
      };
      
      return {
        ...state,
        tasks: [...state.tasks, newTask],
      };
    
    case 'EDIT_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id
            ? { ...task, ...action.payload.updates }
            : task
        ),
      };
    
    case 'COMPLETE_TASK':
      const tasksAfterComplete = state.tasks.map(task =>
        task.id === action.payload
          ? { ...task, completed: true }
          : task
      );
      
      const updatedStatsAfterComplete = {
        ...state.stats,
        completedTasks: state.stats.completedTasks + 1,
      };
      
      return {
        ...state,
        tasks: tasksAfterComplete,
        stats: updatedStatsAfterComplete,
        currentTask: state.currentTask?.id === action.payload ? null : state.currentTask,
      };
    
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload),
        currentTask: state.currentTask?.id === action.payload ? null : state.currentTask,
      };
    
    case 'SET_CURRENT_TASK':
      return {
        ...state,
        currentTask: action.payload === null
          ? null
          : state.tasks.find(task => task.id === action.payload) || null,
      };
    
    case 'BLOCK_WEBSITE':
      if (state.blockedWebsites.includes(action.payload)) {
        return state;
      }
      return {
        ...state,
        blockedWebsites: [...state.blockedWebsites, action.payload],
      };
    
    case 'UNBLOCK_WEBSITE':
      return {
        ...state,
        blockedWebsites: state.blockedWebsites.filter(site => site !== action.payload),
      };
    
    case 'UPDATE_GOALS':
      return {
        ...state,
        goals: {
          ...state.goals,
          ...action.payload,
        },
      };
    
    default:
      return state;
  }
};

// Context for the Focus Timer
interface FocusTimerContextType {
  state: FocusTimerState;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  skipTimer: () => void;
  completeSession: () => void;
  changeFocusMode: (mode: FocusMode) => void;
  updateSettings: (settings: Partial<TimerSettings>) => void;
  setSound: (sound: string | null) => void;
  addTask: (task: Omit<FocusTask, 'id' | 'completed' | 'timeSpent'>) => void;
  editTask: (id: string, updates: Partial<FocusTask>) => void;
  completeTask: (id: string) => void;
  deleteTask: (id: string) => void;
  setCurrentTask: (id: string | null) => void;
  blockWebsite: (url: string) => void;
  unblockWebsite: (url: string) => void;
  updateGoals: (goals: Partial<FocusTimerState['goals']>) => void;
  formatTime: (seconds: number) => string;
}

const FocusTimerContext = createContext<FocusTimerContextType | undefined>(undefined);

export const FocusTimerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(focusTimerReducer, initialState, loadState);
  
  // Save state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('focusTimerState', JSON.stringify(state));
    } catch (error) {
      console.error('Error saving focus timer state:', error);
    }
  }, [state]);
  
  // Timer tick effect
  useEffect(() => {
    let interval: number | undefined;
    
    if (state.isRunning) {
      interval = window.setInterval(() => {
        if (state.remainingTime <= 0) {
          completeSession();
          // Play sound when timer completes
          if (state.sound) {
            const audio = new Audio(state.sound);
            audio.play().catch(error => console.error('Error playing sound:', error));
          }
        } else {
          dispatch({ type: 'TICK' });
        }
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [state.isRunning, state.remainingTime, state.sound]);
  
  // Timer actions
  const startTimer = useCallback(() => {
    dispatch({ type: 'START_TIMER' });
  }, []);
  
  const pauseTimer = useCallback(() => {
    dispatch({ type: 'PAUSE_TIMER' });
  }, []);
  
  const resetTimer = useCallback(() => {
    dispatch({ type: 'RESET_TIMER' });
  }, []);
  
  const skipTimer = useCallback(() => {
    dispatch({ type: 'SKIP_TIMER' });
  }, []);
  
  const completeSession = useCallback(() => {
    dispatch({ type: 'COMPLETE_SESSION' });
  }, []);
  
  const changeFocusMode = useCallback((mode: FocusMode) => {
    dispatch({ type: 'SET_FOCUS_MODE', payload: mode });
  }, []);
  
  const updateSettings = useCallback((settings: Partial<TimerSettings>) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
  }, []);
  
  const setSound = useCallback((sound: string | null) => {
    dispatch({ type: 'SET_SOUND', payload: sound });
  }, []);
  
  // Task actions
  const addTask = useCallback((task: Omit<FocusTask, 'id' | 'completed' | 'timeSpent'>) => {
    dispatch({ type: 'ADD_TASK', payload: task });
  }, []);
  
  const editTask = useCallback((id: string, updates: Partial<FocusTask>) => {
    dispatch({ type: 'EDIT_TASK', payload: { id, updates } });
  }, []);
  
  const completeTask = useCallback((id: string) => {
    dispatch({ type: 'COMPLETE_TASK', payload: id });
  }, []);
  
  const deleteTask = useCallback((id: string) => {
    dispatch({ type: 'DELETE_TASK', payload: id });
  }, []);
  
  const setCurrentTask = useCallback((id: string | null) => {
    dispatch({ type: 'SET_CURRENT_TASK', payload: id });
  }, []);
  
  // Website blocking actions
  const blockWebsite = useCallback((url: string) => {
    dispatch({ type: 'BLOCK_WEBSITE', payload: url });
  }, []);
  
  const unblockWebsite = useCallback((url: string) => {
    dispatch({ type: 'UNBLOCK_WEBSITE', payload: url });
  }, []);
  
  // Goal actions
  const updateGoals = useCallback((goals: Partial<FocusTimerState['goals']>) => {
    dispatch({ type: 'UPDATE_GOALS', payload: goals });
  }, []);
  
  // Helper function to format time
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  return (
    <FocusTimerContext.Provider
      value={{
        state,
        startTimer,
        pauseTimer,
        resetTimer,
        skipTimer,
        completeSession,
        changeFocusMode,
        updateSettings,
        setSound,
        addTask,
        editTask,
        completeTask,
        deleteTask,
        setCurrentTask,
        blockWebsite,
        unblockWebsite,
        updateGoals,
        formatTime,
      }}
    >
      {children}
    </FocusTimerContext.Provider>
  );
};

// Custom hook to use the focus timer context
export const useFocusTimer = () => {
  const context = useContext(FocusTimerContext);
  if (context === undefined) {
    throw new Error('useFocusTimer must be used within a FocusTimerProvider');
  }
  return context;
};
