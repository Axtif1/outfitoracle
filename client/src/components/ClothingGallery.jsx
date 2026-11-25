import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchClothes, setSelectedCategory } from '../store/clothingSlice';
import { setSelectedClothing } from '../store/tryonSlice';
import ClothingCard from './ClothingCard';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs) => twMerge(clsx(inputs));

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'tshirt', label: 'T-Shirt' },
  { id: 'shirt', label: 'Shirt' },
  { id: 'kurta', label: 'Kurta' },
  { id: 'jacket', label: 'Jacket' },
  { id: 'hoodie', label: 'Hoodie' },
  { id: 'dress', label: 'Dress' },
];

const ClothingGallery = () => {
  const dispatch = useDispatch();
  const { items, loading, selectedCategory, error } = useSelector((state) => state.clothing);
  const { selectedClothing } = useSelector((state) => state.tryon);

  useEffect(() => {
    dispatch(fetchClothes(selectedCategory));
  }, [dispatch, selectedCategory]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex gap-2 overflow-x-auto pb-4 custom-scrollbar mb-4">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => dispatch(setSelectedCategory(cat.id))}
            className={cn(
              "whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-all",
              selectedCategory === cat.id 
                ? "bg-[var(--color-accent-violet)] text-white shadow-lg border border-[var(--color-accent-violet)]" 
                : "glass text-white/70 hover:text-white"
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {error ? (
        <div className="glass p-8 text-center text-red-400 rounded-2xl">{error}</div>
      ) : loading ? (
        <div className="flex-grow flex items-center justify-center">
           <div className="w-8 h-8 rounded-full border-2 border-[var(--color-accent-violet)] border-t-transparent animate-spin"/>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 overflow-y-auto pb-2 custom-scrollbar pr-2 max-h-[500px]">
          {items.map((item) => (
            <ClothingCard
              key={item._id}
              item={item}
              isSelected={selectedClothing?._id === item._id}
              onClick={() => dispatch(setSelectedClothing(selectedClothing?._id === item._id ? null : item))}
            />
          ))}
          {items.length === 0 && (
             <div className="col-span-full text-center text-white/50 py-12">
               No clothing items found in this category.
             </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ClothingGallery;
