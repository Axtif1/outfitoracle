import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Wand2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

import ImageUploader from '../components/ImageUploader';
import ClothingGallery from '../components/ClothingGallery';
import Loader from '../components/Loader';
import ResultModal from '../components/ResultModal';

import { setUserImage, setResultImage, setLoading, resetTryon } from '../store/tryonSlice';
import { updateCredits } from '../store/authSlice';
import api from '../api/axios';

const HomePage = () => {
  const dispatch = useDispatch();
  const { userImage, selectedClothing, resultImage, loading } = useSelector((state) => state.tryon);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [modalOpen, setModalOpen] = useState(false);

  const handleGenerate = async () => {
    if (!isAuthenticated) return toast.error('You must be logged in to try on clothes.');
    if (user?.credits <= 0) return toast.error('No credits left. Contact admin for more credits.');
    if (!userImage || !selectedClothing) return;

    try {
      dispatch(setLoading(true));
      const res = await api.post('/api/tryon', {
        userImage: userImage,
        clothingId: selectedClothing._id
      });
      
      dispatch(setResultImage(res.data.resultImage));
      
      if (res.data.remainingCredits !== undefined) {
         dispatch(updateCredits(res.data.remainingCredits));
         toast.success(`1 credit used. ${res.data.remainingCredits} credits remaining.`);
      }

      setModalOpen(true);
    } catch (error) {
      dispatch(setLoading(false));
      toast.error(error.response?.data?.message || 'Failed to generate try-on. Please try again.');
    }
  };

  const handleTryAnother = () => {
    dispatch(resetTryon());
  };

  return (
    <div className="max-w-7xl mx-auto px-6 pt-4 pb-8 flex flex-col">
      {/* Hero Section */}
      <div className="text-center mb-8 shrink-0">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-display mb-2"
        >
          Wear the <span className="bg-gradient-to-r from-[var(--color-accent-violet)] to-[var(--color-accent-gold)] text-transparent bg-clip-text font-bold">Future</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.2 } }}
          className="text-white/60 text-base max-w-2xl mx-auto"
        >
          Upload your photo, pick an outfit, and let our AI do the rest.
        </motion.p>
      </div>

      <div className="grid lg:grid-cols-[1fr_2fr] gap-8">
        {/* Left Panel */}
        <div className="flex flex-col">
          <h2 className="font-display text-2xl mb-4 text-white/90">1. Your Photo</h2>
          <ImageUploader 
            onImageUpload={(url) => dispatch(setUserImage(url))} 
            uploadedImageUrl={userImage} 
          />
        </div>

        {/* Right Panel */}
        <div className="flex flex-col min-h-0 bg-[#0A0A0A] lg:bg-transparent -mx-6 lg:mx-0 px-6 lg:px-0 mt-8 lg:mt-0 pt-8 lg:pt-0 border-t border-white/5 lg:border-t-0">
          <h2 className="font-display text-2xl mb-4 text-white/90">2. Select Fit</h2>
          <ClothingGallery />
        </div>
      </div>

      {/* Action Footer directly trailing the content */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={handleGenerate}
          disabled={!userImage || !selectedClothing || loading || (user && user.credits <= 0)}
          className={`px-8 py-3.5 rounded-full font-medium text-lg flex items-center gap-3 transition-all duration-300 ${
            userImage && selectedClothing && !loading && user?.credits > 0
              ? 'bg-[var(--color-accent-violet)] hover:bg-[#6D28D9] text-white shadow-[0_0_20px_rgba(124,58,237,0.4)] scale-100'
              : 'bg-white/10 text-white/40 cursor-not-allowed scale-95'
          }`}
        >
          <Wand2 size={24} />
          ✨ Generate Try-On
        </button>
      </div>

      <Loader isLoading={loading} />
      <ResultModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        originalImage={userImage}
        resultImage={resultImage}
        onTryAnother={handleTryAnother}
      />
    </div>
  );
};

export default HomePage;
