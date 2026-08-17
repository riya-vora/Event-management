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
  ArrowRight,
  Star
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
      className="group relative bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer overflow-hidden"
    >
      
      {/* Image Container & Badges */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100 p-3">
        <div className="w-full h-full rounded-xl overflow-hidden relative">
          <img 
            src={event.image_url || 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80'} 
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />

          {/* Top Category Badge */}
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
            <span className="px-3 py-1 rounded-full text-[11px] font-black bg-white/90 backdrop-blur-md text-blue-600 border border-slate-200 shadow-sm">
              {event.category}
            </span>
            {event.is_featured && (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-400 text-slate-900 shadow-sm flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Featured
              </span>
            )}
          </div>

          {registered && (
            <div className="absolute top-2.5 right-2.5">
              <span className="px-3 py-1 rounded-full text-[11px] font-black bg-emerald-500 text-white flex items-center gap-1 shadow-md">
                <CheckCircle2 className="w-3.5 h-3.5" /> Registered
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold">
            <span>{event.club_name}</span>
            <span className="flex items-center gap-1 text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <strong className="text-slate-700">4.8</strong> ({event.registered_count + 12})
            </span>
          </div>

          <h3 className="text-base font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
            {event.title}
          </h3>

          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {event.short_description || event.description}
          </p>
        </div>

        {/* Details Grid */}
        <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-medium">
              <Calendar className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              {formatDate(event.date)}
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <Clock className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
              {event.time}
            </span>
          </div>

          <div className="flex items-center gap-1.5 font-medium truncate pt-0.5">
            <MapPin className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            <span className="truncate">{event.location}</span>
          </div>
        </div>

        {/* Seat Meter */}
        <div className="space-y-1 pt-1">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-500 font-medium flex items-center gap-1">
              <Users className="w-3 h-3 text-blue-600" /> Seats Registered
            </span>
            <span className="font-bold text-slate-900">
              {event.registered_count} / {event.capacity}
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
            <div 
              className="h-full bg-blue-600 rounded-full transition-all duration-500" 
              style={{ width: `${fillPercentage}%` }}
            />
          </div>
        </div>

        {/* Flowdesk Action Row */}
        <div className="pt-2 flex items-center justify-between border-t border-slate-100">
          <div>
            <span className="text-[10px] text-slate-400 font-bold block uppercase">ENTRY PASS</span>
            <span className="text-sm font-black text-slate-900">FREE Pass</span>
          </div>

          <div>
            {registered ? (
              <button
                onClick={handleRegisterClick}
                className="py-2 px-4 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5 shadow-sm hover:bg-emerald-100 transition-all"
              >
                <Ticket className="w-3.5 h-3.5" />
                View Pass
              </button>
            ) : !isLoggedIn ? (
              <button
                onClick={handleRegisterClick}
                className="py-2 px-4 rounded-full text-xs font-extrabold bg-slate-100 hover:bg-blue-600 text-slate-700 hover:text-white border border-slate-200 flex items-center gap-1.5 transition-all shadow-sm"
              >
                <Lock className="w-3.5 h-3.5" />
                Sign In
              </button>
            ) : isFull ? (
              <button
                disabled
                className="py-2 px-4 rounded-full text-xs font-extrabold bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
              >
                Full
              </button>
            ) : (
              <button
                onClick={handleRegisterClick}
                className="py-2 px-5 rounded-full text-xs font-black bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20 flex items-center gap-1.5 transition-all transform active:scale-95"
              >
                <span>Reserve Pass</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}


