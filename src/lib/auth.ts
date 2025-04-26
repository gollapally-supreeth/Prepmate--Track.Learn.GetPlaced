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
  loginWithToken: (token: string) => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      login: async (email: string, password: string, rememberMe?: boolean) => {
        const res = await fetch('http://localhost:5000/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
          credentials: 'include',
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Invalid email or password');
        }
        // Optionally store the token in localStorage
        localStorage.setItem('authToken', data.token);
        set({
          isAuthenticated: true,
          user: {
            email,
            name: data.name || email.split('@')[0],
          },
        });
      },
      logout: () => {
        set({
          isAuthenticated: false,
          user: null,
        });
        localStorage.removeItem('authToken');
      },
      loginWithToken: (token: string) => {
        // Decode token, set isAuthenticated and user
        const payload = JSON.parse(atob(token.split('.')[1]));
        set({
          isAuthenticated: true,
          user: {
            email: payload.email,
            name: payload.name,
          },
        });
        // Optionally, store the token in state as well
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