import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { AvatarStack } from './AvatarStack';

interface HangoutCardProps {
  hangout: {
    id: string;
    groupName: string;
    groupEmoji: string;
    date: string;
    time: string;
    location: string;
    attendees: Array<{
      id: string;
      name: string;
      image?: string;
      initials: string;
    }>;
    confirmed?: boolean;
  };
  onClick?: () => void;
}

export function HangoutCard({ hangout, onClick }: HangoutCardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl p-4 shadow-sm border-2 ${
        hangout.confirmed 
          ? 'border-[hsl(var(--color-success)/.3)] bg-gradient-to-br from-white to-[hsl(var(--color-success)/.03)]' 
          : 'border-[hsl(var(--color-border))]'
      } ${onClick ? 'cursor-pointer hover:shadow-md transition-all active:scale-98' : ''}`}
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[hsl(var(--color-primary)/.2)] to-[hsl(var(--color-secondary)/.2)] flex items-center justify-center text-2xl flex-shrink-0">
          {hangout.groupEmoji}
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-[hsl(var(--color-text))] mb-1">{hangout.groupName}</h4>
          {hangout.confirmed && (
            <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-[hsl(var(--color-success)/.15)] text-[hsl(var(--color-success))] font-medium">
              <Calendar className="w-3 h-3" />
              Confirmed
            </span>
          )}
        </div>
      </div>
      
      <div className="space-y-2 mb-3">
        <div className="flex items-center gap-2 text-sm text-[hsl(var(--color-text-secondary))]">
          <Calendar className="w-4 h-4 text-[hsl(var(--color-primary))]" />
          <span>{hangout.date}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-[hsl(var(--color-text-secondary))]">
          <Clock className="w-4 h-4 text-[hsl(var(--color-primary))]" />
          <span>{hangout.time}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-[hsl(var(--color-text-secondary))]">
          <MapPin className="w-4 h-4 text-[hsl(var(--color-primary))]" />
          <span>{hangout.location}</span>
        </div>
      </div>
      
      <div className="flex items-center justify-between pt-3 border-t border-[hsl(var(--color-border))]">
        <AvatarStack avatars={hangout.attendees} max={5} size="sm" />
        <span className="text-xs text-[hsl(var(--color-text-secondary))]">
          {hangout.attendees.length} {hangout.attendees.length === 1 ? 'person' : 'people'}
        </span>
      </div>
    </div>
  );
}
