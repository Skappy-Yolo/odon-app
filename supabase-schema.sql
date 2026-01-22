-- ================================================
-- ODON PWA - Complete Supabase Schema (FIXED)
-- Run this in Supabase SQL Editor (Dashboard > SQL)
-- ================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ================================================
-- STEP 1: Create tables WITHOUT circular foreign keys
-- ================================================

-- USERS TABLE
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT,
  avatar_url TEXT,
  timezone TEXT DEFAULT 'UTC',
  reminder_style TEXT DEFAULT 'gentle' CHECK (reminder_style IN ('gentle', 'persistent', 'minimal')),
  reminder_day INTEGER DEFAULT 1 CHECK (reminder_day >= 0 AND reminder_day <= 6),
  reminder_time TIME DEFAULT '09:00:00',
  google_calendar_connected BOOLEAN DEFAULT FALSE,
  microsoft_calendar_connected BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- GROUPS TABLE (created_by WITHOUT foreign key initially)
CREATE TABLE IF NOT EXISTS groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  emoji TEXT DEFAULT '👥',
  created_by UUID,
  invite_code TEXT UNIQUE NOT NULL,
  check_in_frequency TEXT DEFAULT 'weekly' CHECK (check_in_frequency IN ('weekly', 'biweekly', 'monthly')),
  check_in_day INTEGER DEFAULT 1 CHECK (check_in_day >= 0 AND check_in_day <= 6),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- GROUP MEMBERS TABLE
CREATE TABLE IF NOT EXISTS group_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(group_id, user_id)
);

-- CHECK-INS TABLE
CREATE TABLE IF NOT EXISTS check_ins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'complete', 'cancelled')),
  deadline TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AVAILABILITY SLOTS TABLE
CREATE TABLE IF NOT EXISTS availability_slots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  check_in_id UUID NOT NULL REFERENCES check_ins(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  slot_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  confirmed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CHECK-IN RESPONSES TABLE
CREATE TABLE IF NOT EXISTS responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  check_in_id UUID NOT NULL REFERENCES check_ins(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  confirmed_all_slots BOOLEAN DEFAULT FALSE,
  responded_at TIMESTAMPTZ,
  UNIQUE(check_in_id, user_id)
);

-- CHECK-IN SNOOZES TABLE
CREATE TABLE IF NOT EXISTS check_in_snoozes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  check_in_id UUID NOT NULL REFERENCES check_ins(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  snooze_count INTEGER DEFAULT 0,
  snoozed_until TIMESTAMPTZ,
  UNIQUE(check_in_id, user_id)
);

-- EVENTS TABLE
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME,
  location TEXT,
  location_url TEXT,
  created_by UUID,
  ai_suggested BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- EVENT PARTICIPANTS TABLE
CREATE TABLE IF NOT EXISTS event_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'declined', 'maybe')),
  UNIQUE(event_id, user_id)
);

-- NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('check_in', 'event', 'group_invite', 'reminder', 'system')),
  title TEXT NOT NULL,
  message TEXT,
  action_url TEXT,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE check_ins ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE check_in_snoozes ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON users FOR INSERT WITH CHECK (auth.uid() = id);

-- Groups policies
CREATE POLICY "Anyone can view groups by invite code" ON groups FOR SELECT USING (true);
CREATE POLICY "Users can create groups" ON groups FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can update groups" ON groups FOR UPDATE USING (
  EXISTS (SELECT 1 FROM group_members WHERE group_members.group_id = groups.id AND group_members.user_id = auth.uid() AND group_members.role = 'admin')
);

-- Group Members policies
CREATE POLICY "Members can view group members" ON group_members FOR SELECT USING (
  EXISTS (SELECT 1 FROM group_members gm WHERE gm.group_id = group_members.group_id AND gm.user_id = auth.uid())
);
CREATE POLICY "Users can join groups" ON group_members FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can leave groups" ON group_members FOR DELETE USING (auth.uid() = user_id);

-- Check-ins policies
CREATE POLICY "Group members can view check-ins" ON check_ins FOR SELECT USING (
  EXISTS (SELECT 1 FROM group_members WHERE group_members.group_id = check_ins.group_id AND group_members.user_id = auth.uid())
);

-- Availability policies
CREATE POLICY "Users can view availability" ON availability_slots FOR SELECT USING (
  EXISTS (SELECT 1 FROM check_ins ci JOIN group_members gm ON gm.group_id = ci.group_id WHERE ci.id = availability_slots.check_in_id AND gm.user_id = auth.uid())
);
CREATE POLICY "Users can insert own availability" ON availability_slots FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own availability" ON availability_slots FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own availability" ON availability_slots FOR DELETE USING (auth.uid() = user_id);

-- Responses policies
CREATE POLICY "Users can view responses" ON responses FOR SELECT USING (
  EXISTS (SELECT 1 FROM check_ins ci JOIN group_members gm ON gm.group_id = ci.group_id WHERE ci.id = responses.check_in_id AND gm.user_id = auth.uid())
);
CREATE POLICY "Users can upsert own responses" ON responses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own responses" ON responses FOR UPDATE USING (auth.uid() = user_id);

-- Snoozes policies
CREATE POLICY "Users can manage own snoozes" ON check_in_snoozes FOR ALL USING (auth.uid() = user_id);

-- Events policies
CREATE POLICY "Group members can view events" ON events FOR SELECT USING (
  EXISTS (SELECT 1 FROM group_members WHERE group_members.group_id = events.group_id AND group_members.user_id = auth.uid())
);
CREATE POLICY "Group members can create events" ON events FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM group_members WHERE group_members.group_id = events.group_id AND group_members.user_id = auth.uid())
);

-- Event Participants policies
CREATE POLICY "Users can view event participants" ON event_participants FOR SELECT USING (
  EXISTS (SELECT 1 FROM events e JOIN group_members gm ON gm.group_id = e.group_id WHERE e.id = event_participants.event_id AND gm.user_id = auth.uid())
);
CREATE POLICY "Users can manage own participation" ON event_participants FOR ALL USING (auth.uid() = user_id);

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- ================================================
-- TRIGGER: Auto-create user profile on signup
-- ================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ================================================
-- TRIGGER: Update updated_at timestamp
-- ================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_users_updated_at ON users;
DROP TRIGGER IF EXISTS update_groups_updated_at ON groups;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_groups_updated_at BEFORE UPDATE ON groups FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ================================================
-- DONE! Your Supabase is now ready for Odon PWA
-- ================================================
