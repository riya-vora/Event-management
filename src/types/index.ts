export type UserRole = 'student' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  student_id?: string;
  department?: string;
  avatar_url?: string;
  role: UserRole;
  created_at: string;
}

export type EventCategory = 
  | 'Hackathon' 
  | 'Workshop' 
  | 'Cultural' 
  | 'Gaming' 
  | 'Sports' 
  | 'Business' 
  | 'Other';

export interface ClubEvent {
  id: string;
  title: string;
  slug?: string;
  description: string;
  short_description?: string;
  category: EventCategory;
  club_name: string;
  date: string;
  time: string;
  location: string;
  capacity: number;
  registered_count: number;
  image_url: string;
  banner_url?: string;
  is_featured?: boolean;
  tags?: string[];
  created_by?: string;
  created_at: string;
}

export type RegistrationStatus = 'confirmed' | 'waitlisted' | 'cancelled';

export interface AttendeeCheckIn {
  ticket_code: string;
  checked_in_at: string;
  checked_in_by?: string;
}

export interface EventRegistration {
  id: string;
  event_id: string;
  user_id: string;
  status: RegistrationStatus;
  ticket_code: string;
  registered_at: string;
  checked_in?: boolean;
  checked_in_at?: string;
  // Joined fields for admin view & student tickets
  event?: ClubEvent;
  user_profile?: UserProfile;
}

export interface FilterOptions {
  searchQuery: string;
  category: string;
  featuredOnly: boolean;
  sortBy: 'date' | 'popular' | 'capacity';
}



