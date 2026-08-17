'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();
  const { role, user, isLoggedIn } = useAuth();
  const { events, registrations, deleteEvent } = useEvents();

  const [activeTab, setActiveTab] = useState<'events' | 'attendees'>('events');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [attendeeSearch, setAttendeeSearch] = useState('');
  const [eventFilter, setEventFilter] = useState('All');

  const isAdmin = isLoggedIn && user?.role === 'admin';

  // Security authorization redirect for unauthorized attempts to /admin
  useEffect(() => {
    if (!isLoggedIn || user?.role !== 'admin') {
      const timer = setTimeout(() => {
        router.replace('/');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isLoggedIn, user?.role, router]);

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
      <div className="min-h-screen bg-slate-50 py-20 flex items-center justify-center px-4">
        <div className="max-w-lg w-full p-8 rounded-3xl bg-white border border-slate-200 text-center space-y-6 shadow-xl">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
            <Lock className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-900">Access Denied (403 Forbidden)</h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              The Admin Portal is restricted to authorized club managers and event coordinators. You do not have permission to access this page.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 font-medium">
            Redirecting to home page...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-blue-600 text-xs font-black uppercase tracking-widest">
              <ShieldCheck className="w-4 h-4" /> Admin Executive Portal
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Club Event Management & Registration Analytics
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Logged in as <strong className="text-slate-900 font-bold">{user?.full_name}</strong> (Administrator)
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportCSV}
              className="px-4 py-2.5 rounded-full text-xs font-black bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 flex items-center gap-2 transition-colors shadow-sm"
            >
              <Download className="w-4 h-4 text-blue-600" /> Export CSV
            </button>

            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-5 py-2.5 rounded-full text-xs font-black bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 shadow-md shadow-blue-600/20 transition-all transform hover:-translate-y-0.5 active:scale-95"
            >
              <Plus className="w-4 h-4" /> Create Event
            </button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-white border border-slate-200 space-y-1 shadow-sm">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Club Events</p>
            <p className="text-3xl font-black text-slate-900">{totalEvents}</p>
            <p className="text-[10px] text-slate-500 font-medium">Active campus listings</p>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-slate-200 space-y-1 shadow-sm">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Registrations</p>
            <p className="text-3xl font-black text-blue-600">{totalRegistrations}</p>
            <p className="text-[10px] text-slate-500 font-medium">Confirmed student tickets</p>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-slate-200 space-y-1 shadow-sm">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Seat Fill Rate</p>
            <p className="text-3xl font-black text-cyan-600">{overallFillPercentage}%</p>
            <p className="text-[10px] text-slate-500 font-medium">{totalRegisteredSeats} / {totalCapacity} seats filled</p>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-slate-200 space-y-1 shadow-sm">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Backend Storage</p>
            <p className="text-xl font-black text-emerald-600">Supabase RLS</p>
            <p className="text-[10px] text-slate-500 font-medium">PostgreSQL Schema & Auth</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
          <button
            onClick={() => setActiveTab('events')}
            className={`px-5 py-2.5 rounded-full text-xs font-black transition-all duration-200 ${
              activeTab === 'events'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            Manage Events ({events.length})
          </button>

          <button
            onClick={() => setActiveTab('attendees')}
            className={`px-5 py-2.5 rounded-full text-xs font-black transition-all duration-200 ${
              activeTab === 'attendees'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            Registered Attendees ({registrations.length})
          </button>
        </div>

        {/* Tab 1: Manage Events */}
        {activeTab === 'events' && (
          <div className="rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">Event Directory & Capacity Status</h3>
              <span className="text-[11px] text-slate-500 font-bold">Manage listings</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-100 text-slate-500 uppercase font-black tracking-wider border-b border-slate-200 text-[10px]">
                  <tr>
                    <th className="p-4">Event Title & Club</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Date & Time</th>
                    <th className="p-4">Location</th>
                    <th className="p-4">Capacity</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {events.map((ev) => (
                    <tr key={ev.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 space-y-0.5">
                        <p className="font-extrabold text-slate-900 text-sm">{ev.title}</p>
                        <p className="text-[11px] text-slate-500 font-medium">{ev.club_name}</p>
                      </td>
                      <td className="p-4">
                        <span className="px-3 py-1 rounded-full text-[10px] font-black bg-blue-50 text-blue-700 border border-blue-200 uppercase">
                          {ev.category}
                        </span>
                      </td>
                      <td className="p-4 font-mono">
                        <p className="font-bold text-slate-800">{formatDate(ev.date)}</p>
                        <p className="text-[10px] text-slate-500">{ev.time}</p>
                      </td>
                      <td className="p-4 font-medium text-slate-700">{ev.location}</td>
                      <td className="p-4">
                        <span className="font-black text-slate-900">{ev.registered_count}</span> / {ev.capacity}
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleDeleteEvent(ev.id, ev.title)}
                          className="p-2.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
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
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4.5 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search attendee name, email, student ID, ticket code..."
                  value={attendeeSearch}
                  onChange={(e) => setAttendeeSearch(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-full pl-9 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 font-medium"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={eventFilter}
                  onChange={(e) => setEventFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-full px-4 py-2 text-xs text-slate-900 focus:outline-none font-bold cursor-pointer"
                >
                  <option value="All">All Events</option>
                  {events.map(ev => (
                    <option key={ev.id} value={ev.id}>{ev.title}</option>
                  ))}
                </select>

                <button
                  onClick={handleExportCSV}
                  className="px-4 py-2 rounded-full text-xs font-black bg-blue-600 hover:bg-blue-700 text-white shrink-0 flex items-center gap-1.5 shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" /> Download CSV
                </button>
              </div>
            </div>

            {/* Attendees Table */}
            <div className="rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-100 text-slate-500 uppercase font-black tracking-wider border-b border-slate-200 text-[10px]">
                    <tr>
                      <th className="p-4">Student Attendee</th>
                      <th className="p-4">Student ID & Dept</th>
                      <th className="p-4">Event Title</th>
                      <th className="p-4">Ticket Verification Code</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Registered Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredRegistrations.map((reg) => (
                      <tr key={reg.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4 space-y-0.5">
                          <p className="font-extrabold text-slate-900">{reg.user_profile?.full_name || 'Anonymous'}</p>
                          <p className="text-[11px] text-slate-500 font-medium">{reg.user_profile?.email || 'N/A'}</p>
                        </td>
                        <td className="p-4">
                          <p className="font-mono font-bold text-slate-800">{reg.user_profile?.student_id || 'N/A'}</p>
                          <p className="text-[10px] text-slate-500 font-medium">{reg.user_profile?.department || 'N/A'}</p>
                        </td>
                        <td className="p-4 max-w-xs truncate font-extrabold text-slate-800">
                          {reg.event?.title || 'Event'}
                        </td>
                        <td className="p-4 font-mono font-black text-blue-700">
                          {reg.ticket_code}
                        </td>
                        <td className="p-4">
                          <span className="px-3 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
                            {reg.status}
                          </span>
                        </td>
                        <td className="p-4 text-slate-500 font-mono text-[11px]">
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


