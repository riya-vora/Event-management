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
      <div className="min-h-screen bg-slate-50 py-20 flex items-center justify-center px-4">
        <div className="max-w-md w-full p-8 rounded-3xl bg-white border border-slate-200 text-center space-y-6 shadow-xl">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">Authentication Required</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Please log in to view your registered event passes, tickets, and unique QR entrance codes.
          </p>
          <button
            onClick={() => openAuthModal('login')}
            className="w-full py-3.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow-md shadow-blue-600/20 active:scale-95 transition-all"
          >
            Sign In Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-blue-600 text-xs font-black uppercase tracking-widest">
              <Ticket className="w-4 h-4" /> Student Passbook
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              My Registered Event Passes
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Logged in as <strong className="text-slate-900 font-bold">{user?.full_name}</strong> ({user?.student_id || user?.email})
            </p>
          </div>

          <div className="px-4 py-2.5 rounded-full bg-blue-50 border border-blue-200 text-xs text-slate-700 font-bold shrink-0 shadow-sm">
            Total Confirmed Passes: <span className="text-blue-600 font-black text-sm ml-1">{myRegistrations.length}</span>
          </div>
        </div>

        {/* Tickets Grid */}
        {myRegistrations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {myRegistrations.map((reg) => {
              const ev = reg.event;
              return (
                <div
                  key={reg.id}
                  onClick={() => setSelectedTicket(reg)}
                  className="group relative rounded-3xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-xl p-6 sm:p-7 flex flex-col justify-between space-y-5 cursor-pointer overflow-hidden transition-all duration-300 shadow-sm"
                >
                  {/* Header info */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 shadow-sm">
                        {ev?.club_name || 'Campus Club'}
                      </span>
                      <h3 className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                        {ev?.title}
                      </h3>
                    </div>
                    <div className="p-2.5 rounded-2xl bg-slate-50 shrink-0 border border-slate-200 shadow-sm">
                      <QrCode className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>

                  {/* Ticket details */}
                  <div className="grid grid-cols-2 gap-3 text-xs text-slate-600 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span className="font-bold">{ev ? formatDate(ev.date) : 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                      <span className="truncate font-bold">{ev?.time}</span>
                    </div>
                    <div className="flex items-center gap-2 col-span-2">
                      <MapPin className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      <span className="truncate font-medium">{ev?.location}</span>
                    </div>
                  </div>

                  {/* Code & Cancel Action */}
                  <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                    <div>
                      <span className="text-[10px] text-slate-400 font-mono font-bold block uppercase tracking-wider">TICKET CODE</span>
                      <span className="text-xs font-mono font-black text-blue-700">{reg.ticket_code}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => handleCancel(e, reg.id)}
                        className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-full border border-transparent hover:border-rose-200 transition-colors"
                        title="Cancel Registration"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <button className="px-4 py-2 rounded-full text-xs font-black bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 shadow-md shadow-blue-600/20">
                        <Ticket className="w-3.5 h-3.5" /> View Pass
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center rounded-3xl bg-white border border-slate-200 space-y-4 max-w-md mx-auto my-14 shadow-sm">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <Ticket className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-slate-900">No Registered Passes Yet</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              You haven't registered for any upcoming club events yet. Browse our event catalog to reserve your seats!
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-black transition-all shadow-md shadow-blue-600/20"
            >
              Explore Club Events <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}


