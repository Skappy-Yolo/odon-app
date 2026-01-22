import { useState } from 'react';
import { ArrowLeft, Sparkles, CheckCircle2, Calendar } from 'lucide-react';
import { motion } from 'motion/react';
import { TimeSlotSelector } from '../components/TimeSlotSelector';
import { Button } from '../components/Button';

interface CheckInScreenProps {
  group?: any;
  onBack: () => void;
  onNavigate: (screen: string, data?: any) => void;
}

export function CheckInScreen({ group, onBack, onNavigate }: CheckInScreenProps) {
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const mockSlots = [
    {
      id: '1',
      day: 'Thursday',
      date: 'Jan 23',
      startTime: '6:00 PM',
      endTime: '9:00 PM',
      duration: '3 hours'
    },
    {
      id: '2',
      day: 'Friday',
      date: 'Jan 24',
      startTime: '7:00 PM',
      endTime: '11:00 PM',
      duration: '4 hours'
    },
    {
      id: '3',
      day: 'Saturday',
      date: 'Jan 25',
      startTime: '2:00 PM',
      endTime: '6:00 PM',
      duration: '4 hours'
    },
    {
      id: '4',
      day: 'Saturday',
      date: 'Jan 25',
      startTime: '7:00 PM',
      endTime: '10:00 PM',
      duration: '3 hours'
    },
    {
      id: '5',
      day: 'Sunday',
      date: 'Jan 26',
      startTime: '11:00 AM',
      endTime: '3:00 PM',
      duration: '4 hours'
    },
    {
      id: '6',
      day: 'Sunday',
      date: 'Jan 26',
      startTime: '5:00 PM',
      endTime: '9:00 PM',
      duration: '4 hours'
    }
  ];

  const handleToggleSlot = (slotId: string) => {
    setSelectedSlots(prev =>
      prev.includes(slotId)
        ? prev.filter(id => id !== slotId)
        : [...prev, slotId]
    );
  };

  const handleSelectAll = () => {
    setSelectedSlots(mockSlots.map(slot => slot.id));
  };

  const handleSelectNone = () => {
    setSelectedSlots([]);
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => {
      onNavigate('availability-match', { group, selectedSlots });
    }, 2000);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[hsl(var(--color-background))] flex items-center justify-center p-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-sm"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-24 h-24 rounded-full bg-gradient-to-br from-[hsl(var(--color-success)/.2)] to-[hsl(var(--color-success)/.3)] flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle2 className="w-12 h-12 text-[hsl(var(--color-success))]" />
          </motion.div>
          <h2 className="mb-3">Availability submitted!</h2>
          <p className="text-[hsl(var(--color-text-secondary))]">
            We're checking with the rest of the group...
          </p>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
            className="h-1 bg-[hsl(var(--color-primary))] rounded-full mt-6"
          />
        </motion.div>
      </div>
    );
  }

  const respondedCount = 3;
  const totalCount = 5;
  const progress = (respondedCount / totalCount) * 100;

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

          <div className="flex items-start gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[hsl(var(--color-primary)/.2)] to-[hsl(var(--color-secondary)/.2)] flex items-center justify-center text-2xl flex-shrink-0">
              🎓
            </div>
            <div>
              <h2 className="text-xl mb-1">Weekly Check-in</h2>
              <p className="text-sm text-[hsl(var(--color-text-secondary))]">College Squad</p>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[hsl(var(--color-text-secondary))]">
                {respondedCount} of {totalCount} responded
              </span>
              <span className="text-sm font-medium text-[hsl(var(--color-primary))]">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="h-2 bg-[hsl(var(--color-border))] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-gradient-to-r from-[hsl(var(--color-primary))] to-[hsl(var(--color-secondary))]"
              />
            </div>
          </div>
        </header>

        <div className="px-6 py-6">
          <div className="bg-gradient-to-br from-[hsl(var(--color-primary)/.1)] to-[hsl(var(--color-secondary)/.1)] rounded-2xl p-4 border border-[hsl(var(--color-primary)/.2)] mb-6">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-[hsl(var(--color-primary))] flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-[hsl(var(--color-text))] mb-1">
                  We found these free times
                </h4>
                <p className="text-sm text-[hsl(var(--color-text-secondary))]">
                  Based on your calendar, here are times when you're available. Select all that work for you!
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-2 mb-4">
            <Button onClick={handleSelectAll} variant="outline" size="sm" className="flex-1">
              All work
            </Button>
            <Button onClick={handleSelectNone} variant="outline" size="sm" className="flex-1">
              None work
            </Button>
          </div>

          <TimeSlotSelector
            slots={mockSlots}
            selectedSlots={selectedSlots}
            onToggle={handleToggleSlot}
          />
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[hsl(var(--color-border))] p-6 z-20">
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-[hsl(var(--color-text-secondary))]">
                {selectedSlots.length} {selectedSlots.length === 1 ? 'slot' : 'slots'} selected
              </span>
              {selectedSlots.length > 0 && (
                <span className="text-sm text-[hsl(var(--color-success))]">
                  <CheckCircle2 className="w-4 h-4 inline mr-1" />
                  Ready to submit
                </span>
              )}
            </div>
            <Button
              onClick={handleSubmit}
              variant="primary"
              fullWidth
              size="lg"
              disabled={selectedSlots.length === 0}
            >
              Submit my availability
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
