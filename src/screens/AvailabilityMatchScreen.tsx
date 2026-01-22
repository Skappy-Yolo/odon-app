import { useState } from 'react';
import { ArrowLeft, Sparkles, Users, ChevronRight, Calendar, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '../components/Button';
import { AvatarStack } from '../components/AvatarStack';

interface AvailabilityMatchScreenProps {
  onBack: () => void;
  onNavigate: (screen: string, data?: any) => void;
}

export function AvailabilityMatchScreen({ onBack, onNavigate }: AvailabilityMatchScreenProps) {
  const [selectedMatch, setSelectedMatch] = useState<string | null>('1');

  const matches = [
    {
      id: '1',
      day: 'Saturday',
      date: 'Jan 25',
      startTime: '7:00 PM',
      endTime: '10:00 PM',
      duration: '3 hours',
      attendees: [
        { id: '1', name: 'Alex', initials: 'AC' },
        { id: '2', name: 'Sam', initials: 'SR' },
        { id: '3', name: 'Jordan', initials: 'JP' },
        { id: '4', name: 'Casey', initials: 'CK' }
      ],
      isBestMatch: true,
      aiReason: 'Most people available and popular hangout time for your group'
    },
    {
      id: '2',
      day: 'Friday',
      date: 'Jan 24',
      startTime: '7:00 PM',
      endTime: '10:00 PM',
      duration: '3 hours',
      attendees: [
        { id: '1', name: 'Alex', initials: 'AC' },
        { id: '2', name: 'Sam', initials: 'SR' },
        { id: '5', name: 'Riley', initials: 'RM' }
      ],
      isBestMatch: false
    },
    {
      id: '3',
      day: 'Sunday',
      date: 'Jan 26',
      startTime: '11:00 AM',
      endTime: '2:00 PM',
      duration: '3 hours',
      attendees: [
        { id: '2', name: 'Sam', initials: 'SR' },
        { id: '3', name: 'Jordan', initials: 'JP' },
        { id: '4', name: 'Casey', initials: 'CK' }
      ],
      isBestMatch: false
    }
  ];

  const selectedMatchData = matches.find(m => m.id === selectedMatch);

  return (
    <div className="min-h-screen bg-[hsl(var(--color-background))] pb-32">
      <div className="max-w-md mx-auto">
        <header className="sticky top-0 bg-[hsl(var(--color-background))] z-10 px-6 py-4 border-b border-[hsl(var(--color-border))]">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={onBack}
              className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-[hsl(var(--color-border))] transition-colors -ml-2"
            >
              <ArrowLeft className="w-5 h-5 text-[hsl(var(--color-text))]" />
            </button>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[hsl(var(--color-primary)/.2)] to-[hsl(var(--color-secondary)/.2)] flex items-center justify-center text-2xl flex-shrink-0">
              🎓
            </div>
            <div>
              <h2 className="text-xl mb-1">Perfect! We found matches</h2>
              <p className="text-sm text-[hsl(var(--color-text-secondary))]">College Squad</p>
            </div>
          </div>
        </header>

        <div className="px-6 py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3 mb-6"
          >
            {matches.map((match, index) => (
              <motion.button
                key={match.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedMatch(match.id)}
                className={`w-full p-4 rounded-2xl border-2 transition-all relative overflow-hidden ${
                  selectedMatch === match.id
                    ? 'border-[hsl(var(--color-primary))] bg-[hsl(var(--color-primary)/.05)]'
                    : 'border-[hsl(var(--color-border))] bg-white'
                }`}
              >
                {match.isBestMatch && (
                  <div className="absolute top-3 right-3">
                    <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r from-[hsl(var(--color-primary))] to-[hsl(var(--color-secondary))] text-white text-xs font-medium">
                      <Sparkles className="w-3 h-3" />
                      <span>AI Pick</span>
                    </div>
                  </div>
                )}

                <div className="text-left mb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-[hsl(var(--color-text))]">{match.day}</span>
                    <span className="text-sm text-[hsl(var(--color-text-secondary))]">{match.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[hsl(var(--color-primary))]" />
                    <span className="text-sm text-[hsl(var(--color-text-secondary))]">
                      {match.startTime} - {match.endTime}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[hsl(var(--color-border))] text-[hsl(var(--color-text-secondary))]">
                      {match.duration}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AvatarStack avatars={match.attendees} max={4} size="sm" />
                    <span className="text-sm text-[hsl(var(--color-text-secondary))]">
                      {match.attendees.length} available
                    </span>
                  </div>
                  {selectedMatch === match.id && (
                    <div className="w-6 h-6 rounded-full bg-[hsl(var(--color-primary))] flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                  )}
                </div>

                {match.isBestMatch && match.aiReason && (
                  <div className="mt-3 pt-3 border-t border-[hsl(var(--color-border))]">
                    <p className="text-xs text-[hsl(var(--color-text-secondary))] italic">
                      {match.aiReason}
                    </p>
                  </div>
                )}
              </motion.button>
            ))}
          </motion.div>

          {selectedMatchData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-4 border border-[hsl(var(--color-border))]"
            >
              <h4 className="font-semibold text-[hsl(var(--color-text))] mb-3">Who's available?</h4>
              <div className="space-y-2">
                {selectedMatchData.attendees.map((attendee) => (
                  <div key={attendee.id} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[hsl(var(--color-primary)/.2)] flex items-center justify-center text-xs font-medium text-[hsl(var(--color-primary))]">
                      {attendee.initials}
                    </div>
                    <span className="text-sm text-[hsl(var(--color-text))]">{attendee.name}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[hsl(var(--color-border))] p-6 z-20">
          <div className="max-w-md mx-auto">
            <Button
              onClick={() => onNavigate('location-picker', { match: selectedMatchData })}
              variant="primary"
              fullWidth
              size="lg"
              disabled={!selectedMatch}
            >
              Continue with this time
              <ChevronRight className="w-5 h-5 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
