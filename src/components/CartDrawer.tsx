import React, { useState } from 'react';
import { X, Minus, Plus, Trash2, ShoppingBag, Sparkles, Gift, ChevronLeft, CreditCard, CheckCircle, MapPin, Mail, Phone, User } from 'lucide-react';
import { CartItem, Order } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  cart: CartItem[];
  onClose: () => void;
  onUpdateQuantity: (productId: number, size: string, change: number) => void;
  onRemoveItem: (productId: number, size: string) => void;
  onClearCart: () => void;
  onPlaceOrder: (order: Order) => void;
  onTrackOrder: (orderId: string) => void;
}

export default function CartDrawer({
  isOpen,
  cart,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onPlaceOrder,
  onTrackOrder,
}: CartDrawerProps) {
  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0); // e.g. 0.10 for 10%
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');

  // Checkout Form states
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Checkout completion state
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  if (!isOpen) return null;

  const subtotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  
  // Free Shipping Calculation ($75 limit)
  const freeShippingThreshold = 75;
  const isFreeShipping = subtotal >= freeShippingThreshold;
  const shippingDue = freeShippingThreshold - subtotal;
  const freeShippingPct = Math.min((subtotal / freeShippingThreshold) * 100, 100);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    setPromoSuccess('');
    
    if (promoCode.trim().toUpperCase() === 'FIRST10') {
      setAppliedDiscount(0.10);
      setPromoSuccess('10% OFF PROMO CODE "FIRST10" APPLIED!');
    } else if (promoCode.trim() === '') {
      setPromoError('Please enter a code');
    } else {
      setPromoError('Invalid promo code. Try FIRST10');
    }
  };

  const discountAmount = subtotal * appliedDiscount;
  const finalTotal = subtotal - discountAmount;
  const shippingCharge = isFreeShipping ? 0 : 10;
  const grandTotal = finalTotal + shippingCharge;

  // Form Validation and Order dispatch
  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!fullName.trim()) errors.fullName = 'Full name is required';
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) errors.email = 'Valid email is required';
    if (!address.trim()) errors.address = 'Shipping address is required';
    if (!phone.trim()) errors.phone = 'Phone number is required';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    
    // Generate a unique Order Number
    const generatedId = `AF-${Math.floor(100000 + Math.random() * 900000)}`;
    
    const newOrder: Order = {
      id: generatedId,
      customerName: fullName,
      customerEmail: email,
      address: address,
      phone: phone,
      items: [...cart],
      subtotal: subtotal,
      discount: discountAmount,
      shipping: shippingCharge,
      total: grandTotal,
      date: new Date().toISOString(),
      status: 'Pending',
    };

    // Save order in parent state (persisted to LocalStorage)
    onPlaceOrder(newOrder);
    
    // Setup completed order UI
    setCompletedOrder(newOrder);
    onClearCart();
    
    // Reset Form Fields
    setPromoCode('');
    setAppliedDiscount(0);
    setPromoSuccess('');
  };

  // Close the order completion visual slate
  const handleCloseSuccess = () => {
    setCompletedOrder(null);
    setIsCheckingOut(false);
    setFullName('');
    setEmail('');
    setAddress('');
    setPhone('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" id="cart-drawer-root">
      {/* Dark overlay backdrop */}
      <div 
        className="absolute inset-0 bg-brand-black/60 backdrop-blur-xs transition-opacity animate-fadeIn" 
        onClick={completedOrder ? handleCloseSuccess : onClose} 
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md bg-brand-cream border-l border-brand-black/10 shadow-2xl flex flex-col animate-slideLeft">
          
          {/* RENDER MODE A: ORDER PLACED SUCCESSFULLY SCREEN */}
          {completedOrder ? (
            <div className="flex-1 flex flex-col justify-between p-6 overflow-y-auto">
              <div className="my-auto text-center space-y-6 py-8">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center text-green-700 mx-auto border border-green-200 shadow-sm animate-bounce">
                  <CheckCircle className="w-9 h-9" />
                </div>
                
                <div className="space-y-2">
                  <span className="text-[10px] text-brand-gold font-bold tracking-[0.25em] uppercase block">
                    THANK YOU FOR YOUR PURCHASE!
                  </span>
                  <h2 className="font-serif text-2xl font-black text-brand-black">Your Closet is Upgraded</h2>
                  <p className="text-xs text-stone-500 max-w-[280px] mx-auto leading-relaxed">
                    We've received your streetwear order and our shipping team is preparing your package.
                  </p>
                </div>

                {/* Receipt Card highlights */}
                <div className="bg-white p-5 rounded border border-brand-black/10 text-left space-y-3.5 max-w-sm mx-auto font-sans">
                  <div className="flex justify-between border-b border-stone-100 pb-2.5">
                    <span className="text-[10px] text-stone-400 font-extrabold uppercase uppercase">Receipt Token</span>
                    <span className="text-xs font-mono font-bold text-brand-gold">{completedOrder.id}</span>
                  </div>

                  <div className="text-xs space-y-1.5">
                    <p className="font-semibold text-brand-black">Recipient: <span className="font-normal text-stone-600">{completedOrder.customerName}</span></p>
                    <p className="font-semibold text-brand-black truncate">Email: <span className="font-normal text-stone-600">{completedOrder.customerEmail}</span></p>
                    <p className="font-semibold text-brand-black leading-relaxed">Shipping Dest: <span className="font-normal text-stone-600">{completedOrder.address}</span></p>
                  </div>

                  <div className="border-t border-dashed border-stone-100 pt-3 flex justify-between items-center bg-stone-50/50 p-2.5 rounded gap-1">
                    <span className="text-[10px] text-stone-400 font-extrabold uppercase">Total Paid</span>
                    <span className="font-mono text-sm font-extrabold text-brand-black">${completedOrder.total.toFixed(2)}</span>
                  </div>
                </div>

                <p className="text-[10px] text-stone-400 leading-relaxed max-w-[250px] mx-auto">
                  A verification receipt email was dispatched. You may track this order in real-time or check transit progress below.
                </p>
              </div>

              <div className="space-y-2 mt-auto">
                <button
                  onClick={() => {
                    const trackingId = completedOrder.id;
                    handleCloseSuccess();
                    // trigger callback
                    setTimeout(() => onTrackOrder(trackingId), 150);
                  }}
                  className="w-full py-3.5 bg-brand-gold text-brand-black hover:bg-brand-black hover:text-brand-cream text-xs font-sans font-bold uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 cursor-pointer border border-brand-gold hover:border-brand-black"
                >
                  TRACK MY ORDER NOW 🚚
                </button>
                <button
                  onClick={handleCloseSuccess}
                  className="w-full py-3.5 bg-transparent hover:bg-stone-100 text-brand-black text-xs font-sans font-extrabold uppercase tracking-[0.2em] transition-all flex items-center justify-center cursor-pointer border border-brand-black/15 rounded"
                >
                  Return to storefront ⚡
                </button>
              </div>
            </div>
          ) : (
            /* RENDER MODE B: ACTIVE CART OR CHECKOUT FORM FLOW */
            <>
              {/* Header */}
              <div className="p-6 border-b border-brand-black/10 flex items-center justify-between">
                {isCheckingOut ? (
                  <button 
                    onClick={() => setIsCheckingOut(false)}
                    className="flex items-center gap-1.5 text-xs font-sans font-extrabold uppercase tracking-widest text-brand-black hover:text-brand-gold transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" /> Back to Bag
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-brand-gold animate-pulse" />
                    <h2 className="font-serif text-lg font-bold tracking-tight text-brand-black">Your Shopping Bag</h2>
                    <span className="bg-brand-black text-brand-cream text-[10px] font-bold px-2 py-0.5 rounded-full font-mono">
                      {cart.reduce((tot, it) => tot + it.quantity, 0)}
                    </span>
                  </div>
                )}
                
                <button
                  onClick={onClose}
                  className="p-2 text-brand-black hover:text-brand-gold hover:scale-105 transition-all"
                  aria-label="Close cart sidebar"
                >
                  <X className="w-5.5 h-5.5" />
                </button>
              </div>

              {/* Shipping tracker (Only displayed in Cart Bag subview) */}
              {!isCheckingOut && cart.length > 0 && (
                <div className="px-6 py-4 bg-stone-100 border-b border-brand-black/5">
                  {isFreeShipping ? (
                    <p className="text-[11px] font-bold tracking-wider text-green-700 uppercase flex items-center gap-1.5 justify-center">
                      <Gift className="w-4 h-4 animate-bounce" /> YOU HAVE UNLOCKED <strong>FREE SHIPPING!</strong>
                    </p>
                  ) : (
                    <div className="space-y-1.5">
                      <p className="text-[11px] text-stone-600 font-medium text-center">
                        Add <strong className="text-brand-black font-extrabold">${shippingDue.toFixed(2)}</strong> more to unlock <strong className="text-brand-gold">FREE SHIPPING</strong>
                      </p>
                      <div className="h-2 w-full bg-stone-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-brand-gold rounded-full transition-all duration-500" 
                          style={{ width: `${freeShippingPct}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Main Contents Panel */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {isCheckingOut ? (
                  /* Form Subview */
                  <form onSubmit={handleCheckoutSubmit} className="space-y-5 font-sans">
                    <div>
                      <span className="text-[9px] text-brand-gold font-bold tracking-[0.2em] uppercase block mb-1">
                        SECURE PAYLOAD
                      </span>
                      <h3 className="font-serif text-lg font-black text-brand-black">Delivery Information</h3>
                      <p className="text-xs text-stone-500 mt-0.5">Where should we deliver your street wears?</p>
                    </div>

                    {/* Full Name */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
                        Full Name <span className="text-brand-gold">*</span>
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="e.g. John Doe"
                          className={`w-full bg-white text-xs text-brand-black border ${formErrors.fullName ? 'border-red-500' : 'border-brand-black/15'} pl-9 pr-4 py-2.5 rounded focus:outline-none focus:border-brand-gold`}
                        />
                      </div>
                      {formErrors.fullName && <p className="text-[10px] text-red-500 font-medium">{formErrors.fullName}</p>}
                    </div>

                    {/* Email */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
                        Email Address <span className="text-brand-gold">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="e.g. john@example.com"
                          className={`w-full bg-white text-xs text-brand-black border ${formErrors.email ? 'border-red-500' : 'border-brand-black/15'} pl-9 pr-4 py-2.5 rounded focus:outline-none focus:border-brand-gold`}
                        />
                      </div>
                      {formErrors.email && <p className="text-[10px] text-red-500 font-medium">{formErrors.email}</p>}
                    </div>

                    {/* Phone */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
                        Phone Number <span className="text-brand-gold">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-2.5 w-4 h-4 text-stone-400 font-mono" />
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="e.g. +1 555-019-2834"
                          className={`w-full bg-white text-xs text-brand-black border ${formErrors.phone ? 'border-red-500' : 'border-brand-black/15'} pl-9 pr-4 py-2.5 rounded focus:outline-none focus:border-brand-gold`}
                        />
                      </div>
                      {formErrors.phone && <p className="text-[10px] text-red-500 font-medium">{formErrors.phone}</p>}
                    </div>

                    {/* Physical Delivery Address */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
                        Shipping Address <span className="text-brand-gold">*</span>
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
                        <textarea
                          required
                          rows={2}
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="e.g. 742 Evergreen Terrace, Springfield, OR 97477"
                          className={`w-full bg-white text-xs text-brand-black border ${formErrors.address ? 'border-red-500' : 'border-brand-black/15'} pl-9 pr-4 py-2 rounded focus:outline-none focus:border-brand-gold`}
                        />
                      </div>
                      {formErrors.address && <p className="text-[10px] text-red-500 font-medium">{formErrors.address}</p>}
                    </div>

                    {/* Dummy Payment visual container */}
                    <div className="p-4 bg-stone-100 rounded border border-brand-black/5 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-black flex items-center gap-1">
                          <CreditCard className="w-4 h-4 text-brand-gold" /> Payment Sandbox
                        </span>
                        <span className="bg-green-15% text-green-700 px-2 py-0.5 rounded text-[9px] uppercase font-bold tracking-wider font-sans border border-green-200">
                          Demo Mode
                        </span>
                      </div>
                      <p className="text-[10px] text-stone-500 leading-relaxed font-sans">
                        Enjoy free access! Real credentials are never charged. Clicking the placement trigger simulates success cleanly.
                      </p>
                    </div>

                    {/* Invisible submit button to bind enter click */}
                    <button type="submit" className="hidden" />
                  </form>
                ) : (
                  /* Direct Bag listing info */
                  <>
                    {cart.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                        <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center text-stone-400">
                          <ShoppingBag className="w-8 h-8" />
                        </div>
                        <div>
                          <h3 className="font-serif text-base font-bold text-brand-black">Your bag is empty</h3>
                          <p className="font-sans text-xs text-stone-500 mt-1 max-w-[240px] leading-relaxed">
                            If you want to have a beautiful girlfriend (or husband), you're going to need a bigger wardrobe.
                          </p>
                        </div>
                        <button
                          onClick={onClose}
                          className="px-6 py-3 bg-brand-black hover:bg-brand-gold text-brand-cream hover:text-brand-black font-sans uppercase text-[10px] font-bold tracking-widest transition-all cursor-pointer"
                        >
                          Start Shopping
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {cart.map((item) => (
                          <div 
                            key={`${item.product.id}-${item.selectedSize}`} 
                            className="flex items-center gap-4 py-3 border-b border-brand-black/5"
                          >
                            {/* Item Image */}
                            <div className="w-20 h-24 bg-stone-100 flex-shrink-0 overflow-hidden rounded border border-brand-black/5">
                              <img
                                src={item.product.image}
                                alt={item.product.name}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover object-top"
                              />
                            </div>

                            {/* Item Info and Controls */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-1.5">
                                <h4 className="font-sans text-xs sm:text-sm font-bold text-brand-black truncate">
                                  {item.product.name}
                                </h4>
                                
                                <button
                                  onClick={() => onRemoveItem(item.product.id, item.selectedSize)}
                                  className="text-stone-400 hover:text-red-500 transition-colors p-1 cursor-pointer"
                                  aria-label="Remove item"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>

                              <span className="inline-block bg-brand-gold/15 text-brand-gold text-[9px] uppercase tracking-widest font-extrabold px-2 py-0.5 mt-1 rounded border border-brand-gold/25">
                                SIZE: {item.selectedSize}
                              </span>

                              <div className="flex items-center justify-between mt-3">
                                <div className="flex items-center border border-brand-black/10 rounded overflow-hidden bg-brand-cream">
                                  <button
                                    onClick={() => onUpdateQuantity(item.product.id, item.selectedSize, -1)}
                                    className="p-1.5 text-stone-500 hover:text-brand-black hover:bg-stone-100 transition-colors cursor-pointer"
                                    aria-label="Decrease quantity"
                                  >
                                    <Minus className="w-3.5 h-3.5" />
                                  </button>
                                  
                                  <span className="px-2.5 text-xs font-mono font-bold text-brand-black select-none">
                                    {item.quantity}
                                  </span>

                                  <button
                                    onClick={() => onUpdateQuantity(item.product.id, item.selectedSize, 1)}
                                    className="p-1.5 text-stone-500 hover:text-brand-black hover:bg-stone-100 transition-colors cursor-pointer"
                                    aria-label="Increase quantity"
                                  >
                                    <Plus className="w-3.5 h-3.5" />
                                  </button>
                                </div>

                                <span className="font-serif text-sm font-bold text-brand-black">
                                  ${(item.product.price * item.quantity).toFixed(2)}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Footer containing Summary calculation and actions */}
              {cart.length > 0 && (
                <div className="p-6 bg-stone-50 border-t border-brand-black/10 space-y-4">
                  
                  {/* Promo input field (Only in Cart Subview) */}
                  {!isCheckingOut && (
                    <form onSubmit={handleApplyPromo} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Enter code (Try FIRST10)"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="flex-1 bg-brand-cream uppercase text-xs font-sans tracking-wider border border-brand-black/15 px-3 py-2 rounded focus:outline-none focus:border-brand-gold"
                      />
                      <button
                        type="submit"
                        className="bg-brand-black hover:bg-brand-gold text-brand-cream hover:text-brand-black py-2 px-4 text-[10px] tracking-widest font-bold uppercase transition-all rounded cursor-pointer"
                      >
                        Apply
                      </button>
                    </form>
                  )}

                  {!isCheckingOut && promoError && <p className="text-[10px] text-red-600 font-medium tracking-wide">{promoError}</p>}
                  {!isCheckingOut && promoSuccess && <p className="text-[10px] text-green-700 font-bold tracking-wide flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5" /> {promoSuccess}</p>}

                  {/* Order Summation rows */}
                  <div className="space-y-1.5 font-sans text-xs">
                    <div className="flex justify-between text-stone-500">
                      <span>Bag Subtotal</span>
                      <span className="font-mono">${subtotal.toFixed(2)}</span>
                    </div>
                    
                    {appliedDiscount > 0 && (
                      <div className="flex justify-between text-green-700 font-medium">
                        <span>Discount (FIRST10 - 10%)</span>
                        <span className="font-mono">-${discountAmount.toFixed(2)}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-stone-500">
                      <span>Estimated Shipping</span>
                      <span className="font-mono uppercase text-[10px] font-bold text-green-700">
                        {isFreeShipping ? 'FREE' : '$10.00'}
                      </span>
                    </div>

                    <div className="flex justify-between font-serif text-base font-extrabold text-brand-black border-t border-brand-black/5 pt-2 mt-2">
                      <span>Total Amount</span>
                      <span className="font-mono">${(isFreeShipping ? finalTotal : finalTotal + 10).toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Checkout Trigger CTA button */}
                  {isCheckingOut ? (
                    <button
                      onClick={handleCheckoutSubmit}
                      className="w-full py-4 bg-brand-black hover:bg-brand-gold text-brand-cream hover:text-brand-black text-xs font-sans font-bold uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 group cursor-pointer"
                    >
                      COMPLETE PURCHASE ⚡
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsCheckingOut(true)}
                      className="w-full py-4 bg-brand-black hover:bg-brand-gold text-brand-cream hover:text-brand-black text-xs font-sans font-bold uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 group cursor-pointer"
                    >
                      PROCEED TO CHECKOUT ⚡
                    </button>
                  )}
                  
                  <p className="text-[9px] text-stone-400 text-center font-sans tracking-wide">
                    🛡️ Card Data Is Processed Over Clean Encrypted Secure Tunnel.
                  </p>
                </div>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  );
}

