interface Avatar {
  id: string;
  name: string;
  image?: string;
  initials: string;
}

interface AvatarStackProps {
  avatars: Avatar[];
  max?: number;
  size?: 'sm' | 'md' | 'lg';
}

export function AvatarStack({ avatars, max = 5, size = 'md' }: AvatarStackProps) {
  const displayAvatars = avatars.slice(0, max);
  const remaining = Math.max(0, avatars.length - max);
  
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base'
  };
  
  const colors = [
    'bg-[#FF6B6B]',
    'bg-[#4ECDC4]',
    'bg-[#45B7D1]',
    'bg-[#FFA07A]',
    'bg-[#98D8C8]',
    'bg-[#F7DC6F]',
  ];
  
  return (
    <div className="flex -space-x-2">
      {displayAvatars.map((avatar, index) => (
        <div
          key={avatar.id}
          className={`${sizes[size]} rounded-full border-2 border-white ${colors[index % colors.length]} flex items-center justify-center text-white font-medium shadow-sm`}
          style={{ zIndex: displayAvatars.length - index }}
        >
          {avatar.image ? (
            <img src={avatar.image} alt={avatar.name} className="w-full h-full rounded-full object-cover" />
          ) : (
            <span>{avatar.initials}</span>
          )}
        </div>
      ))}
      {remaining > 0 && (
        <div
          className={`${sizes[size]} rounded-full border-2 border-white bg-[hsl(var(--color-text-light))] flex items-center justify-center text-white font-medium shadow-sm`}
          style={{ zIndex: 0 }}
        >
          <span>+{remaining}</span>
        </div>
      )}
    </div>
  );
}
