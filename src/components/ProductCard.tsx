import React, { useState } from 'react';
import { Heart, Star, HelpCircle, Check, ShoppingCart } from 'lucide-react';
import { Product } from '../types';
import { sizes } from '../data';

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  onToggleWishlist: (productId: number) => void;
  onAddToCart: (product: Product, size: string) => void;
  onOpenQuickView: (product: Product) => void;
}

export default function ProductCard({
  product,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  onOpenQuickView,
}: ProductCardProps) {
  const [showSizes, setShowSizes] = useState(false);
  const [showSizeTooltip, setShowSizeTooltip] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const isSoldOut = product.badge === 'Sold Out';
  const isScarcity = product.badge === 'Only 3 left!';

  const handleQuickAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSoldOut) return;
    setShowSizes(!showSizes);
  };

  const handleSizeSelect = (e: React.MouseEvent, size: string) => {
    e.stopPropagation();
    onAddToCart(product, size);
    setShowSizes(false);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  return (
    <div 
      className="group relative flex flex-col bg-brand-cream border border-brand-black/5 hover:border-brand-black/20 hover:shadow-xl transition-all duration-300 rounded overflow-hidden"
      id={`product-card-${product.id}`}
    >
      {/* Product Image Area */}
      <div 
        className="relative aspect-4/5 w-full bg-stone-100 overflow-hidden cursor-pointer"
        onClick={() => onOpenQuickView(product)}
      >
        {/* Badge Overlay */}
        {product.badge && (
          <span 
            className={`absolute top-3 left-3 z-10 px-2.5 py-1 text-[10px] uppercase tracking-wider font-extrabold rounded shadow-md ${
              isSoldOut 
                ? 'bg-stone-500 text-brand-cream' 
                : isScarcity
                  ? 'bg-rose-600 text-brand-cream animate-pulse'
                  : product.badge === 'Sale'
                    ? 'bg-red-500 text-brand-cream'
                    : 'bg-brand-gold text-brand-black'
            }`}
          >
            {product.badge}
          </span>
        )}

        {/* Wishlist Heart Icon */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product.id);
          }}
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-brand-cream/80 backdrop-blur-xs hover:bg-brand-cream text-brand-black hover:text-red-500 hover:scale-110 transition-all shadow-sm"
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={`w-4.5 h-4.5 transition-colors ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-brand-black'}`} />
        </button>

        {/* Product Image */}
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          referrerPolicy="no-referrer"
          className={`w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-108 ${isSoldOut ? 'opacity-40 grayscale-[40%]' : ''}`}
        />

        {/* Size Guide Tooltip Floating Icon */}
        <div 
          className="absolute bottom-3 left-3 z-10"
          onMouseEnter={() => setShowSizeTooltip(true)}
          onMouseLeave={() => setShowSizeTooltip(false)}
          onClick={(e) => e.stopPropagation()}
        >
          <button 
            className="p-1.5 rounded-full bg-brand-cream/80 backdrop-blur-xs text-brand-black/60 hover:text-brand-black transition-all hover:scale-105"
            aria-label="Size Guide"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
          
          {showSizeTooltip && (
            <div className="absolute bottom-8 left-0 z-30 w-44 bg-brand-black text-brand-cream p-2.5 text-[10px] rounded shadow-xl border border-brand-gold/30 font-sans tracking-wide">
              <span className="font-bold text-brand-gold block mb-1">SIZE CHART CHEATSHEET:</span>
              <ul className="space-y-0.5 text-[9px] list-none p-0 m-0">
                <li>XS: Chest 34" | Sleek</li>
                <li>S: Chest 36" | Tailored</li>
                <li>M: Chest 38" | Regular</li>
                <li>L: Chest 40" | Comfortable</li>
                <li>XL: Chest 42" | Over-sized</li>
                <li>XXL: Chest 44" | Majestic</li>
              </ul>
            </div>
          )}
        </div>

        {/* Quick Sizes Selector Overlay */}
        {showSizes && !isSoldOut && (
          <div 
            className="absolute inset-0 bg-brand-black/85 flex flex-col justify-center items-center p-3 animate-fadeIn z-20"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-brand-cream text-xs font-bold uppercase tracking-widest mb-3">SELECT SIZE</p>
            <div className="grid grid-cols-3 gap-2 w-full max-w-[180px]">
              {sizes.map((sz) => (
                <button
                  key={sz}
                  onClick={(e) => handleSizeSelect(e, sz)}
                  className="bg-transparent hover:bg-brand-gold text-brand-cream hover:text-brand-black border border-brand-cream/30 hover:border-brand-gold text-[10px] font-sans font-bold py-2 rounded transition-all duration-200"
                >
                  {sz}
                </button>
              ))}
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); setShowSizes(false); }}
              className="mt-4 text-stone-400 hover:text-brand-cream text-[10px] uppercase tracking-widest font-bold"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Inline Feedback added state */}
        {addedAnimation && (
          <div className="absolute inset-x-0 bottom-0 bg-brand-gold text-brand-black text-center py-2 text-[10px] font-bold tracking-widest uppercase flex items-center justify-center gap-1.5 animate-slideUp z-20">
            <Check className="w-3.5 h-3.5" /> Added to Bag!
          </div>
        )}

        {/* Slide-Up Quick Add (Desktop Hover) */}
        {!showSizes && !isSoldOut && !addedAnimation && (
          <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-brand-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:flex justify-stretch">
            <button
              onClick={handleQuickAddClick}
              className="w-full py-2.5 bg-brand-cream hover:bg-brand-gold text-brand-black font-sans font-bold text-[10px] uppercase tracking-[0.15em] border border-transparent hover:scale-[1.02] transition-all"
            >
              Express Quick Add
            </button>
          </div>
        )}
      </div>

      {/* Product Information */}
      <div className="p-4 flex flex-col flex-1">
        <span className="text-[10px] text-stone-500 font-bold uppercase tracking-widest mb-1">
          {product.category}
        </span>
        
        <h3 
          className="font-serif text-sm font-semibold tracking-tight text-brand-black line-clamp-1 hover:text-brand-gold cursor-pointer"
          onClick={() => onOpenQuickView(product)}
        >
          {product.name}
        </h3>

        {/* Stars info */}
        <div className="flex items-center gap-1 mt-1.5">
          <div className="flex text-brand-gold">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'fill-brand-gold' : ''}`} 
              />
            ))}
          </div>
          <span className="text-[10px] font-sans text-stone-400 font-medium">({product.reviews})</span>
        </div>

        {/* Bottom Price and Shop Actions */}
        <div className="flex items-center justify-between mt-auto pt-3">
          <span className="font-serif text-sm font-bold text-brand-black">
            ${product.price.toFixed(2)}
          </span>

          <div className="flex items-center gap-1.5">
            {/* Quick action for mobile - Tap is shopping bag */}
            <button
              onClick={handleQuickAddClick}
              disabled={isSoldOut}
              className={`md:hidden p-2 rounded border transition-colors ${
                isSoldOut 
                  ? 'bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed' 
                  : 'bg-brand-cream border-brand-black/20 text-brand-black hover:bg-brand-gold hover:border-brand-gold'
              }`}
              aria-label="Quick add size select"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
            </button>

            {/* Sizes guide click overlay */}
            <button
              onClick={() => onOpenQuickView(product)}
              className="text-[10px] uppercase font-bold tracking-widest text-slate-800 hover:text-brand-gold transition-colors underline underline-offset-4 pl-1"
            >
              Quick View
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
