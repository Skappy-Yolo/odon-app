import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, Calendar, Shield, Mail, Chrome, Loader2, Check, ArrowLeft } from 'lucide-react';
import { Button } from '../components/Button';
import { Logo } from '../components/Logo';
import { useAuth } from '../lib/AuthContext';

const slides = [
  {
    title: "Never miss a hangout again",
    description: "Odon finds the perfect time for your friend group to meet up, automatically.",
    emoji: "👋",
    gradient: "from-[hsl(var(--color-primary)/.2)] to-[hsl(var(--color-secondary)/.2)]"
  },
  {
    title: "Weekly check-ins made easy",
    description: "Get a quick notification, tap your free times, and we'll handle the rest.",
    emoji: "✨",
    gradient: "from-[hsl(var(--color-accent)/.2)] to-[hsl(var(--color-primary)/.2)]"
  },
  {
    title: "AI-powered coordination",
    description: "We analyze calendars and suggest the best times and places for everyone.",
    emoji: "🎯",
    gradient: "from-[hsl(var(--color-secondary)/.2)] to-[hsl(var(--color-accent)/.2)]"
  }
];

interface OnboardingScreenProps {
  onComplete: () => void;
}

// Privacy Footer Component - shown on all auth screens
function PrivacyFooter() {
  return (
    <div className="text-center py-4 border-t border-[hsl(var(--color-border)/.5)]">
      <a 
        href="/privacy.html" 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-xs text-[hsl(var(--color-text-secondary))] hover:text-[hsl(var(--color-primary))] transition-colors"
      >
        Privacy Policy
      </a>
      <span className="text-xs text-[hsl(var(--color-text-light))] mx-2">|</span>
      <a 
        href="/privacy.html" 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-xs text-[hsl(var(--color-text-secondary))] hover:text-[hsl(var(--color-primary))] transition-colors"
      >
        Terms of Service
      </a>
    </div>
  );
}

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [step, setStep] = useState(0);
  const [showSignUp, setShowSignUp] = useState(false);
  const [showCalendarConnect, setShowCalendarConnect] = useState(false);
  const [showPermissions, setShowPermissions] = useState(false);

  // Auth state
  const { signInWithGoogle, signInWithMagicLink, signUp, signIn, resetPassword } = useAuth();
  const [authMode, setAuthMode] = useState<'signup' | 'signin'>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [useMagicLink, setUseMagicLink] = useState(true);

  // Forgot password state
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetLinkSent, setResetLinkSent] = useState(false);

  // Calendar connection state
  const [connectedCalendars, setConnectedCalendars] = useState<string[]>([]);

  // Handle Google Sign In
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setAuthError(null);
    try {
      await signInWithGoogle();
      // Redirect will happen automatically
    } catch (error: any) {
      setAuthError(error.message || 'Failed to sign in with Google');
      setIsLoading(false);
    }
  };

  // Handle Magic Link
  const handleMagicLink = async () => {
    if (!email) {
      setAuthError('Please enter your email address');
      return;
    }

    setIsLoading(true);
    setAuthError(null);

    const result = await signInWithMagicLink(email);

    if (result.success) {
      setMagicLinkSent(true);
    } else {
      setAuthError(result.message);
    }

    setIsLoading(false);
  };

  // Handle Email/Password Auth
  const handleEmailAuth = async () => {
    if (!email || !password) {
      setAuthError('Please fill in all fields');
      return;
    }

    if (authMode === 'signup' && !name) {
      setAuthError('Please enter your name');
      return;
    }

    setIsLoading(true);
    setAuthError(null);

    try {
      if (authMode === 'signup') {
        const result = await signUp(email, password, name);
        if (!result.success) {
          setAuthError(result.error || 'Failed to create account');
        } else {
          // Show success message or continue
          setMagicLinkSent(true); // Use same confirmation screen
        }
      } else {
        const result = await signIn(email, password);
        if (!result.success) {
          setAuthError(result.error || 'Invalid email or password');
        }
        // If successful, auth state change will handle navigation
      }
    } catch (error: any) {
      setAuthError(error.message || 'An error occurred');
    }

    setIsLoading(false);
  };

  // Handle Forgot Password
  const handleForgotPassword = async () => {
    if (!email) {
      setAuthError('Please enter your email address');
      return;
    }

    setIsLoading(true);
    setAuthError(null);

    const result = await resetPassword(email);

    if (result.success) {
      setResetLinkSent(true);
    } else {
      setAuthError(result.message);
    }

    setIsLoading(false);
  };

  // Back to sign in from forgot password
  const handleBackToSignIn = () => {
    setShowForgotPassword(false);
    setResetLinkSent(false);
    setAuthError(null);
  };

  // Handle calendar connections
  const handleConnectGoogle = async () => {
    // This would trigger Google Calendar OAuth
    // For now, simulate connection
    if (!connectedCalendars.includes('google')) {
      setConnectedCalendars([...connectedCalendars, 'google']);
    }
  };

  const handleConnectOutlook = async () => {
    // This would trigger Microsoft OAuth
    // For now, simulate connection
    if (!connectedCalendars.includes('microsoft')) {
      setConnectedCalendars([...connectedCalendars, 'microsoft']);
    }
  };

  // Permissions screen
  if (showPermissions) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[hsl(var(--color-background))] to-white flex flex-col p-6">
        {/* Back button */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => setShowPermissions(false)}
          className="flex items-center gap-2 text-[hsl(var(--color-text-secondary))] hover:text-[hsl(var(--color-text))] transition-colors mb-4 self-start"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full"
        >
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[hsl(var(--color-primary)/.2)] to-[hsl(var(--color-secondary)/.2)] flex items-center justify-center text-5xl mb-6 mx-auto">
            <Shield className="w-12 h-12 text-[hsl(var(--color-primary))]" />
          </div>

          <h1 className="text-center mb-3">We respect your privacy</h1>
          <p className="text-center text-[hsl(var(--color-text-secondary))] mb-8">
            We only access your calendar to find free times. We never read event details or share your data.
          </p>

          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-3 p-4 bg-white rounded-xl border border-[hsl(var(--color-border))]">
              <Check className="w-5 h-5 text-[hsl(var(--color-success))] mt-0.5" />
              <div>
                <h4 className="font-medium text-[hsl(var(--color-text))]">Free/busy times only</h4>
                <p className="text-sm text-[hsl(var(--color-text-secondary))]">We only see when you're free, not what you're doing</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-white rounded-xl border border-[hsl(var(--color-border))]">
              <Check className="w-5 h-5 text-[hsl(var(--color-success))] mt-0.5" />
              <div>
                <h4 className="font-medium text-[hsl(var(--color-text))]">Encrypted & secure</h4>
                <p className="text-sm text-[hsl(var(--color-text-secondary))]">Your data is encrypted and never sold</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-white rounded-xl border border-[hsl(var(--color-border))]">
              <Check className="w-5 h-5 text-[hsl(var(--color-success))] mt-0.5" />
              <div>
                <h4 className="font-medium text-[hsl(var(--color-text))]">Disconnect anytime</h4>
                <p className="text-sm text-[hsl(var(--color-text-secondary))]">You can remove calendar access whenever you want</p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="max-w-md mx-auto w-full space-y-3">
          <Button onClick={onComplete} variant="primary" fullWidth size="lg">
            I understand, continue
          </Button>
        </div>
        <PrivacyFooter />
      </div>
    );
  }

  // Calendar connection screen
  if (showCalendarConnect) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[hsl(var(--color-background))] to-white flex flex-col p-6">
        {/* Back button */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => setShowCalendarConnect(false)}
          className="flex items-center gap-2 text-[hsl(var(--color-text-secondary))] hover:text-[hsl(var(--color-text))] transition-colors mb-4 self-start"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full"
        >
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[hsl(var(--color-primary)/.2)] to-[hsl(var(--color-secondary)/.2)] flex items-center justify-center text-5xl mb-6 mx-auto">
            <Calendar className="w-12 h-12 text-[hsl(var(--color-primary))]" />
          </div>

          <h1 className="text-center mb-3">Connect your calendar</h1>
          <p className="text-center text-[hsl(var(--color-text-secondary))] mb-8">
            We'll use your calendar to find times when you're free to hang out.
          </p>

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
                <ChevronRight className="w-5 h-5 text-[hsl(var(--color-text-light))] group-hover:text-[hsl(var(--color-primary))]" />
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
                <ChevronRight className="w-5 h-5 text-[hsl(var(--color-text-light))] group-hover:text-[hsl(var(--color-primary))]" />
              )}
            </button>

            <button
              onClick={() => alert('Apple Calendar coming soon! Use Google or Outlook for now.')}
              className="w-full bg-white rounded-2xl p-4 border-2 border-[hsl(var(--color-border))] hover:border-[hsl(var(--color-primary))] transition-all flex items-center justify-between group opacity-60"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <h4 className="font-medium text-[hsl(var(--color-text))]">Apple Calendar</h4>
                  <p className="text-sm text-[hsl(var(--color-text-secondary))]">Coming soon</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-[hsl(var(--color-text-light))] group-hover:text-[hsl(var(--color-primary))]" />
            </button>
          </div>
        </motion.div>

        <div className="max-w-md mx-auto w-full space-y-3">
          <Button onClick={() => setShowPermissions(true)} variant="primary" fullWidth size="lg">
            Continue
          </Button>
          <Button onClick={onComplete} variant="ghost" fullWidth>
            Skip for now
          </Button>
        </div>
        <PrivacyFooter />
      </div>
    );
  }

  // Forgot password screen
  if (showForgotPassword) {
    if (resetLinkSent) {
      return (
        <div className="min-h-screen bg-gradient-to-b from-[hsl(var(--color-background))] to-white flex flex-col p-6">
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={handleBackToSignIn}
            className="flex items-center gap-2 text-[hsl(var(--color-text-secondary))] hover:text-[hsl(var(--color-text))] transition-colors mb-4 self-start"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to sign in</span>
          </motion.button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full text-center"
          >
            <div className="text-6xl mb-6">✉️</div>
            <h1 className="mb-3">Check your email!</h1>
            <p className="text-[hsl(var(--color-text-secondary))] mb-8">
              We've sent a password reset link to <strong>{email}</strong>. Click the link to set a new password.
            </p>
            <p className="text-sm text-[hsl(var(--color-text-secondary))]">
              Didn't receive it?{' '}
              <button
                onClick={() => {
                  setResetLinkSent(false);
                  setTimeout(() => handleForgotPassword(), 100);
                }}
                className="text-[hsl(var(--color-primary))] font-medium"
              >
                Resend link
              </button>
            </p>
          </motion.div>

          <div className="max-w-md mx-auto w-full">
            <Button onClick={handleBackToSignIn} variant="primary" fullWidth size="lg">
              Back to sign in
            </Button>
          </div>
          <PrivacyFooter />
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-b from-[hsl(var(--color-background))] to-white flex flex-col p-6">
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={handleBackToSignIn}
          className="flex items-center gap-2 text-[hsl(var(--color-text-secondary))] hover:text-[hsl(var(--color-text))] transition-colors mb-4 self-start"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to sign in</span>
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full"
        >
          <div className="text-5xl mb-6 text-center">🔑</div>
          <h1 className="text-center mb-3">Reset your password</h1>
          <p className="text-center text-[hsl(var(--color-text-secondary))] mb-8">
            Enter your email address and we'll send you a link to reset your password.
          </p>

          {authError && (
            <div className="mb-4 p-3 bg-[hsl(var(--color-error)/.1)] border border-[hsl(var(--color-error)/.3)] rounded-xl text-[hsl(var(--color-error))] text-sm text-center">
              {authError}
            </div>
          )}

          <div className="space-y-3 mb-8">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-[hsl(var(--color-border))] focus:border-[hsl(var(--color-primary))] outline-none transition-colors"
              autoFocus
            />
          </div>
        </motion.div>

        <div className="max-w-md mx-auto w-full space-y-3">
          <Button
            onClick={handleForgotPassword}
            disabled={isLoading || !email}
            variant="primary"
            fullWidth
            size="lg"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              'Send reset link'
            )}
          </Button>
          <Button onClick={handleBackToSignIn} variant="ghost" fullWidth>
            Cancel
          </Button>
        </div>
        <PrivacyFooter />
      </div>
    );
  }

  // Sign up / Sign in screen
  if (showSignUp) {
    if (magicLinkSent) {
      return (
        <div className="min-h-screen bg-gradient-to-b from-[hsl(var(--color-background))] to-white flex flex-col p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full text-center"
          >
            <div className="text-6xl mb-6">✉️</div>
            <h1 className="mb-3">Check your email!</h1>
            <p className="text-[hsl(var(--color-text-secondary))] mb-8">
              We've sent a sign-in link to <strong>{email}</strong>. Click the link to continue.
            </p>
            <p className="text-sm text-[hsl(var(--color-text-secondary))]">
              Didn't receive it?{' '}
              <button
                onClick={() => {
                  setMagicLinkSent(false);
                  handleMagicLink();
                }}
                className="text-[hsl(var(--color-primary))] font-medium"
              >
                Resend link
              </button>
            </p>
          </motion.div>

          <div className="max-w-md mx-auto w-full">
            <Button
              onClick={() => {
                setMagicLinkSent(false);
                setEmail('');
              }}
              variant="ghost"
              fullWidth
            >
              Use a different email
            </Button>
          </div>
          <PrivacyFooter />
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-b from-[hsl(var(--color-background))] to-white flex flex-col p-6">
        {/* Back button */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => setShowSignUp(false)}
          className="flex items-center gap-2 text-[hsl(var(--color-text-secondary))] hover:text-[hsl(var(--color-text))] transition-colors mb-4 self-start"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full"
        >
          <div className="text-5xl mb-6 text-center">👋</div>
          <h1 className="text-center mb-3">
            {authMode === 'signup' ? 'Create your account' : 'Welcome back'}
          </h1>
          <p className="text-center text-[hsl(var(--color-text-secondary))] mb-8">
            {authMode === 'signup'
              ? 'Join Odon and start coordinating with your friends'
              : 'Sign in to continue to Odon'
            }
          </p>

          {authError && (
            <div className="mb-4 p-3 bg-[hsl(var(--color-error)/.1)] border border-[hsl(var(--color-error)/.3)] rounded-xl text-[hsl(var(--color-error))] text-sm text-center">
              {authError}
            </div>
          )}

          <div className="space-y-3 mb-6">
            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full bg-white rounded-2xl p-4 border-2 border-[hsl(var(--color-border))] hover:border-[hsl(var(--color-primary))] transition-all flex items-center justify-center gap-3 shadow-sm disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Chrome className="w-5 h-5" />
                  <span className="font-medium">Continue with Google</span>
                </>
              )}
            </button>

            <button
              onClick={() => alert('Apple Sign-In coming soon! Use Google or email for now.')}
              className="w-full bg-black text-white rounded-2xl p-4 border-2 border-black hover:bg-gray-900 transition-all flex items-center justify-center gap-3 shadow-sm opacity-60"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              <span className="font-medium">Continue with Apple</span>
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded">Soon</span>
            </button>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-[hsl(var(--color-border))]" />
            <span className="text-sm text-[hsl(var(--color-text-secondary))]">or</span>
            <div className="flex-1 h-px bg-[hsl(var(--color-border))]" />
          </div>

          <div className="flex gap-2 mb-4 p-1 bg-[hsl(var(--color-border)/.3)] rounded-xl">
            <button
              onClick={() => setUseMagicLink(true)}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                useMagicLink
                  ? 'bg-[hsl(var(--color-primary))] text-white shadow-sm'
                  : 'text-[hsl(var(--color-text-secondary))]'
              }`}
            >
              Magic Link ✨
            </button>
            <button
              onClick={() => setUseMagicLink(false)}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                !useMagicLink
                  ? 'bg-[hsl(var(--color-primary))] text-white shadow-sm'
                  : 'text-[hsl(var(--color-text-secondary))]'
              }`}
            >
              Password
            </button>
          </div>

          <div className="space-y-3 mb-6">
            {authMode === 'signup' && !useMagicLink && (
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-[hsl(var(--color-border))] focus:border-[hsl(var(--color-primary))] outline-none transition-colors"
              />
            )}

            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-[hsl(var(--color-border))] focus:border-[hsl(var(--color-primary))] outline-none transition-colors"
            />

            {!useMagicLink && (
              <>
                <input
                  type="password"
                  placeholder={authMode === 'signup' ? 'Create a password' : 'Enter your password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-[hsl(var(--color-border))] focus:border-[hsl(var(--color-primary))] outline-none transition-colors"
                />
                {authMode === 'signin' && (
                  <button
                    onClick={() => {
                      setAuthError(null);
                      setShowForgotPassword(true);
                    }}
                    className="w-full text-right text-sm text-[hsl(var(--color-primary))] font-medium hover:underline"
                  >
                    Forgot password?
                  </button>
                )}
              </>
            )}
          </div>

          <p className="text-center text-sm text-[hsl(var(--color-text-secondary))] mb-4">
            {authMode === 'signup' ? (
              <>
                Already have an account?{' '}
                <button
                  onClick={() => setAuthMode('signin')}
                  className="text-[hsl(var(--color-primary))] font-medium"
                >
                  Sign in
                </button>
              </>
            ) : (
              <>
                Don't have an account?{' '}
                <button
                  onClick={() => setAuthMode('signup')}
                  className="text-[hsl(var(--color-primary))] font-medium"
                >
                  Sign up
                </button>
              </>
            )}
          </p>
        </motion.div>

        <div className="max-w-md mx-auto w-full space-y-3">
          <Button
            onClick={useMagicLink ? handleMagicLink : handleEmailAuth}
            disabled={isLoading}
            variant="primary"
            fullWidth
            size="lg"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : useMagicLink ? (
              'Send magic link'
            ) : authMode === 'signup' ? (
              'Create account'
            ) : (
              'Sign in'
            )}
          </Button>
          <p className="text-xs text-center text-[hsl(var(--color-text-secondary))]">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
        <PrivacyFooter />
      </div>
    );
  }

  // Intro slides
  return (
    <div className="min-h-screen bg-gradient-to-b from-[hsl(var(--color-background))] to-white flex flex-col p-6">
      {/* Back button - only show after first slide */}
      {step > 0 && (
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => setStep(step - 1)}
          className="flex items-center gap-2 text-[hsl(var(--color-text-secondary))] hover:text-[hsl(var(--color-text))] transition-colors mb-4 self-start"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </motion.button>
      )}

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={step === 0 ? "pt-4 pb-8" : "pb-8"}
      >
        <Logo size="lg" className="justify-center" />
      </motion.div>

      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="text-center"
          >
            <div className={`w-32 h-32 rounded-3xl bg-gradient-to-br ${slides[step].gradient} flex items-center justify-center text-7xl mb-8 mx-auto`}>
              {slides[step].emoji}
            </div>
            <h1 className="mb-4">{slides[step].title}</h1>
            <p className="text-lg text-[hsl(var(--color-text-secondary))] px-4">
              {slides[step].description}
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-center gap-2 mt-12">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all ${
                index === step
                  ? 'w-8 bg-[hsl(var(--color-primary))]'
                  : 'w-2 bg-[hsl(var(--color-border))]'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="max-w-md mx-auto w-full space-y-3">
        {step < slides.length - 1 ? (
          <>
            <Button onClick={() => setStep(step + 1)} variant="primary" fullWidth size="lg">
              Next
            </Button>
            <Button onClick={() => setStep(slides.length - 1)} variant="ghost" fullWidth>
              Skip
            </Button>
          </>
        ) : (
          <Button onClick={() => setShowSignUp(true)} variant="primary" fullWidth size="lg">
            Get started
          </Button>
        )}
      </div>
      <PrivacyFooter />
    </div>
  );
}
