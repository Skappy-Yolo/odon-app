/**
 * React Hooks for Odon PWA
 * 
 * These hooks provide data to screens while keeping UI components untouched.
 * Screens can optionally use these hooks, or continue using mock data.
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase, auth } from './supabase';
import { userApi, groupsApi, checkInsApi, eventsApi, notificationsApi } from './api';
import type { User, Group, Event, Notification } from './supabase';

// ---
// AUTH HOOK
// ---

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    auth.getSession().then((session) => {
      setUser(session?.user || null);
      setLoading(false);
    });

    // Listen for changes
    const { data: { subscription } } = auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const data = await auth.signIn(email, password);
    setUser(data.user);
    return data;
  }, []);

  const signInWithGoogle = useCallback(async () => {
    return auth.signInWithGoogle();
  }, []);

  const signUp = useCallback(async (email: string, password: string, name: string) => {
    const data = await auth.signUp(email, password, name);
    return data;
  }, []);

  const signOut = useCallback(async () => {
    await auth.signOut();
    setUser(null);
  }, []);

  return {
    user,
    loading,
    isAuthenticated: !!user,
    signIn,
    signInWithGoogle,
    signUp,
    signOut,
  };
}

// ---
// USER PROFILE HOOK
// ---

export function useProfile() {
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userApi.getProfile().then((data) => {
      setProfile(data);
      setLoading(false);
    });
  }, []);

  const updateProfile = useCallback(async (updates: Partial<User>) => {
    const updated = await userApi.updateProfile(updates);
    if (updated) setProfile(updated);
    return updated;
  }, []);

  return { profile, loading, updateProfile };
}

// ---
// GROUPS HOOK
// ---

export function useGroups() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGroups = useCallback(async () => {
    setLoading(true);
    const data = await groupsApi.getMyGroups();
    setGroups(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  const createGroup = useCallback(async (name: string, description?: string) => {
    // Get current user ID from supabase
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    
    const group = await groupsApi.createGroup({ name, description, created_by: user.id });
    if (group) {
      setGroups((prev: Group[]) => [...prev, group]);
    }
    return group;
  }, []);

  const joinGroup = useCallback(async (inviteCode: string) => {
    const group = await groupsApi.joinGroupByCode(inviteCode);
    if (group) {
      setGroups((prev: Group[]) => [...prev, group]);
    }
    return group;
  }, []);

  return { groups, loading, fetchGroups, createGroup, joinGroup };
}

// ---
// SINGLE GROUP HOOK
// ---

export function useGroup(groupId: string | null) {
  const [group, setGroup] = useState<(Group & { members: any[] }) | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!groupId) {
      setLoading(false);
      return;
    }

    groupsApi.getGroup(groupId).then((data) => {
      setGroup(data);
      setLoading(false);
    });
  }, [groupId]);

  const updateSettings = useCallback(async (updates: Partial<Group>) => {
    if (!groupId) return null;
    const updated = await groupsApi.updateGroup(groupId, updates);
    if (updated && group) {
      setGroup({ ...group, ...updated });
    }
    return updated;
  }, [groupId, group]);

  return { group, loading, updateSettings };
}

// ---
// EVENTS HOOK
// ---

export function useUpcomingEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    eventsApi.getMyUpcomingEvents().then((data) => {
      setEvents(data);
      setLoading(false);
    });
  }, []);

  return { events, loading };
}

// ---
// NOTIFICATIONS HOOK
// ---

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch initial
    notificationsApi.getNotifications().then((data) => {
      setNotifications(data);
      setLoading(false);
    });

    notificationsApi.getUnreadCount().then(setUnreadCount);

    // Subscribe to new notifications
    const unsubscribe = notificationsApi.subscribeToNotifications((notification) => {
      setNotifications((prev: Notification[]) => [notification, ...prev]);
      setUnreadCount((prev: number) => prev + 1);
    });

    return unsubscribe;
  }, []);

  const markAsRead = useCallback(async (id: string) => {
    await notificationsApi.markAsRead(id);
    setNotifications((prev: Notification[]) =>
      prev.map((n: Notification) => (n.id === id ? { ...n, read: true } : n))
    );
    setUnreadCount((prev: number) => Math.max(0, prev - 1));
  }, []);

  const markAllAsRead = useCallback(async () => {
    await notificationsApi.markAllAsRead();
    setNotifications((prev: Notification[]) => prev.map((n: Notification) => ({ ...n, read: true })));
    setUnreadCount(0);
  }, []);

  return { notifications, unreadCount, loading, markAsRead, markAllAsRead };
}

// ---
// CHECK-IN HOOK
// ---

export function useCheckIn(groupId: string | null) {
  const [checkIn, setCheckIn] = useState<any>(null);
  const [mySlots, setMySlots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!groupId) {
      setLoading(false);
      return;
    }

    checkInsApi.getActiveCheckIn(groupId).then(async (data) => {
      setCheckIn(data);
      if (data) {
        const slots = await checkInsApi.getMyAvailability(data.id);
        setMySlots(slots);
      }
      setLoading(false);
    });
  }, [groupId]);

  const submitAvailability = useCallback(async (slots: Array<{ date: string; start: string; end: string }>) => {
    if (!checkIn) return;
    await checkInsApi.submitAvailability(checkIn.id, slots);
    setMySlots(slots.map((s, i) => ({ id: i, ...s, confirmed: true })));
  }, [checkIn]);

  const confirmAll = useCallback(async () => {
    if (!checkIn) return;
    await checkInsApi.confirmAllSlots(checkIn.id);
    setMySlots((prev: any[]) => prev.map((s: any) => ({ ...s, confirmed: true })));
  }, [checkIn]);

  const snooze = useCallback(async (hours: number) => {
    if (!checkIn) return { success: false, canSnoozeAgain: false };
    return checkInsApi.snoozeCheckIn(checkIn.id, hours);
  }, [checkIn]);

  return { checkIn, mySlots, loading, submitAvailability, confirmAll, snooze };
}

