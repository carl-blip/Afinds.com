import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, Menu, X, Heart, Sparkles, ShieldCheck, Truck } from 'lucide-react';
import { CartItem, Product } from '../types';

interface HeaderProps {
  cart: CartItem[];
  wishlist: number[];
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onSearchChange: (query: string) => void;
  onCategorySelect: (category: 'all' | 'men' | 'women' | 'sale') => void;
  activeCategory: string;
  onOpenAdmin: () => void;
  onOpenTracking: () => void;
}

export default function Header({
  cart,
  wishlist,
  onOpenCart,
  onOpenWishlist,
  onSearchChange,
  onCategorySelect,
  activeCategory,
  onOpenAdmin,
  onOpenTracking,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [timeLeft, setTimeLeft] = useState('24:00:00');

  // Unified Countdown timer logic
  useEffect(() => {
    const getTargetTime = () => {
      const stored = localStorage.getItem('afinds_countdown_target');
      if (stored) {
        const target = parseInt(stored, 10);
        if (target > Date.now()) {
          return target;
        }
      }
      // Set new target 24 hours into the future
      const newTarget = Date.now() + 4 * 3600000 + 22 * 60000 + 10 * 1000; // 04:22:10 approx or 24 hours
      const target24h = Date.now() + 24 * 60 * 60 * 1000;
      localStorage.setItem('afinds_countdown_target', target24h.toString());
      return target24h;
    };

    const targetTime = getTargetTime();

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = targetTime - now;

      if (diff <= 0) {
        // Reset timer to another 24 hours
        const newTarget = Date.now() + 24 * 60 * 60 * 1000;
        localStorage.setItem('afinds_countdown_target', newTarget.toString());
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        const pad = (num: number) => num.toString().padStart(2, '0');
        setTimeLeft(`${pad(hours)}:${pad(minutes)}:${pad(seconds)}`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const totalCartItems = cart.reduce((total, item) => total + item.quantity, 0);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchChange(searchQuery);
  };

  const handleSearchKeyPress = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    onSearchChange(e.target.value);
  };

  const handleQueryClick = (cat: 'all' | 'men' | 'women' | 'sale') => {
    onCategorySelect(cat);
    setMobileMenuOpen(false);
    // Smooth scroll to products section
    const el = document.getElementById('products-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-brand-cream border-b border-brand-black/5" id="header-root">
      {/* Announcement Bar */}
      <div 
        id="announcement-bar" 
        className="w-full bg-brand-black text-brand-cream py-2 px-4 text-center text-xs tracking-wider flex flex-col md:flex-row justify-center items-center gap-2 font-medium border-b border-brand-gold/25"
      >
        <span className="flex items-center gap-1.5 justify-center">
          <Sparkles className="w-3.5 h-3.5 text-brand-gold animate-pulse" />
          <span>SALE ENDS IN: <strong className="font-mono text-brand-gold sm:text-sm text-xs bg-brand-gold/10 px-1.5 py-0.5 rounded border border-brand-gold/20">{timeLeft}</strong></span>
        </span>
        <span className="hidden md:inline">|</span>
        <span>USE CODE <strong className="text-brand-gold">FIRST10</strong> FOR 10% OFF</span>
        <span className="hidden md:inline">|</span>
        <span className="text-gray-300">⚡ FREE SHIPPING OVER $75</span>
      </div>

      {/* Main Navigation */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="main-navigation">
        <div className="flex items-center justify-between h-16 md:h-20">
          
          {/* Mobile Menu Trigger */}
          <div className="flex md:hidden">
            <button
              id="mobile-menu-trigger"
              onClick={() => setMobileMenuOpen(true)}
              className="text-brand-black hover:text-brand-gold transition-colors p-2"
              aria-label="Open navigation menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {/* Nav Links (Desktop) */}
          <div className="hidden md:flex items-center space-x-8 font-sans text-sm tracking-widest uppercase font-medium">
            <button
              onClick={() => handleQueryClick('all')}
              className={`pb-1 border-b-2 transition-all ${
                activeCategory === 'all' 
                  ? 'border-brand-gold text-brand-gold' 
                  : 'border-transparent text-brand-black hover:border-brand-gold/40'
              }`}
            >
              Shop All
            </button>
            <button
              onClick={() => handleQueryClick('women')}
              className={`pb-1 border-b-2 transition-all ${
                activeCategory === 'women' 
                  ? 'border-brand-gold text-brand-gold' 
                  : 'border-transparent text-brand-black hover:border-brand-gold/40'
              }`}
            >
              Women
            </button>
            <button
              onClick={() => handleQueryClick('men')}
              className={`pb-1 border-b-2 transition-all ${
                activeCategory === 'men' 
                  ? 'border-brand-gold text-brand-gold' 
                  : 'border-transparent text-brand-black hover:border-brand-gold/40'
              }`}
            >
              Men
            </button>
            <button
              onClick={() => handleQueryClick('sale')}
              className={`pb-1 border-b-2 transition-all ${
                activeCategory === 'sale' 
                  ? 'border-brand-gold text-brand-gold' 
                  : 'border-transparent text-red-600 hover:border-red-600/40 font-semibold'
              }`}
            >
              Sale
            </button>
          </div>

          {/* Logo Center */}
          <div className="flex-1 md:flex-none text-center">
            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="font-serif text-2xl md:text-3.5xl font-black tracking-[0.2em] text-brand-black hover:text-brand-gold transition-colors select-none inline-block pl-4 md:pl-0"
              id="brand-logo"
            >
              AFINDS
            </a>
          </div>

          {/* Actions (Search, Wishlist, Cart) */}
          <div className="flex items-center space-x-2 md:space-x-4">
            
            {/* Search Input (Expands inline on desktop) */}
            <div className="relative flex items-center">
              <form onSubmit={handleSearchSubmit} className={`transition-all duration-300 overflow-hidden ${searchOpen ? 'w-40 sm:w-60 opacity-100 pr-2' : 'w-0 opacity-0'}`}>
                <input
                  id="header-search-input"
                  type="text"
                  placeholder="Search outfits..."
                  value={searchQuery}
                  onChange={handleSearchKeyPress}
                  className="w-full bg-stone-100 text-brand-black text-xs font-sans rounded-full py-1.5 px-4 focus:ring-1 focus:ring-brand-gold border-none outline-none"
                />
              </form>
              <button
                id="search-toggle-btn"
                onClick={() => setSearchOpen(!searchOpen)}
                className="text-brand-black hover:text-brand-gold transition-colors p-2"
                aria-label="Toggle search bar"
              >
                {searchOpen ? <X className="w-5.5 h-5.5" /> : <Search className="w-5.5 h-5.5" />}
              </button>
            </div>

            {/* Store Management Portal Trigger */}
            <button
              id="admin-dashboard-trigger"
              onClick={onOpenAdmin}
              className="group flex items-center gap-1 bg-brand-black hover:bg-brand-gold text-brand-cream hover:text-brand-black px-2 py-1.5 sm:px-3 rounded transition-all text-[9px] sm:text-[10px] tracking-widest font-extrabold uppercase cursor-pointer border border-brand-gold/35 shadow-xs"
              title="Store Admin Dashboard"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-brand-gold group-hover:text-brand-black transition-colors" />
              <span className="hidden sm:inline">Admin</span>
            </button>

            {/* Live Track Carrier Trigger */}
            <button
              id="order-tracking-trigger"
              onClick={onOpenTracking}
              className="group flex items-center gap-1.5 bg-white hover:bg-brand-gold text-brand-black px-2.5 py-1.5 sm:px-3 rounded transition-all text-[9px] sm:text-[10px] tracking-widest font-extrabold uppercase cursor-pointer border border-brand-black/15 hover:border-brand-black shadow-xs"
              title="Track Shipping Order"
            >
              <Truck className="w-3.5 h-3.5 text-stone-600 group-hover:text-brand-black transition-colors" />
              <span className="hidden lg:inline">Track Order</span>
            </button>

            {/* Wishlist Button */}
            <button
              id="wishlist-trigger"
              onClick={onOpenWishlist}
              className="text-brand-black hover:text-brand-gold transition-colors p-2 relative"
              aria-label="Open wishlist"
            >
              <Heart className={`w-5.5 h-5.5 ${wishlist.length > 0 ? 'fill-red-500 text-red-500' : ''}`} />
              {wishlist.length > 0 && (
                <span className="absolute top-1.5 right-1.5 bg-brand-gold text-brand-black text-[10px] h-4 w-4 rounded-full flex items-center justify-center font-bold">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              id="cart-trigger"
              onClick={onOpenCart}
              className="text-brand-black hover:text-brand-gold transition-colors p-2 relative"
              aria-label="Open shopping cart"
            >
              <ShoppingBag className="w-5.5 h-5.5" />
              {totalCartItems > 0 && (
                <span className="absolute top-1.5 right-1.5 bg-brand-black text-brand-cream border border-brand-gold/50 text-[10px] h-4 w-4 rounded-full flex items-center justify-center font-bold animate-bounce">
                  {totalCartItems}
                </span>
              )}
            </button>
          </div>

        </div>
      </nav>

      {/* Mobile Drawer Navigation Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden" id="mobile-drawer-root">
          <div 
            className="fixed inset-0 bg-brand-black/60 backdrop-blur-xs transition-opacity" 
            onClick={() => setMobileMenuOpen(false)} 
          />
          
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-brand-cream border-r border-brand-black/10 p-6 shadow-2xl transition-transform duration-300 ease-out h-full">
            <div className="flex items-center justify-between mb-8">
              <span className="font-serif text-xl font-bold tracking-widest text-brand-black">AFINDS</span>
              <button
                id="close-mobile-menu"
                onClick={() => setMobileMenuOpen(false)}
                className="text-brand-black hover:text-brand-gold p-2"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Mobile Nav Links */}
            <div className="flex flex-col space-y-6 text-lg tracking-widest font-sans font-semibold uppercase">
              <button
                onClick={() => handleQueryClick('all')}
                className={`text-left py-2 border-b border-brand-black/5 ${activeCategory === 'all' ? 'text-brand-gold border-brand-gold' : 'text-brand-black'}`}
              >
                Shop All
              </button>
              <button
                onClick={() => handleQueryClick('women')}
                className={`text-left py-2 border-b border-brand-black/5 ${activeCategory === 'women' ? 'text-brand-gold border-brand-gold' : 'text-brand-black'}`}
              >
                Women's Apparel
              </button>
              <button
                onClick={() => handleQueryClick('men')}
                className={`text-left py-2 border-b border-brand-black/5 ${activeCategory === 'men' ? 'text-brand-gold border-brand-gold' : 'text-brand-black'}`}
              >
                Men's Apparel
              </button>
              <button
                onClick={() => handleQueryClick('sale')}
                className={`text-left py-2 border-b border-brand-black/5 ${activeCategory === 'sale' ? 'text-red-500 border-red-500' : 'text-red-600 font-bold'}`}
              >
                ⚡ Seasonal Sale
              </button>
            </div>

            {/* Cheeky copy in drawer */}
            <div className="mt-auto pt-6 border-t border-brand-black/10 text-center">
              <p className="font-serif italic text-sm text-brand-black/60">
                "If you want to have a beautiful girlfriend, buy this shirt."
              </p>
              <p className="text-[10px] font-sans text-brand-gold tracking-widest mt-2 uppercase">Original Streetwear</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
