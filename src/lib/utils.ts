import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { EventRegistration } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  } catch {
    return dateString;
  }
}

export function generateTicketCode(eventId: string, userId: string): string {
  const shortEvent = eventId.substring(0, 4).toUpperCase();
  const shortUser = userId.substring(0, 4).toUpperCase();
  const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `CP-${shortEvent}-${shortUser}-${randomStr}`;
}

export function exportRegistrationsToCSV(registrations: EventRegistration[], fileName = 'attendees.csv') {
  if (!registrations || registrations.length === 0) return;

  const headers = ['Registration ID', 'Event Title', 'Club Name', 'Student Name', 'Student Email', 'Student ID', 'Department', 'Ticket Code', 'Status', 'Registered Date'];
  
  const rows = registrations.map(reg => [
    reg.id,
    `"${reg.event?.title || 'Unknown Event'}"`,
    `"${reg.event?.club_name || 'N/A'}"`,
    `"${reg.user_profile?.full_name || 'Anonymous'}"`,
    `"${reg.user_profile?.email || 'N/A'}"`,
    `"${reg.user_profile?.student_id || 'N/A'}"`,
    `"${reg.user_profile?.department || 'N/A'}"`,
    reg.ticket_code,
    reg.status,
    new Date(reg.registered_at).toLocaleString()
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
