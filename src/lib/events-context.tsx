'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { ClubEvent, EventCategory, EventRegistration, FilterOptions } from '@/types';
import { createClient } from './supabase/client';
import { INITIAL_DEMO_EVENTS, INITIAL_DEMO_REGISTRATIONS } from './supabase/mockStore';
import { generateTicketCode } from './utils';
import { useAuth } from './auth-context';

interface EventsContextType {
  events: ClubEvent[];
  registrations: EventRegistration[];
  selectedEvent: ClubEvent | null;
  selectedTicket: EventRegistration | null;
  filters: FilterOptions;
  setSearchQuery: (query: string) => void;
  setCategoryFilter: (category: string) => void;
  setSortBy: (sortBy: 'date' | 'popular' | 'capacity') => void;
  setSelectedEvent: (event: ClubEvent | null) => void;
  setSelectedTicket: (ticket: EventRegistration | null) => void;
  registerForEvent: (eventId: string) => Promise<{ success: boolean; message: string; ticket?: EventRegistration }>;
  cancelRegistration: (registrationId: string) => Promise<{ success: boolean; message: string }>;
  verifyTicketCode: (ticketCode: string) => { success: boolean; message: string; registration?: EventRegistration };
  createEvent: (newEvent: Omit<ClubEvent, 'id' | 'registered_count' | 'created_at'>) => Promise<boolean>;
  deleteEvent: (eventId: string) => Promise<boolean>;
  isRegistered: (eventId: string) => boolean;
  getRegistrationForEvent: (eventId: string) => EventRegistration | undefined;
}

const EventsContext = createContext<EventsContextType | undefined>(undefined);

export function EventsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [events, setEvents] = useState<ClubEvent[]>([]);
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<ClubEvent | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<EventRegistration | null>(null);
  
  const [filters, setFilters] = useState<FilterOptions>({
    searchQuery: '',
    category: 'All',
    featuredOnly: false,
    sortBy: 'date'
  });

  // Load events and registrations
  useEffect(() => {
    const savedEvents = localStorage.getItem('campus_pulse_events');
    const savedRegs = localStorage.getItem('campus_pulse_registrations');

    if (savedEvents) {
      try {
        setEvents(JSON.parse(savedEvents));
      } catch {
        setEvents(INITIAL_DEMO_EVENTS);
      }
    } else {
      setEvents(INITIAL_DEMO_EVENTS);
      localStorage.setItem('campus_pulse_events', JSON.stringify(INITIAL_DEMO_EVENTS));
    }

    if (savedRegs) {
      try {
        setRegistrations(JSON.parse(savedRegs));
      } catch {
        setRegistrations(INITIAL_DEMO_REGISTRATIONS);
      }
    } else {
      setRegistrations(INITIAL_DEMO_REGISTRATIONS);
      localStorage.setItem('campus_pulse_registrations', JSON.stringify(INITIAL_DEMO_REGISTRATIONS));
    }

    // Attempt Supabase Sync if available
    const supabase = createClient();
    if (supabase) {
      supabase.from('events').select('*').then(({ data }) => {
        if (data && data.length > 0) {
          setEvents(data);
        }
      });
    }
  }, []);

  const setSearchQuery = (query: string) => {
    setFilters(prev => ({ ...prev, searchQuery: query }));
  };

  const setCategoryFilter = (category: string) => {
    setFilters(prev => ({ ...prev, category }));
  };

  const setSortBy = (sortBy: 'date' | 'popular' | 'capacity') => {
    setFilters(prev => ({ ...prev, sortBy }));
  };

  const verifyTicketCode = (ticketCode: string): { success: boolean; message: string; registration?: EventRegistration } => {
    const cleanCode = ticketCode.trim().toUpperCase();
    const reg = registrations.find(r => r.ticket_code.toUpperCase() === cleanCode);
    if (!reg) {
      return { success: false, message: 'Invalid ticket code. No matching registration found.' };
    }
    if (reg.checked_in) {
      return { 
        success: false, 
        message: `Ticket already checked in at ${new Date(reg.checked_in_at || '').toLocaleTimeString()}`, 
        registration: reg 
      };
    }

    const updatedRegs = registrations.map(r => 
      r.id === reg.id ? { ...r, checked_in: true, checked_in_at: new Date().toISOString() } : r
    );
    setRegistrations(updatedRegs);
    localStorage.setItem('campus_pulse_registrations', JSON.stringify(updatedRegs));

    return { 
      success: true, 
      message: `Access Granted! Ticket verified for ${reg.user_profile?.full_name || 'Attendee'}.`, 
      registration: { ...reg, checked_in: true } 
    };
  };

  const isRegistered = (eventId: string): boolean => {
    if (!user) return false;
    return registrations.some(r => r.event_id === eventId && r.user_id === user.id && r.status === 'confirmed');
  };

  const getRegistrationForEvent = (eventId: string): EventRegistration | undefined => {
    if (!user) return undefined;
    return registrations.find(r => r.event_id === eventId && r.user_id === user.id && r.status === 'confirmed');
  };

  const registerForEvent = async (eventId: string): Promise<{ success: boolean; message: string; ticket?: EventRegistration }> => {
    if (!user) {
      return { success: false, message: 'You must log in to register for events.' };
    }

    const targetEvent = events.find(e => e.id === eventId);
    if (!targetEvent) {
      return { success: false, message: 'Event not found.' };
    }

    if (targetEvent.registered_count >= targetEvent.capacity) {
      return { success: false, message: 'Sorry, this event is fully booked!' };
    }

    if (isRegistered(eventId)) {
      return { success: false, message: 'You are already registered for this event!' };
    }

    const ticketCode = generateTicketCode(eventId, user.id);
    const newReg: EventRegistration = {
      id: `r-${Date.now()}`,
      event_id: eventId,
      user_id: user.id,
      status: 'confirmed',
      ticket_code: ticketCode,
      registered_at: new Date().toISOString(),
      event: targetEvent,
      user_profile: user
    };

    // Update state locally & localstorage
    const updatedEvents = events.map(ev => 
      ev.id === eventId ? { ...ev, registered_count: ev.registered_count + 1 } : ev
    );
    const updatedRegs = [newReg, ...registrations];

    setEvents(updatedEvents);
    setRegistrations(updatedRegs);
    localStorage.setItem('campus_pulse_events', JSON.stringify(updatedEvents));
    localStorage.setItem('campus_pulse_registrations', JSON.stringify(updatedRegs));

    // Try Supabase insert
    const supabase = createClient();
    if (supabase) {
      await supabase.from('registrations').insert([{
        event_id: eventId,
        user_id: user.id,
        ticket_code: ticketCode,
        status: 'confirmed'
      }]);
    }

    return { success: true, message: 'Registration successful! View your pass in My Tickets.', ticket: newReg };
  };

  const cancelRegistration = async (registrationId: string): Promise<{ success: boolean; message: string }> => {
    const targetReg = registrations.find(r => r.id === registrationId);
    if (!targetReg) return { success: false, message: 'Registration record not found.' };

    const updatedRegs = registrations.filter(r => r.id !== registrationId);
    const updatedEvents = events.map(ev => 
      ev.id === targetReg.event_id ? { ...ev, registered_count: Math.max(0, ev.registered_count - 1) } : ev
    );

    setRegistrations(updatedRegs);
    setEvents(updatedEvents);
    localStorage.setItem('campus_pulse_events', JSON.stringify(updatedEvents));
    localStorage.setItem('campus_pulse_registrations', JSON.stringify(updatedRegs));

    return { success: true, message: 'Registration cancelled successfully.' };
  };

  const createEvent = async (newEventData: Omit<ClubEvent, 'id' | 'registered_count' | 'created_at'>): Promise<boolean> => {
    const newEvent: ClubEvent = {
      ...newEventData,
      id: `e-${Date.now()}`,
      registered_count: 0,
      created_at: new Date().toISOString()
    };

    const updatedEvents = [newEvent, ...events];
    setEvents(updatedEvents);
    localStorage.setItem('campus_pulse_events', JSON.stringify(updatedEvents));

    const supabase = createClient();
    if (supabase) {
      await supabase.from('events').insert([newEvent]);
    }

    return true;
  };

  const deleteEvent = async (eventId: string): Promise<boolean> => {
    const updatedEvents = events.filter(e => e.id !== eventId);
    const updatedRegs = registrations.filter(r => r.event_id !== eventId);
    
    setEvents(updatedEvents);
    setRegistrations(updatedRegs);
    localStorage.setItem('campus_pulse_events', JSON.stringify(updatedEvents));
    localStorage.setItem('campus_pulse_registrations', JSON.stringify(updatedRegs));

    const supabase = createClient();
    if (supabase) {
      await supabase.from('events').delete().eq('id', eventId);
    }

    return true;
  };

  return (
    <EventsContext.Provider
      value={{
        events,
        registrations,
        selectedEvent,
        selectedTicket,
        filters,
        setSearchQuery,
        setCategoryFilter,
        setSortBy,
        setSelectedEvent,
        setSelectedTicket,
        registerForEvent,
        cancelRegistration,
        verifyTicketCode,
        createEvent,
        deleteEvent,
        isRegistered,
        getRegistrationForEvent
      }}
    >
      {children}
    </EventsContext.Provider>
  );
}

export function useEvents() {
  const context = useContext(EventsContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventsProvider');
  }
  return context;
}
