import { useRef } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Product } from '../types';
import ProductCard from './ProductCard';

interface CarouselProps {
  products: Product[];
  wishlist: number[];
  onToggleWishlist: (productId: number) => void;
  onAddToCart: (product: Product, size: string) => void;
  onOpenQuickView: (product: Product) => void;
}

export default function Carousel({
  products,
  wishlist,
  onToggleWishlist,
  onAddToCart,
  onOpenQuickView,
}: CarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null);

  // Filter 6 products for Bestsellers (marked as bestseller or highest rating/reviews)
  const bestsellerProducts = products.filter(
    (p) => p.badge === 'Bestseller' || p.rating >= 4.8
  ).slice(0, 6);

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  return (
    <section id="bestsellers-carousel" className="py-16 bg-stone-50 border-b border-brand-black/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Caption and Section Controls */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-[10px] text-brand-gold font-bold tracking-[0.25em] uppercase block mb-1">CULT FAVORITES</span>
            <h2 className="font-serif text-2xl md:text-3.5xl font-bold tracking-tight text-brand-black">
              Bestselling Staples
            </h2>
          </div>
          
          {/* Arrow navigation buttons */}
          <div className="flex gap-2">
            <button
              onClick={scrollLeft}
              className="p-3 bg-brand-cream border border-brand-black/10 hover:border-brand-gold hover:text-brand-gold transition-colors duration-200 text-brand-black rounded"
              aria-label="Scroll left overview"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              onClick={scrollRight}
              className="p-3 bg-brand-cream border border-brand-black/10 hover:border-brand-gold hover:text-brand-gold transition-colors duration-200 text-brand-black rounded"
              aria-label="Scroll right overview"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Carousel Scroll Area */}
        <div 
          ref={carouselRef}
          className="flex overflow-x-auto gap-6 pb-6 no-scrollbar snap-x snap-mandatory cursor-grab active:cursor-grabbing"
          style={{ scrollbarWidth: 'none' }}
        >
          {bestsellerProducts.map((p) => (
            <div 
              key={p.id} 
              className="w-[280px] sm:w-[320px] flex-shrink-0 snap-start"
            >
              <ProductCard
                product={p}
                isWishlisted={wishlist.includes(p.id)}
                onToggleWishlist={onToggleWishlist}
                onAddToCart={onAddToCart}
                onOpenQuickView={onOpenQuickView}
              />
            </div>
          ))}
        </div>

        {/* Small cheeky reminder underneath the carousel */}
        <p className="font-serif italic text-xs text-stone-500 text-center mt-6">
          "Yeah, our data is clear: wearing these results in instantaneous confidence boosts."
        </p>

      </div>
    </section>
  );
}
