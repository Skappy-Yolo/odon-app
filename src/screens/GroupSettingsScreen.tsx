import { ArrowLeft, Calendar, Users, Link2, Bell, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../components/Button';

interface GroupSettingsScreenProps {
  group?: any;
  onBack: () => void;
}

export function GroupSettingsScreen({ group, onBack }: GroupSettingsScreenProps) {
  const [autoSchedule, setAutoSchedule] = useState(true);
  const [checkInDay, setCheckInDay] = useState('thursday');
  const [checkInTime, setCheckInTime] = useState('18:00');
  const [frequency, setFrequency] = useState('weekly');
  const [minAttendees, setMinAttendees] = useState('3');

  const mockGroup = group || {
    id: '1',
    name: 'College Squad',
    emoji: '🎓',
    isAdmin: true
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--color-background))]">
      <div className="max-w-md mx-auto pb-20">
        <header className="sticky top-0 bg-[hsl(var(--color-background))] z-10 px-6 py-4 border-b border-[hsl(var(--color-border))]">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-[hsl(var(--color-border))] transition-colors -ml-2"
            >
              <ArrowLeft className="w-5 h-5 text-[hsl(var(--color-text))]" />
            </button>
            <h2 className="text-xl">Group Settings</h2>
          </div>
        </header>

        <div className="px-6 py-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[hsl(var(--color-primary)/.2)] to-[hsl(var(--color-secondary)/.2)] flex items-center justify-center text-4xl">
              {mockGroup.emoji}
            </div>
            <div>
              <h3 className="mb-1">{mockGroup.name}</h3>
              <p className="text-sm text-[hsl(var(--color-text-secondary))]">
                {mockGroup.isAdmin ? 'You\'re the admin' : 'Member'}
              </p>
            </div>
          </div>

          <section className="mb-8">
            <h3 className="text-sm font-semibold text-[hsl(var(--color-text-secondary))] mb-3 uppercase tracking-wide">
              Check-in Schedule
            </h3>
            
            <div className="bg-white rounded-2xl border border-[hsl(var(--color-border))] p-4 space-y-6">
              <div>
                <label className="text-sm font-medium text-[hsl(var(--color-text))] mb-2 block">
                  Frequency
                </label>
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-[hsl(var(--color-border))] focus:border-[hsl(var(--color-primary))] outline-none"
                >
                  <option value="weekly">Weekly</option>
                  <option value="biweekly">Bi-weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-[hsl(var(--color-text))] mb-2 block">
                  Check-in Day
                </label>
                <select
                  value={checkInDay}
                  onChange={(e) => setCheckInDay(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-[hsl(var(--color-border))] focus:border-[hsl(var(--color-primary))] outline-none"
                >
                  <option value="monday">Monday</option>
                  <option value="tuesday">Tuesday</option>
                  <option value="wednesday">Wednesday</option>
                  <option value="thursday">Thursday</option>
                  <option value="friday">Friday</option>
                  <option value="saturday">Saturday</option>
                  <option value="sunday">Sunday</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-[hsl(var(--color-text))] mb-2 block">
                  Check-in Time
                </label>
                <input
                  type="time"
                  value={checkInTime}
                  onChange={(e) => setCheckInTime(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-[hsl(var(--color-border))] focus:border-[hsl(var(--color-primary))] outline-none"
                />
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h3 className="text-sm font-semibold text-[hsl(var(--color-text-secondary))] mb-3 uppercase tracking-wide">
              Hangout Settings
            </h3>
            
            <div className="bg-white rounded-2xl border border-[hsl(var(--color-border))] p-4 space-y-6">
              <div>
                <label className="text-sm font-medium text-[hsl(var(--color-text))] mb-2 block">
                  Minimum Attendees
                </label>
                <select
                  value={minAttendees}
                  onChange={(e) => setMinAttendees(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-[hsl(var(--color-border))] focus:border-[hsl(var(--color-primary))] outline-none"
                >
                  <option value="2">2 people</option>
                  <option value="3">3 people</option>
                  <option value="4">4 people</option>
                  <option value="5">5 people</option>
                </select>
                <p className="text-xs text-[hsl(var(--color-text-secondary))] mt-2">
                  Only schedule hangouts if at least this many people are available
                </p>
              </div>

              <div className="h-px bg-[hsl(var(--color-border))]" />

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-[hsl(var(--color-text))]">Auto-schedule</p>
                  <p className="text-sm text-[hsl(var(--color-text-secondary))]">
                    Automatically confirm the best match
                  </p>
                </div>
                <button
                  onClick={() => setAutoSchedule(!autoSchedule)}
                  className={`w-12 h-7 rounded-full transition-colors relative ${
                    autoSchedule ? 'bg-[hsl(var(--color-primary))]' : 'bg-[hsl(var(--color-border))]'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                      autoSchedule ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h3 className="text-sm font-semibold text-[hsl(var(--color-text-secondary))] mb-3 uppercase tracking-wide">
              Invite & Members
            </h3>
            
            <div className="bg-white rounded-2xl border border-[hsl(var(--color-border))] overflow-hidden">
              <button className="w-full p-4 flex items-center gap-3 hover:bg-[hsl(var(--color-background))] transition-colors border-b border-[hsl(var(--color-border))]">
                <div className="w-10 h-10 rounded-xl bg-[hsl(var(--color-primary)/.15)] flex items-center justify-center">
                  <Link2 className="w-5 h-5 text-[hsl(var(--color-primary))]" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-[hsl(var(--color-text))]">Invite Link</p>
                  <p className="text-sm text-[hsl(var(--color-text-secondary))]">Share with friends</p>
                </div>
              </button>

              <button className="w-full p-4 flex items-center gap-3 hover:bg-[hsl(var(--color-background))] transition-colors">
                <div className="w-10 h-10 rounded-xl bg-[hsl(var(--color-accent)/.15)] flex items-center justify-center">
                  <Users className="w-5 h-5 text-[hsl(var(--color-accent))]" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-[hsl(var(--color-text))]">Manage Members</p>
                  <p className="text-sm text-[hsl(var(--color-text-secondary))]">5 members</p>
                </div>
              </button>
            </div>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-[hsl(var(--color-text-secondary))] mb-3 uppercase tracking-wide">
              Danger Zone
            </h3>
            
            <div className="bg-white rounded-2xl border-2 border-[hsl(var(--color-error)/.3)] overflow-hidden">
              <button className="w-full p-4 flex items-center gap-3 hover:bg-[hsl(var(--color-error)/.05)] transition-colors">
                <div className="w-10 h-10 rounded-xl bg-[hsl(var(--color-error)/.15)] flex items-center justify-center">
                  <Trash2 className="w-5 h-5 text-[hsl(var(--color-error))]" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-[hsl(var(--color-error))]">Delete Group</p>
                  <p className="text-sm text-[hsl(var(--color-text-secondary))]">
                    This action cannot be undone
                  </p>
                </div>
              </button>
            </div>
          </section>
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[hsl(var(--color-border))] p-6 z-20">
          <div className="max-w-md mx-auto">
            <Button variant="primary" fullWidth size="lg">
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}