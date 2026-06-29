'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';

export interface User {
  id: string;
  name: string;
  email: string;
  businessName?: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  session: any;
  loading: boolean;
  isLoading: boolean;
  login: (data: Record<string, any>) => Promise<void>;
  signup: (data: Record<string, any>) => Promise<void>;
  register: (data: Record<string, any>) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const loading = isLoading; // Alias to satisfy context signature

  useEffect(() => {
    // Check session on mount
    const checkSession = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        setSession(currentSession);
        if (currentSession) {
          localStorage.setItem('token', currentSession.access_token);
          // Sync with local backend
          try {
            const res = await apiClient.get('/auth/me');
            if (res.data.success && res.data.data) {
              setUser(res.data.data);
            } else {
              setUser({
                id: currentSession.user.id,
                email: currentSession.user.email || '',
                name: currentSession.user.user_metadata?.full_name || currentSession.user.user_metadata?.name || '',
                businessName: currentSession.user.user_metadata?.business_name || currentSession.user.user_metadata?.businessName || '',
                role: currentSession.user.user_metadata?.role || 'admin',
              });
            }
          } catch {
            // Backend unavailable or error, use session data
            setUser({
              id: currentSession.user.id,
              email: currentSession.user.email || '',
              name: currentSession.user.user_metadata?.full_name || currentSession.user.user_metadata?.name || '',
              businessName: currentSession.user.user_metadata?.business_name || currentSession.user.user_metadata?.businessName || '',
              role: currentSession.user.user_metadata?.role || 'admin',
            });
          }
        } else {
          setUser(null);
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.error('Error checkSession:', error);
        setUser(null);
        setSession(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      setIsLoading(true);
      setSession(currentSession);
      if (currentSession) {
        localStorage.setItem('token', currentSession.access_token);
        try {
          const res = await apiClient.get('/auth/me');
          if (res.data.success && res.data.data) {
            setUser(res.data.data);
          } else {
            setUser({
              id: currentSession.user.id,
              email: currentSession.user.email || '',
              name: currentSession.user.user_metadata?.full_name || currentSession.user.user_metadata?.name || '',
              businessName: currentSession.user.user_metadata?.business_name || currentSession.user.user_metadata?.businessName || '',
              role: currentSession.user.user_metadata?.role || 'admin',
            });
          }
        } catch {
          setUser({
            id: currentSession.user.id,
            email: currentSession.user.email || '',
            name: currentSession.user.user_metadata?.full_name || currentSession.user.user_metadata?.name || '',
            businessName: currentSession.user.user_metadata?.business_name || currentSession.user.user_metadata?.businessName || '',
            role: currentSession.user.user_metadata?.role || 'admin',
          });
        }
      } else {
        setUser(null);
        localStorage.removeItem('token');
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (data: Record<string, any>) => {
    try {
      const { email, password } = data;
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (authData.session) {
        setSession(authData.session);
        localStorage.setItem('token', authData.session.access_token);
        
        // Explicitly call /auth/me after login and set user from the API response
        try {
          const res = await apiClient.get('/auth/me');
          if (res.data.success && res.data.data) {
            setUser(res.data.data);
          } else {
            throw new Error('Backend failed to return user data');
          }
        } catch (apiErr) {
          console.error('[Login] Backend sync error fetching /auth/me:', apiErr);
          throw apiErr;
        }
      }

      toast.success('Logged in successfully');
      router.push('/dashboard');
    } catch (err: unknown) {
      console.error('[Login Error]', err);
      const message = err instanceof Error ? err.message : 'Login failed';
      toast.error(message);
      throw new Error(message);
    }
  };

  const signup = async (data: Record<string, any>) => {
    try {
      const { name, email, password, businessName, role } = data;

      // Step 1: Create account in Supabase Auth
      const { data: authData, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            business_name: businessName,
            role: role || 'admin',
          },
        },
      });
      if (error) throw error;

      // Step 2: Immediately sign in to get a valid session + access_token
      const { data: sessionData, error: loginErr } = 
        await supabase.auth.signInWithPassword({ email, password });
      if (loginErr) throw loginErr;

      // Step 3: Call Express API with Supabase token — this creates the 
      // user in Neon via Prisma (auth middleware handles upsert automatically)
      if (sessionData?.session?.access_token) {
        try {
          await apiClient.post('/auth/register', {
            name,
            email,
            password,
            businessName,
          });
        } catch (apiErr) {
          // Non-fatal: auth middleware will create the user on first 
          // protected route call anyway
          console.warn('[Signup] Backend sync warning:', apiErr);
        }
      }

      // Sign out after registration — user must verify email first
      await supabase.auth.signOut();

      toast.success('Account created! Please verify your email before signing in.');
      router.push('/login');
    } catch (err: unknown) {
      console.error('[Signup Error]', err);
      const message = err instanceof Error ? err.message : 'Registration failed';
      toast.error(message);
      throw new Error(message);
    }
  };

  const register = async (data: Record<string, any>) => {
    await signup(data);
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Logout error', error);
    } finally {
      setUser(null);
      setSession(null);
      localStorage.removeItem('token');
      router.push('/login');
      toast.success('Logged out successfully');
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const response = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      console.log('[Supabase Reset Password Response]', response);
      const { error } = response;
      if (error) throw error;
      toast.success('A password reset link has been sent to your email.');
    } catch (err: unknown) {
      console.error('[Reset Password Request Error]', err);
      throw err;
    }
  };

  const updatePassword = async (password: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });
      if (error) throw error;
      toast.success('Password updated successfully! Please sign in');
      router.push('/login');
    } catch (err: unknown) {
      console.error('[Update Password Error]', err);
      const message = err instanceof Error ? err.message : 'Update password failed';
      toast.error(message);
      throw new Error(message);
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, isLoading, login, signup, register, logout, resetPassword, updatePassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
