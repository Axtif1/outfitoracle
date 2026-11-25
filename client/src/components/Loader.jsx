import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const loadingTexts = [
  "Analyzing your photo...",
  "Selecting fit...",
  "Rendering outfit...",
  "Almost ready..."
];

const Loader = ({ isLoading }) => {
  const [textIndex, setTextIndex] = useState(0);

  useEffect(() => {
    if (!isLoading) {
      setTextIndex(0);
      return;
    }
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % loadingTexts.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [isLoading]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md"
        >
          <div className="flex flex-col items-center gap-6">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="relative"
            >
              <div className="w-20 h-20 border-4 border-white/10 border-t-[var(--color-accent-violet)] border-r-[var(--color-accent-gold)] rounded-full" />
              <div className="absolute inset-0 flex items-center justify-center animate-pulse">
                <Sparkles className="text-[var(--color-accent-gold)]" size={24} />
              </div>
            </motion.div>
            
            <div className="h-8 overflow-hidden relative w-64 text-center">
              <AnimatePresence mode="popLayout">
                <motion.p
                  key={textIndex}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="font-display text-xl tracking-wide absolute w-full"
                >
                  {loadingTexts[textIndex]}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Loader;
