import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Users, Sparkles, Loader2, Copy, Check, Share2 } from 'lucide-react';
import { Button } from '../components/Button';
import { useAuth } from '../lib/AuthContext';
import { groupsApi } from '../lib/api';

interface CreateGroupScreenProps {
  onBack: () => void;
  onCreated: (group: any) => void;
}

// Suggested group names for inspiration
const groupNameSuggestions = [
  'The Crew',
  'Squad Goals',
  'Brunch Bunch',
  'Weekend Warriors',
  'The A-Team',
  'Friday Friends',
  'The Hangout Club',
];

export function CreateGroupScreen({ onBack, onCreated }: CreateGroupScreenProps) {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdGroup, setCreatedGroup] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) {
      setError('Please enter a group name');
      return;
    }

    if (!user) {
      setError('You must be signed in to create a group');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const group = await groupsApi.createGroup({
        name: name.trim(),
        description: description.trim() || undefined,
        created_by: user.id,
      });

      if (group) {
        setCreatedGroup(group);
      } else {
        setError('Failed to create group. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    }

    setIsLoading(false);
  };

  const handleCopyInvite = async () => {
    if (!createdGroup?.invite_code) return;
    
    const inviteUrl = `${window.location.origin}/join/${createdGroup.invite_code}`;
    
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = inviteUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = async () => {
    if (!createdGroup?.invite_code) return;
    
    const inviteUrl = `${window.location.origin}/join/${createdGroup.invite_code}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Join ${createdGroup.name} on Odon`,
          text: `Hey! Join our friend group "${createdGroup.name}" on Odon to coordinate hangouts.`,
          url: inviteUrl,
        });
      } catch {
        // User cancelled or share failed
      }
    } else {
      handleCopyInvite();
    }
  };

  // Success screen after group is created
  if (createdGroup) {
    const inviteUrl = `${window.location.origin}/join/${createdGroup.invite_code}`;
    
    return (
      <div className="min-h-screen bg-gradient-to-b from-[hsl(var(--color-background))] to-white flex flex-col p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full text-center"
        >
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[hsl(var(--color-success)/.2)] to-[hsl(var(--color-primary)/.2)] flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-12 h-12 text-[hsl(var(--color-success))]" />
          </div>
          
          <h1 className="mb-3">Group created! 🎉</h1>
          <p className="text-[hsl(var(--color-text-secondary))] mb-8">
            <strong>{createdGroup.name}</strong> is ready. Now invite your friends!
          </p>

          {/* Invite code display */}
          <div className="bg-white rounded-2xl p-6 border border-[hsl(var(--color-border))] mb-6">
            <p className="text-sm text-[hsl(var(--color-text-secondary))] mb-3">Invite code</p>
            <div className="text-4xl font-bold tracking-widest text-[hsl(var(--color-primary))] mb-4">
              {createdGroup.invite_code}
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleCopyInvite}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-[hsl(var(--color-border)/.3)] rounded-xl hover:bg-[hsl(var(--color-border)/.5)] transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-5 h-5 text-[hsl(var(--color-success))]" />
                    <span className="font-medium">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5" />
                    <span className="font-medium">Copy link</span>
                  </>
                )}
              </button>
              
              <button
                onClick={handleShare}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-[hsl(var(--color-primary))] text-white rounded-xl hover:opacity-90 transition-opacity"
              >
                <Share2 className="w-5 h-5" />
                <span className="font-medium">Share</span>
              </button>
            </div>
          </div>

          <p className="text-sm text-[hsl(var(--color-text-secondary))]">
            Share this code with friends so they can join your group
          </p>
        </motion.div>

        <div className="max-w-md mx-auto w-full">
          <Button 
            onClick={() => onCreated(createdGroup)} 
            variant="primary" 
            fullWidth 
            size="lg"
          >
            Go to group
          </Button>
        </div>
      </div>
    );
  }

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
        <h2 className="text-lg font-semibold">Create a group</h2>
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 p-6 max-w-md mx-auto w-full"
      >
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[hsl(var(--color-primary))] to-[hsl(var(--color-secondary))] flex items-center justify-center mx-auto mb-6">
          <Users className="w-10 h-10 text-white" />
        </div>

        {error && (
          <div className="mb-4 p-3 bg-[hsl(var(--color-error)/.1)] border border-[hsl(var(--color-error)/.3)] rounded-xl text-[hsl(var(--color-error))] text-sm text-center">
            {error}
          </div>
        )}

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-[hsl(var(--color-text))] mb-2">
              Group name *
            </label>
            <input
              type="text"
              placeholder="e.g., The Crew, Friday Friends"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-[hsl(var(--color-border))] focus:border-[hsl(var(--color-primary))] outline-none transition-colors"
              maxLength={50}
            />
          </div>

          {/* Suggestions */}
          <div className="flex flex-wrap gap-2">
            {groupNameSuggestions.slice(0, 4).map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => setName(suggestion)}
                className="px-3 py-1.5 bg-[hsl(var(--color-border)/.3)] rounded-full text-sm text-[hsl(var(--color-text-secondary))] hover:bg-[hsl(var(--color-border)/.5)] transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium text-[hsl(var(--color-text))] mb-2">
              Description <span className="text-[hsl(var(--color-text-secondary))] font-normal">(optional)</span>
            </label>
            <textarea
              placeholder="What's this group about?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-[hsl(var(--color-border))] focus:border-[hsl(var(--color-primary))] outline-none transition-colors resize-none"
              rows={3}
              maxLength={200}
            />
          </div>
        </div>
      </motion.div>

      {/* Footer */}
      <div className="p-6 max-w-md mx-auto w-full">
        <Button
          onClick={handleCreate}
          disabled={isLoading || !name.trim()}
          variant="primary"
          fullWidth
          size="lg"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            'Create group'
          )}
        </Button>
      </div>
    </div>
  );
}
