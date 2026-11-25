import { motion, AnimatePresence } from 'framer-motion';
import { Download, Repeat, X, Share2 } from 'lucide-react';
import toast from 'react-hot-toast';

const ResultModal = ({ isOpen, onClose, originalImage, resultImage, onTryAnother }) => {
  const handleCopyLink = () => {
    navigator.clipboard.writeText(resultImage);
    toast.success('Image link copied to clipboard!');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-lg p-4 sm:p-8 overflow-y-auto"
        >
          <motion.div
            initial={{ scale: 0.95, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 20, opacity: 0 }}
            className="glass w-full max-w-5xl rounded-3xl overflow-hidden relative my-auto flex flex-col"
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/80 p-2 rounded-full text-white/70 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>

            <div className="p-8 pb-4">
              <h2 className="font-display text-3xl mb-1">Your Virtual Fit</h2>
              <p className="text-white/60">Powered by Gemini AI</p>
            </div>

            <div className="p-4 sm:p-8 pt-0 flex-grow grid md:grid-cols-2 gap-4 sm:gap-8">
              <div className="flex flex-col gap-3">
                <span className="text-white/50 text-sm font-medium uppercase tracking-widest pl-1">Original</span>
                <div className="rounded-2xl overflow-hidden bg-[#111] aspect-[3/4]">
                  <img src={originalImage} alt="Original" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <span className="text-[var(--color-accent-violet)] text-sm font-medium uppercase tracking-widest pl-1 glow-text">Result</span>
                <div className="rounded-2xl overflow-hidden bg-[#111] aspect-[3/4] relative glow border border-[var(--color-accent-violet)]/30">
                  <img src={resultImage} alt="Result" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>

            <div className="bg-black/40 p-6 border-t border-white/10 flex flex-wrap items-center justify-end gap-4 shrink-0">
              <button 
                onClick={handleCopyLink}
                className="px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 text-white font-medium transition-colors flex items-center gap-2 border border-white/10"
              >
                <Share2 size={18} /> Share
              </button>
              <a 
                href={resultImage} 
                download="virtual-tryon-result.jpg"
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium transition-colors flex items-center gap-2 border border-white/20"
              >
                <Download size={18} /> Download
              </a>
              <button 
                onClick={() => {
                  onClose();
                  onTryAnother();
                }}
                className="px-8 py-3 rounded-full bg-[var(--color-accent-violet)] hover:bg-[#6D28D9] text-white font-medium shadow-lg hover:shadow-[var(--color-accent-violet)]/50 transition-all flex items-center gap-2"
              >
                <Repeat size={18} /> Try Another
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ResultModal;
