'use client';

import React from 'react';
import { useEvents } from '@/lib/events-context';
import { Search, CheckCircle2, Sparkles } from 'lucide-react';

export function HeroSection() {
  const { events, registrations, filters, setSearchQuery, setCategoryFilter } = useEvents();

  const featuredEvent = events[0] || null;

  return (
    <div className="relative bg-white pt-10 pb-16 md:pt-14 md:pb-20 border-b border-slate-200">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Flowdesk 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Heading, Subtitle, Search, Checkmarks */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
              Discover campus events. <br />
              <span className="text-blue-600">Build your experience.</span>
            </h1>

            {/* Subtitle Description */}
            <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-xl">
              Discover and register for upcoming college workshops, hackathons, seminars, competitions, and club events. Reserve seats in seconds and get instant digital QR tickets.
            </p>

            {/* Search Box */}
            <div className="pt-1 max-w-xl">
              <div className="relative flex items-center bg-slate-50 border border-slate-300 rounded-full p-2 shadow-sm focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                <Search className="w-5 h-5 text-slate-400 ml-4 shrink-0" />
                <input
                  type="text"
                  placeholder="Search for workshops, hackathons, seminars, or clubs..."
                  value={filters.searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-slate-900 placeholder-slate-400 px-3 py-2 text-sm font-medium focus:outline-none"
                />
                <button
                  onClick={() => {
                    const el = document.getElementById('explore-events');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-full shadow-md shadow-blue-600/20 transition-all shrink-0"
                >
                  Search
                </button>
              </div>
            </div>

            {/* Feature Badges */}
            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs font-semibold text-slate-700">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                <span>Verified Campus Clubs</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                <span>Instant QR Tickets</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                <span>Skill & Certification Passes</span>
              </div>
            </div>

            {/* Quick Topic Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-3">
              {[
                { label: 'Hackathons', cat: 'Hackathon' },
                { label: 'Workshops', cat: 'Workshop' },
                { label: 'Seminars', cat: 'Business' },
                { label: 'Competitions', cat: 'Gaming' },
                { label: 'Cultural Fests', cat: 'Cultural' }
              ].map((topic) => (
                <button
                  key={topic.label}
                  onClick={() => setCategoryFilter(topic.cat)}
                  className={`px-4 py-2 rounded-full text-xs font-extrabold flex items-center gap-2 transition-all duration-200 border ${
                    filters.category === topic.cat
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:text-blue-600 shadow-sm'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                  {topic.label}
                </button>
              ))}
            </div>

          </div>

          {/* Right Column: Hero Visual Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 group">
              <img
                src={featuredEvent?.image_url || 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80'}
                alt={featuredEvent?.title || 'Featured Event'}
                className="w-full h-80 sm:h-96 object-cover transform group-hover:scale-105 transition-transform duration-700"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />

              {/* Overlay Badge */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200 shadow-xl flex items-center justify-between">
                <div className="space-y-0.5 max-w-[70%]">
                  <span className="text-[10px] font-black uppercase text-blue-600 tracking-wider">
                    {featuredEvent?.club_name || 'Campus Event Highlight'}
                  </span>
                  <h4 className="text-sm font-extrabold text-slate-900 truncate">
                    {featuredEvent?.title || 'National Student Hackathon 2026'}
                  </h4>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {featuredEvent?.location || 'Main Campus Auditorium'}
                  </p>
                </div>

                <div className="px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-black border border-blue-200">
                  FREE Pass
                </div>
              </div>
            </div>

            {/* Background Accent Decorative Pill */}
            <div className="absolute -top-4 -right-4 w-28 h-28 bg-blue-100 rounded-full blur-2xl pointer-events-none" />
          </div>

        </div>

      </div>
    </div>
  );
}



