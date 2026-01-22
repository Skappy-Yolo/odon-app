import { useState } from 'react';
import { motion } from 'motion/react';
import { User, Camera, Loader2, Calendar, Chrome, Mail, Check } from 'lucide-react';
import { Button } from '../components/Button';
import { useAuth } from '../lib/AuthContext';

interface ProfileSetupScreenProps {
  onComplete: () => void;
}

export function ProfileSetupScreen({ onComplete }: ProfileSetupScreenProps) {
  const { user, profile, updateProfile, completeOnboarding, signInWithGoogle } = useAuth();
  const [name, setName] = useState(profile?.name || user?.user_metadata?.full_name || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'name' | 'calendar'>('name');
  const [connectedCalendars, setConnectedCalendars] = useState<string[]>([]);

  const handleNameSubmit = async () => {
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await updateProfile({ name: name.trim() });
      setStep('calendar');
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    }

    setIsLoading(false);
  };

  const handleConnectGoogle = async () => {
    try {
      await signInWithGoogle();
      // After OAuth redirect, calendar will be connected
    } catch (error) {
      console.error('Failed to connect Google Calendar:', error);
    }
  };

  const handleConnectOutlook = () => {
    const clientId = import.meta.env.VITE_MICROSOFT_CLIENT_ID;
    const redirectUri = encodeURIComponent(window.location.origin + '/auth/microsoft/callback');
    const scopes = encodeURIComponent('User.Read Calendars.Read Calendars.ReadWrite offline_access');
    window.location.href = 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=' + clientId + '&response_type=code&redirect_uri=' + redirectUri + '&scope=' + scopes;
  };

  const handleFinish = async () => {
    setIsLoading(true);
    try {
      await completeOnboarding();
      onComplete();
    } catch (err: any) {
      setError(err.message || 'Failed to complete setup');
      setIsLoading(false);
    }
  };

  // Calendar connection step
  if (step === 'calendar') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[hsl(var(--color-background))] to-white flex flex-col p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full"
        >
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[hsl(var(--color-primary)/.2)] to-[hsl(var(--color-secondary)/.2)] flex items-center justify-center mx-auto mb-6">
            <Calendar className="w-12 h-12 text-[hsl(var(--color-primary))]" />
          </div>

          <h1 className="text-center mb-3">Connect your calendar</h1>
          <p className="text-center text-[hsl(var(--color-text-secondary))] mb-8">
            This helps us find the best times for your friend group to meet up.
          </p>

          {error && (
            <div className="mb-4 p-3 bg-[hsl(var(--color-error)/.1)] border border-[hsl(var(--color-error)/.3)] rounded-xl text-[hsl(var(--color-error))] text-sm text-center">
              {error}
            </div>
          )}

          <div className="space-y-3 mb-8">
            <button 
              onClick={handleConnectGoogle}
              className="w-full bg-white rounded-2xl p-4 border-2 border-[hsl(var(--color-border))] hover:border-[hsl(var(--color-primary))] transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <Chrome className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <h4 className="font-medium text-[hsl(var(--color-text))]">Google Calendar</h4>
                  <p className="text-sm text-[hsl(var(--color-text-secondary))]">Most popular</p>
                </div>
              </div>
              {connectedCalendars.includes('google') ? (
                <Check className="w-5 h-5 text-[hsl(var(--color-success))]" />
              ) : (
                <span className="text-sm text-[hsl(var(--color-primary))] font-medium">Connect</span>
              )}
            </button>

            <button 
              onClick={handleConnectOutlook}
              className="w-full bg-white rounded-2xl p-4 border-2 border-[hsl(var(--color-border))] hover:border-[hsl(var(--color-primary))] transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <h4 className="font-medium text-[hsl(var(--color-text))]">Outlook Calendar</h4>
                  <p className="text-sm text-[hsl(var(--color-text-secondary))]">Microsoft 365</p>
                </div>
              </div>
              {connectedCalendars.includes('microsoft') ? (
                <Check className="w-5 h-5 text-[hsl(var(--color-success))]" />
              ) : (
                <span className="text-sm text-[hsl(var(--color-primary))] font-medium">Connect</span>
              )}
            </button>
          </div>

          {/* Privacy note */}
          <div className="bg-[hsl(var(--color-border)/.3)] rounded-xl p-4 mb-8">
            <p className="text-sm text-[hsl(var(--color-text-secondary))] text-center">
              🔒 We only see when you're free or busy, never your event details.
            </p>
          </div>
        </motion.div>

        <div className="max-w-md mx-auto w-full space-y-3">
          <Button 
            onClick={handleFinish}
            disabled={isLoading}
            variant="primary" 
            fullWidth 
            size="lg"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : connectedCalendars.length > 0 ? (
              'Continue'
            ) : (
              'Skip for now'
            )}
          </Button>
        </div>
      </div>
    );
  }

  // Name entry step
  return (
    <div className="min-h-screen bg-gradient-to-b from-[hsl(var(--color-background))] to-white flex flex-col p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full"
      >
        {/* Avatar placeholder */}
        <div className="relative w-28 h-28 mx-auto mb-6">
          <div className="w-full h-full rounded-full bg-gradient-to-br from-[hsl(var(--color-primary)/.2)] to-[hsl(var(--color-secondary)/.2)] flex items-center justify-center">
            {profile?.avatar_url ? (
              <img 
                src={profile.avatar_url} 
                alt="" 
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <User className="w-14 h-14 text-[hsl(var(--color-primary))]" />
            )}
          </div>
          <button className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-[hsl(var(--color-primary))] text-white flex items-center justify-center shadow-lg">
            <Camera className="w-5 h-5" />
          </button>
        </div>

        <h1 className="text-center mb-3">What should we call you?</h1>
        <p className="text-center text-[hsl(var(--color-text-secondary))] mb-8">
          This is how your friends will see you in groups
        </p>

        {error && (
          <div className="mb-4 p-3 bg-[hsl(var(--color-error)/.1)] border border-[hsl(var(--color-error)/.3)] rounded-xl text-[hsl(var(--color-error))] text-sm text-center">
            {error}
          </div>
        )}

        <div className="space-y-4 mb-8">
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-4 text-lg text-center rounded-2xl border-2 border-[hsl(var(--color-border))] focus:border-[hsl(var(--color-primary))] outline-none transition-colors"
            autoFocus
          />
        </div>

        {/* Email display */}
        {user?.email && (
          <div className="text-center text-sm text-[hsl(var(--color-text-secondary))]">
            Signed in as <strong>{user.email}</strong>
          </div>
        )}
      </motion.div>

      <div className="max-w-md mx-auto w-full">
        <Button 
          onClick={handleNameSubmit}
          disabled={isLoading || !name.trim()}
          variant="primary" 
          fullWidth 
          size="lg"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            'Continue'
          )}
        </Button>
      </div>
    </div>
  );
}
