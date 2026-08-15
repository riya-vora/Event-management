'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { X, Database, Check, Copy, Terminal, ExternalLink, ShieldCheck } from 'lucide-react';

export function SupabaseConfigModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { isSupabaseConnected } = useAuth();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const sqlCode = `-- Execute in Supabase SQL Editor:
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  student_id TEXT,
  department TEXT,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  club_name TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  location TEXT NOT NULL,
  capacity INTEGER NOT NULL DEFAULT 100,
  registered_count INTEGER NOT NULL DEFAULT 0,
  image_url TEXT,
  is_featured BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS public.registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'confirmed',
  ticket_code TEXT NOT NULL UNIQUE,
  registered_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);`;

  const copySQL = () => {
    navigator.clipboard.writeText(sqlCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl glass-panel rounded-3xl border border-slate-700/80 overflow-hidden shadow-2xl my-8 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-950/80 hover:bg-slate-900 text-slate-400 hover:text-white border border-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 border-b border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-lg">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Supabase Integration & Database Info</h3>
            <p className="text-xs text-slate-400">
              {isSupabaseConnected 
                ? 'Connected to live Supabase backend' 
                : 'Running in Interactive Demo Mode (Supabase SQL Schema available below)'}
            </p>
          </div>
        </div>

        <div className="p-6 space-y-5 text-xs text-slate-300">
          
          <div className={`p-4 rounded-xl border flex items-center justify-between ${
            isSupabaseConnected 
              ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300' 
              : 'bg-amber-950/40 border-amber-800 text-amber-300'
          }`}>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 shrink-0" />
              <span>
                <strong>Status:</strong> {isSupabaseConnected ? 'Live Supabase API Active' : 'Zero-Config Interactive Demo Mode Active'}
              </span>
            </div>
            <span className="text-[10px] px-2.5 py-1 rounded-md bg-slate-950/80 text-white font-mono border border-slate-800">
              NEXT_PUBLIC_SUPABASE_URL
            </span>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-white flex items-center gap-2">
              <Terminal className="w-4 h-4 text-indigo-400" />
              1. Add Environment Variables to <code className="text-indigo-300">.env.local</code> (Optional for Live Supabase)
            </h4>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 font-mono text-[11px] text-slate-300">
              NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co<br />
              NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-white">2. Supabase SQL Schema Script (`supabase/schema.sql`)</h4>
              <button
                onClick={copySQL}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied!' : 'Copy SQL Schema'}
              </button>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[10px] text-slate-400 max-h-44 overflow-y-auto whitespace-pre-wrap">
              {sqlCode}
            </div>
          </div>

        </div>

        <div className="p-4 bg-slate-900 border-t border-slate-800 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
