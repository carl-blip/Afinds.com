interface CategoryBannerProps {
  onSelectCategory: (category: 'all' | 'men' | 'women' | 'sale') => void;
}

export default function CategoryBanner({ onSelectCategory }: CategoryBannerProps) {
  const handleCategoryClick = (cat: 'men' | 'women') => {
    onSelectCategory(cat);
    const el = document.getElementById('products-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="category-banners" className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 h-[450px]">
        {/* Women Banner */}
        <div 
          className="relative group h-full overflow-hidden flex items-center justify-center cursor-pointer border-r border-brand-cream/10"
          onClick={() => handleCategoryClick('women')}
        >
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1000&q=80')` }}
          />
          <div className="absolute inset-0 bg-brand-black/45 group-hover:bg-brand-black/55 transition-colors duration-300" />
          
          <div className="relative text-center text-brand-cream px-4">
            <span className="text-xs font-bold tracking-[0.25em] text-brand-gold uppercase block mb-2">HER COLLECTION</span>
            <h2 className="font-serif text-3xl md:text-4.5xl font-bold tracking-tight mb-4">SHOP WOMEN</h2>
            <button className="px-6 py-3 bg-brand-cream text-brand-black font-sans uppercase text-[10px] tracking-wider font-bold group-hover:bg-brand-gold group-hover:text-brand-black transition-colors">
              Discover Drip
            </button>
          </div>
        </div>

        {/* Men Banner */}
        <div 
          className="relative group h-full overflow-hidden flex items-center justify-center cursor-pointer"
          onClick={() => handleCategoryClick('men')}
        >
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=1000&q=80')` }}
          />
          <div className="absolute inset-0 bg-brand-black/45 group-hover:bg-brand-black/55 transition-colors duration-300" />
          
          <div className="relative text-center text-brand-cream px-4">
            <span className="text-xs font-bold tracking-[0.25em] text-brand-gold uppercase block mb-2">HIS COLLECTION</span>
            <h2 className="font-serif text-3xl md:text-4.5xl font-bold tracking-tight mb-4">SHOP MEN</h2>
            <button className="px-6 py-3 bg-brand-cream text-brand-black font-sans uppercase text-[10px] tracking-wider font-bold group-hover:bg-brand-gold group-hover:text-brand-black transition-colors">
              Explore Wardrobe
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
