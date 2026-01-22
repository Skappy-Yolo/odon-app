import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useParams, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
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

// Simple loading screen
function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[hsl(var(--color-background))] to-white flex items-center justify-center p-4">
      <div className="text-center">
        <Loader2 className="w-12 h-12 animate-spin text-[hsl(var(--color-primary))] mx-auto mb-4" />
        <p className="text-[hsl(var(--color-text-secondary))]">Loading...</p>
      </div>
    </div>
  );
}

// Protected route wrapper - redirects to login if not authenticated
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    // Save the attempted URL for redirecting after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

// Home page wrapper - checks for groups and redirects appropriately
function HomePage() {
  const { user, isAuthenticated, needsOnboarding } = useAuth();
  const navigate = useNavigate();
  const [userGroups, setUserGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
      }
      setLoading(false);
    }
    fetchGroups();
  }, [isAuthenticated, user]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (needsOnboarding) {
    return <Navigate to="/profile-setup" replace />;
  }

  // No groups - show welcome screen
  if (userGroups.length === 0) {
    return (
      <WelcomeScreen
        onCreateGroup={() => navigate('/create-group')}
        onJoinGroup={() => navigate('/join-group')}
      />
    );
  }

  // Has groups - show home screen
  return (
    <HomeScreen
      onNavigate={(screen, data) => {
        switch (screen) {
          case 'group':
            navigate(`/group/${data?.id}`);
            break;
          case 'settings':
            navigate('/settings');
            break;
          case 'notifications':
            navigate('/notifications');
            break;
          case 'create-group':
            navigate('/create-group');
            break;
          case 'join-group':
            navigate('/join-group');
            break;
          default:
            navigate('/');
        }
      }}
      hasGroups={userGroups.length > 0}
      groups={userGroups}
    />
  );
}

// Create Group page wrapper
function CreateGroupPage() {
  const navigate = useNavigate();

  const handleCreated = (group: any) => {
    navigate(`/group/${group.id}`, { replace: true });
  };

  return (
    <CreateGroupScreen
      onBack={() => navigate(-1)}
      onCreated={handleCreated}
    />
  );
}

// Join Group page wrapper
function JoinGroupPage() {
  const navigate = useNavigate();
  const { code } = useParams();

  const handleJoined = (group: any) => {
    navigate(`/group/${group.id}`, { replace: true });
  };

  return (
    <JoinGroupScreen
      inviteCode={code}
      onBack={() => navigate(-1)}
      onJoined={handleJoined}
    />
  );
}

// Group page wrapper
function GroupPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [group, setGroup] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGroup() {
      if (id) {
        try {
          const groupData = await groupsApi.getGroup(id);
          setGroup(groupData);
        } catch (error) {
          console.error('Error fetching group:', error);
        }
      }
      setLoading(false);
    }
    fetchGroup();
  }, [id]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (!group) {
    return <Navigate to="/" replace />;
  }

  return (
    <GroupScreen
      group={group}
      onBack={() => navigate('/')}
      onNavigate={(screen, data) => {
        switch (screen) {
          case 'check-in':
            navigate(`/group/${id}/check-in`);
            break;
          case 'group-settings':
            navigate(`/group/${id}/settings`);
            break;
          default:
            navigate('/');
        }
      }}
    />
  );
}

// Check-in page wrapper
function CheckInPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [group, setGroup] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGroup() {
      if (id) {
        try {
          const groupData = await groupsApi.getGroup(id);
          setGroup(groupData);
        } catch (error) {
          console.error('Error fetching group:', error);
        }
      }
      setLoading(false);
    }
    fetchGroup();
  }, [id]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (!group) {
    return <Navigate to="/" replace />;
  }

  return (
    <CheckInScreen
      group={group}
      onBack={() => navigate(`/group/${id}`)}
      onNavigate={(screen, data) => {
        if (screen === 'availability-match') {
          navigate('/availability-match', { state: data });
        }
      }}
    />
  );
}

// Group Settings page wrapper
function GroupSettingsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [group, setGroup] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGroup() {
      if (id) {
        try {
          const groupData = await groupsApi.getGroup(id);
          setGroup(groupData);
        } catch (error) {
          console.error('Error fetching group:', error);
        }
      }
      setLoading(false);
    }
    fetchGroup();
  }, [id]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (!group) {
    return <Navigate to="/" replace />;
  }

  return (
    <GroupSettingsScreen
      group={group}
      onBack={() => navigate(`/group/${id}`)}
    />
  );
}

// Settings page wrapper
function SettingsPage() {
  const navigate = useNavigate();
  return <SettingsScreen onBack={() => navigate('/')} />;
}

// Notifications page wrapper
function NotificationsPage() {
  const navigate = useNavigate();
  return (
    <NotificationsScreen
      onBack={() => navigate('/')}
      onNavigate={(screen, data) => {
        if (screen === 'group' && data?.id) {
          navigate(`/group/${data.id}`);
        }
      }}
    />
  );
}

// Profile setup page wrapper
function ProfileSetupPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  return (
    <ProfileSetupScreen
      onComplete={() => {
        // Go back to where they were trying to go, or home
        const from = (location.state as any)?.from?.pathname || '/';
        navigate(from, { replace: true });
      }}
    />
  );
}

// Availability match page wrapper
function AvailabilityMatchPage() {
  const navigate = useNavigate();
  
  return (
    <AvailabilityMatchScreen
      onBack={() => navigate(-1)}
      onNavigate={(screen, data) => {
        if (screen === 'location-picker') {
          navigate('/location-picker', { state: data });
        }
      }}
    />
  );
}

// Location picker page wrapper
function LocationPickerPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  return (
    <LocationPickerScreen
      match={(location.state as any)?.match}
      onBack={() => navigate(-1)}
      onNavigate={(screen) => {
        if (screen === 'hangout-confirmed') {
          navigate('/hangout-confirmed');
        }
      }}
    />
  );
}

// Hangout confirmed page wrapper
function HangoutConfirmedPage() {
  const navigate = useNavigate();
  
  return (
    <HangoutConfirmedScreen
      onNavigate={() => {
        navigate('/');
      }}
    />
  );
}

// Login/Onboarding page
function LoginPage() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (isAuthenticated) {
    // Redirect to where they were trying to go, or home
    const from = (location.state as any)?.from?.pathname || '/';
    return <Navigate to={from} replace />;
  }

  return (
    <OnboardingScreen
      onComplete={() => {
        // Will be handled by the auth state change
        window.location.href = '/';
      }}
    />
  );
}

// Auth callback handler
function AuthCallbackPage() {
  const { isAuthenticated, loading } = useAuth();
  
  useEffect(() => {
    // Give time for auth to process, then redirect
    const timer = setTimeout(() => {
      window.location.href = '/';
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!loading && isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <LoadingScreen />;
}

// Main App Routes
function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/auth/callback" element={<AuthCallbackPage />} />
      
      {/* Protected routes */}
      <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
      <Route path="/profile-setup" element={<ProtectedRoute><ProfileSetupPage /></ProtectedRoute>} />
      <Route path="/create-group" element={<ProtectedRoute><CreateGroupPage /></ProtectedRoute>} />
      <Route path="/join-group" element={<ProtectedRoute><JoinGroupPage /></ProtectedRoute>} />
      <Route path="/join-group/:code" element={<ProtectedRoute><JoinGroupPage /></ProtectedRoute>} />
      <Route path="/join/:code" element={<ProtectedRoute><JoinGroupPage /></ProtectedRoute>} />
      <Route path="/group/:id" element={<ProtectedRoute><GroupPage /></ProtectedRoute>} />
      <Route path="/group/:id/check-in" element={<ProtectedRoute><CheckInPage /></ProtectedRoute>} />
      <Route path="/group/:id/settings" element={<ProtectedRoute><GroupSettingsPage /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
      <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
      <Route path="/availability-match" element={<ProtectedRoute><AvailabilityMatchPage /></ProtectedRoute>} />
      <Route path="/location-picker" element={<ProtectedRoute><LocationPickerPage /></ProtectedRoute>} />
      <Route path="/hangout-confirmed" element={<ProtectedRoute><HangoutConfirmedPage /></ProtectedRoute>} />
      
      {/* Catch all - redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

// Root App component
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
