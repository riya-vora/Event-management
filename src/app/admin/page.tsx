'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useEvents } from '@/lib/events-context';
import { exportRegistrationsToCSV, formatDate } from '@/lib/utils';
import { AdminEventModal } from '@/components/AdminEventModal';
import { 
  ShieldCheck, 
  Users, 
  Calendar, 
  Download, 
  Plus, 
  Trash2, 
  Search, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle,
  Lock,
  ArrowRight,
  Building2,
  Ticket
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { role, switchRole, user } = useAuth();
  const { events, registrations, deleteEvent } = useEvents();

  const [activeTab, setActiveTab] = useState<'events' | 'attendees'>('events');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [attendeeSearch, setAttendeeSearch] = useState('');
  const [eventFilter, setEventFilter] = useState('All');

  const isAdmin = role === 'admin';

  // Stats
  const totalEvents = events.length;
  const totalRegistrations = registrations.length;
  const totalCapacity = events.reduce((acc, curr) => acc + curr.capacity, 0);
  const totalRegisteredSeats = events.reduce((acc, curr) => acc + curr.registered_count, 0);
  const overallFillPercentage = totalCapacity > 0 ? Math.round((totalRegisteredSeats / totalCapacity) * 100) : 0;

  // Filtered Attendees list
  const filteredRegistrations = registrations.filter(reg => {
    const matchesEvent = eventFilter === 'All' || reg.event_id === eventFilter;
    const q = attendeeSearch.toLowerCase();
    const matchesSearch = 
      !attendeeSearch ||
      reg.ticket_code.toLowerCase().includes(q) ||
      (reg.user_profile?.full_name && reg.user_profile.full_name.toLowerCase().includes(q)) ||
      (reg.user_profile?.email && reg.user_profile.email.toLowerCase().includes(q)) ||
      (reg.user_profile?.student_id && reg.user_profile.student_id.toLowerCase().includes(q)) ||
      (reg.event?.title && reg.event.title.toLowerCase().includes(q));

    return matchesEvent && matchesSearch;
  });

  const handleExportCSV = () => {
    exportRegistrationsToCSV(filteredRegistrations, `campus-pulse-attendees-${Date.now()}.csv`);
  };

  const handleDeleteEvent = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      await deleteEvent(id);
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 py-20 flex items-center justify-center px-4">
        <div className="max-w-lg w-full p-8 rounded-3xl glass-panel border border-purple-500/40 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-purple-950 flex items-center justify-center text-purple-400 border border-purple-800">
            <Lock className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">Protected Admin Access</h2>
            <p className="text-sm text-slate-300">
              The Admin Portal is restricted to authorized club managers and event coordinators.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400">
            Current session role: <strong className="text-amber-400 capitalize">{role}</strong>
          </div>

          <button
            onClick={() => switchRole('admin')}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-purple-600/30 flex items-center justify-center gap-2 transition-all transform active:scale-95"
          >
            <ShieldCheck className="w-5 h-5" />
            Switch to Admin Role (Instant Preview)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 py-12 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl glass-panel border border-purple-500/30">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" /> Admin Portal
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Club Event Management & Registration Analytics
            </h1>
            <p className="text-xs text-slate-400">
              Logged in as <strong className="text-white">{user?.full_name}</strong> (Administrator)
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportCSV}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 flex items-center gap-2 transition-colors"
            >
              <Download className="w-4 h-4 text-cyan-400" /> Export CSV
            </button>

            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white flex items-center gap-2 shadow-lg shadow-purple-600/30 transition-all transform hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4" /> Create Event
            </button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-1">
            <p className="text-xs text-slate-400 font-semibold">Total Club Events</p>
            <p className="text-3xl font-black text-white">{totalEvents}</p>
            <p className="text-[10px] text-slate-500">Active campus listings</p>
          </div>

          <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-1">
            <p className="text-xs text-slate-400 font-semibold">Total Registrations</p>
            <p className="text-3xl font-black text-cyan-400">{totalRegistrations}</p>
            <p className="text-[10px] text-slate-500">Confirmed student tickets</p>
          </div>

          <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-1">
            <p className="text-xs text-slate-400 font-semibold">Seat Fill Rate</p>
            <p className="text-3xl font-black text-indigo-400">{overallFillPercentage}%</p>
            <p className="text-[10px] text-slate-500">{totalRegisteredSeats} / {totalCapacity} seats filled</p>
          </div>

          <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-1">
            <p className="text-xs text-slate-400 font-semibold">System Backend</p>
            <p className="text-xl font-bold text-emerald-400">Supabase RLS</p>
            <p className="text-[10px] text-slate-500">PostgreSQL Schema & Auth</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-3 border-b border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab('events')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'events'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            Manage Events ({events.length})
          </button>

          <button
            onClick={() => setActiveTab('attendees')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'attendees'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            Registered Attendees ({registrations.length})
          </button>
        </div>

        {/* Tab 1: Manage Events */}
        {activeTab === 'events' && (
          <div className="rounded-3xl glass-panel border border-slate-800 overflow-hidden shadow-xl">
            <div className="p-4 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Event Directory & Capacity Status</h3>
              <span className="text-xs text-slate-400">Click actions to manage</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
                  <tr>
                    <th className="p-4">Event Title & Club</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Date & Time</th>
                    <th className="p-4">Location</th>
                    <th className="p-4">Capacity</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {events.map((ev) => (
                    <tr key={ev.id} className="hover:bg-slate-900/50 transition-colors">
                      <td className="p-4 space-y-0.5">
                        <p className="font-bold text-white text-sm">{ev.title}</p>
                        <p className="text-[11px] text-slate-400">{ev.club_name}</p>
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-800">
                          {ev.category}
                        </span>
                      </td>
                      <td className="p-4 font-mono">
                        <p>{formatDate(ev.date)}</p>
                        <p className="text-[10px] text-slate-500">{ev.time}</p>
                      </td>
                      <td className="p-4">{ev.location}</td>
                      <td className="p-4">
                        <span className="font-bold text-white">{ev.registered_count}</span> / {ev.capacity}
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleDeleteEvent(ev.id, ev.title)}
                          className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 transition-colors"
                          title="Delete Event"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Registered Attendees */}
        {activeTab === 'attendees' && (
          <div className="space-y-4">
            
            {/* Filter Search Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl glass-panel border border-slate-800">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search attendee name, email, student ID, ticket code..."
                  value={attendeeSearch}
                  onChange={(e) => setAttendeeSearch(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={eventFilter}
                  onChange={(e) => setEventFilter(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                >
                  <option value="All">All Events</option>
                  {events.map(ev => (
                    <option key={ev.id} value={ev.id}>{ev.title}</option>
                  ))}
                </select>

                <button
                  onClick={handleExportCSV}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shrink-0 flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" /> Download CSV
                </button>
              </div>
            </div>

            {/* Attendees Table */}
            <div className="rounded-3xl glass-panel border border-slate-800 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
                    <tr>
                      <th className="p-4">Student Attendee</th>
                      <th className="p-4">Student ID & Dept</th>
                      <th className="p-4">Event Title</th>
                      <th className="p-4">Ticket Verification Code</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Registered Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {filteredRegistrations.map((reg) => (
                      <tr key={reg.id} className="hover:bg-slate-900/50 transition-colors">
                        <td className="p-4 space-y-0.5">
                          <p className="font-bold text-white">{reg.user_profile?.full_name || 'Anonymous'}</p>
                          <p className="text-[11px] text-slate-400">{reg.user_profile?.email || 'N/A'}</p>
                        </td>
                        <td className="p-4">
                          <p className="font-mono font-semibold text-slate-200">{reg.user_profile?.student_id || 'N/A'}</p>
                          <p className="text-[10px] text-slate-500">{reg.user_profile?.department || 'N/A'}</p>
                        </td>
                        <td className="p-4 max-w-xs truncate font-medium text-slate-200">
                          {reg.event?.title || 'Event'}
                        </td>
                        <td className="p-4 font-mono font-bold text-cyan-400">
                          {reg.ticket_code}
                        </td>
                        <td className="p-4">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                            {reg.status}
                          </span>
                        </td>
                        <td className="p-4 text-slate-400 font-mono">
                          {new Date(reg.registered_at).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* Admin Create Event Modal */}
      <AdminEventModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
    </div>
  );
}
