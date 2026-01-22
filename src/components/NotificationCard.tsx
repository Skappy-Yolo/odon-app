import { Bell, Calendar, CheckCircle, Users, MapPin } from 'lucide-react';

type NotificationType = 'check-in' | 'reminder' | 'match-found' | 'confirmed' | 'upcoming';

interface NotificationCardProps {
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  groupName?: string;
  groupEmoji?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function NotificationCard({ 
  type, 
  title, 
  message, 
  time, 
  groupName,
  groupEmoji,
  actionLabel,
  onAction 
}: NotificationCardProps) {
  const icons = {
    'check-in': Bell,
    'reminder': Calendar,
    'match-found': Users,
    'confirmed': CheckCircle,
    'upcoming': MapPin
  };
  
  const colors = {
    'check-in': 'bg-[hsl(var(--color-primary)/.1)] text-[hsl(var(--color-primary))]',
    'reminder': 'bg-[hsl(var(--color-secondary)/.15)] text-[hsl(var(--color-secondary-dark))]',
    'match-found': 'bg-[hsl(var(--color-accent)/.15)] text-[hsl(var(--color-accent))]',
    'confirmed': 'bg-[hsl(var(--color-success)/.15)] text-[hsl(var(--color-success))]',
    'upcoming': 'bg-[hsl(var(--color-primary)/.1)] text-[hsl(var(--color-primary))]'
  };
  
  const Icon = icons[type];
  
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-[hsl(var(--color-border))]">
      <div className="flex gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${colors[type]}`}>
          <Icon className="w-5 h-5" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-1">
            <h4 className="font-semibold text-[hsl(var(--color-text))]">{title}</h4>
            <span className="text-xs text-[hsl(var(--color-text-light))] ml-2">{time}</span>
          </div>
          
          {groupName && (
            <div className="flex items-center gap-1.5 mb-2">
              {groupEmoji && <span className="text-sm">{groupEmoji}</span>}
              <span className="text-sm text-[hsl(var(--color-text-secondary))]">{groupName}</span>
            </div>
          )}
          
          <p className="text-sm text-[hsl(var(--color-text-secondary))] mb-3">{message}</p>
          
          {actionLabel && onAction && (
            <button
              onClick={onAction}
              className="text-sm font-medium text-[hsl(var(--color-primary))] hover:underline"
            >
              {actionLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
