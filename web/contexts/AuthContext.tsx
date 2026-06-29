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
  isLoading: boolean;
  login: (data: Record<string, any>) => Promise<void>;
  register: (data: Record<string, any>) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check session on mount
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          localStorage.setItem('token', session.access_token);
          // Sync with local backend
          try {
            const res = await apiClient.get('/auth/me');
            if (res.data.success && res.data.data) {
              setUser(res.data.data);
            } else {
              setUser({
                id: session.user.id,
                email: session.user.email || '',
                name: session.user.user_metadata?.name || '',
                businessName: session.user.user_metadata?.businessName || '',
                role: session.user.user_metadata?.role || 'admin',
              });
            }
          } catch {
            // Backend unavailable or error, use session data
            setUser({
              id: session.user.id,
              email: session.user.email || '',
              name: session.user.user_metadata?.name || '',
              businessName: session.user.user_metadata?.businessName || '',
              role: session.user.user_metadata?.role || 'admin',
            });
          }
        } else {
          setUser(null);
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.error('Error checkSession:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setIsLoading(true);
      if (session) {
        localStorage.setItem('token', session.access_token);
        try {
          const res = await apiClient.get('/auth/me');
          if (res.data.success && res.data.data) {
            setUser(res.data.data);
          } else {
            setUser({
              id: session.user.id,
              email: session.user.email || '',
              name: session.user.user_metadata?.name || '',
              businessName: session.user.user_metadata?.businessName || '',
              role: session.user.user_metadata?.role || 'admin',
            });
          }
        } catch {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.name || '',
            businessName: session.user.user_metadata?.businessName || '',
            role: session.user.user_metadata?.role || 'admin',
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
        localStorage.setItem('token', authData.session.access_token);
      }

      toast.success('Logged in successfully');
      router.push('/dashboard');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed';
      toast.error(message);
      throw new Error(message);
    }
  };

  const register = async (data: Record<string, any>) => {
    try {
      const { name, email, password, businessName, role } = data;
      const { data: authData, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            businessName,
            role: role || 'admin',
          },
        },
      });

      if (error) throw error;

      // After successful signup, store user details in database (Supabase database public.users table)
      if (authData.user) {
        try {
          const { error: dbError } = await supabase.from('users').insert([
            {
              id: authData.user.id,
              email: authData.user.email || email,
              name: name,
              created_at: new Date().toISOString(),
            },
          ]);

          if (dbError) {
            console.error('[Supabase DB Error] Could not insert profile info:', dbError.message);
          }
        } catch (dbErr: unknown) {
          const dbErrMsg = dbErr instanceof Error ? dbErr.message : 'Unknown database error';
          console.error('[Supabase DB Error] Table insertion error:', dbErrMsg);
        }
      }

      if (authData.session) {
        localStorage.setItem('token', authData.session.access_token);
      }

      toast.success('Account created successfully');
      router.push('/dashboard');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      toast.error(message);
      throw new Error(message);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Logout error', error);
    } finally {
      setUser(null);
      localStorage.removeItem('token');
      router.push('/login');
      toast.success('Logged out successfully');
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
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

