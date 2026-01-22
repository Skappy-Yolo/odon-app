import { ArrowLeft, User, Calendar, Bell, Globe, Shield, ChevronRight, Plus, Check } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../components/Button';
import { BottomSheet } from '../components/BottomSheet';

interface SettingsScreenProps {
  onBack: () => void;
}

export function SettingsScreen({ onBack }: SettingsScreenProps) {
  const [showNotificationSheet, setShowNotificationSheet] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [checkInReminders, setCheckInReminders] = useState(true);
  const [hangoutReminders, setHangoutReminders] = useState(true);

  const connectedCalendars = [
    {
      id: '1',
      name: 'Google Calendar',
      email: 'alex@example.com',
      icon: '📅'
    }
  ];

  return (
    <div className="min-h-screen bg-[hsl(var(--color-background))]">
      <div className="max-w-md mx-auto">
        <header className="sticky top-0 bg-[hsl(var(--color-background))] z-10 px-6 py-4 border-b border-[hsl(var(--color-border))]">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-[hsl(var(--color-border))] transition-colors -ml-2"
            >
              <ArrowLeft className="w-5 h-5 text-[hsl(var(--color-text))]" />
            </button>
            <h2 className="text-xl">Settings</h2>
          </div>
        </header>

        <div className="px-6 py-6">
          <section className="mb-8">
            <h3 className="text-sm font-semibold text-[hsl(var(--color-text-secondary))] mb-3 uppercase tracking-wide">
              Profile
            </h3>
            <div className="bg-white rounded-2xl border border-[hsl(var(--color-border))] overflow-hidden">
              <button className="w-full p-4 flex items-center gap-3 hover:bg-[hsl(var(--color-background))] transition-colors">
                <div className="w-12 h-12 rounded-full bg-[hsl(var(--color-primary)/.2)] flex items-center justify-center">
                  <User className="w-6 h-6 text-[hsl(var(--color-primary))]" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-[hsl(var(--color-text))]">Alex Chen</p>
                  <p className="text-sm text-[hsl(var(--color-text-secondary))]">alex@example.com</p>
                </div>
                <ChevronRight className="w-5 h-5 text-[hsl(var(--color-text-light))]" />
              </button>
            </div>
          </section>

          <section className="mb-8">
            <h3 className="text-sm font-semibold text-[hsl(var(--color-text-secondary))] mb-3 uppercase tracking-wide">
              Calendars
            </h3>
            <div className="bg-white rounded-2xl border border-[hsl(var(--color-border))] overflow-hidden">
              {connectedCalendars.map((calendar, index) => (
                <div
                  key={calendar.id}
                  className={`p-4 flex items-center gap-3 ${
                    index < connectedCalendars.length - 1 ? 'border-b border-[hsl(var(--color-border))]' : ''
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-[hsl(var(--color-success)/.15)] flex items-center justify-center text-xl">
                    {calendar.icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-[hsl(var(--color-text))]">{calendar.name}</p>
                    <p className="text-sm text-[hsl(var(--color-text-secondary))]">{calendar.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--color-success)/.15)] text-[hsl(var(--color-success))] font-medium">
                      Connected
                    </span>
                  </div>
                </div>
              ))}
              <button className="w-full p-4 flex items-center justify-center gap-2 text-[hsl(var(--color-primary))] hover:bg-[hsl(var(--color-background))] transition-colors">
                <Plus className="w-5 h-5" />
                <span className="font-medium">Add another calendar</span>
              </button>
            </div>
          </section>

          <section className="mb-8">
            <h3 className="text-sm font-semibold text-[hsl(var(--color-text-secondary))] mb-3 uppercase tracking-wide">
              Preferences
            </h3>
            <div className="bg-white rounded-2xl border border-[hsl(var(--color-border))] overflow-hidden">
              <button
                onClick={() => setShowNotificationSheet(true)}
                className="w-full p-4 flex items-center gap-3 hover:bg-[hsl(var(--color-background))] transition-colors border-b border-[hsl(var(--color-border))]"
              >
                <div className="w-10 h-10 rounded-xl bg-[hsl(var(--color-primary)/.15)] flex items-center justify-center">
                  <Bell className="w-5 h-5 text-[hsl(var(--color-primary))]" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-[hsl(var(--color-text))]">Notifications</p>
                  <p className="text-sm text-[hsl(var(--color-text-secondary))]">
                    {notificationsEnabled ? 'Enabled' : 'Disabled'}
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-[hsl(var(--color-text-light))]" />
              </button>

              <button className="w-full p-4 flex items-center gap-3 hover:bg-[hsl(var(--color-background))] transition-colors border-b border-[hsl(var(--color-border))]">
                <div className="w-10 h-10 rounded-xl bg-[hsl(var(--color-accent)/.15)] flex items-center justify-center">
                  <Globe className="w-5 h-5 text-[hsl(var(--color-accent))]" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-[hsl(var(--color-text))]">Timezone</p>
                  <p className="text-sm text-[hsl(var(--color-text-secondary))]">Eastern Time (ET)</p>
                </div>
                <ChevronRight className="w-5 h-5 text-[hsl(var(--color-text-light))]" />
              </button>

              <button className="w-full p-4 flex items-center gap-3 hover:bg-[hsl(var(--color-background))] transition-colors">
                <div className="w-10 h-10 rounded-xl bg-[hsl(var(--color-secondary)/.15)] flex items-center justify-center">
                  <Shield className="w-5 h-5 text-[hsl(var(--color-text))]" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-[hsl(var(--color-text))]">Privacy</p>
                  <p className="text-sm text-[hsl(var(--color-text-secondary))]">Manage your data</p>
                </div>
                <ChevronRight className="w-5 h-5 text-[hsl(var(--color-text-light))]" />
              </button>
            </div>
          </section>

          <section>
            <div className="bg-white rounded-2xl border border-[hsl(var(--color-border))] p-4 text-center">
              <p className="text-sm text-[hsl(var(--color-text-secondary))] mb-1">
                Odon version 1.0.0
              </p>
              <button className="text-sm text-[hsl(var(--color-primary))] font-medium hover:underline">
                Terms & Privacy
              </button>
            </div>
          </section>
        </div>
      </div>

      <BottomSheet
        isOpen={showNotificationSheet}
        onClose={() => setShowNotificationSheet(false)}
        title="Notification Settings"
      >
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-[hsl(var(--color-text))]">Push Notifications</p>
              <p className="text-sm text-[hsl(var(--color-text-secondary))]">
                Get notified about check-ins and hangouts
              </p>
            </div>
            <button
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              className={`w-12 h-7 rounded-full transition-colors relative ${
                notificationsEnabled ? 'bg-[hsl(var(--color-primary))]' : 'bg-[hsl(var(--color-border))]'
              }`}
            >
              <div
                className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                  notificationsEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="h-px bg-[hsl(var(--color-border))]" />

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-[hsl(var(--color-text))]">Check-in Reminders</p>
              <p className="text-sm text-[hsl(var(--color-text-secondary))]">
                When it's time to submit availability
              </p>
            </div>
            <button
              onClick={() => setCheckInReminders(!checkInReminders)}
              className={`w-12 h-7 rounded-full transition-colors relative ${
                checkInReminders ? 'bg-[hsl(var(--color-primary))]' : 'bg-[hsl(var(--color-border))]'
              }`}
            >
              <div
                className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                  checkInReminders ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-[hsl(var(--color-text))]">Hangout Reminders</p>
              <p className="text-sm text-[hsl(var(--color-text-secondary))]">
                1 day and 1 hour before hangouts
              </p>
            </div>
            <button
              onClick={() => setHangoutReminders(!hangoutReminders)}
              className={`w-12 h-7 rounded-full transition-colors relative ${
                hangoutReminders ? 'bg-[hsl(var(--color-primary))]' : 'bg-[hsl(var(--color-border))]'
              }`}
            >
              <div
                className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                  hangoutReminders ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="h-px bg-[hsl(var(--color-border))]" />

          <div>
            <p className="font-medium text-[hsl(var(--color-text))] mb-2">Quiet Hours</p>
            <p className="text-sm text-[hsl(var(--color-text-secondary))] mb-4">
              Pause notifications during these hours
            </p>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-xs text-[hsl(var(--color-text-secondary))] mb-1 block">
                  From
                </label>
                <select className="w-full px-3 py-2 rounded-xl border-2 border-[hsl(var(--color-border))] focus:border-[hsl(var(--color-primary))] outline-none">
                  <option>10:00 PM</option>
                  <option>11:00 PM</option>
                  <option>12:00 AM</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="text-xs text-[hsl(var(--color-text-secondary))] mb-1 block">
                  To
                </label>
                <select className="w-full px-3 py-2 rounded-xl border-2 border-[hsl(var(--color-border))] focus:border-[hsl(var(--color-primary))] outline-none">
                  <option>7:00 AM</option>
                  <option>8:00 AM</option>
                  <option>9:00 AM</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </BottomSheet>
    </div>
  );
}
