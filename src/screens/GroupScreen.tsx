import { ArrowLeft, Settings, Calendar, Clock, Users, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { AvatarStack } from '../components/AvatarStack';
import { HangoutCard } from '../components/HangoutCard';
import { Button } from '../components/Button';

interface GroupScreenProps {
  group?: any;
  onBack: () => void;
  onNavigate: (screen: string, data?: any) => void;
}

export function GroupScreen({ group, onBack, onNavigate }: GroupScreenProps) {
  const [showPastHangouts, setShowPastHangouts] = useState(false);

  const mockGroup = group || {
    id: '1',
    name: 'College Squad',
    emoji: '🎓',
    members: [
      { id: '1', name: 'Alex Chen', initials: 'AC' },
      { id: '2', name: 'Sam Rivera', initials: 'SR' },
      { id: '3', name: 'Jordan Park', initials: 'JP' },
      { id: '4', name: 'Casey Kim', initials: 'CK' },
      { id: '5', name: 'Riley Morgan', initials: 'RM' }
    ],
    nextCheckIn: 'Tomorrow at 6:00 PM',
    checkInFrequency: 'Weekly on Thursdays',
    upcomingHangout: {
      id: '1',
      groupName: 'College Squad',
      groupEmoji: '🎓',
      date: 'Saturday, January 25',
      time: '7:00 PM - 10:00 PM',
      location: 'The Green Cafe',
      attendees: [
        { id: '1', name: 'Alex', initials: 'AC' },
        { id: '2', name: 'Sam', initials: 'SR' },
        { id: '3', name: 'Jordan', initials: 'JP' },
        { id: '4', name: 'Casey', initials: 'CK' }
      ],
      confirmed: true
    },
    isAdmin: true
  };

  const pastHangouts = [
    {
      id: '2',
      groupName: 'College Squad',
      groupEmoji: '🎓',
      date: 'Saturday, January 18',
      time: '2:00 PM - 5:00 PM',
      location: 'Central Park',
      attendees: [
        { id: '1', name: 'Alex', initials: 'AC' },
        { id: '2', name: 'Sam', initials: 'SR' },
        { id: '5', name: 'Riley', initials: 'RM' }
      ]
    },
    {
      id: '3',
      groupName: 'College Squad',
      groupEmoji: '🎓',
      date: 'Sunday, January 12',
      time: '6:00 PM - 9:00 PM',
      location: 'Mario\'s Pizza',
      attendees: [
        { id: '1', name: 'Alex', initials: 'AC' },
        { id: '2', name: 'Sam', initials: 'SR' },
        { id: '3', name: 'Jordan', initials: 'JP' },
        { id: '4', name: 'Casey', initials: 'CK' },
        { id: '5', name: 'Riley', initials: 'RM' }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[hsl(var(--color-background))]">
      <div className="max-w-md mx-auto">
        <header className="sticky top-0 bg-[hsl(var(--color-background))] z-10 px-6 py-4 border-b border-[hsl(var(--color-border))]">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-[hsl(var(--color-border))] transition-colors -ml-2"
            >
              <ArrowLeft className="w-5 h-5 text-[hsl(var(--color-text))]" />
            </button>
            <button
              onClick={() => onNavigate('group-settings', mockGroup)}
              className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-[hsl(var(--color-border))] transition-colors"
            >
              <Settings className="w-5 h-5 text-[hsl(var(--color-text-secondary))]" />
            </button>
          </div>
        </header>

        <div className="px-6 py-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[hsl(var(--color-primary)/.2)] to-[hsl(var(--color-secondary)/.2)] flex items-center justify-center text-5xl flex-shrink-0">
              {mockGroup.emoji}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl mb-2">{mockGroup.name}</h1>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[hsl(var(--color-text-secondary))]" />
                <span className="text-sm text-[hsl(var(--color-text-secondary))]">
                  {mockGroup.members.length} members
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-[hsl(var(--color-border))] mb-6">
            <h3 className="font-semibold text-[hsl(var(--color-text))] mb-3">Members</h3>
            <div className="space-y-3">
              {mockGroup.members.map((member: any) => (
                <div key={member.id} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[hsl(var(--color-primary)/.2)] flex items-center justify-center text-sm font-medium text-[hsl(var(--color-primary))]">
                    {member.initials}
                  </div>
                  <span className="text-sm text-[hsl(var(--color-text))]">{member.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-[hsl(var(--color-primary)/.1)] to-[hsl(var(--color-secondary)/.1)] rounded-2xl p-4 border border-[hsl(var(--color-primary)/.2)] mb-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/80 flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5 text-[hsl(var(--color-primary))]" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-[hsl(var(--color-text))] mb-1">Next Check-in</h4>
                <p className="text-sm text-[hsl(var(--color-text-secondary))] mb-3">
                  {mockGroup.nextCheckIn}
                </p>
                <div className="flex items-center gap-2 text-xs text-[hsl(var(--color-text-secondary))]">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{mockGroup.checkInFrequency}</span>
                </div>
              </div>
            </div>
          </div>

          {mockGroup.isAdmin && (
            <Button
              onClick={() => onNavigate('check-in', mockGroup)}
              variant="primary"
              fullWidth
              size="lg"
              className="mb-6"
            >
              Start Check-in Now
            </Button>
          )}

          {mockGroup.upcomingHangout && (
            <section className="mb-6">
              <h3 className="font-semibold text-[hsl(var(--color-text))] mb-3">Upcoming Hangout</h3>
              <HangoutCard hangout={mockGroup.upcomingHangout} />
            </section>
          )}

          <section>
            <button
              onClick={() => setShowPastHangouts(!showPastHangouts)}
              className="flex items-center justify-between w-full mb-3 group"
            >
              <h3 className="font-semibold text-[hsl(var(--color-text))]">
                Past Hangouts ({pastHangouts.length})
              </h3>
              <ChevronDown
                className={`w-5 h-5 text-[hsl(var(--color-text-secondary))] transition-transform ${
                  showPastHangouts ? 'rotate-180' : ''
                }`}
              />
            </button>
            {showPastHangouts && (
              <div className="space-y-3">
                {pastHangouts.map((hangout) => (
                  <HangoutCard key={hangout.id} hangout={hangout} />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
