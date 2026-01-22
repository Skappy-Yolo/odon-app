/**
 * Odon PWA Backend Services
 * 
 * This module provides all backend functionality without modifying any UI components.
 * 
 * Usage in screens (optional - screens can still use mock data):
 * 
 * import { useAuth, useGroups, useNotifications } from '../lib';
 * 
 * function MyScreen() {
 *   const { user, signIn, signOut } = useAuth();
 *   const { groups, loading } = useGroups();
 *   const { notifications, unreadCount } = useNotifications();
 *   // ... use real data or fall back to mock
 * }
 */

// Core services
export { supabase, auth } from './supabase';
export type { User, Group, Event, Notification, CheckIn, AvailabilitySlot } from './supabase';

// API functions
export { userApi, groupsApi, checkInsApi, eventsApi, notificationsApi } from './api';

// React hooks
export {
  useAuth,
  useProfile,
  useGroups,
  useGroup,
  useUpcomingEvents,
  useNotifications,
  useCheckIn,
} from './hooks';

// AI services
export { gemini, geminiFlash, generateSmartSuggestion, generateNotificationText } from './gemini';

// Calendar services
export {
  getConnectedCalendars,
  disconnectCalendar,
  calculateFreeSlots,
  connectGoogleCalendar,
  connectMicrosoftCalendar,
} from './calendar';

// Config
export { config } from './config';
