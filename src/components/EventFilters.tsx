'use client';

import React from 'react';
import { useEvents } from '@/lib/events-context';
import { Filter, Layers, ArrowUpDown, Code, BarChart3, Rocket, Palette, Trophy, Gamepad2 } from 'lucide-react';

export function EventFilters() {
  const { filters, setCategoryFilter, setSortBy, events } = useEvents();

  const getCategoryCount = (category: string) => {
    if (category === 'All') return events.length;
    return events.filter(e => e.category === category).length;
  };

  const categoryCards = [
    { title: 'Product & Engineering', cat: 'Hackathon', desc: 'Real-world design systems, code & hackathons.', icon: Code },
    { title: 'Data & Analytics', cat: 'Workshop', desc: 'Python, dashboards, ML, and decision-making.', icon: BarChart3 },
    { title: 'Marketing & Growth', cat: 'Business', desc: 'Launch strategy, pitch decks, and brand playbooks.', icon: Rocket },
    { title: 'Design & Arts', cat: 'Cultural', desc: 'Typography, branding, UI/UX, and creative arts.', icon: Palette },
  ];

  return (
    <div className="w-full space-y-8 py-6">
      
      {/* Flowdesk Popular Categories Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Popular categories</h2>
            <p className="text-xs text-slate-500 font-medium">Discover what's trending across campus clubs and industries.</p>
          </div>
          <button 
            onClick={() => setCategoryFilter('All')}
            className="text-xs font-black text-blue-600 hover:text-blue-700 transition-colors"
          >
            View all
          </button>
        </div>

        {/* 4-Column Category Box Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categoryCards.map((item) => {
            const IconComp = item.icon;
            const isSelected = filters.category === item.cat;
            return (
              <div
                key={item.title}
                onClick={() => setCategoryFilter(isSelected ? 'All' : item.cat)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                  isSelected
                    ? 'bg-blue-50 border-blue-300 shadow-md ring-2 ring-blue-500/20'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-lg'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-blue-100/80 flex items-center justify-center text-blue-600 shrink-0">
                  <IconComp className="w-5 h-5" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-sm font-extrabold text-slate-900 leading-snug">{item.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filter Pill Bar & Sort Control */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-slate-200">
        
        {/* Category Pills Header */}
        <div className="flex items-center gap-2 overflow-x-auto w-full pb-2 sm:pb-0 no-scrollbar">
          {['All', 'Hackathon', 'Workshop', 'Cultural', 'Gaming', 'Business', 'Sports'].map((cat) => {
            const count = getCategoryCount(cat);
            const active = filters.category === cat;
            return (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 ${
                  active
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                <span>{cat}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${active ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Sort By Dropdown */}
        <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-full px-4 py-2 text-xs text-slate-700 shadow-sm">
            <ArrowUpDown className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-slate-500 font-medium">Sort:</span>
            <select
              value={filters.sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'popular' | 'capacity')}
              className="bg-transparent text-slate-900 font-extrabold outline-none cursor-pointer text-xs"
            >
              <option value="date">Upcoming Date</option>
              <option value="popular">Most Popular</option>
              <option value="capacity">Highest Capacity</option>
            </select>
          </div>
        </div>

      </div>

    </div>
  );
}



