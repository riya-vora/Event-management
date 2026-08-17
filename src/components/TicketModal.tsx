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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-xl bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xl my-8 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setSelectedTicket(null)}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-white/90 hover:bg-white text-slate-500 hover:text-slate-900 border border-slate-200 transition-colors shadow-md"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Ribbon */}
        <div className="p-6 bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/30">
              <Ticket className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-200">Official Campus Pass</span>
              <h3 className="text-lg font-black text-white">Event Registration Pass</h3>
            </div>
          </div>
          <div className="px-3.5 py-1 rounded-full text-xs font-black bg-emerald-400 text-slate-950 flex items-center gap-1.5 shadow-md">
            <CheckCircle2 className="w-3.5 h-3.5" /> Confirmed
          </div>
        </div>

        {/* Printable Ticket Pass Body */}
        <div ref={printRef} className="p-6 sm:p-8 space-y-6 bg-white text-slate-900 relative">
          
          {/* Event Banner & Title */}
          <div className="space-y-2">
            <span className="text-[11px] font-extrabold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-wider">
              {selectedTicket.event?.club_name || 'Campus Club'}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
              {selectedTicket.event?.title}
            </h2>
          </div>

          {/* QR Code Container */}
          <div className="p-6 rounded-3xl bg-blue-50/70 border border-blue-200 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm relative overflow-hidden">
            <div className="text-center sm:text-left space-y-1.5">
              <p className="text-[10px] uppercase font-black tracking-widest text-slate-500">Unique Verification Code</p>
              <p className="text-2xl font-mono font-black text-blue-700 tracking-wider">
                {selectedTicket.ticket_code}
              </p>
              <p className="text-[11px] text-slate-500 font-medium">Show QR code at venue check-in desk</p>
            </div>

            {/* Visual QR Code Box */}
            <div className="w-28 h-28 p-2.5 rounded-2xl bg-white flex items-center justify-center shrink-0 shadow-md border border-slate-200">
              <QrCode className="w-full h-full text-slate-900" />
            </div>
          </div>

          {/* Dashed Pass Notch Divider */}
          <div className="relative flex items-center justify-center my-2">
            <div className="w-full border-t-2 border-dashed border-slate-200" />
            <div className="absolute left-[-32px] w-6 h-6 rounded-full bg-slate-100 border-r border-slate-200" />
            <div className="absolute right-[-32px] w-6 h-6 rounded-full bg-slate-100 border-l border-slate-200" />
          </div>

          {/* Attendee & Event Details Grid */}
          <div className="grid grid-cols-2 gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
            <div className="space-y-1">
              <p className="text-[10px] text-slate-500 uppercase font-black flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-blue-600" /> Student Name
              </p>
              <p className="font-extrabold text-slate-900 text-sm">{selectedTicket.user_profile?.full_name || 'Student'}</p>
              <p className="text-slate-500 text-[11px] font-medium">{selectedTicket.user_profile?.email}</p>
            </div>

            <div className="space-y-1">
              <p className="text-[10px] text-slate-500 uppercase font-black flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-indigo-600" /> Student ID & Dept
              </p>
              <p className="font-mono font-extrabold text-slate-900 text-sm">{selectedTicket.user_profile?.student_id || 'N/A'}</p>
              <p className="text-slate-500 text-[11px] font-medium">{selectedTicket.user_profile?.department || 'General'}</p>
            </div>

            <div className="space-y-1 pt-3 border-t border-slate-200">
              <p className="text-[10px] text-slate-500 uppercase font-black flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-blue-600" /> Date & Time
              </p>
              <p className="font-extrabold text-slate-800">
                {selectedTicket.event ? formatDate(selectedTicket.event.date) : 'TBD'}
              </p>
              <p className="text-slate-500 font-medium">{selectedTicket.event?.time}</p>
            </div>

            <div className="space-y-1 pt-3 border-t border-slate-200">
              <p className="text-[10px] text-slate-500 uppercase font-black flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" /> Venue Location
              </p>
              <p className="font-extrabold text-slate-800 truncate">{selectedTicket.event?.location}</p>
            </div>
          </div>

          <div className="text-center text-[10px] text-slate-400 font-mono">
            Registered on {new Date(selectedTicket.registered_at).toLocaleString()} • CampusPulse Portal
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-full text-xs font-bold bg-white hover:bg-slate-100 text-slate-700 flex items-center gap-2 border border-slate-200 transition-colors shadow-sm"
          >
            <Printer className="w-4 h-4 text-blue-600" /> Print / Save Pass
          </button>

          <button
            onClick={() => setSelectedTicket(null)}
            className="px-6 py-2.5 rounded-full text-xs font-black bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-md shadow-blue-600/20"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}


