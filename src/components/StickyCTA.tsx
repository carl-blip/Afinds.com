import { useState, useEffect } from 'react';
import { ShoppingBag, Star, X, Check } from 'lucide-react';
import { Product } from '../types';
import { sizes } from '../data';

interface StickyCTAProps {
  product: Product;
  onAddToCart: (product: Product, size: string) => void;
}

export default function StickyCTA({ product, onAddToCart }: StickyCTAProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedSize, setSelectedSize] = useState('M');
  const [isDismissed, setIsDismissed] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (isDismissed) return;
      if (window.scrollY > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isDismissed]);

  const handleBuyNow = () => {
    onAddToCart(product, selectedSize);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (!isVisible || isDismissed) return null;

  return (
    <div 
      className="fixed bottom-0 inset-x-0 z-30 bg-brand-black/95 backdrop-blur-md text-brand-cream border-t border-brand-gold/30 shadow-2xl py-3.5 px-4 sm:px-6 transition-all duration-300 animate-slideUp" 
      id="sticky-checkout-bar"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Product Details Section */}
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-10 h-12 bg-stone-800 flex-shrink-0 overflow-hidden rounded border border-brand-cream/10 hidden sm:block">
            <img
              src={product.image}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-top"
            />
          </div>
          <div className="min-w-0">
            <span className="flex items-center gap-1">
              <span className="text-[9px] bg-brand-gold text-brand-black font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider scale-90 origin-left">
                BESTSELLER
              </span>
              <span className="text-[10px] text-brand-gold font-bold tracking-wider hidden md:flex items-center gap-0.5">
                <Star className="w-2.5 h-2.5 fill-brand-gold" /> 4.9 Rating
              </span>
            </span>
            <h4 className="font-serif text-xs md:text-sm font-bold text-brand-cream truncate mt-0.5 leading-tight">
              {product.name}
            </h4>
            <p className="font-serif text-xs text-brand-gold font-bold sm:mt-0.5">
              ${product.price.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Action controls (Size Selector + Main Action button) */}
        <div className="flex items-center gap-3 md:gap-5 flex-shrink-0">
          
          {/* Size choices (Compact labels) */}
          <div className="hidden md:flex items-center gap-1.5">
            <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider mr-1">SIZE:</span>
            {sizes.slice(1, 5).map((sz) => ( // S, M, L, XL
              <button
                key={sz}
                onClick={() => setSelectedSize(sz)}
                className={`h-7 w-8 text-[10px] font-sans font-bold border transition-colors ${
                  selectedSize === sz
                    ? 'bg-brand-gold text-brand-black border-brand-gold'
                    : 'bg-transparent text-brand-cream border-brand-cream/20 hover:border-brand-gold'
                }`}
              >
                {sz}
              </button>
            ))}
          </div>

          <button
            onClick={handleBuyNow}
            disabled={added}
            className={`px-5 py-2.5 rounded font-sans uppercase text-[10px] font-extrabold tracking-[0.15em] flex items-center justify-center gap-1.5 transition-all outline-none focus:ring-1 focus:ring-brand-gold ${
              added
                ? 'bg-green-700 text-brand-cream'
                : 'bg-brand-gold hover:bg-brand-cream text-brand-black hover:scale-102 cursor-pointer shadow shadow-brand-gold/40'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            {added ? 'Added to Bag!' : 'Claim Signature Look'}
          </button>

          {/* Dismiss button */}
          <button
            onClick={() => {
              setIsDismissed(true);
              setIsVisible(false);
            }}
            className="p-1.5 text-stone-400 hover:text-brand-cream hover:bg-white/10 rounded transition-colors"
            aria-label="Dismiss sticky offer bar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
