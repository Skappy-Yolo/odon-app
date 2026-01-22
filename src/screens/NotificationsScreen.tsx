import { ArrowLeft } from 'lucide-react';
import { NotificationCard } from '../components/NotificationCard';

interface NotificationsScreenProps {
  onBack: () => void;
  onNavigate: (screen: string, data?: any) => void;
}

export function NotificationsScreen({ onBack, onNavigate }: NotificationsScreenProps) {
  const notifications = [
    {
      type: 'check-in' as const,
      title: 'Time for your weekly check-in!',
      message: 'Let College Squad know when you\'re free this week',
      time: '2m ago',
      groupName: 'College Squad',
      groupEmoji: '🎓',
      actionLabel: 'Submit availability',
      onAction: () => onNavigate('check-in', {})
    },
    {
      type: 'match-found' as const,
      title: 'Perfect! We found a match',
      message: 'Saturday at 7 PM works for 4 people in College Squad',
      time: '1h ago',
      groupName: 'College Squad',
      groupEmoji: '🎓',
      actionLabel: 'View details'
    },
    {
      type: 'confirmed' as const,
      title: 'Hangout confirmed!',
      message: 'See you at The Green Cafe this Saturday',
      time: '3h ago',
      groupName: 'College Squad',
      groupEmoji: '🎓',
      actionLabel: 'Add to calendar'
    },
    {
      type: 'upcoming' as const,
      title: 'Hangout reminder',
      message: 'Your hangout with Book Club is tomorrow at 6 PM',
      time: '1d ago',
      groupName: 'Book Club',
      groupEmoji: '📚',
      actionLabel: 'View event'
    },
    {
      type: 'reminder' as const,
      title: 'Don\'t forget!',
      message: 'Running Crew check-in closes in 2 hours',
      time: '2d ago',
      groupName: 'Running Crew',
      groupEmoji: '👟',
      actionLabel: 'Submit now'
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
            <div>
              <h2 className="text-xl">Notifications</h2>
              <p className="text-sm text-[hsl(var(--color-text-secondary))]">{notifications.length} unread</p>
            </div>
          </div>
        </header>

        <div className="px-6 py-6">
          <div className="space-y-3">
            {notifications.map((notification, index) => (
              <NotificationCard key={index} {...notification} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}