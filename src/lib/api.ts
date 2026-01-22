/**
 * Data API - Clean interface for screens to fetch/update data
 */

import { supabase, Group, User, CheckIn, Event, Notification, AvailabilitySlot } from './supabase';

// Helper to generate invite code
function generateInviteCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// ============================================
// USER API
// ============================================

export const userApi = {
  async getProfile(): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    return data;
  },

  async updateProfile(updates: Partial<User>): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateReminderSettings(settings: {
    reminder_style: string;
    reminder_day?: number;
    reminder_time?: string;
  }) {
    return this.updateProfile(settings);
  },
};

// ============================================
// GROUPS API
// ============================================

export const groupsApi = {
  async getMyGroups(): Promise<Group[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data } = await supabase
      .from('group_members')
      .select('group_id, role, groups(*)')
      .eq('user_id', user.id);

    return data?.map((m: any) => ({ ...m.groups, myRole: m.role })) || [];
  },

  async getUserGroups(userId: string): Promise<Group[]> {
    const { data } = await supabase
      .from('group_members')
      .select('group_id, role, groups(*)')
      .eq('user_id', userId);

    return data?.map((m: any) => ({ ...m.groups, myRole: m.role })) || [];
  },

  async getGroup(groupId: string): Promise<Group & { members: any[] } | null> {
    const { data: group } = await supabase
      .from('groups')
      .select('*')
      .eq('id', groupId)
      .single();

    if (!group) return null;

    const { data: members } = await supabase
      .from('group_members')
      .select('*, users(id, name, avatar_url)')
      .eq('group_id', groupId);

    return { ...group, members: members || [] };
  },

  async getGroupByInviteCode(code: string): Promise<Group | null> {
    const { data, error } = await supabase
      .from('groups')
      .select('*, group_members(count)')
      .eq('invite_code', code.toUpperCase())
      .single();

    if (error || !data) return null;
    
    return {
      ...data,
      member_count: data.group_members?.[0]?.count || 1
    };
  },

  async createGroup(groupData: { name: string; description?: string; created_by: string }): Promise<Group | null> {
    const inviteCode = generateInviteCode();
    
    const { data: group, error } = await supabase
      .from('groups')
      .insert({
        name: groupData.name,
        description: groupData.description,
        created_by: groupData.created_by,
        invite_code: inviteCode,
      })
      .select()
      .single();

    if (error) throw error;

    // Add creator as admin
    await supabase.from('group_members').insert({
      group_id: group.id,
      user_id: groupData.created_by,
      role: 'admin',
    });

    return group;
  },

  async joinGroup(groupId: string, userId: string): Promise<boolean> {
    const { error } = await supabase.from('group_members').insert({
      group_id: groupId,
      user_id: userId,
      role: 'member',
    });

    return !error;
  },

  async joinGroupByCode(inviteCode: string): Promise<Group | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: group } = await supabase
      .from('groups')
      .select('*')
      .eq('invite_code', inviteCode.toUpperCase())
      .single();

    if (!group) throw new Error('Invalid invite code');

    const { data: existing } = await supabase
      .from('group_members')
      .select('id')
      .eq('group_id', group.id)
      .eq('user_id', user.id)
      .single();

    if (existing) throw new Error('Already a member of this group');

    await supabase.from('group_members').insert({
      group_id: group.id,
      user_id: user.id,
      role: 'member',
    });

    return group;
  },

  async isGroupMember(groupId: string, userId: string): Promise<boolean> {
    const { data } = await supabase
      .from('group_members')
      .select('id')
      .eq('group_id', groupId)
      .eq('user_id', userId)
      .single();

    return !!data;
  },

  async updateGroup(groupId: string, updates: Partial<Group>): Promise<Group | null> {
    const { data, error } = await supabase
      .from('groups')
      .update(updates)
      .eq('id', groupId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async leaveGroup(groupId: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from('group_members')
      .delete()
      .eq('group_id', groupId)
      .eq('user_id', user.id);
  },

  async regenerateInviteCode(groupId: string): Promise<string> {
    const newCode = generateInviteCode();
    
    await supabase
      .from('groups')
      .update({ invite_code: newCode })
      .eq('id', groupId);

    return newCode;
  },
};

// ============================================
// CHECK-INS API
// ============================================

export const checkInsApi = {
  async getActiveCheckIn(groupId: string): Promise<CheckIn | null> {
    const { data } = await supabase
      .from('check_ins')
      .select('*')
      .eq('group_id', groupId)
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    return data;
  },

  async getMyAvailability(checkInId: string): Promise<AvailabilitySlot[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data } = await supabase
      .from('availability_slots')
      .select('*')
      .eq('check_in_id', checkInId)
      .eq('user_id', user.id)
      .order('slot_date')
      .order('start_time');

    return data || [];
  },

  async submitAvailability(
    checkInId: string,
    slots: Array<{ date: string; start: string; end: string }>
  ): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from('availability_slots')
      .delete()
      .eq('check_in_id', checkInId)
      .eq('user_id', user.id);

    const slotsToInsert = slots.map((slot) => ({
      check_in_id: checkInId,
      user_id: user.id,
      slot_date: slot.date,
      start_time: slot.start,
      end_time: slot.end,
      confirmed: true,
    }));

    await supabase.from('availability_slots').insert(slotsToInsert);
  },

  async confirmAllSlots(checkInId: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from('availability_slots')
      .update({ confirmed: true })
      .eq('check_in_id', checkInId)
      .eq('user_id', user.id);

    await supabase
      .from('responses')
      .upsert({
        check_in_id: checkInId,
        user_id: user.id,
        confirmed_all_slots: true,
        responded_at: new Date().toISOString(),
      });
  },

  async snoozeCheckIn(checkInId: string, hours: number): Promise<{ success: boolean; canSnoozeAgain: boolean }> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, canSnoozeAgain: false };

    const { data: existing } = await supabase
      .from('check_in_snoozes')
      .select('snooze_count')
      .eq('check_in_id', checkInId)
      .eq('user_id', user.id)
      .single();

    const currentCount = existing?.snooze_count || 0;

    if (currentCount >= 2) {
      return { success: false, canSnoozeAgain: false };
    }

    const snoozedUntil = new Date(Date.now() + hours * 60 * 60 * 1000);

    await supabase
      .from('check_in_snoozes')
      .upsert({
        check_in_id: checkInId,
        user_id: user.id,
        snooze_count: currentCount + 1,
        snoozed_until: snoozedUntil.toISOString(),
      });

    return { success: true, canSnoozeAgain: currentCount + 1 < 2 };
  },
};

// ============================================
// EVENTS API
// ============================================

export const eventsApi = {
  async getGroupEvents(groupId: string): Promise<Event[]> {
    const { data } = await supabase
      .from('events')
      .select('*')
      .eq('group_id', groupId)
      .gte('event_date', new Date().toISOString().split('T')[0])
      .order('event_date')
      .order('start_time');

    return data || [];
  },

  async getMyUpcomingEvents(): Promise<Event[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data: memberships } = await supabase
      .from('group_members')
      .select('group_id')
      .eq('user_id', user.id);

    if (!memberships?.length) return [];

    const groupIds = memberships.map((m) => m.group_id);

    const { data } = await supabase
      .from('events')
      .select('*, groups(name)')
      .in('group_id', groupIds)
      .gte('event_date', new Date().toISOString().split('T')[0])
      .order('event_date')
      .order('start_time')
      .limit(10);

    return data || [];
  },

  async confirmAttendance(eventId: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('event_participants').upsert({
      event_id: eventId,
      user_id: user.id,
      status: 'confirmed',
    });
  },
};

// ============================================
// NOTIFICATIONS API
// ============================================

export const notificationsApi = {
  async getNotifications(): Promise<Notification[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50);

    return data || [];
  },

  async getUnreadCount(): Promise<number> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return 0;

    const { count } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('read', false);

    return count || 0;
  },

  async markAsRead(notificationId: string): Promise<void> {
    await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId);
  },

  async markAllAsRead(): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', user.id)
      .eq('read', false);
  },

  subscribeToNotifications(callback: (notification: Notification) => void) {
    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
        },
        (payload) => {
          callback(payload.new as Notification);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },
};
