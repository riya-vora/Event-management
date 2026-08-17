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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xl my-8 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-white/90 hover:bg-white text-slate-500 hover:text-slate-900 border border-slate-200 transition-colors shadow-md"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header & Tabs */}
        <div className="p-6 bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 border-b border-slate-200">
          <div className="flex items-center gap-3.5 mb-4">
            <div className="w-11 h-11 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">Club Organizer Portal</h3>
              <p className="text-xs text-blue-200 font-medium">Manage campus events & verify ticket passes</p>
            </div>
          </div>

          <div className="flex items-center gap-2 border-t border-blue-700/50 pt-3">
            <button
              onClick={() => setActiveTab('create')}
              className={`px-4 py-2 rounded-full text-xs font-black transition-all flex items-center gap-2 ${
                activeTab === 'create'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'bg-white/10 text-blue-100 hover:bg-white/20'
              }`}
            >
              <Plus className="w-3.5 h-3.5" /> Create New Event
            </button>
            <button
              onClick={() => setActiveTab('scan')}
              className={`px-4 py-2 rounded-full text-xs font-black transition-all flex items-center gap-2 ${
                activeTab === 'scan'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'bg-white/10 text-blue-100 hover:bg-white/20'
              }`}
            >
              <QrCode className="w-3.5 h-3.5" /> Verify Ticket Pass
            </button>
          </div>
        </div>

        {activeTab === 'create' ? (
          <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-4 text-xs">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1 sm:col-span-2">
                <label className="font-bold text-slate-700">Event Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CodeSprint 2026: Algorithmic Challenge"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-full px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as EventCategory)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-full px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500 font-bold cursor-pointer"
                >
                  {['Hackathon', 'Workshop', 'Cultural', 'Gaming', 'Sports', 'Business', 'Other'].map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Hosting Club Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Robotics Guild"
                  value={clubName}
                  onChange={(e) => setClubName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-full px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Date *</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-full px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500 font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Time *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 10:00 AM - 04:00 PM"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-full px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Venue / Location *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tech Complex Lab 4A"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-full px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Total Capacity (Seats) *</label>
                <input
                  type="number"
                  required
                  min={5}
                  max={1000}
                  value={capacity}
                  onChange={(e) => setCapacity(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-full px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500 font-medium"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="font-bold text-slate-700">Cover Image Presets or Custom URL</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {sampleImages.map((img) => (
                    <button
                      key={img.label}
                      type="button"
                      onClick={() => setImageUrl(img.url)}
                      className={`px-3 py-1 rounded-full text-[10px] font-extrabold border transition-colors shadow-sm ${
                        imageUrl === img.url ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-100 text-slate-600 border-slate-200'
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
                  className="w-full bg-slate-50 border border-slate-200 rounded-full px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500 font-medium"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="font-bold text-slate-700">Tags (comma separated)</label>
                <input
                  type="text"
                  placeholder="AI, Coding, Hackathon, Free Food"
                  value={tagsStr}
                  onChange={(e) => setTagsStr(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-full px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 font-medium"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="font-bold text-slate-700">Full Description *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe the event, agenda, prizes, requirements..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500 font-medium"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4.5 py-2.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 rounded-full text-xs font-black text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-600/20 active:scale-95 transition-all"
              >
                {loading ? 'Publishing...' : 'Publish Event'}
              </button>
            </div>

          </form>
        ) : (
          <div className="p-6 space-y-6">
            <form onSubmit={handleVerifyTicket} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-700 uppercase tracking-wider">Enter Ticket Verification Code</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="e.g. CP-E001-U101-9A2F"
                    value={ticketInput}
                    onChange={(e) => setTicketInput(e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-4 py-3 text-sm font-mono text-blue-700 uppercase tracking-widest placeholder-slate-400 focus:outline-none focus:border-blue-500 font-bold"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-black flex items-center gap-2 transition-all shadow-md shadow-blue-600/20 active:scale-95"
                  >
                    <Search className="w-4 h-4" /> Check Code
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">Sample code to test: <code className="text-blue-600 font-bold font-mono">CP-E001-U101-9A2F</code></p>
              </div>
            </form>

            {scanResult && (
              <div className={`p-5 rounded-3xl border ${
                scanResult.success
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border-rose-200 text-rose-800'
              } space-y-3 animate-in fade-in duration-200 shadow-sm`}>
                <div className="flex items-center gap-3">
                  {scanResult.success ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-rose-600 shrink-0" />
                  )}
                  <div>
                    <h4 className="font-black text-sm text-slate-900">{scanResult.success ? 'VALID PASS - ENTRY GRANTED' : 'VERIFICATION FAILED'}</h4>
                    <p className="text-xs font-medium">{scanResult.message}</p>
                  </div>
                </div>

                {scanResult.registration && (
                  <div className="pt-3 border-t border-emerald-200 grid grid-cols-2 gap-2 text-xs text-slate-700">
                    <div><span className="text-slate-500 font-medium">Attendee:</span> <strong className="text-slate-900 font-bold">{scanResult.registration.user_profile?.full_name}</strong></div>
                    <div><span className="text-slate-500 font-medium">Email:</span> {scanResult.registration.user_profile?.email}</div>
                    <div><span className="text-slate-500 font-medium">Event:</span> {scanResult.registration.event?.title}</div>
                    <div><span className="text-slate-500 font-medium">Status:</span> <span className="text-emerald-600 font-black">Checked In</span></div>
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


