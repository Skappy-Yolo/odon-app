import { useState } from 'react';
import { ArrowLeft, Sparkles, MapPin, Video, ThumbsUp, Plus } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '../components/Button';

interface LocationPickerScreenProps {
  match?: any;
  onBack: () => void;
  onNavigate: (screen: string, data?: any) => void;
}

export function LocationPickerScreen({ match, onBack, onNavigate }: LocationPickerScreenProps) {
  const [selectedLocation, setSelectedLocation] = useState<string | null>('1');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const suggestions = [
    {
      id: '1',
      name: 'The Green Cafe',
      type: 'Coffee & Food',
      address: '123 Main St',
      distance: '0.5 mi from center',
      votes: 3,
      isAiPick: true,
      aiReason: 'Great vibe, central location, and your group went here last time'
    },
    {
      id: '2',
      name: 'Central Park',
      type: 'Outdoor',
      address: 'Park Ave entrance',
      distance: '0.8 mi from center',
      votes: 1,
      isAiPick: false
    },
    {
      id: '3',
      name: "Mario's Pizza",
      type: 'Restaurant',
      address: '456 Oak Street',
      distance: '1.2 mi from center',
      votes: 2,
      isAiPick: false
    },
    {
      id: 'virtual',
      name: 'Virtual Hangout',
      type: 'Video Call',
      address: 'Google Meet link',
      distance: null,
      votes: 0,
      isAiPick: false,
      isVirtual: true
    }
  ];

  const selectedLocationData = suggestions.find(l => l.id === selectedLocation);

  const handleConfirm = () => {
    onNavigate('hangout-confirmed', { 
      match, 
      location: selectedLocationData 
    });
  };

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
              <h2 className="text-xl mb-1">Where should we meet?</h2>
              <p className="text-sm text-[hsl(var(--color-text-secondary))]">
                Saturday, Jan 25 • 7:00 PM
              </p>
            </div>
          </div>
        </header>

        <div className="px-6 py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3 mb-4"
          >
            {suggestions.map((location, index) => (
              <motion.button
                key={location.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedLocation(location.id)}
                className={`w-full p-4 rounded-2xl border-2 transition-all relative ${
                  selectedLocation === location.id
                    ? 'border-[hsl(var(--color-primary))] bg-[hsl(var(--color-primary)/.05)]'
                    : 'border-[hsl(var(--color-border))] bg-white'
                }`}
              >
                {location.isAiPick && (
                  <div className="absolute top-3 right-3">
                    <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r from-[hsl(var(--color-primary))] to-[hsl(var(--color-secondary))] text-white text-xs font-medium">
                      <Sparkles className="w-3 h-3" />
                      <span>AI Pick</span>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    location.isVirtual 
                      ? 'bg-gradient-to-br from-purple-500/20 to-blue-500/20'
                      : 'bg-[hsl(var(--color-accent)/.2)]'
                  }`}>
                    {location.isVirtual ? (
                      <Video className="w-6 h-6 text-purple-600" />
                    ) : (
                      <MapPin className="w-6 h-6 text-[hsl(var(--color-accent))]" />
                    )}
                  </div>

                  <div className="flex-1 text-left">
                    <h4 className="font-semibold text-[hsl(var(--color-text))] mb-1">
                      {location.name}
                    </h4>
                    <p className="text-sm text-[hsl(var(--color-text-secondary))] mb-1">
                      {location.type} • {location.address}
                    </p>
                    {location.distance && (
                      <p className="text-xs text-[hsl(var(--color-text-light))]">
                        {location.distance}
                      </p>
                    )}
                    
                    {location.votes > 0 && (
                      <div className="flex items-center gap-1 mt-2">
                        <ThumbsUp className="w-3.5 h-3.5 text-[hsl(var(--color-primary))]" />
                        <span className="text-xs text-[hsl(var(--color-text-secondary))]">
                          {location.votes} {location.votes === 1 ? 'vote' : 'votes'}
                        </span>
                      </div>
                    )}
                  </div>

                  {selectedLocation === location.id && (
                    <div className="w-6 h-6 rounded-full bg-[hsl(var(--color-primary))] flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                  )}
                </div>

                {location.isAiPick && location.aiReason && (
                  <div className="mt-3 pt-3 border-t border-[hsl(var(--color-border))]">
                    <p className="text-xs text-[hsl(var(--color-text-secondary))] italic text-left">
                      {location.aiReason}
                    </p>
                  </div>
                )}
              </motion.button>
            ))}
          </motion.div>

          {!showCustomInput ? (
            <button
              onClick={() => setShowCustomInput(true)}
              className="w-full p-4 rounded-2xl border-2 border-dashed border-[hsl(var(--color-border))] bg-white hover:border-[hsl(var(--color-primary))] hover:bg-[hsl(var(--color-primary)/.05)] transition-all flex items-center justify-center gap-2 text-[hsl(var(--color-text-secondary))] hover:text-[hsl(var(--color-primary))]"
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium">Suggest your own location</span>
            </button>
          ) : (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-white rounded-2xl border-2 border-[hsl(var(--color-primary))] p-4"
            >
              <input
                type="text"
                placeholder="Enter location name..."
                className="w-full px-4 py-3 rounded-xl border-2 border-[hsl(var(--color-border))] focus:border-[hsl(var(--color-primary))] outline-none transition-colors mb-3"
                autoFocus
              />
              <div className="flex gap-2">
                <Button variant="primary" size="sm" className="flex-1">
                  Add location
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowCustomInput(false)}
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          )}
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[hsl(var(--color-border))] p-6 z-20">
          <div className="max-w-md mx-auto">
            <Button
              onClick={handleConfirm}
              variant="primary"
              fullWidth
              size="lg"
              disabled={!selectedLocation}
            >
              Confirm hangout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
