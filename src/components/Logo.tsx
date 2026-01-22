interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export function Logo({ size = 'md', showText = true, className = '' }: LogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-5xl'
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`${sizeClasses[size]} rounded-2xl bg-gradient-to-br from-[hsl(var(--color-primary))] to-[hsl(var(--color-secondary))] flex items-center justify-center shadow-lg relative overflow-hidden`}>
        {/* Abstract "O" shape representing connection and coordination */}
        <svg viewBox="0 0 100 100" className="w-3/4 h-3/4">
          {/* Outer ring */}
          <circle
            cx="50"
            cy="50"
            r="35"
            fill="none"
            stroke="white"
            strokeWidth="8"
            opacity="0.9"
          />
          {/* Inner dots representing friend group */}
          <circle cx="50" cy="30" r="5" fill="white" opacity="0.95" />
          <circle cx="65" cy="45" r="5" fill="white" opacity="0.85" />
          <circle cx="50" cy="60" r="5" fill="white" opacity="0.95" />
          <circle cx="35" cy="45" r="5" fill="white" opacity="0.85" />
          {/* Center connection point */}
          <circle cx="50" cy="47" r="3" fill="white" opacity="0.7" />
        </svg>
      </div>
      {showText && (
        <span className={`font-bold ${textSizeClasses[size]} text-[hsl(var(--color-text))]`}>
          Odon
        </span>
      )}
    </div>
  );
}
