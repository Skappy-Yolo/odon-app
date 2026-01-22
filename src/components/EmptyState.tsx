import { LucideIcon } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon: Icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center px-6 py-12">
      <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[hsl(var(--color-primary)/.15)] to-[hsl(var(--color-secondary)/.15)] flex items-center justify-center mb-4">
        <Icon className="w-10 h-10 text-[hsl(var(--color-primary))]" />
      </div>
      <h3 className="font-semibold text-[hsl(var(--color-text))] mb-2">{title}</h3>
      <p className="text-sm text-[hsl(var(--color-text-secondary))] mb-6 max-w-xs">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="primary">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
