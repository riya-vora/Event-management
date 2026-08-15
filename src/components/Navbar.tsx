'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useEvents } from '@/lib/events-context';
import { 
  Sparkles, 
  Ticket, 
  ShieldCheck, 
  LogOut, 
  User, 
  Database, 
  Menu, 
  X,
  Compass,
  ArrowRightLeft
} from 'lucide-react';
import { SupabaseConfigModal } from './SupabaseConfigModal';

export function Navbar() {
  const pathname = usePathname();
  const { user, isLoggedIn, openAuthModal, logout, role, switchRole, isSupabaseConnected } = useAuth();
  const { registrations } = useEvents();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dbModalOpen, setDbModalOpen] = useState(false);

  const activeRegistrationsCount = user 
    ? registrations.filter(r => r.user_id === user.id && r.status === 'confirmed').length 
    : 0;

  return (
    <>
      <header className="sticky top-0 z-40 w-full glass-nav backdrop-blur-md border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 p-[2px] shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-indigo-400 group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xl tracking-tight text-white group-hover:text-indigo-200 transition-colors">
                  Campus<span className="gradient-text">Pulse</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-indigo-950/80 text-indigo-400 border border-indigo-800/50">
                  College Hub
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">Discover & Register Club Events</p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-full border border-slate-800/80">
            <Link
              href="/"
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                pathname === '/'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Compass className="w-4 h-4" />
              Discover Events
            </Link>

            <Link
              href="/my-tickets"
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                pathname === '/my-tickets'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Ticket className="w-4 h-4" />
              My Tickets
              {activeRegistrationsCount > 0 && (
                <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-cyan-500 text-slate-950 font-bold">
                  {activeRegistrationsCount}
                </span>
              )}
            </Link>

            <Link
              href="/admin"
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                pathname === '/admin'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              Admin Portal
            </Link>
          </nav>

          {/* Right Action Bar */}
          <div className="hidden lg:flex items-center gap-3">
            
            {/* Supabase Status Button */}
            <button
              onClick={() => setDbModalOpen(true)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                isSupabaseConnected
                  ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/60 hover:bg-emerald-900/50'
                  : 'bg-amber-950/40 text-amber-300 border-amber-800/60 hover:bg-amber-900/50'
              }`}
              title="Click to view Supabase database setup script & connection info"
            >
              <Database className="w-3.5 h-3.5" />
              <span>{isSupabaseConnected ? 'Supabase Connected' : 'Demo Mode (SQL Available)'}</span>
            </button>

            {/* Quick Demo Role Switcher Toggle */}
            <button
              onClick={() => switchRole(role === 'admin' ? 'student' : 'admin')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-xs text-slate-300 font-medium border border-slate-700 transition-colors"
              title="Toggle role for instant testing"
            >
              <ArrowRightLeft className="w-3.5 h-3.5 text-indigo-400" />
              <span>Role: <strong className="capitalize text-white">{role}</strong></span>
            </button>

            {/* Auth Button */}
            {isLoggedIn ? (
              <div className="flex items-center gap-3 pl-2 border-l border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 p-0.5">
                    <img
                      src={user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                      alt={user?.full_name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  <div className="text-left hidden xl:block">
                    <p className="text-xs font-semibold text-white leading-tight">{user?.full_name}</p>
                    <p className="text-[10px] text-slate-400 capitalize">{user?.role} ({user?.student_id || 'Campus'})</p>
                  </div>
                </div>

                <button
                  onClick={logout}
                  className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg border border-transparent hover:border-rose-900/50 transition-all"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openAuthModal('login')}
                  className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => openAuthModal('signup')}
                  className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl shadow-lg shadow-indigo-600/30 transition-all transform hover:-translate-y-0.5"
                >
                  Create Account
                </button>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden px-4 pt-2 pb-6 bg-slate-900 border-b border-slate-800 space-y-3">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-200 bg-slate-800/60"
            >
              <Compass className="w-5 h-5 text-indigo-400" />
              Discover Club Events
            </Link>
            <Link
              href="/my-tickets"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium text-slate-200 bg-slate-800/60"
            >
              <div className="flex items-center gap-3">
                <Ticket className="w-5 h-5 text-cyan-400" />
                My Registered Tickets
              </div>
              {activeRegistrationsCount > 0 && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-500 text-slate-950">
                  {activeRegistrationsCount}
                </span>
              )}
            </Link>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-200 bg-slate-800/60"
            >
              <ShieldCheck className="w-5 h-5 text-purple-400" />
              Protected Admin Portal
            </Link>

            <div className="pt-3 border-t border-slate-800 space-y-3">
              <button
                onClick={() => { setMobileMenuOpen(false); setDbModalOpen(true); }}
                className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-800 text-xs font-medium text-slate-300"
              >
                <span className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-emerald-400" />
                  Supabase Status & SQL Script
                </span>
                <span className="text-[10px] text-emerald-400">View</span>
              </button>

              <button
                onClick={() => switchRole(role === 'admin' ? 'student' : 'admin')}
                className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-800 text-xs font-medium text-slate-300"
              >
                <span>Current Role: <strong className="capitalize text-indigo-400">{role}</strong></span>
                <span className="text-[10px] text-indigo-300 underline">Switch Role</span>
              </button>

              {isLoggedIn ? (
                <button
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-rose-950/40 text-rose-300 text-sm font-semibold border border-rose-900/50"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out ({user?.full_name})
                </button>
              ) : (
                <button
                  onClick={() => { openAuthModal('login'); setMobileMenuOpen(false); }}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-sm shadow-lg"
                >
                  Sign In / Create Account
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Supabase Config & Schema Modal */}
      {dbModalOpen && <SupabaseConfigModal isOpen={dbModalOpen} onClose={() => setDbModalOpen(false)} />}
    </>
  );
}
