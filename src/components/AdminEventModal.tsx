'use client';

import React, { useState } from 'react';
import { useEvents } from '@/lib/events-context';
import { EventCategory } from '@/types';
import { X, Plus, QrCode, CheckCircle2, AlertCircle, Search, ShieldCheck } from 'lucide-react';

export function AdminEventModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { createEvent, verifyTicketCode } = useEvents();

  const [activeTab, setActiveTab] = useState<'create' | 'scan'>('create');
  
  // Create Event Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<EventCategory>('Hackathon');
  const [clubName, setClubName] = useState('DevSociety Club');
  const [date, setDate] = useState('2026-10-15');
  const [time, setTime] = useState('10:00 AM - 05:00 PM');
  const [location, setLocation] = useState('Main Campus Auditorium');
  const [capacity, setCapacity] = useState(100);
  const [shortDesc, setShortDesc] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80');
  const [tagsStr, setTagsStr] = useState('AI, Hackathon, Coding');
  const [loading, setLoading] = useState(false);

  // Ticket Scanning State
  const [ticketInput, setTicketInput] = useState('');
  const [scanResult, setScanResult] = useState<{ success: boolean; message: string; registration?: any } | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !clubName) return;

    setLoading(true);
    const tags = tagsStr.split(',').map(t => t.trim()).filter(Boolean);

    await createEvent({
      title,
      category,
      club_name: clubName,
      date,
      time,
      location,
      capacity: Number(capacity),
      short_description: shortDesc || description.substring(0, 100),
      description,
      image_url: imageUrl,
      banner_url: imageUrl,
      is_featured: true,
      tags
    });

    setLoading(false);
    onClose();
  };

  const handleVerifyTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketInput.trim()) return;
    const res = verifyTicketCode(ticketInput);
    setScanResult(res);
  };

  const sampleImages = [
    { label: 'Tech & Hackathon', url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80' },
    { label: 'Robotics & Hardware', url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=80' },
    { label: 'Music & Cultural', url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80' },
    { label: 'Gaming & LAN', url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80' },
    { label: 'Design Workshop', url: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&auto=format&fit=crop&q=80' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl glass-panel rounded-3xl border border-purple-500/40 overflow-hidden shadow-2xl my-8 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-950/80 hover:bg-slate-900 text-slate-400 hover:text-white border border-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header & Tabs */}
        <div className="p-6 bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 border-b border-slate-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-lg">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Club Organizer Portal</h3>
              <p className="text-xs text-slate-400">Manage campus events & check-in registered attendees</p>
            </div>
          </div>

          <div className="flex items-center gap-2 border-t border-slate-800/80 pt-3">
            <button
              onClick={() => setActiveTab('create')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'create'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white'
              }`}
            >
              <Plus className="w-3.5 h-3.5" /> Create New Event
            </button>
            <button
              onClick={() => setActiveTab('scan')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'scan'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white'
              }`}
            >
              <QrCode className="w-3.5 h-3.5" /> Verify Ticket Pass
            </button>
          </div>
        </div>

        {activeTab === 'create' ? (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1 sm:col-span-2">
                <label className="font-semibold text-slate-300">Event Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CodeSprint 2026: Algorithmic Challenge"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as EventCategory)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                >
                  {['Hackathon', 'Workshop', 'Cultural', 'Gaming', 'Sports', 'Business', 'Other'].map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Hosting Club Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Robotics Guild"
                  value={clubName}
                  onChange={(e) => setClubName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Date *</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Time *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 10:00 AM - 04:00 PM"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Venue / Location *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tech Complex Lab 4A"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Total Capacity (Seats) *</label>
                <input
                  type="number"
                  required
                  min={5}
                  max={1000}
                  value={capacity}
                  onChange={(e) => setCapacity(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="font-semibold text-slate-300">Cover Image Presets or Custom URL</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {sampleImages.map((img) => (
                    <button
                      key={img.label}
                      type="button"
                      onClick={() => setImageUrl(img.url)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold border transition-colors ${
                        imageUrl === img.url ? 'bg-purple-600 text-white border-purple-400' : 'bg-slate-900 text-slate-400 border-slate-800'
                      }`}
                    >
                      {img.label}
                    </button>
                  ))}
                </div>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="font-semibold text-slate-300">Tags (comma separated)</label>
                <input
                  type="text"
                  placeholder="AI, Coding, Hackathon, Free Food"
                  value={tagsStr}
                  onChange={(e) => setTagsStr(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="font-semibold text-slate-300">Full Description *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe the event, agenda, prizes, requirements..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-900 text-slate-300 hover:text-white border border-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-lg shadow-purple-600/30"
              >
                {loading ? 'Publishing...' : 'Publish Event'}
              </button>
            </div>

          </form>
        ) : (
          <div className="p-6 space-y-6">
            <form onSubmit={handleVerifyTicket} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Enter Ticket Verification Code</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="e.g. CP-E001-U101-9A2F"
                    value={ticketInput}
                    onChange={(e) => setTicketInput(e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm font-mono text-cyan-400 uppercase tracking-widest placeholder-slate-600 focus:outline-none focus:border-purple-500"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-lg shadow-purple-600/30"
                  >
                    <Search className="w-4 h-4" /> Check Code
                  </button>
                </div>
                <p className="text-[11px] text-slate-500">Sample code to test: <code className="text-purple-400">CP-E001-U101-9A2F</code></p>
              </div>
            </form>

            {scanResult && (
              <div className={`p-4 rounded-2xl border ${
                scanResult.success
                  ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                  : 'bg-rose-950/40 border-rose-500/50 text-rose-300'
              } space-y-3 animate-in fade-in duration-200`}>
                <div className="flex items-center gap-3">
                  {scanResult.success ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-rose-400 shrink-0" />
                  )}
                  <div>
                    <h4 className="font-bold text-sm text-white">{scanResult.success ? 'VALID PASS - ENTRY GRANTED' : 'VERIFICATION FAILED'}</h4>
                    <p className="text-xs">{scanResult.message}</p>
                  </div>
                </div>

                {scanResult.registration && (
                  <div className="pt-3 border-t border-slate-800/60 grid grid-cols-2 gap-2 text-xs text-slate-300">
                    <div><span className="text-slate-500">Attendee:</span> <strong>{scanResult.registration.user_profile?.full_name}</strong></div>
                    <div><span className="text-slate-500">Email:</span> {scanResult.registration.user_profile?.email}</div>
                    <div><span className="text-slate-500">Event:</span> {scanResult.registration.event?.title}</div>
                    <div><span className="text-slate-500">Status:</span> <span className="text-emerald-400 font-bold">Checked In</span></div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
