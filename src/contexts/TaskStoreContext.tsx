import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';

export type TaskPriority = 'high' | 'medium' | 'low';

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueTime?: string;
  subject?: string;
  priority: TaskPriority | 'High' | 'Medium' | 'Low';
  status?: 'todo' | 'in-progress' | 'completed';
  completed?: boolean;
  inPlanner?: boolean;
  inFocus?: boolean;
  focusFields?: {
    notes?: string;
    tags?: string[];
    pomodoros?: number;
    subtasks?: { id: string; title: string; completed: boolean }[];
    dueDate?: string;
    order?: number;
  };
}

interface TaskStoreState {
  tasks: Task[];
}

type TaskStoreAction =
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'EDIT_TASK'; payload: { id: string; updates: Partial<Task> } }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'COMPLETE_TASK'; payload: string }
  | { type: 'SYNC_TASK'; payload: Task }
  | { type: 'REORDER_TASKS'; payload: { sourceIndex: number; destinationIndex: number } };

const initialState: TaskStoreState = {
  tasks: [],
};

const TaskStoreContext = createContext<any>(undefined);

function taskStoreReducer(state: TaskStoreState, action: TaskStoreAction): TaskStoreState {
  switch (action.type) {
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] };
    case 'EDIT_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id ? { ...task, ...action.payload.updates } : task
        ),
      };
    case 'DELETE_TASK':
      return { ...state, tasks: state.tasks.filter(task => task.id !== action.payload) };
    case 'COMPLETE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload ? { ...task, completed: true, status: 'completed' } : task
        ),
      };
    case 'SYNC_TASK':
      // Replace or add the task
      const exists = state.tasks.some(t => t.id === action.payload.id);
      return exists
        ? {
            ...state,
            tasks: state.tasks.map(t => (t.id === action.payload.id ? action.payload : t)),
          }
        : { ...state, tasks: [...state.tasks, action.payload] };
    case 'REORDER_TASKS': {
      const { sourceIndex, destinationIndex } = action.payload;
      const tasks = Array.from(state.tasks);
      const [removed] = tasks.splice(sourceIndex, 1);
      tasks.splice(destinationIndex, 0, removed);
      return { ...state, tasks };
    }
    default:
      return state;
  }
}

export const TaskStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(taskStoreReducer, initialState, (init) => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('allTasks');
      if (stored) return { tasks: JSON.parse(stored) };
    }
    return init;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('allTasks', JSON.stringify(state.tasks));
    }
  }, [state.tasks]);

  // Actions
  const addTask = useCallback((task: Task) => dispatch({ type: 'ADD_TASK', payload: task }), []);
  const editTask = useCallback((id: string, updates: Partial<Task>) => dispatch({ type: 'EDIT_TASK', payload: { id, updates } }), []);
  const deleteTask = useCallback((id: string) => dispatch({ type: 'DELETE_TASK', payload: id }), []);
  const completeTask = useCallback((id: string) => dispatch({ type: 'COMPLETE_TASK', payload: id }), []);
  const syncTask = useCallback((task: Task) => dispatch({ type: 'SYNC_TASK', payload: task }), []);
  const reorderTasks = useCallback((sourceIndex: number, destinationIndex: number) => dispatch({ type: 'REORDER_TASKS', payload: { sourceIndex, destinationIndex } }), []);

  return (
    <TaskStoreContext.Provider value={{
      tasks: state.tasks,
      addTask,
      editTask,
      deleteTask,
      completeTask,
      syncTask,
      reorderTasks,
    }}>
      {children}
    </TaskStoreContext.Provider>
  );
};

export const useTaskStore = () => {
  const ctx = useContext(TaskStoreContext);
  if (!ctx) throw new Error('useTaskStore must be used within a TaskStoreProvider');
  return ctx;
}; 