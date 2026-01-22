import { Plus, Bell, Settings, Calendar } from 'lucide-react';
import { GroupCard } from '../components/GroupCard';
import { HangoutCard } from '../components/HangoutCard';
import { EmptyState } from '../components/EmptyState';

interface HomeScreenProps {
  onNavigate: (screen: string, data?: any) => void;
  hasGroups?: boolean;
}

export function HomeScreen({ onNavigate, hasGroups = true }: HomeScreenProps) {
  const mockGroups = [
    {
      id: '1',
      name: 'College Squad',
      emoji: '🎓',
      members: [
        { id: '1', name: 'Alex', initials: 'AL' },
        { id: '2', name: 'Sam', initials: 'SM' },
        { id: '3', name: 'Jordan', initials: 'JD' },
        { id: '4', name: 'Casey', initials: 'CS' },
        { id: '5', name: 'Riley', initials: 'RL' }
      ],
      upcomingHangout: {
        date: 'Sat, Jan 25',
        time: '7:00 PM'
      }
    },
    {
      id: '2',
      name: 'Book Club',
      emoji: '📚',
      members: [
        { id: '6', name: 'Morgan', initials: 'MG' },
        { id: '7', name: 'Taylor', initials: 'TY' },
        { id: '8', name: 'Jamie', initials: 'JM' }
      ],
      nextCheckIn: 'in 3 days'
    },
    {
      id: '3',
      name: 'Running Crew',
      emoji: '👟',
      members: [
        { id: '9', name: 'Drew', initials: 'DR' },
        { id: '10', name: 'Quinn', initials: 'QN' },
        { id: '11', name: 'Blake', initials: 'BL' },
        { id: '12', name: 'Avery', initials: 'AV' }
      ],
      nextCheckIn: 'tomorrow'
    }
  ];

  const upcomingHangouts = [
    {
      id: '1',
      groupName: 'College Squad',
      groupEmoji: '🎓',
      date: 'Saturday, January 25',
      time: '7:00 PM - 10:00 PM',
      location: 'The Green Cafe',
      attendees: [
        { id: '1', name: 'Alex', initials: 'AL' },
        { id: '2', name: 'Sam', initials: 'SM' },
        { id: '3', name: 'Jordan', initials: 'JD' },
        { id: '4', name: 'Casey', initials: 'CS' }
      ],
      confirmed: true
    }
  ];

  if (!hasGroups) {
    return (
      <div className="min-h-screen bg-[hsl(var(--color-background))]">
        <div className="max-w-md mx-auto">
          <header className="sticky top-0 bg-[hsl(var(--color-background))] z-10 px-6 py-4 border-b border-[hsl(var(--color-border))]">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl">Odon</h1>
                <p className="text-sm text-[hsl(var(--color-text-secondary))]">Hang out more, stress less</p>
              </div>
              <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-[hsl(var(--color-border))] transition-colors">
                <Settings className="w-5 h-5 text-[hsl(var(--color-text-secondary))]" />
              </button>
            </div>
          </header>

          <div className="py-12">
            <EmptyState
              icon={Calendar}
              title="No groups yet"
              description="Create your first group to start coordinating hangouts with your friends!"
              actionLabel="Create a group"
              onAction={() => onNavigate('create-group')}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[hsl(var(--color-background))] pb-20">
      <div className="max-w-md mx-auto">
        <header className="sticky top-0 bg-[hsl(var(--color-background))] z-10 px-6 py-4 border-b border-[hsl(var(--color-border))]">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl">Odon</h1>
              <p className="text-sm text-[hsl(var(--color-text-secondary))]">3 active groups</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-[hsl(var(--color-border))] transition-colors relative">
                <Bell className="w-5 h-5 text-[hsl(var(--color-text-secondary))]" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[hsl(var(--color-error))] rounded-full" />
              </button>
              <button 
                onClick={() => onNavigate('settings')}
                className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-[hsl(var(--color-border))] transition-colors"
              >
                <Settings className="w-5 h-5 text-[hsl(var(--color-text-secondary))]" />
              </button>
            </div>
          </div>
        </header>

        {upcomingHangouts.length > 0 && (
          <section className="px-6 py-6">
            <h2 className="text-xl mb-4">Upcoming</h2>
            <div className="space-y-3">
              {upcomingHangouts.map((hangout) => (
                <HangoutCard key={hangout.id} hangout={hangout} onClick={() => onNavigate('hangout-detail', hangout)} />
              ))}
            </div>
          </section>
        )}

        <section className="px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl">Your Groups</h2>
          </div>
          <div className="space-y-3">
            {mockGroups.map((group) => (
              <GroupCard key={group.id} group={group} onClick={() => onNavigate('group', group)} />
            ))}
          </div>
        </section>

        <button
          onClick={() => onNavigate('create-group')}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-[hsl(var(--color-primary))] text-white shadow-lg flex items-center justify-center active:scale-95 transition-transform z-20"
          aria-label="Create new group"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
