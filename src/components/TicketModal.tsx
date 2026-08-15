'use client';

import React, { useRef } from 'react';
import { EventRegistration } from '@/types';
import { useEvents } from '@/lib/events-context';
import { formatDate } from '@/lib/utils';
import { 
  X, 
  Ticket, 
  QrCode, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  CheckCircle2, 
  Printer, 
  Download, 
  Building2
} from 'lucide-react';

export function TicketModal() {
  const { selectedTicket, setSelectedTicket } = useEvents();
  const printRef = useRef<HTMLDivElement>(null);

  if (!selectedTicket) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-xl glass-panel rounded-3xl border border-indigo-500/40 overflow-hidden shadow-2xl my-8 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setSelectedTicket(null)}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-950/80 hover:bg-slate-900 text-slate-400 hover:text-white border border-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Ribbon */}
        <div className="p-6 bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 border-b border-indigo-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg">
              <Ticket className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-300">Official Pass</span>
              <h3 className="text-lg font-bold text-white">Event Registration Pass</h3>
            </div>
          </div>
          <div className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500 text-slate-950 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Confirmed
          </div>
        </div>

        {/* Printable Ticket Pass Body */}
        <div ref={printRef} className="p-6 sm:p-8 space-y-6 bg-slate-950 text-white">
          
          {/* Event Banner & Title */}
          <div className="space-y-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-indigo-950 text-indigo-300 border border-indigo-800/60">
              {selectedTicket.event?.club_name || 'Campus Club'}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
              {selectedTicket.event?.title}
            </h2>
          </div>

          {/* QR Code Container */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950/40 border border-indigo-500/30 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-inner">
            <div className="text-center sm:text-left space-y-1">
              <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Unique Verification Code</p>
              <p className="text-xl font-mono font-extrabold text-cyan-400 tracking-wider">
                {selectedTicket.ticket_code}
              </p>
              <p className="text-[11px] text-slate-400">Scan at entrance for fast check-in entry</p>
            </div>

            {/* Visual QR Code Box */}
            <div className="w-28 h-28 p-2 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-lg">
              <QrCode className="w-full h-full text-slate-950" />
            </div>
          </div>

          {/* Attendee & Event Details Grid */}
          <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
            <div className="space-y-1">
              <p className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1">
                <User className="w-3 h-3 text-indigo-400" /> Student Name
              </p>
              <p className="font-bold text-white text-sm">{selectedTicket.user_profile?.full_name || 'Student'}</p>
              <p className="text-slate-400 text-[11px]">{selectedTicket.user_profile?.email}</p>
            </div>

            <div className="space-y-1">
              <p className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1">
                <Building2 className="w-3 h-3 text-purple-400" /> Student ID & Dept
              </p>
              <p className="font-bold text-white text-sm">{selectedTicket.user_profile?.student_id || 'N/A'}</p>
              <p className="text-slate-400 text-[11px]">{selectedTicket.user_profile?.department || 'General'}</p>
            </div>

            <div className="space-y-1 pt-2 border-t border-slate-800">
              <p className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1">
                <Calendar className="w-3 h-3 text-cyan-400" /> Date & Time
              </p>
              <p className="font-bold text-slate-200">
                {selectedTicket.event ? formatDate(selectedTicket.event.date) : 'TBD'}
              </p>
              <p className="text-slate-400">{selectedTicket.event?.time}</p>
            </div>

            <div className="space-y-1 pt-2 border-t border-slate-800">
              <p className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1">
                <MapPin className="w-3 h-3 text-emerald-400" /> Venue Location
              </p>
              <p className="font-bold text-slate-200 truncate">{selectedTicket.event?.location}</p>
            </div>
          </div>

          <div className="text-center text-[10px] text-slate-500">
            Registered on {new Date(selectedTicket.registered_at).toLocaleString()} • CampusPulse Portal
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-2 border border-slate-700 transition-colors"
          >
            <Printer className="w-4 h-4" /> Print / Save Pass
          </button>

          <button
            onClick={() => setSelectedTicket(null)}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
