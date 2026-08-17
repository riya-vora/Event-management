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

  // Helper to persist user to localStorage and document.cookie for middleware server-side checks
  const persistUserSession = (profile: UserProfile | null) => {
    setUser(profile);
    if (profile) {
      const jsonStr = JSON.stringify(profile);
      localStorage.setItem('campus_pulse_user', jsonStr);
      document.cookie = `campus_pulse_user=${encodeURIComponent(jsonStr)}; path=/; max-age=86400; SameSite=Lax`;
    } else {
      localStorage.removeItem('campus_pulse_user');
      document.cookie = `campus_pulse_user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    }
  };

  useEffect(() => {
    // Check stored user profile
    const savedUser = localStorage.getItem('campus_pulse_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        persistUserSession(parsed);
      } catch {
        persistUserSession(DEMO_STUDENT_PROFILE);
      }
    } else {
      persistUserSession(DEMO_STUDENT_PROFILE);
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
                persistUserSession(data);
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

  const login = async (email: string, _rolePref?: UserRole, namePreference?: string): Promise<boolean> => {
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

    // Role is strictly derived from user identity, not client UI choice
    const isAdminEmail = email.toLowerCase().includes('admin') || email.toLowerCase().includes('staff');
    const profile: UserProfile = isAdminEmail ? DEMO_ADMIN_PROFILE : {
      ...DEMO_STUDENT_PROFILE,
      id: `u-${Date.now()}`,
      email,
      full_name: namePreference || (email.split('@')[0] ? email.split('@')[0].toUpperCase() : 'Student'),
      role: 'student'
    };

    persistUserSession(profile);
    closeAuthModal();
    return true;
  };

  const signup = async (
    email: string,
    name: string,
    studentId?: string,
    department?: string
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
            role: 'student' // Always create student accounts by default for security
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
      role: 'student',
      created_at: new Date().toISOString()
    };

    persistUserSession(newProfile);
    closeAuthModal();
    return true;
  };

  const logout = () => {
    const supabase = createClient();
    if (supabase && isSupabaseConnected) {
      supabase.auth.signOut();
    }
    persistUserSession(null);
  };

  const switchRole = (_newRole: UserRole) => {
    // Role switching UI disabled for security compliance
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
