import { ClubEvent, EventRegistration, UserProfile } from '@/types';
import { generateTicketCode } from '../utils';

export const INITIAL_DEMO_EVENTS: ClubEvent[] = [
  {
    id: 'e1010101-0000-0000-0000-000000000001',
    title: 'HackCampus 2026: 24-Hour AI & Web3 Hackathon',
    slug: 'hackcampus-2026',
    description: 'Join 300+ student developers, designers, and innovators for a thrilling 24-hour hackathon! Build groundbreaking solutions in Artificial Intelligence, Web3, and Climate Tech. Mentors from Google, Meta, and OpenAI will be on site. Free food, swag bags, and $5,000+ in prize pool!',
    short_description: 'Build AI & Web3 projects in 24 hours with top industry mentors and $5,000+ in prizes.',
    category: 'Hackathon',
    club_name: 'DevSociety Club',
    date: '2026-09-12',
    time: '09:00 AM - 09:00 AM (Next Day)',
    location: 'Main Auditorium & Tech Complex',
    capacity: 150,
    registered_count: 128,
    image_url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80',
    banner_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80',
    is_featured: true,
    tags: ['AI', 'Coding', 'Hackathon', 'Prizes', 'Free Food'],
    created_at: new Date().toISOString()
  },
  {
    id: 'e1010101-0000-0000-0000-000000000002',
    title: 'RoboWars: Mini Bot Championship 2026',
    slug: 'robowars-2026',
    description: 'Watch high-powered custom battlebots clash in our annual combat robotics arena! Categories include 1lb Antweight and 3lb Beetleweight. Witness flame-throwing, flipper, and spinner bots battle for victory.',
    short_description: 'Spectacular battlebot competition with flame-throwers and spinner combat bots in action.',
    category: 'Gaming',
    club_name: 'Robotics Guild',
    date: '2026-09-18',
    time: '02:00 PM - 07:00 PM',
    location: 'Engineering Quad Arena',
    capacity: 200,
    registered_count: 184,
    image_url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=80',
    banner_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80',
    is_featured: true,
    tags: ['Robotics', 'Hardware', 'Battlebots', 'Competition'],
    created_at: new Date().toISOString()
  },
  {
    id: 'e1010101-0000-0000-0000-000000000003',
    title: 'Acoustic Night & Open Mic Cultural Fest',
    slug: 'acoustic-night-2026',
    description: 'An unforgettable evening of live acoustics, spoken word poetry, indie music bands, and coffee. Unwind under starry campus lights with warm brews and amazing musical performances by fellow students.',
    short_description: 'Live acoustic music, poetry slam, and indie performances with free artisanal coffee.',
    category: 'Cultural',
    club_name: 'Music & Arts Collective',
    date: '2026-09-22',
    time: '06:30 PM - 10:00 PM',
    location: 'Student Center Amphitheater',
    capacity: 120,
    registered_count: 95,
    image_url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
    banner_url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&auto=format&fit=crop&q=80',
    is_featured: false,
    tags: ['Music', 'Acoustic', 'Open Mic', 'Food & Coffee'],
    created_at: new Date().toISOString()
  },
  {
    id: 'e1010101-0000-0000-0000-000000000004',
    title: 'UI/UX Design Masterclass: From Figma to Code',
    slug: 'ui-ux-design-masterclass',
    description: 'Elevate your design skills! Learn modern micro-interactions, responsive design systems, typography hierarchy, and dynamic UI prototyping in Figma. Hands-on workshop with real project teardowns.',
    short_description: 'Master Figma design systems, micro-animations, and UX teardowns in this interactive workshop.',
    category: 'Workshop',
    club_name: 'Creative Designers Club',
    date: '2026-09-25',
    time: '03:00 PM - 06:00 PM',
    location: 'Design Studio Lab 3B',
    capacity: 50,
    registered_count: 42,
    image_url: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&auto=format&fit=crop&q=80',
    banner_url: 'https://images.unsplash.com/photo-1542744094-3a31b272c490?w=1200&auto=format&fit=crop&q=80',
    is_featured: false,
    tags: ['Design', 'Figma', 'UI/UX', 'Workshop'],
    created_at: new Date().toISOString()
  },
  {
    id: 'e1010101-0000-0000-0000-000000000005',
    title: 'Valorant & Rocket League E-Sports LAN Clash',
    slug: 'esports-lan-clash',
    description: 'Compete in the ultimate campus esports tournament! 5v5 Valorant and 3v3 Rocket League brackets streamed live on Twitch with casters, gaming monitors, high-fps rigs, and cash vouchers.',
    short_description: 'Campus-wide LAN tournament for Valorant and Rocket League with live streaming & cash prizes.',
    category: 'Gaming',
    club_name: 'Campus E-Sports League',
    date: '2026-10-02',
    time: '10:00 AM - 08:00 PM',
    location: 'Student Union Gaming Hub',
    capacity: 80,
    registered_count: 76,
    image_url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80',
    banner_url: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=1200&auto=format&fit=crop&q=80',
    is_featured: true,
    tags: ['Gaming', 'Valorant', 'Esports', 'LAN', 'Prizes'],
    created_at: new Date().toISOString()
  },
  {
    id: 'e1010101-0000-0000-0000-000000000006',
    title: 'Startup Pitch Summit: VC & Angel Investor Panel',
    slug: 'startup-pitch-summit',
    description: 'Have a business idea or tech startup? Pitch directly to top venture capitalists and angel investors! Get feedback, co-founder networking, seed funding opportunities, and pitch training.',
    short_description: 'Pitch your student startup to real investors, secure seed funding, and network with founders.',
    category: 'Business',
    club_name: 'Entrepreneurship Cell',
    date: '2026-10-10',
    time: '01:00 PM - 05:30 PM',
    location: 'Innovation Hub Auditorium',
    capacity: 100,
    registered_count: 60,
    image_url: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&auto=format&fit=crop&q=80',
    banner_url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=1200&auto=format&fit=crop&q=80',
    is_featured: false,
    tags: ['Startup', 'Pitching', 'Business', 'Networking'],
    created_at: new Date().toISOString()
  }
];

export const DEMO_STUDENT_PROFILE: UserProfile = {
  id: 'u0000000-0000-0000-0000-000000000001',
  email: 'alex.morgan@campus.edu',
  full_name: 'Alex Morgan',
  student_id: 'CS2026-8942',
  department: 'Computer Science & Engineering',
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  role: 'student',
  created_at: new Date().toISOString()
};

export const DEMO_ADMIN_PROFILE: UserProfile = {
  id: 'u0000000-0000-0000-0000-000000000002',
  email: 'admin.events@campus.edu',
  full_name: 'Dr. Sarah Connor (Club Lead)',
  student_id: 'STAFF-1002',
  department: 'Student Affairs & Clubs',
  avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  role: 'admin',
  created_at: new Date().toISOString()
};

export const INITIAL_DEMO_REGISTRATIONS: EventRegistration[] = [
  {
    id: 'r0000000-0000-0000-0000-000000000001',
    event_id: 'e1010101-0000-0000-0000-000000000001',
    user_id: 'u0000000-0000-0000-0000-000000000001',
    status: 'confirmed',
    ticket_code: generateTicketCode('e1010101-0000-0000-0000-000000000001', 'u0000000-0000-0000-0000-000000000001'),
    registered_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    event: INITIAL_DEMO_EVENTS[0],
    user_profile: DEMO_STUDENT_PROFILE
  },
  {
    id: 'r0000000-0000-0000-0000-000000000002',
    event_id: 'e1010101-0000-0000-0000-000000000002',
    user_id: 'u0000000-0000-0000-0000-000000000001',
    status: 'confirmed',
    ticket_code: generateTicketCode('e1010101-0000-0000-0000-000000000002', 'u0000000-0000-0000-0000-000000000001'),
    registered_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    event: INITIAL_DEMO_EVENTS[1],
    user_profile: DEMO_STUDENT_PROFILE
  }
];
