'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { useEvents } from '@/lib/events-context';
import { useAuth } from '@/lib/auth-context';
import { formatDate } from '@/lib/utils';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Sparkles, 
  Building2, 
  Ticket, 
  CheckCircle2, 
  AlertCircle,
  Share2,
  Lock,
  ArrowRight
} from 'lucide-react';

export function EventDetailModal() {
  const { selectedEvent, setSelectedEvent, isRegistered, getRegistrationForEvent, registerForEvent, setSelectedTicket } = useEvents();
  const { isLoggedIn, openAuthModal } = useAuth();
  const [loading, setLoading] = useState(false);
  const [alertMsg, setAlertMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!selectedEvent) return null;

  const registered = isRegistered(selectedEvent.id);
  const myTicket = getRegistrationForEvent(selectedEvent.id);
  const isFull = selectedEvent.registered_count >= selectedEvent.capacity;
  const fillPercentage = Math.min(100, Math.round((selectedEvent.registered_count / selectedEvent.capacity) * 100));

  const handleRegister = async () => {
    if (!isLoggedIn) {
      openAuthModal('login');
      return;
    }

    if (registered && myTicket) {
      setSelectedEvent(null);
      setSelectedTicket(myTicket);
      return;
    }

    setLoading(true);
    setAlertMsg(null);
    const res = await registerForEvent(selectedEvent.id);
    setLoading(false);

    if (res.success && res.ticket) {
      // Trigger canvas confetti!
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 }
      });
      setAlertMsg({ type: 'success', text: res.message });
      setTimeout(() => {
        setSelectedEvent(null);
        if (res.ticket) setSelectedTicket(res.ticket);
      }, 1500);
    } else {
      setAlertMsg({ type: 'error', text: res.message });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-3xl bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xl my-8 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={() => setSelectedEvent(null)}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-white/90 hover:bg-white text-slate-500 hover:text-slate-900 border border-slate-200 transition-colors shadow-md"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Banner Header */}
        <div className="relative h-64 sm:h-76 w-full bg-slate-100">
          <img
            src={selectedEvent.banner_url || selectedEvent.image_url}
            alt={selectedEvent.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-transparent" />
          
          <div className="absolute bottom-5 left-6 right-6 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3.5 py-1 rounded-full text-xs font-extrabold bg-blue-600 text-white shadow-sm uppercase tracking-wider">
                {selectedEvent.category}
              </span>
              <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-white/90 backdrop-blur-md text-slate-900 border border-slate-200">
                {selectedEvent.club_name}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white leading-snug tracking-tight">
              {selectedEvent.title}
            </h2>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Success / Error Notification */}
          {alertMsg && (
            <div className={`p-4 rounded-2xl text-xs font-extrabold flex items-center gap-3 shadow-sm ${
              alertMsg.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
            }`}>
              {alertMsg.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" /> : <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />}
              <span>{alertMsg.text}</span>
            </div>
          )}

          {/* Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0 shadow-sm">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Date</p>
                <p className="text-xs font-extrabold text-slate-900">{formatDate(selectedEvent.date)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-cyan-100 border border-cyan-200 flex items-center justify-center text-cyan-700 shrink-0 shadow-sm">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Time</p>
                <p className="text-xs font-extrabold text-slate-900">{selectedEvent.time}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700 shrink-0 shadow-sm">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Venue Location</p>
                <p className="text-xs font-extrabold text-slate-900 truncate max-w-[150px]">{selectedEvent.location}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest">About This Event</h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line font-normal">
              {selectedEvent.description}
            </p>
          </div>

          {/* Tags */}
          {selectedEvent.tags && selectedEvent.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs font-bold text-slate-500 mr-1">Tags:</span>
              {selectedEvent.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 rounded-full text-xs font-extrabold bg-blue-50 text-blue-700 border border-blue-200">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Capacity Progress Bar */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-700 font-extrabold flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                Seat Capacity Status
              </span>
              <span className="text-slate-900 font-extrabold">
                {selectedEvent.registered_count} / {selectedEvent.capacity} filled ({fillPercentage}%)
              </span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-slate-200 overflow-hidden border border-slate-300">
              <div 
                className="h-full bg-blue-600 rounded-full transition-all duration-500"
                style={{ width: `${fillPercentage}%` }}
              />
            </div>
          </div>

          {/* Footer Control Bar */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <Building2 className="w-4 h-4 text-blue-600" />
              <span>Organized by <strong className="text-slate-900 font-bold">{selectedEvent.club_name}</strong></span>
            </div>

            <div className="w-full sm:w-auto">
              {registered ? (
                <button
                  onClick={handleRegister}
                  className="w-full sm:w-auto px-6 py-3 rounded-full text-xs font-black bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20 transition-all"
                >
                  <Ticket className="w-4 h-4" />
                  View Registered Pass / QR
                </button>
              ) : !isLoggedIn ? (
                <button
                  onClick={handleRegister}
                  className="w-full sm:w-auto px-6 py-3 rounded-full text-xs font-black bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 transition-all"
                >
                  <Lock className="w-4 h-4" />
                  Log In to Register
                </button>
              ) : isFull ? (
                <button
                  disabled
                  className="w-full sm:w-auto px-6 py-3 rounded-full text-xs font-extrabold bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                >
                  Registration Closed (Full)
                </button>
              ) : (
                <button
                  disabled={loading}
                  onClick={handleRegister}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full text-xs font-black bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/25 flex items-center justify-center gap-2 transition-all transform active:scale-95"
                >
                  {loading ? 'Processing...' : 'Confirm Registration'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}


