import { createClient } from '@supabase/supabase-js';
import { config } from './config';

// Create Supabase client
export const supabase = createClient(
  config.supabase.url,
  config.supabase.anonKey
);

// Auth helpers
export const auth = {
  /**
   * Sign up with email and password
   */
  async signUp(email: string, password: string, name: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    });
    
    if (error) throw error;
    return data;
  },

  /**
   * Sign in with email and password
   */
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    return data;
  },

  /**
   * Sign in with Google OAuth
   */
  async signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        scopes: 'https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar.events',
        redirectTo: `${config.app.url}/auth/callback`,
      },
    });
    
    if (error) throw error;
    return data;
  },

  /**
   * Sign out
   */
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  /**
   * Get current user
   */
  async getUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  /**
   * Get current session
   */
  async getSession() {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  },

  /**
   * Subscribe to auth changes
   */
  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  },
};

// Database types (matching your Supabase schema)
export interface User {
  id: string;
  phone_number?: string;
  name: string;
  timezone: string;
  created_at: string;
  reminder_style?: string;
  reminder_day?: number;
  reminder_time?: string;
  auto_add_to_calendar?: boolean;
}

export interface Group {
  id: string;
  name: string;
  created_by: string;
  min_attendees: number;
  check_in_day: number;
  check_in_time: string;
  created_at: string;
  hangout_frequency?: string;
  custom_frequency_days?: number;
  check_in_deadline_days?: number;
  auto_schedule?: boolean;
  invite_code?: string;
}

export interface GroupMember {
  id: string;
  group_id: string;
  user_id: string;
  role: 'admin' | 'member';
  joined_at: string;
}

export interface CheckIn {
  id: string;
  group_id: string;
  week_start: string;
  status: 'pending' | 'completed' | 'cancelled';
  created_at: string;
}

export interface AvailabilitySlot {
  id: string;
  check_in_id: string;
  user_id: string;
  slot_date: string;
  start_time: string;
  end_time: string;
  confirmed: boolean;
}

export interface Event {
  id: string;
  group_id: string;
  title: string;
  event_date: string;
  start_time: string;
  end_time: string;
  location?: string;
  status: 'scheduled' | 'confirmed' | 'cancelled';
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  body: string;
  data?: any;
  read: boolean;
  created_at: string;
}
