import { useState, useEffect } from 'react';
import { Loader2, RefreshCw, LogOut, AlertCircle } from 'lucide-react';
import { AuthProvider, useAuth } from './lib/AuthContext';
import { OnboardingScreen } from './screens/OnboardingScreen';
import { HomeScreen } from './screens/HomeScreen';
import { GroupScreen } from './screens/GroupScreen';
import { CheckInScreen } from './screens/CheckInScreen';
import { AvailabilityMatchScreen } from './screens/AvailabilityMatchScreen';
import { LocationPickerScreen } from './screens/LocationPickerScreen';
import { HangoutConfirmedScreen } from './screens/HangoutConfirmedScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { NotificationsScreen } from './screens/NotificationsScreen';
import { GroupSettingsScreen } from './screens/GroupSettingsScreen';
import { WelcomeScreen } from './screens/WelcomeScreen';
import { CreateGroupScreen } from './screens/CreateGroupScreen';
import { JoinGroupScreen } from './screens/JoinGroupScreen';
import { ProfileSetupScreen } from './screens/ProfileSetupScreen';
import { groupsApi } from './lib/api';

type Screen =
  | 'onboarding'
  | 'welcome'
  | 'profile-setup'
  | 'create-group'
  | 'join-group'
  | 'home'
  | 'group'
  | 'check-in'
  | 'availability-match'
  | 'location-picker'
  | 'hangout-confirmed'
  | 'settings'
  | 'notifications'
  | 'group-settings';

interface NavigationState {
  screen: Screen;
  data?: any;
}

// Loading screen component
function LoadingScreen() {
  const { retryInitialization, signOut, error } = useAuth();
  const [showRetry, setShowRetry] = useState(false);
  const [retrying, setRetrying] = useState(false);

  // Show retry button after 5 seconds of loading
  useEffect(() => {
    const timer = setTimeout(() => setShowRetry(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleRetry = async () => {
    setRetrying(true);
    try {
      await retryInitialization();
    } finally {
      setRetrying(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      window.location.reload();
    } catch (e) {
      // Force reload anyway
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[hsl(var(--color-background))] to-white flex items-center justify-center p-4">
      <div className="text-center max-w-sm">
        {error ? (
          <>
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-[hsl(var(--color-text-primary))] font-medium mb-2">Something went wrong</p>
            <p className="text-[hsl(var(--color-text-secondary))] text-sm mb-6">{error}</p>
          </>
        ) : (
          <>
            <Loader2 className="w-12 h-12 animate-spin text-[hsl(var(--color-primary))] mx-auto mb-4" />
            <p className="text-[hsl(var(--color-text-secondary))]">Loading...</p>
          </>
        )}
        
        {(showRetry || error) && (
          <div className="mt-6 space-y-3">
            <button
              onClick={handleRetry}
              disabled={retrying}
              className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-[hsl(var(--color-primary))] text-white rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {retrying ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <RefreshCw className="w-5 h-5" />
              )}
              {retrying ? 'Retrying...' : 'Try Again'}
            </button>
            
            <button
              onClick={handleSignOut}
              className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Sign Out & Start Fresh
            </button>
            
            <p className="text-xs text-[hsl(var(--color-text-secondary))] mt-4">
              If this keeps happening, try signing out and logging in again.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Main App Content (needs to be inside AuthProvider)
function AppContent() {
  const { user, profile, loading, isAuthenticated, needsOnboarding } = useAuth();
  const [navigationStack, setNavigationStack] = useState<NavigationState[]>([
    { screen: 'home' }
  ]);
  const [userGroups, setUserGroups] = useState<any[]>([]);
  const [loadingGroups, setLoadingGroups] = useState(true);
  const [inviteCode, setInviteCode] = useState<string | null>(null);

  // Check for invite code in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('invite') || params.get('code');
    if (code) {
      setInviteCode(code);
      // Clean URL without reload
      window.history.replaceState({}, '', window.location.pathname);
    }

    // Also check for /join/:code pattern
    const pathMatch = window.location.pathname.match(/\/join\/([A-Z0-9]+)/i);
    if (pathMatch) {
      setInviteCode(pathMatch[1]);
      window.history.replaceState({}, '', '/');
    }
  }, []);

  // Fetch user groups when authenticated
  useEffect(() => {
    async function fetchGroups() {
      if (isAuthenticated && user) {
        try {
          const groups = await groupsApi.getUserGroups(user.id);
          setUserGroups(groups || []);
        } catch (error) {
          console.error('Error fetching groups:', error);
          setUserGroups([]);
        }
        setLoadingGroups(false);
      }
    }

    if (isAuthenticated) {
      fetchGroups();
    } else {
      setLoadingGroups(false);
    }
  }, [isAuthenticated, user]);

  const currentNav = navigationStack[navigationStack.length - 1];

  const handleNavigate = (screen: Screen, data?: any) => {
    setNavigationStack(prev => [...prev, { screen, data }]);
  };

  const handleBack = () => {
    if (navigationStack.length > 1) {
      setNavigationStack(prev => prev.slice(0, -1));
    }
  };

  const handleOnboardingComplete = () => {
    // After onboarding, refresh to check profile/groups
    window.location.reload();
  };

  const handleProfileComplete = () => {
    // Check if there is an invite code
    if (inviteCode) {
      setNavigationStack([{ screen: 'join-group', data: { inviteCode } }]);
    } else if (userGroups.length === 0) {
      setNavigationStack([{ screen: 'welcome' }]);
    } else {
      setNavigationStack([{ screen: 'home' }]);
    }
  };

  const handleGroupCreated = (group: any) => {
    setUserGroups(prev => [...prev, group]);
    setNavigationStack([{ screen: 'group', data: group }]);
  };

  const handleGroupJoined = (group: any) => {
    setUserGroups(prev => [...prev, group]);
    setInviteCode(null);
    setNavigationStack([{ screen: 'group', data: group }]);
  };

  // Show loading while checking auth
  if (loading || (isAuthenticated && loadingGroups)) {
    return <LoadingScreen />;
  }

  // Not authenticated -> Show onboarding
  if (!isAuthenticated) {
    return <OnboardingScreen onComplete={handleOnboardingComplete} />;
  }

  // Authenticated but needs profile setup
  if (needsOnboarding) {
    return <ProfileSetupScreen onComplete={handleProfileComplete} />;
  }

  // Has invite code -> Go to join group
  if (inviteCode && currentNav.screen !== 'join-group') {
    return (
      <JoinGroupScreen
        inviteCode={inviteCode}
        onBack={() => {
          setInviteCode(null);
          setNavigationStack([{ screen: userGroups.length > 0 ? 'home' : 'welcome' }]);
        }}
        onJoined={handleGroupJoined}
      />
    );
  }

  // No groups -> Show welcome screen
  if (userGroups.length === 0 && currentNav.screen === 'home') {
    return (
      <WelcomeScreen
        onCreateGroup={() => handleNavigate('create-group')}
        onJoinGroup={() => handleNavigate('join-group')}
      />
    );
  }

  // Render current screen
  switch (currentNav.screen) {
    case 'welcome':
      return (
        <WelcomeScreen
          onCreateGroup={() => handleNavigate('create-group')}
          onJoinGroup={() => handleNavigate('join-group')}
        />
      );

    case 'create-group':
      return (
        <CreateGroupScreen
          onBack={handleBack}
          onCreated={handleGroupCreated}
        />
      );

    case 'join-group':
      return (
        <JoinGroupScreen
          inviteCode={currentNav.data?.inviteCode}
          onBack={handleBack}
          onJoined={handleGroupJoined}
        />
      );

    case 'home':
      return (
        <HomeScreen
          onNavigate={handleNavigate}
          hasGroups={userGroups.length > 0}
          groups={userGroups}
        />
      );

    case 'group':
      return (
        <GroupScreen
          group={currentNav.data}
          onBack={handleBack}
          onNavigate={handleNavigate}
        />
      );

    case 'check-in':
      return (
        <CheckInScreen
          group={currentNav.data}
          onBack={handleBack}
          onNavigate={handleNavigate}
        />
      );

    case 'availability-match':
      return (
        <AvailabilityMatchScreen
          onBack={handleBack}
          onNavigate={handleNavigate}
        />
      );

    case 'location-picker':
      return (
        <LocationPickerScreen
          match={currentNav.data?.match}
          onBack={handleBack}
          onNavigate={handleNavigate}
        />
      );

    case 'hangout-confirmed':
      return (
        <HangoutConfirmedScreen
          onNavigate={(screen) => {
            setNavigationStack([{ screen: screen as Screen }]);
          }}
        />
      );

    case 'settings':
      return <SettingsScreen onBack={handleBack} />;

    case 'notifications':
      return <NotificationsScreen onBack={handleBack} onNavigate={handleNavigate} />;

    case 'group-settings':
      return <GroupSettingsScreen group={currentNav.data} onBack={handleBack} />;

    default:
      return (
        <HomeScreen
          onNavigate={handleNavigate}
          hasGroups={userGroups.length > 0}
          groups={userGroups}
        />
      );
  }
}

// Root App component with AuthProvider
export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
