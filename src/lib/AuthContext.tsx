/**
 * Authentication Context for Odon PWA
 * 
 * Provides auth state throughout the app without modifying screen visuals.
 */

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from './supabase';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  auth_provider: 'google' | 'apple' | 'email';
  avatar_url?: string;
  timezone: string;
  created_at: string;
  onboarding_completed: boolean;
  calendar_connected: boolean;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  
  // Auth methods
  signInWithGoogle: () => Promise<void>;
  signInWithMagicLink: (email: string) => Promise<{ success: boolean; message: string }>;
  signUp: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  signOut: () => Promise<void>;
  
  // Profile methods
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  completeOnboarding: () => Promise<void>;
  
  // State
  isAuthenticated: boolean;
  isNewUser: boolean;
  needsOnboarding: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user profile from database
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') { // Not found is okay for new users
        console.error('Error fetching profile:', error);
        return null;
      }

      return data;
    } catch (err) {
      console.error('Error fetching profile:', err);
      return null;
    }
  };

  // Create profile for new user
  const createProfile = async (user: User): Promise<UserProfile> => {
    const provider = user.app_metadata.provider || 'email';
    const name = user.user_metadata.name || user.user_metadata.full_name || user.email?.split('@')[0] || 'User';
    
    const newProfile = {
      id: user.id,
      name,
      email: user.email || '',
      auth_provider: provider as 'google' | 'apple' | 'email',
      avatar_url: user.user_metadata.avatar_url || user.user_metadata.picture || null,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      onboarding_completed: false,
      calendar_connected: false,
    };

    const { data, error } = await supabase
      .from('users')
      .insert(newProfile)
      .select()
      .single();

    if (error) {
      console.error('Error creating profile:', error);
      // If user already exists (race condition), fetch it
      if (error.code === '23505') {
        const existing = await fetchProfile(user.id);
        if (existing) return existing;
      }
      throw error;
    }

    return data;
  };

  // Initialize auth state
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user || null);

      if (session?.user) {
        let userProfile = await fetchProfile(session.user.id);
        
        // Create profile if doesn't exist (new user)
        if (!userProfile) {
          userProfile = await createProfile(session.user);
        }
        
        setProfile(userProfile);
      }

      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth event:', event);
      setSession(session);
      setUser(session?.user || null);

      if (session?.user) {
        let userProfile = await fetchProfile(session.user.id);
        
        if (!userProfile && (event === 'SIGNED_IN' || event === 'USER_UPDATED')) {
          userProfile = await createProfile(session.user);
        }
        
        setProfile(userProfile);
      } else {
        setProfile(null);
      }

      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Sign in with Google
  const signInWithGoogle = async () => {
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        scopes: 'https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar.events',
      },
    });

    if (error) {
      setError(error.message);
      throw error;
    }
  };

  // Sign in with magic link (passwordless email)
  const signInWithMagicLink = async (email: string) => {
    setError(null);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      return { success: false, message: error.message };
    }

    return { success: true, message: 'Check your email for a sign-in link!' };
  };

  // Sign up with email/password
  const signUp = async (email: string, password: string, name: string) => {
    setError(null);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      return { success: false, error: error.message };
    }

    return { success: true };
  };

  // Sign in with email/password
  const signIn = async (email: string, password: string) => {
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      return { success: false, error: error.message };
    }

    return { success: true };
  };

  // Reset password (sends magic link for password reset)
  const resetPassword = async (email: string) => {
    setError(null);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
    });

    if (error) {
      setError(error.message);
      return { success: false, message: error.message };
    }

    return { success: true, message: 'Check your email for a password reset link!' };
  };

  // Sign out
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      setError(error.message);
      throw error;
    }
    setUser(null);
    setProfile(null);
    setSession(null);
  };

  // Update profile
  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;

    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();

    if (error) {
      setError(error.message);
      throw error;
    }

    setProfile(data);
  };

  // Complete onboarding
  const completeOnboarding = async () => {
    await updateProfile({ onboarding_completed: true });
  };

  const value: AuthContextType = {
    user,
    profile,
    session,
    loading,
    error,
    signInWithGoogle,
    signInWithMagicLink,
    signUp,
    signIn,
    resetPassword,
    signOut,
    updateProfile,
    completeOnboarding,
    isAuthenticated: !!user,
    isNewUser: !!profile && !profile.onboarding_completed,
    needsOnboarding: !!profile && !profile.onboarding_completed,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
