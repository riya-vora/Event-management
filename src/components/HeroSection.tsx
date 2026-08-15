'use client';

import React from 'react';
import { useEvents } from '@/lib/events-context';
import { Search, Calendar, Users, Award, Zap, Sparkles } from 'lucide-react';

export function HeroSection() {
  const { events, registrations, filters, setSearchQuery, setCategoryFilter } = useEvents();

  const totalEvents = events.length;
  const totalRegistrations = registrations.length + 580; // Add baseline mock count for hero vibe
  const totalCapacity = events.reduce((acc, curr) => acc + curr.capacity, 0);

  return (
    <div className="relative overflow-hidden pt-8 pb-12 md:pt-14 md:pb-16 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800/60">
      
      {/* Background Animated Glow Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none translate-y-1/2" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-indigo-500/30 shadow-inner">
            <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
            <span className="text-xs font-semibold text-indigo-300">
              Campus Club Hub & Events Portal 2026
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Discover & Join <br className="hidden sm:inline" />
            <span className="gradient-text">Unforgettable College Events</span>
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
            From overnight AI hackathons and battlebot arenas to acoustic open mics and esports LAN tournaments — explore events, secure your seat, and generate your dynamic QR digital pass.
          </p>

          {/* Search Bar */}
          <div className="pt-2 max-w-2xl mx-auto">
            <div className="relative flex items-center shadow-2xl shadow-indigo-950/50 rounded-2xl overflow-hidden glass-panel p-2 border border-indigo-500/30">
              <Search className="w-5 h-5 text-indigo-400 ml-3 shrink-0" />
              <input
                type="text"
                placeholder="Search by event title, club name, or tag (e.g., Hackathon, AI, Music)..."
                value={filters.searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-white placeholder-slate-400 px-4 py-3 text-sm focus:outline-none"
              />
              {filters.searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-3 text-xs text-slate-400 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Category Chips Quick Bar */}
          <div className="flex flex-wrap justify-center items-center gap-2 pt-2">
            <span className="text-xs font-medium text-slate-400 mr-1">Popular:</span>
            {['All', 'Hackathon', 'Workshop', 'Cultural', 'Gaming', 'Business'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  filters.category === cat
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 border border-indigo-400'
                    : 'bg-slate-900/80 text-slate-300 border border-slate-800 hover:border-indigo-500/40 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Statistics Grid */}
          <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            
            <div className="p-4 rounded-2xl glass-panel border border-slate-800/80 text-center">
              <div className="w-10 h-10 mx-auto rounded-xl bg-indigo-950/80 flex items-center justify-center text-indigo-400 mb-2 border border-indigo-800/40">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="text-2xl font-bold text-white">{totalEvents}</div>
              <div className="text-xs text-slate-400 font-medium">Upcoming Events</div>
            </div>

            <div className="p-4 rounded-2xl glass-panel border border-slate-800/80 text-center">
              <div className="w-10 h-10 mx-auto rounded-xl bg-purple-950/80 flex items-center justify-center text-purple-400 mb-2 border border-purple-800/40">
                <Users className="w-5 h-5" />
              </div>
              <div className="text-2xl font-bold text-white">{totalRegistrations}</div>
              <div className="text-xs text-slate-400 font-medium">Student Registrations</div>
            </div>

            <div className="p-4 rounded-2xl glass-panel border border-slate-800/80 text-center">
              <div className="w-10 h-10 mx-auto rounded-xl bg-cyan-950/80 flex items-center justify-center text-cyan-400 mb-2 border border-cyan-800/40">
                <Zap className="w-5 h-5" />
              </div>
              <div className="text-2xl font-bold text-white">{totalCapacity}</div>
              <div className="text-xs text-slate-400 font-medium">Total Available Seats</div>
            </div>

            <div className="p-4 rounded-2xl glass-panel border border-slate-800/80 text-center">
              <div className="w-10 h-10 mx-auto rounded-xl bg-emerald-950/80 flex items-center justify-center text-emerald-400 mb-2 border border-emerald-800/40">
                <Award className="w-5 h-5" />
              </div>
              <div className="text-2xl font-bold text-white">12+</div>
              <div className="text-xs text-slate-400 font-medium">Active Campus Clubs</div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
