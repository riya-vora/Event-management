'use client';

import React from 'react';
import { HeroSection } from '@/components/HeroSection';
import { EventFilters } from '@/components/EventFilters';
import { EventCard } from '@/components/EventCard';
import { useEvents } from '@/lib/events-context';
import { Sparkles, CalendarX, Compass, FilterX, Users, BookOpen, Star, Award, QrCode } from 'lucide-react';

export default function HomePage() {
  const { events, filters, setCategoryFilter, setSearchQuery } = useEvents();

  // Filter events based on search and category
  const filteredEvents = events.filter((event) => {
    const matchesCategory = filters.category === 'All' || event.category === filters.category;
    const searchLower = filters.searchQuery.toLowerCase();
    const matchesSearch = 
      !filters.searchQuery ||
      event.title.toLowerCase().includes(searchLower) ||
      event.club_name.toLowerCase().includes(searchLower) ||
      event.description.toLowerCase().includes(searchLower) ||
      (event.tags && event.tags.some(t => t.toLowerCase().includes(searchLower)));

    return matchesCategory && matchesSearch;
  }).sort((a, b) => {
    if (filters.sortBy === 'popular') {
      return b.registered_count - a.registered_count;
    } else if (filters.sortBy === 'capacity') {
      return b.capacity - a.capacity;
    } else {
      // Default: sort by date ascending
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    }
  });

  const resetFilters = () => {
    setCategoryFilter('All');
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      
      {/* Flowdesk Hero Banner */}
      <HeroSection />

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Category Filters Bar */}
        <EventFilters />

        {/* Flowdesk Trending Now Event Section */}
        <div id="explore-events" className="space-y-6 scroll-mt-24">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Trending now</h2>
              <p className="text-xs text-slate-500 font-medium">Curated workshops and passes curated for you.</p>
            </div>
            <button 
              onClick={resetFilters}
              className="text-xs font-black text-blue-600 hover:text-blue-700 transition-colors"
            >
              Explore all
            </button>
          </div>

          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center rounded-3xl bg-white border border-slate-200 space-y-4 max-w-md mx-auto my-14 shadow-sm">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                <CalendarX className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-slate-900">No Events Match Your Filters</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                We couldn't find any events matching your selected search terms or categories. Try clearing your search query.
              </p>
              <button
                onClick={resetFilters}
                className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-black transition-all shadow-md shadow-blue-600/20 active:scale-95"
              >
                <FilterX className="w-4 h-4" /> Reset All Filters
              </button>
            </div>
          )}
        </div>

        {/* Flowdesk 4-Column Platform Stats Bar */}
        <div className="py-10 border-y border-slate-200 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900">10M+</div>
              <div className="text-xs text-slate-500 font-bold">Learners & Attendees</div>
            </div>
          </div>

          <div className="flex flex-col items-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900">500+</div>
              <div className="text-xs text-slate-500 font-bold">Campus Events</div>
            </div>
          </div>

          <div className="flex flex-col items-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <Star className="w-5 h-5 fill-blue-600" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900">4.8</div>
              <div className="text-xs text-slate-500 font-bold">Avg. rating</div>
            </div>
          </div>

          <div className="flex flex-col items-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900">180+</div>
              <div className="text-xs text-slate-500 font-bold">Certified campus clubs</div>
            </div>
          </div>
        </div>

        {/* Why CampusPulse Section */}
        <div className="space-y-8 pt-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Why CampusPulse?</h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">The ultimate event discovery and registration platform built for college students & campus clubs.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">Discover Events Easily</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Find all upcoming club hackathons, technical workshops, cultural fests, and guest lectures across your campus in one centralized portal.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">Register in Seconds</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                One-click seat reservations with instant confirmation for your favorite campus events without complicated paperwork.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                <QrCode className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">Digital Pass & QR Check-In</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Receive digital event tickets with unique QR codes for fast, hassle-free venue check-in at entrance desks.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">Track Registered Events</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Manage all your active event passes, dates, timings, and venue details in your personalized My Tickets passbook.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">Club Attendee Management</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Club managers can easily publish events, monitor seat capacity, verify tickets, and export CSV attendee rosters in real-time.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">Certifications & Growth</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Build your college portfolio by participating in certified workshops, hackathons, and student competitions.
              </p>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}



