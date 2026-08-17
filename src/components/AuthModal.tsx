'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { UserRole } from '@/types';
import { 
  X, 
  LogIn, 
  UserPlus, 
  Mail, 
  Lock, 
  User, 
  BookOpen
} from 'lucide-react';

export function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, authMode, login, signup } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>(authMode);
  
  // Form fields
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [department, setDepartment] = useState('Computer Science');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    if (mode === 'login') {
      if (!email) {
        setErrorMsg('Please enter your campus email address.');
        setLoading(false);
        return;
      }
      await login(email, 'student', name);
    } else {
      if (!email || !name) {
        setErrorMsg('Please complete all required fields.');
        setLoading(false);
        return;
      }
      await signup(email, name, studentId, department, 'student');
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-md bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xl my-8 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-white/90 hover:bg-white text-slate-500 hover:text-slate-900 border border-slate-200 transition-colors shadow-md"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 border-b border-slate-200 text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/30">
            {mode === 'login' ? <LogIn className="w-6 h-6" /> : <UserPlus className="w-6 h-6" />}
          </div>
          <h3 className="text-xl font-black text-white">
            {mode === 'login' ? 'Sign In to CampusPulse' : 'Create Student Account'}
          </h3>
          <p className="text-xs text-blue-200">
            {mode === 'login' 
              ? 'Access club events, registered tickets, and digital passes' 
              : 'Register for upcoming club events and generate your digital pass'}
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-50 text-rose-700 text-xs border border-rose-200 font-extrabold">
              {errorMsg}
            </div>
          )}

          {/* Full Name for Signup */}
          {mode === 'signup' && (
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Full Name</label>
              <div className="relative flex items-center">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5" />
                <input
                  type="text"
                  placeholder="e.g. Alex Morgan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-full pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 font-medium"
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Campus Email Address</label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5" />
              <input
                type="email"
                placeholder="student@campus.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-full pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 font-medium"
              />
            </div>
          </div>

          {/* Student ID & Dept for Signup */}
          {mode === 'signup' && (
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Student Roll / ID</label>
                <input
                  type="text"
                  placeholder="CS2026-8942"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-full px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 font-medium"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Department</label>
                <input
                  type="text"
                  placeholder="Computer Science"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-full px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 font-medium"
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-full font-black text-xs text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-600/25 transition-all transform active:scale-95"
          >
            {loading ? 'Authenticating...' : mode === 'login' ? 'Sign In Now' : 'Complete Account Registration'}
          </button>

          {/* Switch Mode Link */}
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setErrorMsg(''); }}
              className="text-xs text-slate-500 hover:text-blue-600 font-bold underline"
            >
              {mode === 'login' 
                ? "Don't have an account yet? Create one here" 
                : "Already have an account? Sign in here"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}



