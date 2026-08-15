'use client';

import React from 'react';
import { useAuth } from '@/lib/auth-context';
import { useEvents } from '@/lib/events-context';
import { formatDate } from '@/lib/utils';
import { 
  Ticket, 
  Calendar, 
  Clock, 
  MapPin, 
  QrCode, 
  Trash2, 
  Sparkles, 
  CheckCircle2,
  Lock,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

export default function MyTicketsPage() {
  const { user, isLoggedIn, openAuthModal } = useAuth();
  const { registrations, setSelectedTicket, cancelRegistration } = useEvents();

  const myRegistrations = user 
    ? registrations.filter(r => r.user_id === user.id && r.status === 'confirmed')
    : [];

  const handleCancel = async (e: React.MouseEvent, regId: string) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to cancel this event registration?')) {
      await cancelRegistration(regId);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-950 py-20 flex items-center justify-center px-4">
        <div className="max-w-md w-full p-8 rounded-3xl glass-panel border border-slate-800 text-center space-y-6">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-950 flex items-center justify-center text-indigo-400">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-white">Authentication Required</h2>
          <p className="text-sm text-slate-400">
            Please log in to view your registered event tickets and digital entry passes.
          </p>
          <button
            onClick={() => openAuthModal('login')}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-sm shadow-lg shadow-indigo-600/30"
          >
            Sign In Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 py-12 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl glass-panel border border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
              <Ticket className="w-4 h-4" /> Student Passbook
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              My Registered Event Passes
            </h1>
            <p className="text-xs text-slate-400">
              Logged in as <strong className="text-white">{user?.full_name}</strong> ({user?.student_id || user?.email})
            </p>
          </div>

          <div className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 font-semibold shrink-0">
            Total Confirmed Passes: <span className="text-cyan-400 font-bold text-sm ml-1">{myRegistrations.length}</span>
          </div>
        </div>

        {/* Tickets Grid */}
        {myRegistrations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {myRegistrations.map((reg) => {
              const ev = reg.event;
              return (
                <div
                  key={reg.id}
                  onClick={() => setSelectedTicket(reg)}
                  className="group relative rounded-2xl glass-panel border border-indigo-500/30 hover:border-indigo-500/70 p-6 flex flex-col justify-between space-y-4 transition-all hover:shadow-xl hover:shadow-indigo-950/40 cursor-pointer overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/10 rounded-full blur-2xl pointer-events-none" />

                  {/* Header info */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800/60">
                        {ev?.club_name || 'Campus Club'}
                      </span>
                      <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-2">
                        {ev?.title}
                      </h3>
                    </div>
                    <div className="p-2 rounded-xl bg-white/10 backdrop-blur-md shrink-0">
                      <QrCode className="w-6 h-6 text-cyan-300" />
                    </div>
                  </div>

                  {/* Ticket details */}
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{ev ? formatDate(ev.date) : 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-cyan-400" />
                      <span className="truncate">{ev?.time}</span>
                    </div>
                    <div className="flex items-center gap-2 col-span-2">
                      <MapPin className="w-3.5 h-3.5 text-purple-400" />
                      <span className="truncate">{ev?.location}</span>
                    </div>
                  </div>

                  {/* Code & Cancel Action */}
                  <div className="pt-2 flex items-center justify-between border-t border-slate-800/80">
                    <div>
                      <span className="text-[10px] text-slate-400 font-mono block">TICKET CODE</span>
                      <span className="text-xs font-mono font-bold text-cyan-400">{reg.ticket_code}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => handleCancel(e, reg.id)}
                        className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg border border-transparent hover:border-rose-900/50 transition-colors"
                        title="Cancel Registration"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <button className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1.5 shadow-md">
                        <Ticket className="w-3.5 h-3.5" /> View Pass
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center rounded-3xl glass-panel border border-slate-800 space-y-4 max-w-md mx-auto my-12">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-900 flex items-center justify-center text-slate-400">
              <Ticket className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-white">No Registered Passes Yet</h3>
            <p className="text-xs text-slate-400">
              You haven't registered for any upcoming club events yet. Browse our event catalog to reserve your seats!
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-lg"
            >
              Explore Club Events <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
