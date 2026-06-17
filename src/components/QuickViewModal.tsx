import React, { useState } from 'react';
import { X, Star, Heart, Check, ArrowRight, ShieldAlert, MessageSquare, Plus, PenTool } from 'lucide-react';
import { Product, Review } from '../types';
import { sizes } from '../data';

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  isWishlisted: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, size: string) => void;
  onToggleWishlist: (productId: number) => void;
  reviews: Review[];
  onAddReview: (productId: number, reviewerName: string, rating: number, reviewText: string, fit?: 'small' | 'true' | 'large') => void;
}

export default function QuickViewModal({
  product,
  isOpen,
  isWishlisted,
  onClose,
  onAddToCart,
  onToggleWishlist,
  reviews,
  onAddReview,
}: QuickViewModalProps) {
  const [selectedSize, setSelectedSize] = useState('M');
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'reviews'>('details');

  // New review form states
  const [newReviewName, setNewReviewName] = useState('');
  const [newReviewText, setNewReviewText] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewFit, setNewReviewFit] = useState<'small' | 'true' | 'large'>('true');
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState('');

  // Dynamic Fit Ratio Analyzer Calculations
  const fitCounts = reviews.reduce(
    (acc, r) => {
      if (r.fit === 'small') acc.small += 1;
      else if (r.fit === 'large') acc.large += 1;
      else if (r.fit === 'true') acc.true += 1;
      return acc;
    },
    { small: 0, true: 0, large: 0 }
  );
  const totalWithFit = fitCounts.small + fitCounts.true + fitCounts.large;

  let fitLabel = 'True to Size';
  let truePercent = 100;
  let smallPercent = 0;
  let largePercent = 0;

  if (totalWithFit > 0) {
    truePercent = Math.round((fitCounts.true / totalWithFit) * 100);
    smallPercent = Math.round((fitCounts.small / totalWithFit) * 100);
    largePercent = Math.round((fitCounts.large / totalWithFit) * 100);

    if (fitCounts.small >= fitCounts.true && fitCounts.small >= fitCounts.large) {
      fitLabel = 'Runs Small';
    } else if (fitCounts.large >= fitCounts.true && fitCounts.large >= fitCounts.small) {
      fitLabel = 'Runs Large';
    } else {
      fitLabel = 'True to Size';
    }
  } else {
    // Default fallback based on category or product seed
    truePercent = 85;
    smallPercent = 10;
    largePercent = 5;
    fitLabel = 'True to Size';
  }

  if (!isOpen || !product) return null;

  const handleAddToCart = () => {
    if (product.badge === 'Sold Out') return;
    onAddToCart(product, selectedSize);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose(); // close the modal after adding
    }, 1200);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewName.trim()) {
      alert("Please enter your name");
      return;
    }
    if (!newReviewText.trim()) {
      alert("Please enter your review experience");
      return;
    }

    onAddReview(product.id, newReviewName.trim(), newReviewRating, newReviewText.trim(), newReviewFit);
    
    // reset form fields
    setNewReviewName('');
    setNewReviewText('');
    setNewReviewRating(5);
    setNewReviewFit('true');
    setSubmitSuccess('Thank you! Your experience has been published instantly.');
    setTimeout(() => {
      setSubmitSuccess('');
    }, 4500);
  };

  const isSoldOut = product.badge === 'Sold Out';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto" id="quickview-modal-root">
      {/* Visual Backdrop Layer */}
      <div 
        className="fixed inset-0 bg-brand-black/70 backdrop-blur-xs transition-opacity animate-fadeIn" 
        onClick={onClose} 
      />

      {/* Main Modal Box Container - Set max height for scrollability, handles overflow cleanly */}
      <div className="relative bg-brand-cream max-w-4xl w-full rounded border border-brand-black/10 shadow-2xl overflow-hidden animate-zoomIn z-10 flex flex-col md:flex-row h-auto max-h-[92vh] md:max-h-[85vh]">
        
        {/* Close Button Top Right */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-brand-cream/80 backdrop-blur-xs text-brand-black hover:text-brand-gold p-2 rounded-full border border-brand-black/5 hover:scale-105 transition-all cursor-pointer"
          aria-label="Close product view"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Column 1: Large Product Image Showcase */}
        <div className="md:w-1/2 relative bg-stone-100 min-h-[220px] md:h-auto overflow-hidden">
          {product.badge && (
            <span className="absolute top-4 left-4 z-10 bg-brand-black/90 text-brand-cream border border-brand-gold/50 text-[10px] uppercase font-black px-2.5 py-1 tracking-wider rounded">
              {product.badge}
            </span>
          )}

          <img
            src={product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-top"
          />
        </div>

        {/* Column 2: Product Context details & Checkout Options */}
        <div className="md:w-1/2 p-5 sm:p-7 flex flex-col justify-between overflow-y-auto h-auto max-h-[70vh] md:max-h-full">
          
          <div className="space-y-4">
            {/* Category tag */}
            <span className="text-[10px] text-brand-gold font-bold uppercase tracking-[0.2em] block">
              {product.category}'s Apparel
            </span>

            {/* Product Title */}
            <h2 className="font-serif text-xl sm:text-2.5xl font-extrabold tracking-tight text-brand-black leading-tight">
              {product.name}
            </h2>

            {/* Price & Rating Row */}
            <div className="flex items-center justify-between border-b border-brand-black/5 pb-3">
              <p className="font-serif text-lg sm:text-xl font-black text-brand-black">
                ${product.price.toFixed(2)}
              </p>
              
              <div 
                onClick={() => setActiveTab('reviews')} 
                className="flex items-center gap-1 cursor-pointer group hover:opacity-80"
              >
                <div className="flex text-brand-gold">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-3.5 h-3.5 ${i < Math.floor(product.rating) ? 'fill-brand-gold' : ''}`} 
                    />
                  ))}
                </div>
                <span className="text-[11px] font-sans text-brand-black font-semibold underline underline-offset-2">
                  {product.rating} ({reviews.length})
                </span>
              </div>
            </div>

            {/* MODERN TABS SWITCHER: Specs vs Reviews */}
            <div className="flex border-b border-brand-black/10 text-xs font-sans tracking-wider uppercase font-extrabold">
              <button
                type="button"
                onClick={() => setActiveTab('details')}
                className={`flex-1 py-2 text-center transition-all cursor-pointer border-b-2 ${
                  activeTab === 'details'
                    ? 'border-brand-black text-brand-black'
                    : 'border-transparent text-stone-400 hover:text-brand-black'
                }`}
              >
                Item Details
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('reviews');
                  setSubmitSuccess('');
                }}
                className={`flex-1 py-2 text-center transition-all cursor-pointer border-b-2 flex items-center justify-center gap-1 ${
                  activeTab === 'reviews'
                    ? 'border-brand-black text-brand-black'
                    : 'border-transparent text-stone-400 hover:text-brand-black'
                }`}
              >
                Reviews ({reviews.length})
              </button>
            </div>

            {/* RENDER ACTIVE TAB */}
            {activeTab === 'details' ? (
              <div className="space-y-4 animate-fadeIn">
                {/* Descriptors */}
                <div className="text-xs text-stone-600 space-y-2 leading-relaxed">
                  <p>
                    Precision constructed from dynamic, heavyweight fabric blends sourced sustainably. Cut to emphasize natural shoulder structures and drape handsomely over any silhouette.
                  </p>
                  <p className="italic font-serif text-brand-black">
                    "This staple integrates easily with standard cargo overlays and neutral blazers, elevating regular daily streetfits."
                  </p>
                </div>

                {/* Interactive Size Selector */}
                {!isSoldOut ? (
                  <div className="space-y-2.5 pt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-brand-black uppercase tracking-wider block">
                        Choose Size
                      </span>
                      <span className="text-[9px] text-stone-400 font-medium">Standard US sizing</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {sizes.map((sz) => (
                        <button
                          key={sz}
                          onClick={() => setSelectedSize(sz)}
                          className={`h-9 w-11 text-[11px] font-sans font-bold flex items-center justify-center rounded border transition-all cursor-pointer ${
                            selectedSize === sz
                              ? 'bg-brand-black text-brand-cream border-brand-black'
                              : 'bg-brand-cream text-brand-black border-brand-black/15 hover:border-brand-gold hover:text-brand-gold'
                          }`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>

                    {/* Dynamic Fit Indicator Widget */}
                    <div className="pt-3 border-t border-brand-black/5 mt-3 space-y-1.5">
                      <div className="flex items-center justify-between text-[10px] font-sans">
                        <span className="text-stone-400">Buyer Fit Rating</span>
                        <span className="font-extrabold text-brand-black uppercase tracking-wider bg-brand-gold/15 px-1.5 py-0.5 rounded font-mono text-[9px] scale-95 origin-right">
                          {fitLabel} ({truePercent}% Match)
                        </span>
                      </div>
                      
                      {/* Horizontal 3-segmented bar chart */}
                      <div className="h-1.5 w-full bg-stone-100 rounded-full flex overflow-hidden">
                        <div 
                          style={{ width: `${smallPercent}%` }} 
                          className="h-full bg-amber-400" 
                          title={`Runs Small: ${smallPercent}%`} 
                        />
                        <div 
                          style={{ width: `${truePercent}%` }} 
                          className="h-full bg-brand-black" 
                          title={`Fits Perfect: ${truePercent}%`} 
                        />
                        <div 
                          style={{ width: `${largePercent}%` }} 
                          className="h-full bg-sky-400" 
                          title={`Runs Large: ${largePercent}%`} 
                        />
                      </div>
                      
                      <div className="flex justify-between text-[8px] font-mono uppercase text-stone-400 tracking-wider">
                        <span>Small ({smallPercent}%)</span>
                        <span className="text-brand-black font-extrabold">Perfect ({truePercent}%)</span>
                        <span>Large ({largePercent}%)</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-stone-100 border border-stone-200 text-stone-500 rounded flex items-center gap-2 text-[11px]">
                    <ShieldAlert className="w-4 h-4 text-stone-400" />
                    This style is currently sold out. Leave email below to get notifications.
                  </div>
                )}
              </div>
            ) : (
              /* BUYER REVIEWS & ADD REVIEW EXPERIENCE TAB */
              <div className="space-y-4 animate-fadeIn max-h-[38vh] overflow-y-auto pr-1">
                
                {/* Form success message if active */}
                {submitSuccess && (
                  <div className="p-3 bg-green-50 border border-green-200 text-green-700 text-xs rounded flex items-center gap-2 font-sans animate-fadeIn">
                    <Check className="w-4 h-4 shrink-0" />
                    <span>{submitSuccess}</span>
                  </div>
                )}

                {/* SUBMIT REVIEW ACCORDION FORM */}
                <form onSubmit={handleReviewSubmit} className="p-3.5 bg-brand-gold/5 border border-brand-gold/20 rounded space-y-3">
                  <span className="text-[10px] font-mono font-bold tracking-wider text-brand-gold uppercase block">
                    ★ Share Your Experience
                  </span>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[9px] text-stone-400 uppercase font-bold block">Your Name</label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. Liam R." 
                        value={newReviewName}
                        onChange={(e) => setNewReviewName(e.target.value)}
                        className="w-full bg-white border border-stone-200 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-brand-gold font-sans"
                      />
                    </div>

                    {/* Highly Interactive Star Ratings Picker */}
                    <div className="space-y-1">
                      <label className="text-[9px] text-stone-400 uppercase font-bold block">Your Rating</label>
                      <div className="flex items-center gap-0.5 mt-1.5">
                        {[1, 2, 3, 4, 5].map((star) => {
                          const isActive = star <= (hoverRating !== null ? hoverRating : newReviewRating);
                          return (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setNewReviewRating(star)}
                              onMouseEnter={() => setHoverRating(star)}
                              onMouseLeave={() => setHoverRating(null)}
                              className="p-0.5 transition-transform hover:scale-110 cursor-pointer"
                              aria-label={`Rate ${star} Stars`}
                            >
                              <Star 
                                className={`w-4 h-4 transition-colors ${
                                  isActive ? 'fill-brand-gold text-brand-gold' : 'text-stone-300'
                                }`} 
                              />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Sizing Fit Picker input */}
                  <div className="space-y-1">
                    <label className="text-[9px] text-stone-400 uppercase font-bold block">Size Fit Experience</label>
                    <div className="grid grid-cols-3 gap-1">
                      {[
                        { val: 'small', label: 'Runs Small 👕' },
                        { val: 'true', label: 'True to Size ✨' },
                        { val: 'large', label: 'Runs Large 🧥' }
                      ].map((item) => (
                        <button
                          key={item.val}
                          type="button"
                          onClick={() => setNewReviewFit(item.val as any)}
                          className={`py-1.5 text-[9px] font-sans font-bold uppercase tracking-wider rounded border text-center transition-all cursor-pointer ${
                            newReviewFit === item.val
                              ? 'bg-brand-black text-brand-cream border-brand-black/25'
                              : 'bg-white text-stone-600 border-stone-200 hover:border-brand-gold hover:text-brand-gold'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] text-stone-400 uppercase font-bold block">Review Description</label>
                    <textarea 
                      required
                      rows={2}
                      placeholder="Was the fit oversized? How was the fabric quality?"
                      value={newReviewText}
                      onChange={(e) => setNewReviewText(e.target.value)}
                      className="w-full bg-white border border-stone-200 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-brand-gold font-sans"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-brand-black hover:bg-brand-gold text-brand-cream hover:text-brand-black text-[10px] uppercase font-bold tracking-widest transition-colors cursor-pointer"
                  >
                    Post Experience Review ⚡
                  </button>
                </form>

                {/* CURRENT REVIEWS LIST FOR THIS PRODUCT */}
                <div className="space-y-3 font-sans mt-2">
                  <h4 className="text-[10px] font-bold tracking-widest text-stone-400 uppercase font-mono">
                    Buyer Logs ({reviews.length} Threads)
                  </h4>

                  {reviews.length === 0 ? (
                    <p className="text-xs text-stone-400 italic py-4 text-center">
                      No customer reviews yet. Be the first to submit your experience above!
                    </p>
                  ) : (
                    <div className="divide-y divide-stone-100 space-y-3">
                      {reviews.map((rev) => (
                        <div key={rev.id} className="pt-3 first:pt-0 space-y-1 bg-white/40 p-3 rounded border border-stone-100">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2">
                              <div className="w-6.5 h-6.5 rounded-full bg-brand-gold/15 text-brand-black flex items-center justify-center font-extrabold text-[9px] shrink-0">
                                {rev.initials}
                              </div>
                              <div>
                                <p className="text-xs font-bold text-brand-black leading-none">{rev.name}</p>
                                <span className="text-[9px] text-green-700 bg-green-100/50 px-1 py-0.5 mt-1 rounded font-semibold inline-flex items-center gap-0.5 scale-90 origin-left">
                                  ✓ Verified Buyer
                                </span>
                              </div>
                            </div>
                            <span className="text-[9px] text-stone-400 font-mono">{rev.date}</span>
                          </div>

                          <div className="flex items-center gap-2 pt-1 font-sans">
                            <div className="flex text-brand-gold">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`w-3 h-3 ${i < rev.rating ? 'fill-brand-gold text-brand-gold' : 'text-stone-200'}`} 
                                />
                              ))}
                            </div>
                            {rev.fit && (
                              <span className="text-[8px] uppercase tracking-wider font-extrabold text-[#7c5e10] bg-[#f9f5e8] px-1.5 py-0.5 rounded font-mono border border-brand-gold/15">
                                Fit: {rev.fit === 'small' ? 'Runs Small' : rev.fit === 'large' ? 'Runs Large' : 'True to Size'}
                              </span>
                            )}
                          </div>

                          <p className="text-[11px] text-stone-600 leading-relaxed font-sans italic pt-0.5">
                            "{rev.text}"
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                </div>

              </div>
            )}
          </div>

          {/* Action CTAs at bottom (Consistent) */}
          <div className="space-y-3 pt-4 border-t border-brand-black/5 mt-5">
            <div className="flex gap-3">
              {/* Add main button */}
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isSoldOut || added}
                className={`flex-1 py-3.5 uppercase text-[10px] sm:text-xs font-sans font-extrabold tracking-[0.2em] flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  isSoldOut
                    ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                    : added
                      ? 'bg-green-700 text-brand-cream'
                      : 'bg-brand-black hover:bg-brand-gold text-brand-cream hover:text-brand-black md:scale-100 hover:scale-[1.01] active:scale-[0.99] shadow-md'
                }`}
              >
                {added ? (
                  <span className="flex items-center gap-1.5">
                    <Check className="w-4 h-4" /> SECURED IN BAG!
                  </span>
                ) : isSoldOut ? (
                  'SOLD OUT'
                ) : (
                  'GET THE LOOK - ADD TO BAG'
                )}
              </button>

              {/* Wishlist Heart Toggle inside Quickview */}
              <button
                type="button"
                onClick={() => onToggleWishlist(product.id)}
                className={`p-3 rounded border transition-all ${
                  isWishlisted 
                    ? 'border-red-500/20 bg-red-50 text-red-500 hover:bg-red-100' 
                    : 'border-brand-black/15 hover:border-brand-gold hover:text-brand-gold bg-brand-cream text-brand-black'
                }`}
                aria-label="Add to visual wishlist"
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500' : ''}`} />
              </button>
            </div>

            <p className="text-[10px] text-stone-400 text-center font-sans tracking-wide leading-none">
              ⚡ Free shipping over $75 • Fast dispatch globally within 24 hours
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
