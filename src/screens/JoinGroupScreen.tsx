import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, UserPlus, Loader2, Users, Check } from 'lucide-react';
import { Button } from '../components/Button';
import { useAuth } from '../lib/AuthContext';
import { groupsApi } from '../lib/api';

interface JoinGroupScreenProps {
  inviteCode?: string;
  onBack: () => void;
  onJoined: (group: any) => void;
}

export function JoinGroupScreen({ inviteCode: initialCode, onBack, onJoined }: JoinGroupScreenProps) {
  const { user } = useAuth();
  const [code, setCode] = useState(initialCode || '');
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [groupPreview, setGroupPreview] = useState<any>(null);

  // Auto-validate when code is complete (6 characters)
  useEffect(() => {
    if (code.length === 6) {
      validateCode(code);
    } else {
      setGroupPreview(null);
      setError(null);
    }
  }, [code]);

  const validateCode = async (inviteCode: string) => {
    setIsValidating(true);
    setError(null);
    
    try {
      const group = await groupsApi.getGroupByInviteCode(inviteCode.toUpperCase());
      if (group) {
        setGroupPreview(group);
      } else {
        setError('Invalid invite code. Please check and try again.');
      }
    } catch (err: any) {
      setError('Could not validate code. Please try again.');
    }
    
    setIsValidating(false);
  };

  const handleJoin = async () => {
    if (!groupPreview || !user) return;

    setIsLoading(true);
    setError(null);

    try {
      // Check if already a member
      const isMember = await groupsApi.isGroupMember(groupPreview.id, user.id);
      if (isMember) {
        // Already a member, just go to group
        onJoined(groupPreview);
        return;
      }

      // Join the group
      const success = await groupsApi.joinGroup(groupPreview.id, user.id);
      if (success) {
        onJoined(groupPreview);
      } else {
        setError('Failed to join group. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    }

    setIsLoading(false);
  };

  const handleCodeChange = (value: string) => {
    // Only allow alphanumeric characters and limit to 6
    const cleaned = value.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 6);
    setCode(cleaned);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[hsl(var(--color-background))] to-white flex flex-col">
      {/* Header */}
      <div className="p-4 flex items-center gap-3">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-white border border-[hsl(var(--color-border))] flex items-center justify-center hover:bg-[hsl(var(--color-background))] transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-semibold">Join a group</h2>
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 p-6 max-w-md mx-auto w-full"
      >
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[hsl(var(--color-accent))] to-[hsl(var(--color-primary))] flex items-center justify-center mx-auto mb-6">
          <UserPlus className="w-10 h-10 text-white" />
        </div>

        <div className="text-center mb-8">
          <h1 className="text-xl font-semibold mb-2">Enter invite code</h1>
          <p className="text-[hsl(var(--color-text-secondary))]">
            Ask your friend for the 6-character code
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-[hsl(var(--color-error)/.1)] border border-[hsl(var(--color-error)/.3)] rounded-xl text-[hsl(var(--color-error))] text-sm text-center">
            {error}
          </div>
        )}

        {/* Code input */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              value={code}
              onChange={(e) => handleCodeChange(e.target.value)}
              placeholder="ABC123"
              className="w-full px-6 py-4 text-center text-3xl font-bold tracking-[0.3em] rounded-2xl border-2 border-[hsl(var(--color-border))] focus:border-[hsl(var(--color-primary))] outline-none transition-colors uppercase"
              maxLength={6}
              autoComplete="off"
              autoFocus
            />
            {isValidating && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <Loader2 className="w-6 h-6 animate-spin text-[hsl(var(--color-primary))]" />
              </div>
            )}
            {groupPreview && !isValidating && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <Check className="w-6 h-6 text-[hsl(var(--color-success))]" />
              </div>
            )}
          </div>
        </div>

        {/* Group preview */}
        {groupPreview && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-5 border-2 border-[hsl(var(--color-success)/.3)] mb-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[hsl(var(--color-primary))] to-[hsl(var(--color-secondary))] flex items-center justify-center">
                <Users className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-[hsl(var(--color-text))]">{groupPreview.name}</h3>
                {groupPreview.description && (
                  <p className="text-sm text-[hsl(var(--color-text-secondary))] line-clamp-1">
                    {groupPreview.description}
                  </p>
                )}
                <p className="text-xs text-[hsl(var(--color-text-light))] mt-1">
                  {groupPreview.member_count || 1} member{(groupPreview.member_count || 1) !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Help text */}
        <div className="text-center">
          <p className="text-sm text-[hsl(var(--color-text-secondary))]">
            Don't have a code?{' '}
            <button 
              onClick={onBack}
              className="text-[hsl(var(--color-primary))] font-medium"
            >
              Create your own group
            </button>
          </p>
        </div>
      </motion.div>

      {/* Footer */}
      <div className="p-6 max-w-md mx-auto w-full">
        <Button
          onClick={handleJoin}
          disabled={isLoading || !groupPreview}
          variant="primary"
          fullWidth
          size="lg"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : groupPreview ? (
            `Join ${groupPreview.name}`
          ) : (
            'Enter code to join'
          )}
        </Button>
      </div>
    </div>
  );
}
