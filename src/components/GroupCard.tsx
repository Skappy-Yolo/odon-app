import { ChevronRight, Calendar } from 'lucide-react';
import { AvatarStack } from './AvatarStack';

interface GroupCardProps {
  group: {
    id: string;
    name: string;
    emoji: string;
    members: Array<{
      id: string;
      name: string;
      image?: string;
      initials: string;
    }>;
    nextCheckIn?: string;
    upcomingHangout?: {
      date: string;
      time: string;
    };
  };
  onClick: () => void;
}

export function GroupCard({ group, onClick }: GroupCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-white rounded-2xl p-4 shadow-sm border border-[hsl(var(--color-border))] hover:shadow-md transition-all active:scale-98"
    >
      <div className="flex items-start gap-3">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[hsl(var(--color-primary)/.2)] to-[hsl(var(--color-secondary)/.2)] flex items-center justify-center text-3xl flex-shrink-0">
          {group.emoji}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-[hsl(var(--color-text))] truncate">{group.name}</h3>
            <ChevronRight className="w-5 h-5 text-[hsl(var(--color-text-light))] flex-shrink-0 ml-2" />
          </div>
          
          <div className="flex items-center justify-between">
            <AvatarStack avatars={group.members} max={4} size="sm" />
            <span className="text-xs text-[hsl(var(--color-text-secondary))] ml-2">
              {group.members.length} {group.members.length === 1 ? 'member' : 'members'}
            </span>
          </div>
          
          {group.upcomingHangout ? (
            <div className="mt-3 flex items-center gap-1.5 text-xs text-[hsl(var(--color-primary))] bg-[hsl(var(--color-primary)/.08)] px-2.5 py-1.5 rounded-lg w-fit">
              <Calendar className="w-3.5 h-3.5" />
              <span className="font-medium">
                {group.upcomingHangout.date} at {group.upcomingHangout.time}
              </span>
            </div>
          ) : group.nextCheckIn ? (
            <div className="mt-3 text-xs text-[hsl(var(--color-text-secondary))]">
              Next check-in: {group.nextCheckIn}
            </div>
          ) : null}
        </div>
      </div>
    </button>
  );
}
