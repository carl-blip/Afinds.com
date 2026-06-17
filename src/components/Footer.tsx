import React, { useState } from 'react';
import { Facebook, Instagram, Twitter, Mail, Check, Sparkles, Send } from 'lucide-react';

interface FooterProps {
  onOpenTracking?: () => void;
}

export default function Footer({ onOpenTracking }: FooterProps) {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSuccess(true);
    setEmail('');
    setTimeout(() => setSuccess(false), 5000);
  };

  return (
    <footer id="footer-section" className="bg-brand-black text-brand-cream border-t border-brand-gold/25 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Upper footer grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12 pb-12 border-b border-white/10">
          
          {/* Column 1: Brand Pitch & Socials */}
          <div className="lg:col-span-2 space-y-4">
            <span className="font-serif text-2xl font-black tracking-[0.2em] text-brand-gold inline-block">
              AFINDS
            </span>
            <p className="font-sans text-xs sm:text-sm text-stone-400 leading-relaxed max-w-sm tracking-wide">
              "If you want to have a beautiful girlfriend, buy this shirt." Bold streetwear built to help you stand taller, feel crisp, and spark genuine conversations. Est. in Rome / Tokyo.
            </p>
            
            {/* Social channels */}
            <div className="flex items-center space-x-4 pt-2 text-stone-300">
              <a href="#" className="hover:text-brand-gold transition-colors p-1.5 hover:bg-white/5 rounded-full" aria-label="Facebook channel">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="hover:text-brand-gold transition-colors p-1.5 hover:bg-white/5 rounded-full" aria-label="Instagram channel">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="hover:text-brand-gold transition-colors p-1.5 hover:bg-white/5 rounded-full" aria-label="Twitter channel">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Shop Links */}
          <div className="space-y-4">
            <h4 className="text-[10px] uppercase font-black tracking-[0.25em] text-brand-gold">
              SHOP ORIGINAL
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400 font-sans tracking-wide">
              <li>
                <a href="#products-section" className="hover:text-brand-gold transition-colors">Men's Signature Looks</a>
              </li>
              <li>
                <a href="#products-section" className="hover:text-brand-gold transition-colors">Women's Premium Blazers</a>
              </li>
              <li>
                <a href="#products-section" className="hover:text-brand-gold transition-colors">Cult Accessories</a>
              </li>
              <li>
                <a href="#products-section" className="hover:text-brand-gold transition-colors text-red-400 font-bold">⚡ Seasonal Sale</a>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Care */}
          <div className="space-y-4">
            <h4 className="text-[10px] uppercase font-black tracking-[0.25em] text-brand-gold">
              HELP & DEBATES
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400 font-sans tracking-wide">
              <li>
                <span 
                  onClick={onOpenTracking}
                  className="hover:text-brand-gold transition-colors cursor-pointer"
                >
                  Live Shipping Tracker 🚚
                </span>
              </li>
              <li><span className="hover:text-brand-gold transition-colors cursor-pointer">Returns Policy (30 Days)</span></li>
              <li><span className="hover:text-brand-gold transition-colors cursor-pointer">Custom Size Calculator</span></li>
              <li><span className="hover:text-brand-gold transition-colors cursor-pointer">Does this shirt work? (FAQ)</span></li>
            </ul>
          </div>

          {/* Column 4: Newsletter capture */}
          <div className="space-y-4">
            <h4 className="text-[10px] uppercase font-black tracking-[0.25em] text-brand-gold">
              STAY NOTIFIED
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed tracking-wide">
              Sign up to receive our cheeky copywriting, sizing drops, and coupons first.
            </p>

            {/* Form */}
            {!success ? (
              <form onSubmit={handleSubscribe} className="flex">
                <input
                  type="email"
                  required
                  placeholder="Tell us your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-stone-900 border border-white/20 text-brand-cream text-xs px-3 py-2 rounded-l focus:outline-none focus:border-brand-gold placeholder:text-stone-500"
                />
                <button
                  type="submit"
                  className="bg-brand-gold text-brand-black px-3 py-2 rounded-r hover:bg-brand-cream hover:text-brand-black transition-colors flex items-center justify-center font-bold"
                  aria-label="Subscribe now"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            ) : (
              <div className="p-3 bg-brand-gold/10 border border-brand-gold/30 rounded text-brand-gold text-[10px] font-bold tracking-wide flex items-center gap-1.5 animate-fadeIn">
                <Check className="w-3.5 h-3.5" /> Use code <strong className="text-brand-cream underline">FIRST10</strong> for 10% off!
              </div>
            )}
          </div>

        </div>

        {/* Lower footer copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-500 tracking-wider">
          <p>© {new Date().getFullYear()} Afinds. Built beautifully. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="hover:text-brand-cream cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-brand-cream cursor-pointer transition-colors">Terms of Service</span>
            <span className="hover:text-brand-cream cursor-pointer transition-colors">Cookie Policy</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
