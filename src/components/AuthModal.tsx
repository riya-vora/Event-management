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
  BookOpen, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2
} from 'lucide-react';

export function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, authMode, login, signup } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>(authMode);
  
  // Form fields
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [department, setDepartment] = useState('Computer Science');
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
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
      await login(email, selectedRole, name);
    } else {
      if (!email || !name) {
        setErrorMsg('Please complete all required fields.');
        setLoading(false);
        return;
      }
      await signup(email, name, studentId, department, selectedRole);
    }

    setLoading(false);
  };

  const fillDemoStudent = () => {
    setEmail('alex.morgan@campus.edu');
    setName('Alex Morgan');
    setStudentId('CS2026-8942');
    setSelectedRole('student');
  };

  const fillDemoAdmin = () => {
    setEmail('admin.events@campus.edu');
    setName('Dr. Sarah Connor');
    setStudentId('STAFF-1002');
    setSelectedRole('admin');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-md glass-panel rounded-3xl border border-indigo-500/40 overflow-hidden shadow-2xl my-8 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-950/80 hover:bg-slate-900 text-slate-400 hover:text-white border border-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 border-b border-slate-800 text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shadow-lg">
            {mode === 'login' ? <LogIn className="w-6 h-6" /> : <UserPlus className="w-6 h-6" />}
          </div>
          <h3 className="text-xl font-extrabold text-white">
            {mode === 'login' ? 'Sign In to CampusPulse' : 'Create Student Account'}
          </h3>
          <p className="text-xs text-slate-400">
            {mode === 'login' 
              ? 'Access club events, registered tickets, and admin dashboard' 
              : 'Register for upcoming club events and generate your digital pass'}
          </p>
        </div>

        {/* Demo Fast Preset Bar */}
        <div className="p-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-xs px-6">
          <span className="text-slate-400 font-medium">Quick Demo Preset:</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={fillDemoStudent}
              className="px-2.5 py-1 rounded-lg bg-indigo-950 hover:bg-indigo-900 text-indigo-300 border border-indigo-800/60 font-semibold transition-colors"
            >
              Student Preset
            </button>
            <button
              type="button"
              onClick={fillDemoAdmin}
              className="px-2.5 py-1 rounded-lg bg-purple-950 hover:bg-purple-900 text-purple-300 border border-purple-800/60 font-semibold transition-colors"
            >
              Admin Preset
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-950/80 text-rose-300 text-xs border border-rose-800 font-medium">
              {errorMsg}
            </div>
          )}

          {/* Role selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Account Type / Role</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSelectedRole('student')}
                className={`py-2 px-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-2 transition-all ${
                  selectedRole === 'student'
                    ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-600/30'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                <User className="w-3.5 h-3.5" /> Student
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole('admin')}
                className={`py-2 px-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-2 transition-all ${
                  selectedRole === 'admin'
                    ? 'bg-purple-600 text-white border-purple-400 shadow-md shadow-purple-600/30'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" /> Club Admin
              </button>
            </div>
          </div>

          {/* Full Name for Signup */}
          {mode === 'signup' && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Full Name</label>
              <div className="relative flex items-center">
                <User className="w-4 h-4 text-slate-400 absolute left-3" />
                <input
                  type="text"
                  placeholder="e.g. Alex Morgan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Campus Email Address</label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3" />
              <input
                type="email"
                placeholder="student@campus.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Student ID & Dept for Signup */}
          {mode === 'signup' && (
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Student Roll / ID</label>
                <input
                  type="text"
                  placeholder="CS2026-8942"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Department</label>
                <input
                  type="text"
                  placeholder="Computer Science"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-600/30 transition-all transform active:scale-95"
          >
            {loading ? 'Authenticating...' : mode === 'login' ? 'Sign In Now' : 'Complete Account Registration'}
          </button>

          {/* Switch Mode Link */}
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setErrorMsg(''); }}
              className="text-xs text-slate-400 hover:text-indigo-300 font-medium underline"
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
