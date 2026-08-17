'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useEvents } from '@/lib/events-context';
import { 
  Ticket, 
  ShieldCheck, 
  LogOut, 
  User, 
  Menu, 
  X,
  Compass,
  Layers,
  Search
} from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const { user, isLoggedIn, openAuthModal, logout } = useAuth();
  const { registrations } = useEvents();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const activeRegistrationsCount = user 
    ? registrations.filter(r => r.user_id === user.id && r.status === 'confirmed').length 
    : 0;

  const isAdmin = isLoggedIn && user?.role === 'admin';

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/25 group-hover:scale-105 transition-transform duration-300">
            <Layers className="w-5.5 h-5.5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-xl tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                Campus<span className="text-blue-600">Pulse</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">College Club Event Portal</p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100/90 p-1.5 rounded-full border border-slate-200">
          <Link
            href="/"
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 ${
              pathname === '/'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Compass className="w-4 h-4" />
            Home
          </Link>

          <Link
            href="/#explore-events"
            className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 transition-all"
          >
            <Search className="w-4 h-4" />
            Explore
          </Link>

          <Link
            href="/my-tickets"
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 ${
              pathname === '/my-tickets'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Ticket className="w-4 h-4 text-cyan-600" />
            My Tickets
            {activeRegistrationsCount > 0 && (
              <span className="ml-1 px-2 py-0.5 text-[10px] rounded-full bg-cyan-100 text-cyan-800 font-black border border-cyan-200">
                {activeRegistrationsCount}
              </span>
            )}
          </Link>

          {/* Admin Portal Link - Strictly ONLY visible when logged-in user is an administrator */}
          {isAdmin && (
            <Link
              href="/admin"
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 ${
                pathname === '/admin'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              Admin Portal
            </Link>
          )}
        </nav>

        {/* Right Auth Bar */}
        <div className="hidden md:flex items-center gap-3">
          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-blue-100 p-0.5 border border-blue-300 shadow-sm overflow-hidden">
                  <img
                    src={user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                    alt={user?.full_name}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <div className="text-left">
                  <p className="text-xs font-black text-slate-900 leading-tight">{user?.full_name}</p>
                  <p className="text-[10px] text-slate-500 font-medium capitalize">{user?.role} ({user?.student_id || 'Campus'})</p>
                </div>
              </div>

              <button
                onClick={logout}
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl border border-transparent hover:border-rose-200 transition-all"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => openAuthModal('login')}
                className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-blue-600 transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => openAuthModal('signup')}
                className="px-5 py-2.5 text-xs font-black text-white bg-blue-600 hover:bg-blue-700 rounded-full shadow-md shadow-blue-600/20 transition-all transform hover:-translate-y-0.5 active:scale-95"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2.5 text-slate-600 hover:text-slate-900 rounded-xl bg-slate-100 border border-slate-200"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-3 pb-6 bg-white border-b border-slate-200 space-y-3 shadow-xl animate-in slide-in-from-top-4 duration-200">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-slate-800 bg-slate-50 border border-slate-200"
          >
            <Compass className="w-5 h-5 text-blue-600" />
            Discover Events
          </Link>
          <Link
            href="/my-tickets"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold text-slate-800 bg-slate-50 border border-slate-200"
          >
            <div className="flex items-center gap-3">
              <Ticket className="w-5 h-5 text-cyan-600" />
              My Registered Tickets
            </div>
            {activeRegistrationsCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-cyan-100 text-cyan-800 border border-cyan-200">
                {activeRegistrationsCount}
              </span>
            )}
          </Link>

          {/* Mobile Admin Link - Only visible to admins */}
          {isAdmin && (
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-slate-800 bg-slate-50 border border-slate-200"
            >
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
              Admin Portal
            </Link>
          )}

          <div className="pt-3 border-t border-slate-200 space-y-3">
            {isLoggedIn ? (
              <button
                onClick={() => { logout(); setMobileMenuOpen(false); }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-rose-50 text-rose-700 text-xs font-black border border-rose-200"
              >
                <LogOut className="w-4 h-4" />
                Sign Out ({user?.full_name})
              </button>
            ) : (
              <button
                onClick={() => { openAuthModal('login'); setMobileMenuOpen(false); }}
                className="w-full py-3.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow-md shadow-blue-600/20"
              >
                Sign In / Sign Up
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}



