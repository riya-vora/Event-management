'use client';

import React from 'react';
import { useEvents } from '@/lib/events-context';
import { Filter, Layers, ArrowUpDown } from 'lucide-react';

export function EventFilters() {
  const { filters, setCategoryFilter, setSortBy, events } = useEvents();

  const categories = ['All', 'Hackathon', 'Workshop', 'Cultural', 'Gaming', 'Business', 'Sports'];

  const getCategoryCount = (category: string) => {
    if (category === 'All') return events.length;
    return events.filter(e => e.category === category).length;
  };

  return (
    <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-4 py-4 border-b border-slate-800/80">
      
      {/* Category Pills Header */}
      <div className="flex items-center gap-2 overflow-x-auto w-full pb-2 md:pb-0 no-scrollbar">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 mr-2 shrink-0">
          <Filter className="w-3.5 h-3.5 text-indigo-400" />
          Filter:
        </div>
        {categories.map((cat) => {
          const count = getCategoryCount(cat);
          const active = filters.category === cat;
          return (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`shrink-0 flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                active
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <span>{cat}</span>
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${active ? 'bg-indigo-700 text-white' : 'bg-slate-800 text-slate-400'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Sort By Dropdown & Info summary */}
      <div className="flex items-center gap-3 shrink-0 self-end md:self-auto">
        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300">
          <ArrowUpDown className="w-3.5 h-3.5 text-indigo-400" />
          <span className="text-slate-400 hidden sm:inline">Sort:</span>
          <select
            value={filters.sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'popular' | 'capacity')}
            className="bg-transparent text-white font-medium outline-none cursor-pointer"
          >
            <option value="date" className="bg-slate-900 text-white">Upcoming Date</option>
            <option value="popular" className="bg-slate-900 text-white">Most Popular</option>
            <option value="capacity" className="bg-slate-900 text-white">Highest Capacity</option>
          </select>
        </div>

        <div className="text-xs text-slate-400 hidden lg:flex items-center gap-2">
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          Showing <strong className="text-white">{events.length}</strong> total events
        </div>
      </div>

    </div>
  );
}

