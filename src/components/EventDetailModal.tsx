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
        particleCount: 80,
        spread: 70,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-3xl glass-panel rounded-3xl border border-slate-700/80 overflow-hidden shadow-2xl my-8 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={() => setSelectedEvent(null)}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-950/80 hover:bg-slate-900 text-slate-400 hover:text-white border border-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Banner */}
        <div className="relative h-64 sm:h-72 w-full bg-slate-900">
          <img
            src={selectedEvent.banner_url || selectedEvent.image_url}
            alt={selectedEvent.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          
          <div className="absolute bottom-4 left-6 right-6 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-600 text-white shadow-md">
                {selectedEvent.category}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-900/90 text-slate-300 border border-slate-700">
                {selectedEvent.club_name}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-snug">
              {selectedEvent.title}
            </h2>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Success / Error Notification */}
          {alertMsg && (
            <div className={`p-4 rounded-xl text-sm font-semibold flex items-center gap-3 ${
              alertMsg.type === 'success' ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800' : 'bg-rose-950/80 text-rose-300 border border-rose-800'
            }`}>
              {alertMsg.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
              <span>{alertMsg.text}</span>
            </div>
          )}

          {/* Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-950 flex items-center justify-center text-indigo-400">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-medium">Date</p>
                <p className="text-xs font-bold text-white">{formatDate(selectedEvent.date)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-950 flex items-center justify-center text-cyan-400">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-medium">Time</p>
                <p className="text-xs font-bold text-white">{selectedEvent.time}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-950 flex items-center justify-center text-purple-400">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-medium">Location</p>
                <p className="text-xs font-bold text-white truncate max-w-[150px]">{selectedEvent.location}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">About This Event</h4>
            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {selectedEvent.description}
            </p>
          </div>

          {/* Tags */}
          {selectedEvent.tags && selectedEvent.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="text-xs text-slate-400 mr-2 font-medium">Tags:</span>
              {selectedEvent.tags.map((tag) => (
                <span key={tag} className="px-2.5 py-1 rounded-lg text-xs bg-slate-900 text-slate-300 border border-slate-800">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Capacity Progress */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                <Users className="w-4 h-4 text-indigo-400" />
                Capacity Status
              </span>
              <span className="text-slate-300 font-bold">
                {selectedEvent.registered_count} / {selectedEvent.capacity} seats filled ({fillPercentage}%)
              </span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 rounded-full transition-all duration-500"
                style={{ width: `${fillPercentage}%` }}
              />
            </div>
          </div>

          {/* Footer Registration Controls */}
          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Building2 className="w-4 h-4 text-slate-400" />
              <span>Organized by <strong className="text-white">{selectedEvent.club_name}</strong></span>
            </div>

            <div className="w-full sm:w-auto">
              {registered ? (
                <button
                  onClick={handleRegister}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-slate-950 flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all"
                >
                  <Ticket className="w-4 h-4" />
                  View Registered Pass / QR
                </button>
              ) : !isLoggedIn ? (
                <button
                  onClick={handleRegister}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all"
                >
                  <Lock className="w-4 h-4" />
                  Log In to Register
                </button>
              ) : isFull ? (
                <button
                  disabled
                  className="w-full sm:w-auto px-6 py-3 rounded-xl text-sm font-bold bg-slate-800 text-slate-500 cursor-not-allowed"
                >
                  Registration Closed (Full)
                </button>
              ) : (
                <button
                  disabled={loading}
                  onClick={handleRegister}
                  className="w-full sm:w-auto px-8 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all transform active:scale-95"
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
