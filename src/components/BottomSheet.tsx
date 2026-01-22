import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export function BottomSheet({ isOpen, onClose, title, children }: BottomSheetProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-40"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 max-h-[90vh] overflow-hidden"
          >
            <div className="sticky top-0 bg-white border-b border-[hsl(var(--color-border))] px-6 py-4">
              <div className="w-12 h-1 bg-[hsl(var(--color-border))] rounded-full mx-auto mb-4" />
              {title && (
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-[hsl(var(--color-text))]">{title}</h3>
                  <button
                    onClick={onClose}
                    className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[hsl(var(--color-border))] transition-colors"
                  >
                    <X className="w-5 h-5 text-[hsl(var(--color-text-secondary))]" />
                  </button>
                </div>
              )}
            </div>
            <div className="overflow-y-auto max-h-[calc(90vh-80px)] px-6 py-4">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
