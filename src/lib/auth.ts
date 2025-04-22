import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  isAuthenticated: boolean;
  user: {
    email: string;
    name?: string;
  } | null;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  logout: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      login: async (email: string, password: string, rememberMe?: boolean) => {
        // Here you would typically make an API call to your backend
        // For now, we'll simulate a successful login
        if (email && password) {
          set({
            isAuthenticated: true,
            user: {
              email,
              name: email.split('@')[0], // Simple name extraction from email
            },
          });
        } else {
          throw new Error('Invalid credentials');
        }
      },
      logout: () => {
        set({
          isAuthenticated: false,
          user: null,
        });
      },
    }),
    {
      name: 'auth-storage',
      skipHydration: true,
    }
  )
);

// Create a hook wrapper for better TypeScript support and easier imports
export const useAuth = () => {
  const { isAuthenticated, user, login, logout } = useAuthStore();
  return { isAuthenticated, user, login, logout };
};

export default useAuthStore; 