import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';
import { EventsProvider } from '@/lib/events-context';
import { Navbar } from '@/components/Navbar';
import { EventDetailModal } from '@/components/EventDetailModal';
import { TicketModal } from '@/components/TicketModal';
import { AuthModal } from '@/components/AuthModal';

export const metadata: Metadata = {
  title: 'CampusPulse | College Club Event Discovery & Registration Portal',
  description: 'Explore upcoming college club events, hackathons, open mics, battlebots, and sports tournaments. Register and generate your digital pass instant QR code.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 min-h-screen flex flex-col antialiased selection:bg-indigo-500 selection:text-white">
        <AuthProvider>
          <EventsProvider>
            
            <Navbar />
            
            <main className="flex-1">
              {children}
            </main>

            {/* Global Modals */}
            <EventDetailModal />
            <TicketModal />
            <AuthModal />

            {/* Footer */}
            <footer className="w-full py-8 border-t border-slate-800/80 bg-slate-950 text-xs text-slate-400">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white">CampusPulse</span>
                  <span>— College Club Event Portal</span>
                </div>
                <div className="flex items-center gap-4 text-slate-400">
                  <span>Built with Next.js & Supabase</span>
                  <span>•</span>
                  <span>College Affairs & Student Unions</span>
                </div>
              </div>
            </footer>

          </EventsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
