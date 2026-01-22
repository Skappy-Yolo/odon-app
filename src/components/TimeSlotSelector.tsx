import { useState } from 'react';
import { Check } from 'lucide-react';

interface TimeSlot {
  id: string;
  day: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: string;
}

interface TimeSlotSelectorProps {
  slots: TimeSlot[];
  selectedSlots: string[];
  onToggle: (slotId: string) => void;
}

export function TimeSlotSelector({ slots, selectedSlots, onToggle }: TimeSlotSelectorProps) {
  return (
    <div className="space-y-2">
      {slots.map((slot) => {
        const isSelected = selectedSlots.includes(slot.id);
        
        return (
          <button
            key={slot.id}
            onClick={() => onToggle(slot.id)}
            className={`w-full p-4 rounded-xl border-2 transition-all active:scale-98 ${
              isSelected 
                ? 'border-[hsl(var(--color-primary))] bg-[hsl(var(--color-primary)/.08)]' 
                : 'border-[hsl(var(--color-border))] bg-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-[hsl(var(--color-text))]">{slot.day}</span>
                  <span className="text-sm text-[hsl(var(--color-text-secondary))]">{slot.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[hsl(var(--color-text-secondary))]">
                    {slot.startTime} - {slot.endTime}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[hsl(var(--color-border))] text-[hsl(var(--color-text-secondary))]">
                    {slot.duration}
                  </span>
                </div>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                isSelected 
                  ? 'border-[hsl(var(--color-primary))] bg-[hsl(var(--color-primary))]' 
                  : 'border-[hsl(var(--color-border))]'
              }`}>
                {isSelected && <Check className="w-4 h-4 text-white" />}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
