'use client';

import React from 'react';
import { ClubEvent } from '@/types';
import { useEvents } from '@/lib/events-context';
import { useAuth } from '@/lib/auth-context';
import { formatDate } from '@/lib/utils';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Sparkles, 
  CheckCircle2, 
  Ticket, 
  Lock,
  ArrowRight
} from 'lucide-react';

interface EventCardProps {
  event: ClubEvent;
}

export function EventCard({ event }: EventCardProps) {
  const { isRegistered, setSelectedEvent, setSelectedTicket, getRegistrationForEvent, registerForEvent } = useEvents();
  const { isLoggedIn, openAuthModal } = useAuth();

  const registered = isRegistered(event.id);
  const myTicket = getRegistrationForEvent(event.id);
  const isFull = event.registered_count >= event.capacity;
  const fillPercentage = Math.min(100, Math.round((event.registered_count / event.capacity) * 100));

  // Determine capacity bar color
  let progressColor = 'bg-indigo-500';
  if (fillPercentage >= 90) progressColor = 'bg-rose-500';
  else if (fillPercentage >= 70) progressColor = 'bg-amber-500';

  const handleRegisterClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
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
    <div 
      onClick={() => setSelectedEvent(event)}
      className="group relative rounded-2xl glass-panel border border-slate-800/80 hover:border-indigo-500/50 overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-indigo-950/40 cursor-pointer"
    >
      
      {/* Image Container & Badges */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-900">
        <img 
          src={event.image_url || 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80'} 
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

        {/* Category Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-950/80 backdrop-blur-md text-indigo-300 border border-indigo-500/30">
            {event.category}
          </span>
          {event.is_featured && (
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/90 text-slate-950 flex items-center gap-1 shadow-md">
              <Sparkles className="w-3 h-3 fill-slate-950" /> Featured
            </span>
          )}
        </div>

        {/* Registered Ribbon */}
        {registered && (
          <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500 text-slate-950 flex items-center gap-1 shadow-lg">
            <CheckCircle2 className="w-3.5 h-3.5" /> Registered
          </div>
        )}

        {/* Club Tag */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-300 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-800">
            {event.club_name}
          </span>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-2">
            {event.title}
          </h3>
          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {event.short_description || event.description}
          </p>
        </div>

        {/* Metadata Details */}
        <div className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-800/60">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-purple-400 shrink-0" />
            <span className="truncate">{event.location}</span>
          </div>
        </div>

        {/* Seats Capacity Meter */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              Seat Capacity
            </span>
            <span className={`font-semibold ${fillPercentage >= 90 ? 'text-rose-400' : 'text-slate-200'}`}>
              {event.registered_count} / {event.capacity} registered ({fillPercentage}%)
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div 
              className={`h-full ${progressColor} transition-all duration-500 rounded-full`} 
              style={{ width: `${fillPercentage}%` }}
            />
          </div>
        </div>

        {/* Card Action Button */}
        <div className="pt-2">
          {registered ? (
            <button
              onClick={handleRegisterClick}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-emerald-950/80 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-700/60 flex items-center justify-center gap-2 transition-all"
            >
              <Ticket className="w-4 h-4" />
              View Digital Pass / QR
            </button>
          ) : !isLoggedIn ? (
            <button
              onClick={handleRegisterClick}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white border border-slate-700 hover:border-indigo-500 flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              <Lock className="w-3.5 h-3.5 text-indigo-400" />
              Log In to Register
            </button>
          ) : isFull ? (
            <button
              disabled
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-slate-900 text-slate-500 border border-slate-800 cursor-not-allowed text-center"
            >
              Fully Booked
            </button>
          ) : (
            <button
              onClick={handleRegisterClick}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all transform active:scale-95"
            >
              <span>Register Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

      </div>

    </div>
  );
}
