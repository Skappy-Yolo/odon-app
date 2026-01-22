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
  const fetchProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        // PGRST116 = not found, which is okay for new users
        console.error('Error fetching profile:', error);
        return null;
      }

      return data;
    } catch (err) {
      console.error('Error fetching profile:', err);
      return null;
    }
  };

  // Create profile for new user (with retry logic for trigger race condition)
  const createProfile = async (authUser: User): Promise<UserProfile | null> => {
    const provider = authUser.app_metadata.provider || 'email';
    const name = authUser.user_metadata.name || authUser.user_metadata.full_name || authUser.email?.split('@')[0] || 'User';

    // First, check if profile already exists (trigger might have created it)
    const existingProfile = await fetchProfile(authUser.id);
    if (existingProfile) {
      console.log('Profile already exists (created by trigger)');
      return existingProfile;
    }

    // Wait a moment for trigger to complete, then check again
    await new Promise(resolve => setTimeout(resolve, 500));
    const profileAfterWait = await fetchProfile(authUser.id);
    if (profileAfterWait) {
      console.log('Profile found after wait (trigger created it)');
      return profileAfterWait;
    }

    // If still no profile, create it manually
    const newProfile = {
      id: authUser.id,
      name,
      email: authUser.email || '',
      auth_provider: provider as 'google' | 'apple' | 'email',
      avatar_url: authUser.user_metadata.avatar_url || authUser.user_metadata.picture || null,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      onboarding_completed: false,
      calendar_connected: false,
    };

    try {
      const { data, error } = await supabase
        .from('users')
        .insert(newProfile)
        .select()
        .single();

      if (error) {
        console.error('Error creating profile:', error);
        // If duplicate key (23505), try to fetch again
        if (error.code === '23505') {
          const existing = await fetchProfile(authUser.id);
          if (existing) return existing;
        }
        return null;
      }

      return data;
    } catch (err) {
      console.error('Error in createProfile:', err);
      return null;
    }
  };

  // Handle auth callback URL (tokens in hash fragment)
  const handleAuthCallback = async () => {
    const hash = window.location.hash;
    const isCallback = window.location.pathname === '/auth/callback' || hash.includes('access_token');
    
    if (isCallback && hash) {
      console.log('Processing auth callback...');
      
      // The Supabase client should automatically handle the hash
      // But we need to ensure getSession() is called after hash is processed
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error getting session from callback:', error);
      }
      
      if (session) {
        console.log('Session established from callback');
        // Clean up the URL (remove hash and redirect to home)
        window.history.replaceState({}, '', '/');
      }
      
      return session;
    }
    
    return null;
  };

  // Initialize auth state
  useEffect(() => {
    const initialize = async () => {
      try {
        // First, handle any auth callback in the URL
        const callbackSession = await handleAuthCallback();
        
        // Get session (either from callback or existing)
        const { data: { session } } = await supabase.auth.getSession();
        const activeSession = callbackSession || session;
        
        setSession(activeSession);
        setUser(activeSession?.user || null);

        if (activeSession?.user) {
          // Try to get or create profile
          let userProfile = await fetchProfile(activeSession.user.id);
          
          if (!userProfile) {
            userProfile = await createProfile(activeSession.user);
          }
          
          setProfile(userProfile);
        }

        setLoading(false);
      } catch (err) {
        console.error('Error initializing auth:', err);
        setLoading(false);
      }
    };

    initialize();

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

      // If this is a sign-in event and we're on the callback URL, clean it up
      if (event === 'SIGNED_IN' && window.location.pathname === '/auth/callback') {
        window.history.replaceState({}, '', '/');
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
