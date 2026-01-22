# Odon - AI-Powered Friend Group Coordination App

A mobile-first Progressive Web App (PWA) designed to help friend groups coordinate hangouts effortlessly by intelligently finding common free times from their calendars.

## 🎨 Brand & Design

**Personality:** Friendly, warm, casual, trust-inducing  
**Colors:** Warm coral (#FF8B73) primary, amber secondary, teal/mint accents  
**Mobile-first:** Optimized for 375px width with responsive design  

## ✨ Core Features

### 1. **Onboarding Flow**
- Welcome screens with value proposition
- Sign up options (Email, Google, Apple)
- Calendar connection (Google, Outlook, Apple)
- Privacy explanation and permissions
- Create/join first group

### 2. **Home Dashboard**
- View all your groups
- See upcoming hangouts
- Quick status updates
- Create new groups (FAB button)
- Notification badge

### 3. **Group Management**
- Group details with member list
- Next check-in countdown
- Upcoming hangout display
- Past hangouts history
- Group settings (admin only)

### 4. **Check-in Flow** (Hero Feature)
- AI-detected free time slots
- Multi-select time picker
- Quick "All work" / "None work" buttons
- Progress indicator showing group responses
- Smooth submission with confirmation

### 5. **Availability Matching**
- Visual overlapping time slots
- AI-powered "best match" recommendation
- See attendee count for each slot
- View who's available per time slot

### 6. **Location Selection**
- AI-suggested locations with reasoning
- Quick vote system
- Virtual hangout option (Google Meet, Zoom)
- Custom location input
- Previous location history

### 7. **Hangout Confirmation**
- Celebration moment with confetti animation
- Event details card
- Calendar sync confirmation
- Share functionality
- PWA installation prompt

### 8. **Settings**
- Personal profile management
- Connected calendars (add/remove)
- Notification preferences
- Quiet hours configuration
- Timezone settings
- Privacy controls

### 9. **Group Settings** (Admin)
- Check-in frequency (weekly/bi-weekly/monthly)
- Check-in day and time
- Minimum attendees requirement
- Auto-schedule toggle
- Invite link management
- Member management

## 🚀 Key Interactions

- **Pull to refresh** - Update data on home screen
- **Swipe actions** - Quick actions on cards
- **Haptic feedback** - On important interactions
- **Smooth transitions** - Between all states
- **Loading skeletons** - Better perceived performance

## 📱 PWA Features

- Add to home screen prompt
- Offline-ready architecture
- Push notification support
- Standalone display mode
- App-like experience

## 🎯 User Flow Example

1. **Complete onboarding** → Sign up → Connect calendar → Privacy confirmation
2. **View home** → See groups and upcoming hangouts
3. **Receive check-in notification** → Tap to submit availability
4. **Select available times** → Submit your free slots
5. **AI finds best match** → Review and confirm time
6. **Choose location** → AI suggests or add custom
7. **Hangout confirmed!** → Added to calendar, share with friends

## 🧩 Component Library

### UI Components
- `Button` - Primary, secondary, ghost, outline variants
- `AvatarStack` - Overlapping user avatars
- `TimeSlotSelector` - Multi-select time picker
- `GroupCard` - Group overview with members
- `HangoutCard` - Event details display
- `NotificationCard` - Various notification types
- `BottomSheet` - Modal drawer component
- `EmptyState` - Placeholder for empty views
- `LoadingSkeleton` - Loading state placeholders

### Screens
- `OnboardingScreen` - Multi-step onboarding
- `HomeScreen` - Main dashboard
- `GroupScreen` - Group details view
- `CheckInScreen` - Availability submission
- `AvailabilityMatchScreen` - Match results
- `LocationPickerScreen` - Location selection
- `HangoutConfirmedScreen` - Success state
- `SettingsScreen` - Personal settings
- `GroupSettingsScreen` - Group admin settings
- `NotificationsScreen` - Notification center

## 🎨 Design Principles

1. **Notification-first** - Users mainly interact via notifications and quick actions
2. **No chat** - This is a coordination tool, not a messaging app
3. **Minimal friction** - Most actions are 1-2 taps
4. **Calendar-centric** - Calendar visualization is key
5. **Group-focused** - Everything revolves around friend groups

## ♿ Accessibility

- High contrast text for readability
- Touch targets minimum 44x44px
- Screen reader labels on all interactive elements
- Reduced motion option support
- Semantic HTML structure

## 🎯 Demo Navigation

Use the **reset button** (↻) in the top-right corner to return to onboarding at any time.

### Quick Navigation Guide:
1. **Start** - Go through onboarding flow
2. **Home** - View your groups and hangouts
3. **Click a group** - See group details
4. **Start Check-in** - Experience the hero feature
5. **Submit availability** - See AI matching
6. **Choose location** - Pick or suggest a place
7. **Confirm** - Celebrate the confirmed hangout!
8. **Settings** - Explore notification and privacy settings

## 🔔 Notification Examples

The app includes examples of various notification types:
- Check-in prompts
- Match found alerts
- Confirmed hangout notifications
- Upcoming hangout reminders
- Response deadline reminders

## 💡 Key Differentiator

The **check-in flow** is designed to be delightful, fast, and satisfying. It uses:
- AI to detect free times from calendar
- Visual time slot selection
- Real-time progress indicators
- Smooth animations and transitions
- Immediate feedback on submission

## 🛠 Technical Stack

- **React** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **Motion (Framer Motion)** - Animations
- **Lucide React** - Icons

## 📝 Notes

This is a design prototype showcasing the complete user experience and interface design for Odon. All data is mocked for demonstration purposes. In a production environment, this would connect to:
- Calendar APIs (Google, Outlook, Apple)
- Backend services for user management
- Push notification services
- Real-time database for group coordination
