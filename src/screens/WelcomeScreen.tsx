import { motion } from 'motion/react';
import { Users, UserPlus, Sparkles } from 'lucide-react';
import { Button } from '../components/Button';
import { Logo } from '../components/Logo';
import { useAuth } from '../lib/AuthContext';

interface WelcomeScreenProps {
  onCreateGroup: () => void;
  onJoinGroup: () => void;
}

export function WelcomeScreen({ onCreateGroup, onJoinGroup }: WelcomeScreenProps) {
  const { profile } = useAuth();
  const firstName = profile?.name?.split(' ')[0] || 'there';

  return (
    <div className="min-h-screen bg-gradient-to-b from-[hsl(var(--color-background))] to-white flex flex-col p-6">
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="pt-4"
      >
        <Logo size="md" className="justify-center" />
      </motion.div>

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full"
      >
        {/* Welcome message */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[hsl(var(--color-primary)/.2)] to-[hsl(var(--color-secondary)/.2)] flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-12 h-12 text-[hsl(var(--color-primary))]" />
          </div>
          <h1 className="mb-3">Welcome, {firstName}! 🎉</h1>
          <p className="text-lg text-[hsl(var(--color-text-secondary))]">
            You're all set! Now let's get you connected with your friends.
          </p>
        </div>

        {/* Options */}
        <div className="space-y-4">
          <button
            onClick={onCreateGroup}
            className="w-full bg-white rounded-2xl p-5 border-2 border-[hsl(var(--color-border))] hover:border-[hsl(var(--color-primary))] transition-all flex items-start gap-4 text-left group"
          >
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[hsl(var(--color-primary))] to-[hsl(var(--color-secondary))] flex items-center justify-center flex-shrink-0">
              <Users className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-[hsl(var(--color-text))] mb-1 group-hover:text-[hsl(var(--color-primary))] transition-colors">
                Create a group
              </h3>
              <p className="text-sm text-[hsl(var(--color-text-secondary))]">
                Start a new friend group and invite others to join
              </p>
            </div>
          </button>

          <button
            onClick={onJoinGroup}
            className="w-full bg-white rounded-2xl p-5 border-2 border-[hsl(var(--color-border))] hover:border-[hsl(var(--color-primary))] transition-all flex items-start gap-4 text-left group"
          >
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[hsl(var(--color-accent))] to-[hsl(var(--color-primary))] flex items-center justify-center flex-shrink-0">
              <UserPlus className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-[hsl(var(--color-text))] mb-1 group-hover:text-[hsl(var(--color-primary))] transition-colors">
                Join a group
              </h3>
              <p className="text-sm text-[hsl(var(--color-text-secondary))]">
                Enter an invite code to join an existing group
              </p>
            </div>
          </button>
        </div>
      </motion.div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-center"
      >
        <p className="text-sm text-[hsl(var(--color-text-secondary))]">
          Tip: You can be part of multiple friend groups!
        </p>
      </motion.div>
    </div>
  );
}
