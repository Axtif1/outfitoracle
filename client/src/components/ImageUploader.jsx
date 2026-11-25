import { useState, useRef } from 'react';
import { UploadCloud, CheckCircle2, X } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs) => twMerge(clsx(inputs));

const ImageUploader = ({ onImageUpload, uploadedImageUrl }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const validateAndUpload = async (file) => {
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }
    
    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
      setIsUploading(true);
      const res = await api.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      onImageUpload(res.data.url);
      toast.success('Photo uploaded successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload photo');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      validateAndUpload(files[0]);
    }
  };

  const handleChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      validateAndUpload(files[0]);
    }
  };

  if (uploadedImageUrl) {
    return (
      <div className="relative glass rounded-2xl p-2 w-full aspect-[3/4] max-h-[600px] overflow-hidden group">
        <img 
          src={uploadedImageUrl} 
          alt="Your uploaded photo" 
          className="w-full h-full object-cover rounded-xl"
        />
        <div className="absolute top-4 right-4 flex gap-2">
          <div className="bg-green-500 text-white p-1 rounded-full shadow-lg">
            <CheckCircle2 size={24} />
          </div>
        </div>
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
          <button 
            onClick={() => onImageUpload(null)}
            className="px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white font-medium transition-colors border border-white/20 flex items-center gap-2"
          >
            <X size={18} /> Change Photo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={cn(
        "glass border-2 border-dashed rounded-2xl w-full aspect-[3/4] max-h-[600px] flex flex-col items-center justify-center p-8 transition-all cursor-pointer text-center",
        isDragging ? "border-[var(--color-accent-violet)] scale-[1.02] bg-[var(--color-accent-violet)]/10" : "border-white/20 hover:border-white/40"
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input 
        type="file" 
        className="hidden" 
        ref={fileInputRef}
        onChange={handleChange}
        accept="image/jpeg, image/png, image/webp"
      />
      <div className="bg-white/5 p-4 rounded-full mb-4">
        {isUploading ? (
           <div className="w-8 h-8 rounded-full border-2 border-[var(--color-accent-violet)] border-t-transparent animate-spin"/>
        ) : (
          <UploadCloud className="w-8 h-8 text-[var(--color-accent-gold)]" />
        )}
      </div>
      <h3 className="text-xl tracking-tight font-display mb-2">Upload your photo</h3>
      <p className="text-white/50 text-sm">Drag and drop or click to browse</p>
      <p className="text-white/30 text-xs mt-4">JPG, PNG, WEBP up to 5MB</p>
    </div>
  );
};

export default ImageUploader;
