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
  description: 'Explore upcoming college club events, hackathons, seminars, competitions, and workshops. Register and generate your digital pass instant QR code.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 min-h-screen flex flex-col antialiased selection:bg-blue-600 selection:text-white">
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
            <footer className="w-full py-8 border-t border-slate-200 bg-white text-xs text-slate-500">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-slate-900 text-sm">CampusPulse</span>
                  <span className="text-slate-500 font-medium">— College Club Event Portal</span>
                </div>
                <div className="text-slate-400 text-xs font-medium text-center sm:text-right">
                  Empowering campus clubs & students with seamless event discovery & digital tickets.
                </div>
              </div>
            </footer>

          </EventsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

