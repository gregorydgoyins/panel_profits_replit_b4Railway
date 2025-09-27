import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  user_metadata?: {
    username?: string;
    name?: string;
    mfa_enabled?: boolean;
  };
}

interface AuthError {
  message: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: AuthError | null;
  
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  loadUser: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  signIn: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful sign in
      const mockUser: User = {
        id: '1',
        email,
        user_metadata: {
          username: email.split('@')[0],
          name: 'Demo User'
        }
      };
      
      set({ 
        user: mockUser, 
        isAuthenticated: true, 
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: { message: 'Invalid email or password' }, 
        isLoading: false 
      });
    }
  },

  signUp: async (email: string, password: string, username: string, name: string) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock successful sign up
      const mockUser: User = {
        id: '1',
        email,
        user_metadata: {
          username,
          name
        }
      };
      
      set({ 
        user: mockUser, 
        isAuthenticated: true, 
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: { message: 'Registration failed' }, 
        isLoading: false 
      });
    }
  },

  signOut: async () => {
    set({ isLoading: true });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set({ 
        user: null, 
        isAuthenticated: false, 
        isLoading: false,
        error: null
      });
    } catch (error) {
      set({ 
        error: { message: 'Sign out failed' }, 
        isLoading: false 
      });
    }
  },

  loadUser: async () => {
    set({ isLoading: true });
    
    try {
      // Simulate checking for existing session
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock no existing session for demo
      set({ 
        user: null, 
        isAuthenticated: false, 
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: { message: 'Failed to load user' }, 
        isLoading: false 
      });
    }
  },

  clearError: () => set({ error: null })
}));

export default useAuthStore;