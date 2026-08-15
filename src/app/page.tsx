'use client';

import React from 'react';
import { HeroSection } from '@/components/HeroSection';
import { EventFilters } from '@/components/EventFilters';
import { EventCard } from '@/components/EventCard';
import { useEvents } from '@/lib/events-context';
import { Sparkles, CalendarX, Compass } from 'lucide-react';

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

  const featuredEvents = events.filter(e => e.is_featured);

  const resetFilters = () => {
    setCategoryFilter('All');
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-slate-950 pb-20">
      
      {/* Hero Banner */}
      <HeroSection />

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-10">
        
        {/* Category Filters Bar */}
        <EventFilters />

        {/* Featured Events Highlight (Only show if no search query is active) */}
        {!filters.searchQuery && filters.category === 'All' && featuredEvents.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h2 className="text-xl font-extrabold text-white tracking-tight">Featured Club Events</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredEvents.slice(0, 3).map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        )}

        {/* All Events Discovery Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-indigo-400" />
              <h2 className="text-xl font-extrabold text-white tracking-tight">
                {filters.category === 'All' ? 'All Upcoming Campus Events' : `${filters.category} Events`}
              </h2>
            </div>
            <span className="text-xs text-slate-400">
              Showing {filteredEvents.length} events
            </span>
          </div>

          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center rounded-3xl glass-panel border border-slate-800 space-y-4 max-w-md mx-auto my-12">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-900 flex items-center justify-center text-slate-400">
                <CalendarX className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-white">No Events Found</h3>
              <p className="text-xs text-slate-400">
                We couldn't find any events matching your search filters. Try selecting a different category or clearing search terms.
              </p>
              <button
                onClick={resetFilters}
                className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-600/30"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
