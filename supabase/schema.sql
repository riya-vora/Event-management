-- ==========================================================
-- CampusPulse - College Club Event Portal Database Schema
-- Execute this SQL in your Supabase SQL Editor
-- ==========================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Profiles Table (Extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  student_id TEXT,
  department TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Events Table
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE,
  description TEXT NOT NULL,
  short_description TEXT,
  category TEXT NOT NULL CHECK (category IN ('Hackathon', 'Workshop', 'Cultural', 'Gaming', 'Sports', 'Business', 'Other')),
  club_name TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  location TEXT NOT NULL,
  capacity INTEGER NOT NULL DEFAULT 100,
  registered_count INTEGER NOT NULL DEFAULT 0,
  image_url TEXT,
  banner_url TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  tags TEXT[] DEFAULT '{}',
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Registrations Table
CREATE TABLE IF NOT EXISTS public.registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'waitlisted', 'cancelled')),
  ticket_code TEXT NOT NULL UNIQUE,
  registered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- 5. Trigger to Automatically Increment/Decrement Event Registered Count
CREATE OR REPLACE FUNCTION update_event_registered_count()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    UPDATE public.events
    SET registered_count = registered_count + 1
    WHERE id = NEW.event_id;
  ELSIF (TG_OP = 'DELETE') THEN
    UPDATE public.events
    SET registered_count = GREATEST(0, registered_count - 1)
    WHERE id = OLD.event_id;
  ELSIF (TG_OP = 'UPDATE') THEN
    IF OLD.status = 'confirmed' AND NEW.status = 'cancelled' THEN
      UPDATE public.events
      SET registered_count = GREATEST(0, registered_count - 1)
      WHERE id = NEW.event_id;
    ELSIF OLD.status = 'cancelled' AND NEW.status = 'confirmed' THEN
      UPDATE public.events
      SET registered_count = registered_count + 1
      WHERE id = NEW.event_id;
    END IF;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER on_registration_change
AFTER INSERT OR DELETE OR UPDATE ON public.registrations
FOR EACH ROW EXECUTE FUNCTION update_event_registered_count();

-- 6. Trigger for New User Signup to Auto-Create Profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, avatar_url, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'student')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 7. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

-- 8. Profiles Policies
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 9. Events Policies
CREATE POLICY "Events are viewable by everyone" ON public.events FOR SELECT USING (true);
CREATE POLICY "Admins can insert events" ON public.events FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can update events" ON public.events FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can delete events" ON public.events FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 10. Registrations Policies
CREATE POLICY "Users can view own registrations or Admins can view all" ON public.registrations FOR SELECT USING (
  auth.uid() = user_id OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Authenticated users can create registrations" ON public.registrations FOR INSERT WITH CHECK (
  auth.uid() = user_id
);
CREATE POLICY "Users can cancel own registration or Admins can update" ON public.registrations FOR UPDATE USING (
  auth.uid() = user_id OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- ==========================================================
-- SAMPLE SEED DATA
-- ==========================================================

INSERT INTO public.events (id, title, slug, description, short_description, category, club_name, date, time, location, capacity, registered_count, image_url, banner_url, is_featured, tags)
VALUES
(
  'e1010101-0000-0000-0000-000000000001',
  'HackCampus 2026: 24-Hour AI & Web3 Hackathon',
  'hackcampus-2026',
  'Join 300+ student developers, designers, and innovators for a thrilling 24-hour hackathon! Build groundbreaking solutions in Artificial Intelligence, Web3, and Climate Tech. Mentors from Google, Meta, and OpenAI will be on site. Free food, swag bags, and $5,000+ in prize pool!',
  'Build AI & Web3 projects in 24 hours with top industry mentors and $5,000+ in prizes.',
  'Hackathon',
  'DevSociety Club',
  '2026-09-12',
  '09:00 AM - 09:00 AM (Next Day)',
  'Main Auditorium & Tech Complex',
  150,
  128,
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80',
  true,
  ARRAY['AI', 'Coding', 'Hackathon', 'Prizes', 'Free Food']
),
(
  'e1010101-0000-0000-0000-000000000002',
  'RoboWars: Mini Bot Championship 2026',
  'robowars-2026',
  'Watch high-powered custom battlebots clash in our annual combat robotics arena! Categories include 1lb Antweight and 3lb Beetleweight. Witness flame-throwing, flipper, and spinner bots battle for victory.',
  'Spectacular battlebot competition with flame-throwers and spinner combat bots in action.',
  'Gaming',
  'Robotics Guild',
  '2026-09-18',
  '02:00 PM - 07:00 PM',
  'Engineering Quad Arena',
  200,
  184,
  'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80',
  true,
  ARRAY['Robotics', 'Hardware', 'Battlebots', 'Competition']
),
(
  'e1010101-0000-0000-0000-000000000003',
  'Acoustic Night & Open Mic Cultural Fest',
  'acoustic-night-2026',
  'An unforgettable evening of live acoustics, spoken word poetry, indie music bands, and coffee. Unwind under starry campus lights with warm brews and amazing musical performances by fellow students.',
  'Live acoustic music, poetry slam, and indie performances with free artisanal coffee.',
  'Cultural',
  'Music & Arts Collective',
  '2026-09-22',
  '06:30 PM - 10:00 PM',
  'Student Center Amphitheater',
  120,
  95,
  'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&auto=format&fit=crop&q=80',
  false,
  ARRAY['Music', 'Acoustic', 'Open Mic', 'Food & Coffee']
),
(
  'e1010101-0000-0000-0000-000000000004',
  'UI/UX Design Masterclass: From Figma to Code',
  'ui-ux-design-masterclass',
  'Elevate your design skills! Learn modern micro-interactions, responsive design systems, typography hierarchy, and dynamic UI prototyping in Figma. Hands-on workshop with real project teardowns.',
  'Master Figma design systems, micro-animations, and UX teardowns in this interactive workshop.',
  'Workshop',
  'Creative Designers Club',
  '2026-09-25',
  '03:00 PM - 06:00 PM',
  'Design Studio Lab 3B',
  50,
  42,
  'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1542744094-3a31b272c490?w=1200&auto=format&fit=crop&q=80',
  false,
  ARRAY['Design', 'Figma', 'UI/UX', 'Workshop']
),
(
  'e1010101-0000-0000-0000-000000000005',
  'Valorant & Rocket League E-Sports LAN Clash',
  'esports-lan-clash',
  'Compete in the ultimate campus esports tournament! 5v5 Valorant and 3v3 Rocket League brackets streamed live on Twitch with casters, gaming monitors, high-fps rigs, and cash vouchers.',
  'Campus-wide LAN tournament for Valorant and Rocket League with live streaming & cash prizes.',
  'Gaming',
  'Campus E-Sports League',
  '2026-10-02',
  '10:00 AM - 08:00 PM',
  'Student Union Gaming Hub',
  80,
  76,
  'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=1200&auto=format&fit=crop&q=80',
  true,
  ARRAY['Gaming', 'Valorant', 'Esports', 'LAN', 'Prizes']
),
(
  'e1010101-0000-0000-0000-000000000006',
  'Startup Pitch Summit: VC & Angel Investor Panel',
  'startup-pitch-summit',
  'Have a business idea or tech startup? Pitch directly to top venture capitalists and angel investors! Get feedback, co-founder networking, seed funding opportunities, and pitch training.',
  'Pitch your student startup to real investors, secure seed funding, and network with founders.',
  'Business',
  'Entrepreneurship Cell',
  '2026-10-10',
  '01:00 PM - 05:30 PM',
  'Innovation Hub Auditorium',
  100,
  60,
  'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=1200&auto=format&fit=crop&q=80',
  false,
  ARRAY['Startup', 'Pitching', 'Business', 'Networking']
);
