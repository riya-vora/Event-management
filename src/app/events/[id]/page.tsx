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
  Building2 
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
        <h2 className="text-2xl font-bold text-white mb-2">Event Not Found</h2>
        <p className="text-sm text-slate-400 mb-6">The requested club event could not be found or has been removed.</p>
        <Link href="/" className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold">
          Back to Events Catalog
        </Link>
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
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Discover
        </button>

        <div className="rounded-3xl glass-panel border border-slate-800 overflow-hidden shadow-2xl space-y-6">
          
          <div className="relative h-72 sm:h-96 w-full bg-slate-900">
            <img
              src={event.banner_url || event.image_url}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 space-y-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-600 text-white">
                {event.category}
              </span>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
                {event.title}
              </h1>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-indigo-400" />
                <div>
                  <p className="text-[10px] text-slate-400 font-medium">Date</p>
                  <p className="text-xs font-bold text-white">{formatDate(event.date)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-cyan-400" />
                <div>
                  <p className="text-[10px] text-slate-400 font-medium">Time</p>
                  <p className="text-xs font-bold text-white">{event.time}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-purple-400" />
                <div>
                  <p className="text-[10px] text-slate-400 font-medium">Venue</p>
                  <p className="text-xs font-bold text-white truncate">{event.location}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Event Overview</h3>
              <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                {event.description}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-indigo-400" />
                  Seat Capacity
                </span>
                <span className="text-slate-300 font-bold">
                  {event.registered_count} / {event.capacity} registered ({fillPercentage}%)
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div 
                  className="h-full bg-indigo-500 rounded-full"
                  style={{ width: `${fillPercentage}%` }}
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Building2 className="w-4 h-4 text-slate-400" />
                <span>Hosted by <strong className="text-white">{event.club_name}</strong></span>
              </div>

              <button
                onClick={handleRegister}
                className="px-8 py-3 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-600/30 flex items-center gap-2"
              >
                {registered ? 'View Digital Pass' : !isLoggedIn ? 'Log In to Register' : isFull ? 'Full' : 'Register Now'}
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
