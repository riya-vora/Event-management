'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserProfile, UserRole } from '@/types';
import { createClient } from './supabase/client';
import { DEMO_ADMIN_PROFILE, DEMO_STUDENT_PROFILE } from './supabase/mockStore';

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole;
  isLoggedIn: boolean;
  isAuthModalOpen: boolean;
  authMode: 'login' | 'signup';
  openAuthModal: (mode?: 'login' | 'signup') => void;
  closeAuthModal: () => void;
  login: (email: string, role?: UserRole, name?: string) => Promise<boolean>;
  signup: (email: string, name: string, studentId?: string, department?: string, role?: UserRole) => Promise<boolean>;
  logout: () => void;
  switchRole: (newRole: UserRole) => void;
  isSupabaseConnected: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(false);

  useEffect(() => {
    // Check local storage or initialize with default demo user
    const savedUser = localStorage.getItem('campus_pulse_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        setUser(DEMO_STUDENT_PROFILE);
      }
    } else {
      // Default to demo student logged in for smooth exploration, can log out anytime!
      setUser(DEMO_STUDENT_PROFILE);
      localStorage.setItem('campus_pulse_user', JSON.stringify(DEMO_STUDENT_PROFILE));
    }

    // Check if Supabase keys exist
    const supabase = createClient();
    if (supabase) {
      setIsSupabaseConnected(true);
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()
            .then(({ data }) => {
              if (data) {
                setUser(data);
                localStorage.setItem('campus_pulse_user', JSON.stringify(data));
              }
            });
        }
      });
    }
  }, []);

  const openAuthModal = (mode: 'login' | 'signup' = 'login') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const login = async (email: string, rolePreference: UserRole = 'student', namePreference?: string): Promise<boolean> => {
    const supabase = createClient();
    if (supabase && isSupabaseConnected) {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password: 'password123'
      });
      if (!error) {
        closeAuthModal();
        return true;
      }
    }

    // Demo Mode Fallback
    const profile: UserProfile = rolePreference === 'admin' ? DEMO_ADMIN_PROFILE : {
      ...DEMO_STUDENT_PROFILE,
      email,
      full_name: namePreference || (email.split('@')[0] ? email.split('@')[0].toUpperCase() : 'Student')
    };

    setUser(profile);
    localStorage.setItem('campus_pulse_user', JSON.stringify(profile));
    closeAuthModal();
    return true;
  };

  const signup = async (
    email: string,
    name: string,
    studentId?: string,
    department?: string,
    role: UserRole = 'student'
  ): Promise<boolean> => {
    const supabase = createClient();
    if (supabase && isSupabaseConnected) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: 'password123',
        options: {
          data: {
            full_name: name,
            student_id: studentId,
            department,
            role
          }
        }
      });
      if (!error && data.user) {
        closeAuthModal();
        return true;
      }
    }

    const newProfile: UserProfile = {
      id: `u-${Date.now()}`,
      email,
      full_name: name,
      student_id: studentId || 'CS2026-NEW',
      department: department || 'General Studies',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role,
      created_at: new Date().toISOString()
    };

    setUser(newProfile);
    localStorage.setItem('campus_pulse_user', JSON.stringify(newProfile));
    closeAuthModal();
    return true;
  };

  const logout = () => {
    const supabase = createClient();
    if (supabase && isSupabaseConnected) {
      supabase.auth.signOut();
    }
    setUser(null);
    localStorage.removeItem('campus_pulse_user');
  };

  const switchRole = (newRole: UserRole) => {
    if (newRole === 'admin') {
      setUser(DEMO_ADMIN_PROFILE);
      localStorage.setItem('campus_pulse_user', JSON.stringify(DEMO_ADMIN_PROFILE));
    } else {
      setUser(DEMO_STUDENT_PROFILE);
      localStorage.setItem('campus_pulse_user', JSON.stringify(DEMO_STUDENT_PROFILE));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || 'student',
        isLoggedIn: !!user,
        isAuthModalOpen,
        authMode,
        openAuthModal,
        closeAuthModal,
        login,
        signup,
        logout,
        switchRole,
        isSupabaseConnected
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
