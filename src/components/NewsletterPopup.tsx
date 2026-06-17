import React, { useState, useEffect } from 'react';
import { X, Mail, Sparkles, Check } from 'lucide-react';

export default function NewsletterPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // Check if user has already subscribed or dismissed
    const hasInteracted = localStorage.getItem('afinds_popup_interacted');
    if (hasInteracted) return;

    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 5000); // Trigger after 5 seconds

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    localStorage.setItem('afinds_popup_interacted', 'true');
    setIsOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    // Simulate discount code acquisition
    localStorage.setItem('afinds_popup_interacted', 'true');
    localStorage.setItem('afinds_subscribed', 'true');
    setSubmitted(true);
    
    setTimeout(() => {
      setIsOpen(false);
    }, 3000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" id="popup-root">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-brand-black/75 backdrop-blur-xs transition-opacity animate-fadeIn" 
        onClick={handleDismiss} 
      />

      {/* Pop-up Box */}
      <div className="relative bg-brand-cream border border-brand-black/10 rounded max-w-lg w-full p-6 sm:p-10 text-center shadow-2xl overflow-hidden animate-zoomIn z-10">
        
        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 text-brand-black/50 hover:text-brand-black hover:scale-105 p-1 transition-all"
          aria-label="No discount today"
        >
          <X className="w-5.5 h-5.5" />
        </button>

        {!submitted ? (
          <div className="space-y-5">
            {/* Crown header icon */}
            <div className="mx-auto w-12 h-12 bg-brand-black text-brand-gold rounded-full flex items-center justify-center">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>

            <span className="text-[10px] text-brand-gold font-bold tracking-[0.25em] uppercase block">
              MEMBER-ONLY EXCLUSIVE PRIVILEGE
            </span>

            <h3 className="font-serif text-2xl sm:text-3xl font-extrabold tracking-tight text-brand-black leading-tight">
              Wait! Your Wardrobe <br />
              Is Begging You.
            </h3>

            <p className="font-sans text-xs sm:text-sm text-stone-600 leading-relaxed max-w-sm mx-auto">
              Join over 10,000 guys (and girls) who upgraded their style competence and boosted their first-date confidence level by 300%. 
            </p>

            {/* Email form submit */}
            <form onSubmit={handleSubmit} className="space-y-3 max-w-sm mx-auto pt-3">
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-stone-50 border border-brand-black/15 text-stone-950 font-sans text-xs py-3.5 pl-10 pr-4 rounded focus:outline-none focus:border-brand-gold text-center"
                />
                <Mail className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-stone-400" />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-brand-black hover:bg-brand-gold text-brand-cream hover:text-brand-black font-sans uppercase text-xs font-bold tracking-[0.2em] transition-all"
              >
                Claim My 10% Discount ⚡
              </button>
            </form>

            <button
              onClick={handleDismiss}
              className="text-[10px] uppercase font-bold tracking-widest text-stone-400 hover:text-brand-black transition-colors underline underline-offset-4 block mx-auto pt-2 cursor-pointer"
            >
              No, I prefer wearing cargo shorts from 2012
            </button>
          </div>
        ) : (
          <div className="space-y-5 py-8 animate-fadeIn">
            <div className="mx-auto w-12 h-12 bg-green-700 text-brand-cream rounded-full flex items-center justify-center">
              <Check className="w-6 h-6" />
            </div>
            
            <h3 className="font-serif text-2xl font-bold text-green-700">You're Registered!</h3>
            
            <p className="font-sans text-sm text-stone-600 leading-relaxed max-w-xs mx-auto">
              Welcome to the family. Use promo code <strong className="text-brand-black font-extrabold bg-brand-gold/15 px-2 py-0.5 rounded border border-brand-gold/20">FIRST10</strong> for 10% off your entire bag!
            </p>

            <span className="text-[10px] text-stone-400 block tracking-widest uppercase">
              Closing this screen...
            </span>
          </div>
        )}

      </div>
    </div>
  );
}
