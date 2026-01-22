export function LoadingSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-4 bg-[hsl(var(--color-border))] rounded w-3/4 mb-3" />
      <div className="h-4 bg-[hsl(var(--color-border))] rounded w-1/2" />
    </div>
  );
}

export function GroupCardSkeleton() {
  return (
    <div className="w-full bg-white rounded-2xl p-4 shadow-sm border border-[hsl(var(--color-border))] animate-pulse">
      <div className="flex items-start gap-3">
        <div className="w-14 h-14 rounded-2xl bg-[hsl(var(--color-border))] flex-shrink-0" />
        <div className="flex-1">
          <div className="h-5 bg-[hsl(var(--color-border))] rounded w-2/3 mb-2" />
          <div className="h-8 bg-[hsl(var(--color-border))] rounded w-1/2" />
        </div>
      </div>
    </div>
  );
}

export function HangoutCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-[hsl(var(--color-border))] animate-pulse">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-12 h-12 rounded-xl bg-[hsl(var(--color-border))] flex-shrink-0" />
        <div className="flex-1">
          <div className="h-5 bg-[hsl(var(--color-border))] rounded w-3/4 mb-2" />
          <div className="h-4 bg-[hsl(var(--color-border))] rounded w-1/2" />
        </div>
      </div>
      <div className="space-y-2 mb-3">
        <div className="h-4 bg-[hsl(var(--color-border))] rounded w-full" />
        <div className="h-4 bg-[hsl(var(--color-border))] rounded w-5/6" />
        <div className="h-4 bg-[hsl(var(--color-border))] rounded w-4/5" />
      </div>
    </div>
  );
}
