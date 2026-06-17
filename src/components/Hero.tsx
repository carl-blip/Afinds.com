import { motion } from 'motion/react';
import { ArrowDown, Flame } from 'lucide-react';

interface HeroProps {
  onShopCategory: (category: 'all' | 'men' | 'women' | 'sale') => void;
  onGetTheShirt: () => void;
}

export default function Hero({ onShopCategory, onGetTheShirt }: HeroProps) {
  const handleScrollToProducts = () => {
    onShopCategory('all');
    const el = document.getElementById('products-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleShopWomen = () => {
    onShopCategory('women');
    const el = document.getElementById('products-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      id="hero-section" 
      className="relative h-[calc(100vh-80px)] min-h-[550px] w-full flex items-center justify-center overflow-hidden bg-brand-black"
    >
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
        style={{ 
          backgroundImage: `url('https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1600')`,
          // Subtle fallback parallax using CSS attachment
          backgroundAttachment: 'scroll',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-brand-black/50 via-brand-black/40 to-brand-black/90" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center text-brand-cream select-none">
        
        {/* Cheeky Badge */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-1.5 bg-brand-gold/15 border border-brand-gold/40 text-brand-gold px-3.5 py-1.5 rounded-full text-xs font-bold tracking-[0.2em] uppercase mb-6 sm:mb-8 hover:bg-brand-gold/25 transition-all cursor-pointer"
          onClick={handleScrollToProducts}
        >
          <Flame className="w-3.5 h-3.5 text-brand-gold animate-bounce" />
          <span>EST. 2022 • DRIP UPGRADE</span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-serif text-4xl sm:text-6xl md:text-7.5xl font-black tracking-tight leading-none mb-6 text-brand-cream select-text"
        >
          The Shirt That <br className="hidden sm:inline" />
          <span className="text-brand-gold italic font-normal">Changes</span> Everything.
        </motion.h1>

        {/* Sub-headline / Copy */}
        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="font-sans text-stone-300 text-sm sm:text-base md:text-lg max-w-2xl mx-auto tracking-wider mb-10 leading-relaxed font-light select-text"
        >
          "If you want to have a beautiful girlfriend — you already know what to do." <br /> 
          <span className="text-xs text-brand-gold/80 block mt-2 font-medium tracking-[0.15em] uppercase">✓ Backed by completely unproven scientific speculation.</span>
        </motion.p>

        {/* Actions Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto"
        >
          <button
            onClick={handleShopWomen}
            className="w-full sm:w-auto px-8 py-4 bg-brand-cream text-brand-black font-sans uppercase text-xs tracking-[0.2em] font-bold border-2 border-brand-cream hover:bg-transparent hover:text-brand-cream transition-all duration-300 active:scale-95 shadow-lg shadow-brand-black/30 cursor-pointer"
          >
            Shop Women
          </button>
          
          <button
            onClick={onGetTheShirt}
            className="w-full sm:w-auto px-8 py-4 bg-transparent text-brand-cream font-sans uppercase text-xs tracking-[0.2em] font-bold border-2 border-brand-gold hover:bg-brand-gold hover:text-brand-black transition-all duration-300 active:scale-95 shadow-md hover:shadow-brand-gold/20 cursor-pointer"
          >
            Get the Shirt
          </button>
        </motion.div>

        {/* Floating Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute bottom-[-100px] left-1/2 transform -translate-x-1/2 hidden md:flex flex-col items-center gap-1 cursor-pointer select-none"
          onClick={handleScrollToProducts}
        >
          <span className="text-[10px] tracking-[0.3em] uppercase text-stone-500 font-bold">Scroll Down</span>
          <ArrowDown className="w-4 h-4 text-brand-gold" />
        </motion.div>

      </div>
    </section>
  );
}
