'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useEvents } from '@/lib/events-context';
import { useAuth } from '@/lib/auth-context';
import { formatDate } from '@/lib/utils';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Ticket, 
  CheckCircle2, 
  Lock, 
  Building2,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

export default function SingleEventPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  
  const { events, isRegistered, getRegistrationForEvent, registerForEvent, setSelectedTicket } = useEvents();
  const { isLoggedIn, openAuthModal } = useAuth();

  const event = events.find(e => e.id === id);

  if (!event) {
    return (
      <div className="min-h-screen bg-slate-950 py-20 flex flex-col items-center justify-center text-center px-4">
        <div className="p-8 rounded-3xl glass-panel border border-white/10 space-y-4 max-w-md shadow-2xl">
          <h2 className="text-2xl font-black text-white">Event Not Found</h2>
          <p className="text-xs text-slate-400">The requested club event could not be found or has been removed.</p>
          <Link href="/" className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-xs font-extrabold shadow-lg">
            <ArrowLeft className="w-4 h-4" /> Back to Events Catalog
          </Link>
        </div>
      </div>
    );
  }

  const registered = isRegistered(event.id);
  const myTicket = getRegistrationForEvent(event.id);
  const isFull = event.registered_count >= event.capacity;
  const fillPercentage = Math.min(100, Math.round((event.registered_count / event.capacity) * 100));

  const handleRegister = async () => {
    if (!isLoggedIn) {
      openAuthModal('login');
      return;
    }
    if (registered && myTicket) {
      setSelectedTicket(myTicket);
      return;
    }
    if (!isFull) {
      const res = await registerForEvent(event.id);
      if (res.success && res.ticket) {
        setSelectedTicket(res.ticket);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 py-12 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-xs font-extrabold text-indigo-400 hover:text-indigo-300 transition-colors uppercase tracking-wider bg-slate-900/80 px-4 py-2 rounded-xl border border-slate-800"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Discover
        </button>

        <div className="rounded-3xl glass-panel border border-white/10 overflow-hidden shadow-2xl space-y-6">
          
          <div className="relative h-72 sm:h-96 w-full bg-slate-900">
            <img
              src={event.banner_url || event.image_url}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-3.5 py-1 rounded-full text-xs font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md uppercase tracking-wider">
                  {event.category}
                </span>
                <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-slate-950/80 backdrop-blur-md text-slate-200 border border-slate-800">
                  {event.club_name}
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight">
                {event.title}
              </h1>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 rounded-2xl bg-slate-900/70 border border-white/5 shadow-inner">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-indigo-950/90 border border-indigo-800/50 flex items-center justify-center text-indigo-400 shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Date</p>
                  <p className="text-xs font-extrabold text-white">{formatDate(event.date)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-cyan-950/90 border border-cyan-800/50 flex items-center justify-center text-cyan-400 shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Time</p>
                  <p className="text-xs font-extrabold text-white">{event.time}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-purple-950/90 border border-purple-800/50 flex items-center justify-center text-purple-400 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Venue Location</p>
                  <p className="text-xs font-extrabold text-white truncate">{event.location}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Event Overview</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line font-normal">
                {event.description}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/70 border border-white/5 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-extrabold flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-400" />
                  Seat Capacity Status
                </span>
                <span className="text-slate-200 font-extrabold">
                  {event.registered_count} / {event.capacity} registered ({fillPercentage}%)
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 rounded-full"
                  style={{ width: `${fillPercentage}%` }}
                />
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                <Building2 className="w-4 h-4 text-indigo-400" />
                <span>Hosted by <strong className="text-white font-bold">{event.club_name}</strong></span>
              </div>

              <button
                onClick={handleRegister}
                className="px-8 py-3.5 rounded-2xl text-xs font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-xl shadow-indigo-600/40 flex items-center gap-2 transition-all transform active:scale-95"
              >
                {registered ? 'View Digital Pass' : !isLoggedIn ? 'Log In to Register' : isFull ? 'Full' : 'Register Now'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

