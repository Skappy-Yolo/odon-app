# Odon - AI-Powered Friend Group Coordination App

A mobile-first Progressive Web App (PWA) designed to help friend groups coordinate hangouts effortlessly by intelligently finding common free times from their calendars.

## Brand & Design

- **Personality:** Friendly, warm, casual, trust-inducing
- **Colors:** Warm orange (#e8713a) primary, gold (#f5a623) secondary, teal/mint accents
- **Mobile-first:** Optimized for 375px width with responsive design

## Core Features

### Onboarding Flow
- Welcome screens with value proposition
- Sign up options (Email, Google)
- Calendar connection (Google, Outlook, Apple)
- Privacy explanation and permissions
- Create/join first group

### Home Dashboard
- View all your groups
- See upcoming hangouts
- Quick status updates
- Create new groups (FAB button)
- Notification badge

### Group Management
- Group details with member list
- Next check-in countdown
- Upcoming hangout display
- Past hangouts history
- Group settings (admin only)

### Check-in Flow (Hero Feature)
- AI-detected free time slots
- Multi-select time picker
- Quick "All work" / "None work" buttons
- Progress indicator showing group responses
- Smooth submission with confirmation

### Availability Matching
- Visual overlapping time slots
- AI-powered "best match" recommendation
- See attendee count for each slot
- View who's available per time slot

### Location Selection
- AI-suggested locations with reasoning
- Quick vote system
- Virtual hangout option (Google Meet, Zoom)
- Custom location input
- Previous location history

### Hangout Confirmation
- Celebration moment with confetti animation
- Event details card
- Calendar sync confirmation
- Share functionality
- PWA installation prompt

### Settings
- Personal profile management
- Connected calendars (add/remove)
- Notification preferences
- Quiet hours configuration
- Timezone settings
- Privacy controls

### Group Settings (Admin)
- Check-in frequency (weekly/bi-weekly/monthly)
- Check-in day and time
- Minimum attendees requirement
- Auto-schedule toggle
- Invite link management
- Member management

## Key Interactions

- Pull to refresh - Update data on home screen
- Swipe actions - Quick actions on cards
- Haptic feedback - On important interactions
- Smooth transitions - Between all states
- Loading skeletons - Better perceived performance

## PWA Features

- Add to home screen prompt
- Offline-ready architecture
- Push notification support
- Standalone display mode
- App-like experience

## Technical Stack

- React
- TypeScript
- Tailwind CSS v4
- Motion (Framer Motion)
- Lucide React
- Supabase (Auth + Database)
- Gemini AI

## Getting Started

```
npm install
npm run dev
```
