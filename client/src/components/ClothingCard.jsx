import { Check } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs) => twMerge(clsx(inputs));

const ClothingCard = ({ item, isSelected, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={cn(
        "relative rounded-2xl overflow-hidden cursor-pointer group transition-all duration-300",
        isSelected ? "glow border-2 border-[var(--color-accent-violet)]" : "border border-white/10 hover:border-white/30"
      )}
    >
      <div className="aspect-[4/5] overflow-hidden bg-[#1a1a1a]">
        <img 
          src={item.imageUrl} 
          alt={item.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      
      <div className="absolute top-3 left-3">
        <span className="glass px-3 py-1 rounded-full text-xs font-medium tracking-wide uppercase shadow-sm">
          {item.category}
        </span>
      </div>

      {isSelected && (
        <div className="absolute top-3 right-3 bg-[var(--color-accent-violet)] text-white p-1 rounded-full shadow-lg z-10">
          <Check size={16} />
        </div>
      )}

      <div className="absolute bottom-0 w-full p-4 bg-gradient-to-t from-black/90 to-transparent pt-12">
        <h4 className="font-display text-lg tracking-wide">{item.name}</h4>
      </div>
    </div>
  );
};

export default ClothingCard;
