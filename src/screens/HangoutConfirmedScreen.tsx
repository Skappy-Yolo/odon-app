import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, MapPin, Share2, Home, CheckCircle } from 'lucide-react';
import { Button } from '../components/Button';
import { AvatarStack } from '../components/AvatarStack';

interface HangoutConfirmedScreenProps {
  onNavigate: (screen: string) => void;
}

export function HangoutConfirmedScreen({ onNavigate }: HangoutConfirmedScreenProps) {
  const [showPWAPrompt, setShowPWAPrompt] = useState(false);

  useEffect(() => {
    // Simulate checking if PWA is not installed
    const timer = setTimeout(() => {
      setShowPWAPrompt(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const attendees = [
    { id: '1', name: 'Alex', initials: 'AC' },
    { id: '2', name: 'Sam', initials: 'SR' },
    { id: '3', name: 'Jordan', initials: 'JP' },
    { id: '4', name: 'Casey', initials: 'CK' }
  ];

  const confetti = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 0.5,
    duration: 1 + Math.random() * 1,
    rotation: Math.random() * 360
  }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-[hsl(var(--color-background))] to-white overflow-hidden relative">
      {/* Confetti */}
      {confetti.map((particle) => (
        <motion.div
          key={particle.id}
          initial={{ y: -20, x: `${particle.x}vw`, opacity: 1, rotate: 0 }}
          animate={{ 
            y: '100vh', 
            rotate: particle.rotation,
            opacity: 0 
          }}
          transition={{ 
            duration: particle.duration,
            delay: particle.delay,
            ease: 'linear'
          }}
          className="absolute w-2 h-2 rounded-full"
          style={{
            background: `hsl(${Math.random() * 360}, 70%, 60%)`
          }}
        />
      ))}

      <div className="max-w-md mx-auto px-6 py-12 relative z-10">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
          className="w-32 h-32 rounded-full bg-gradient-to-br from-[hsl(var(--color-success)/.2)] to-[hsl(var(--color-success)/.3)] flex items-center justify-center mx-auto mb-8"
        >
          <CheckCircle className="w-16 h-16 text-[hsl(var(--color-success))]" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center mb-8"
        >
          <h1 className="mb-3">Hangout confirmed! 🎉</h1>
          <p className="text-[hsl(var(--color-text-secondary))]">
            Your event has been added to everyone's calendar
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-3xl p-6 border-2 border-[hsl(var(--color-success)/.3)] mb-6 shadow-lg"
        >
          <div className="flex items-start gap-3 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[hsl(var(--color-primary)/.2)] to-[hsl(var(--color-secondary)/.2)] flex items-center justify-center text-4xl flex-shrink-0">
              🎓
            </div>
            <div>
              <h3 className="mb-1">College Squad Hangout</h3>
              <div className="flex items-center gap-2">
                <AvatarStack avatars={attendees} max={4} size="sm" />
                <span className="text-sm text-[hsl(var(--color-text-secondary))]">
                  {attendees.length} people
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-[hsl(var(--color-background))]">
              <Calendar className="w-5 h-5 text-[hsl(var(--color-primary))] flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-[hsl(var(--color-text))]">Saturday, January 25</p>
                <p className="text-sm text-[hsl(var(--color-text-secondary))]">This weekend</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-[hsl(var(--color-background))]">
              <Clock className="w-5 h-5 text-[hsl(var(--color-primary))] flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-[hsl(var(--color-text))]">7:00 PM - 10:00 PM</p>
                <p className="text-sm text-[hsl(var(--color-text-secondary))]">3 hours</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-[hsl(var(--color-background))]">
              <MapPin className="w-5 h-5 text-[hsl(var(--color-primary))] flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-[hsl(var(--color-text))]">The Green Cafe</p>
                <p className="text-sm text-[hsl(var(--color-text-secondary))]">123 Main St</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="space-y-3 mb-6"
        >
          <Button variant="outline" fullWidth className="flex items-center justify-center gap-2">
            <Share2 className="w-5 h-5" />
            Share with friends
          </Button>
          <Button 
            onClick={() => onNavigate('home')} 
            variant="primary" 
            fullWidth 
            className="flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Back to home
          </Button>
        </motion.div>

        {showPWAPrompt && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-[hsl(var(--color-primary)/.1)] to-[hsl(var(--color-secondary)/.1)] rounded-2xl p-4 border border-[hsl(var(--color-primary)/.2)]"
          >
            <h4 className="font-semibold text-[hsl(var(--color-text))] mb-2">
              💡 Add Odon to your home screen
            </h4>
            <p className="text-sm text-[hsl(var(--color-text-secondary))] mb-3">
              Get instant notifications for check-ins and never miss a hangout!
            </p>
            <div className="flex gap-2">
              <Button variant="primary" size="sm" className="flex-1">
                Add to home screen
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowPWAPrompt(false)}
              >
                Not now
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
