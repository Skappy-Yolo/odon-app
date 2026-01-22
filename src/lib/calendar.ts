/**
 * Calendar Service for Odon PWA
 * 
 * Handles Google Calendar integration via Supabase OAuth
 */

import { supabase } from './supabase';

export type CalendarProvider = 'google' | 'microsoft' | 'apple';

interface CalendarEvent {
  id: string;
  summary: string;
  start: Date;
  end: Date;
  isAllDay: boolean;
}

/**
 * Check which calendars are connected
 */
export async function getConnectedCalendars(): Promise<Array<{
  provider: CalendarProvider;
  connected: boolean;
}>> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: tokens } = await supabase
    .from('calendar_tokens')
    .select('provider')
    .eq('user_id', user.id);

  const providers: CalendarProvider[] = ['google', 'microsoft', 'apple'];
  
  return providers.map((provider) => ({
    provider,
    connected: tokens?.some((t) => t.provider === provider) || false,
  }));
}

/**
 * Disconnect a calendar provider
 */
export async function disconnectCalendar(provider: CalendarProvider): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from('calendar_tokens')
    .delete()
    .eq('user_id', user.id)
    .eq('provider', provider);
}

/**
 * Calculate free time slots from calendar events
 */
export function calculateFreeSlots(
  events: CalendarEvent[],
  startDate: Date,
  endDate: Date,
  workingHours = { start: 9, end: 21 }
): Array<{ date: string; start: string; end: string }> {
  const freeSlots: Array<{ date: string; start: string; end: string }> = [];

  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    const dayStart = new Date(currentDate);
    dayStart.setHours(workingHours.start, 0, 0, 0);

    const dayEnd = new Date(currentDate);
    dayEnd.setHours(workingHours.end, 0, 0, 0);

    // Get events for this day
    const dayEvents = events
      .filter((e) => {
        const eventDate = e.start.toDateString();
        return eventDate === currentDate.toDateString() && !e.isAllDay;
      })
      .sort((a, b) => a.start.getTime() - b.start.getTime());

    // Find gaps
    let slotStart = dayStart;
    for (const event of dayEvents) {
      if (event.start > slotStart) {
        const gapMinutes = (event.start.getTime() - slotStart.getTime()) / 60000;
        if (gapMinutes >= 60) {
          freeSlots.push({
            date: currentDate.toISOString().split('T')[0],
            start: slotStart.toTimeString().slice(0, 5),
            end: event.start.toTimeString().slice(0, 5),
          });
        }
      }
      slotStart = new Date(Math.max(slotStart.getTime(), event.end.getTime()));
    }

    // Check remaining time
    if (slotStart < dayEnd) {
      const gapMinutes = (dayEnd.getTime() - slotStart.getTime()) / 60000;
      if (gapMinutes >= 60) {
        freeSlots.push({
          date: currentDate.toISOString().split('T')[0],
          start: slotStart.toTimeString().slice(0, 5),
          end: dayEnd.toTimeString().slice(0, 5),
        });
      }
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return freeSlots;
}

/**
 * Open Google Calendar OAuth flow
 */
export function connectGoogleCalendar() {
  // Supabase handles OAuth - just redirect
  window.location.href = `${import.meta.env.VITE_SUPABASE_URL}/auth/v1/authorize?provider=google&scopes=https://www.googleapis.com/auth/calendar.readonly,https://www.googleapis.com/auth/calendar.events`;
}

/**
 * Open Microsoft OAuth flow
 */
export function connectMicrosoftCalendar() {
  const clientId = import.meta.env.VITE_MICROSOFT_CLIENT_ID;
  const redirectUri = encodeURIComponent(`${window.location.origin}/auth/microsoft/callback`);
  const scopes = encodeURIComponent('User.Read Calendars.Read Calendars.ReadWrite offline_access');
  
  window.location.href = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=${scopes}`;
}
