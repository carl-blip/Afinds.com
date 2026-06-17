import React, { useState } from 'react';
import { X, Search, Package, Truck, CheckCircle2, MapPin, Map, Calendar, ArrowRight, CornerDownRight, ShieldAlert, Phone, Inbox } from 'lucide-react';
import { Order } from '../types';

interface TrackingDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  initialOrderId?: string;
}

export default function TrackingDrawer({
  isOpen,
  onClose,
  orders,
  initialOrderId = '',
}: TrackingDrawerProps) {
  const [searchId, setSearchId] = useState(initialOrderId);
  const [errorMsg, setErrorMsg] = useState('');
  const sanitizeId = (id: string) => id.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();

  const [activeOrder, setActiveOrder] = useState<Order | null>(() => {
    if (initialOrderId) {
      const sanitizedInitial = sanitizeId(initialOrderId);
      const found = orders.find((o) => sanitizeId(o.id) === sanitizedInitial);
      if (found) return found;
    }
    return null;
  });

  // Re-sync if initialOrderId changes
  React.useEffect(() => {
    if (initialOrderId) {
      setSearchId(initialOrderId);
      const sanitizedInitial = sanitizeId(initialOrderId);
      const found = orders.find((o) => sanitizeId(o.id) === sanitizedInitial);
      if (found) {
        setActiveOrder(found);
        setErrorMsg('');
      } else {
        setErrorMsg(`Order with ticket code "${initialOrderId}" was not found in database.`);
      }
    }
  }, [initialOrderId, orders]);

  if (!isOpen) return null;

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setActiveOrder(null);

    const matchSearch = searchId.trim();
    if (!matchSearch) {
      setErrorMsg('Please enter an action ticket or order reference ID');
      return;
    }

    const sanitizedSearch = sanitizeId(matchSearch);
    const found = orders.find((o) => sanitizeId(o.id) === sanitizedSearch);
    if (found) {
      setActiveOrder(found);
    } else {
      setErrorMsg(`No live record matched code "${searchId.trim()}". Check spelling or see simulated IDs in Admin Panel.`);
    }
  };

  // Helper to figure out active step index based on order status
  const getStatusStepIndex = (status: Order['status']) => {
    switch (status) {
      case 'Pending':
        return 1;
      case 'Shipped':
        return 2;
      case 'Delivered':
        return 3;
      default:
        return 0;
    }
  };

  const stepIndex = activeOrder ? getStatusStepIndex(activeOrder.status) : 0;

  // Render dynamic estimation time based on order date
  const getDeliveryDateString = (originDate: string, status: Order['status']) => {
    const d = new Date(originDate);
    if (status === 'Delivered') {
      return `Delivered on ${d.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}`;
    }
    // Estimate +3 to +5 calendar days
    d.setDate(d.getDate() + 4);
    return `Estimated Arrival: ${d.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans" id="tracking-drawer-root">
      {/* Dark overlay */}
      <div 
        className="absolute inset-0 bg-brand-black/65 backdrop-blur-xs transition-opacity animate-fadeIn" 
        onClick={onClose} 
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md bg-brand-cream border-l border-brand-black/10 shadow-2xl flex flex-col h-full overflow-hidden animate-slideLeft">
          
          {/* Header section */}
          <div className="p-6 border-b border-brand-black/10 bg-white/70 backdrop-blur-md flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-brand-gold" />
              <h2 className="font-serif text-lg font-black tracking-tight text-brand-black">
                Live Courier Tracker
              </h2>
            </div>
            
            <button
              id="close-tracking-drawer"
              onClick={onClose}
              className="p-2 text-brand-black hover:text-brand-gold hover:scale-105 transition-all cursor-pointer"
              aria-label="Close tracking sidebar"
            >
              <X className="w-5.5 h-5.5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {/* Search lookup bar */}
            <div className="p-6 bg-stone-50 border-b border-brand-black/5">
              <form onSubmit={handleLookup} className="space-y-2">
                <label className="text-[10px] text-stone-400 font-extrabold uppercase tracking-widest block font-mono">
                  Input Purchase Order Ticket / ID
                </label>
                <div className="relative flex">
                  <input
                    id="tracking-lookup-input"
                    type="text"
                    required
                    placeholder="e.g. AF-928135"
                    value={searchId}
                    onChange={(e) => {
                      setSearchId(e.target.value);
                      if (errorMsg) setErrorMsg('');
                    }}
                    className="w-full bg-white text-brand-black border border-brand-black/15 font-mono text-sm px-4 py-3 rounded-l focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold pl-10"
                  />
                  <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                  <button
                    type="submit"
                    className="bg-brand-black hover:bg-brand-gold text-brand-cream hover:text-brand-black text-xs font-bold tracking-widest uppercase px-5 rounded-r transition-all cursor-pointer"
                  >
                    Locate 🛰️
                  </button>
                </div>
              </form>

              {errorMsg && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200/50 rounded flex gap-2.5 items-start animate-fadeIn">
                  <ShieldAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-[11px] text-red-600 font-bold font-sans">Lookup Alert</p>
                    <p className="text-[10px] text-red-500 font-sans leading-relaxed">{errorMsg}</p>
                  </div>
                </div>
              )}
            </div>

            {/* TRACKING DETAILS REPORT MODE */}
            {activeOrder ? (
              <div className="p-6 space-y-6 animate-fadeIn">
                
                {/* Visual Status Header */}
                <div className="bg-white p-5 rounded border border-brand-black/10 space-y-3 shadow-xs">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <span className="text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-brand-gold/15 text-brand-black/95">
                        Ticket: {activeOrder.id}
                      </span>
                      <h3 className="font-serif text-lg font-black text-brand-black mt-2">
                        {activeOrder.status === 'Cancelled' ? 'Delivery Curtailed' : 'In Premium Transit'}
                      </h3>
                    </div>
                    <span className={`text-[10px] font-mono font-semibold uppercase px-2.5 py-1 rounded inline-block ${
                      activeOrder.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                      activeOrder.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                      activeOrder.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      ● {activeOrder.status}
                    </span>
                  </div>

                  <hr className="border-stone-100" />

                  <div className="flex items-center gap-2 text-stone-600 text-xs">
                    <Calendar className="w-4 h-4 text-brand-gold" />
                    <span className="font-semibold text-brand-black text-[11px] sm:text-xs">
                      {getDeliveryDateString(activeOrder.date, activeOrder.status)}
                    </span>
                  </div>
                </div>

                {/* TIMELINE STEPS PROGRESS BAR */}
                {activeOrder.status !== 'Cancelled' ? (
                  <div className="p-4 bg-white rounded border border-brand-black/10 shadow-xs">
                    <h4 className="text-[10px] font-bold tracking-widest text-stone-400 uppercase mb-5 font-mono">
                      Real-Time Route Progress
                    </h4>
                    
                    <div className="relative pl-6 space-y-6 border-l border-stone-200">
                      
                      {/* STEP 3 - DELIVERED */}
                      <div className="relative">
                        {/* Bullet indicators */}
                        <div className={`absolute -left-[31px] top-0 w-4 h-4 rounded-full flex items-center justify-center border-2 ${
                          stepIndex >= 3 
                            ? 'bg-green-500 border-green-500 text-white' 
                            : 'bg-white border-stone-300 text-stone-300'
                        }`}>
                          {stepIndex >= 3 && <CheckCircle2 className="w-3.5 h-3.5 fill-green-500 text-white" />}
                        </div>
                        <div className="space-y-1">
                          <p className={`text-xs font-bold leading-none ${stepIndex >= 3 ? 'text-brand-black' : 'text-stone-400'}`}>
                            Package Landed & Signed
                          </p>
                          <p className="text-[10px] text-stone-400">
                            Courier team registers safe drop-off at home deck.
                          </p>
                        </div>
                      </div>

                      {/* STEP 2 - SHIPPED */}
                      <div className="relative">
                        <div className={`absolute -left-[31px] top-0 w-4 h-4 rounded-full flex items-center justify-center border-2 ${
                          stepIndex >= 2 
                            ? 'bg-brand-gold border-brand-black text-brand-black' 
                            : 'bg-white border-stone-300'
                        }`}>
                          {stepIndex >= 2 && <div className="w-1.5 h-1.5 bg-brand-black rounded-full" />}
                        </div>
                        <div className="space-y-1">
                          <p className={`text-xs font-bold leading-none ${stepIndex >= 2 ? 'text-brand-black' : 'text-stone-400'}`}>
                            Dispatched via AFINDS Cruiser
                          </p>
                          <p className="text-[10px] text-stone-400">
                            Truck transit #AFN-704 in motion. Passing local hubs.
                          </p>
                        </div>
                      </div>

                      {/* STEP 1 - RECEIVED / PENDING */}
                      <div className="relative">
                        <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-brand-black border-2 border-brand-black flex items-center justify-center text-white">
                          <div className="w-1.5 h-1.5 bg-brand-gold rounded-full" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-brand-black leading-none">
                            Order Confirmed & Picked
                          </p>
                          <p className="text-[10px] text-stone-400">
                            Streetwear outfits sorted, size validation check passed.
                          </p>
                        </div>
                      </div>

                    </div>
                  </div>
                ) : (
                  <div className="bg-red-50/50 p-4 rounded border border-red-200 text-stone-600 text-[11px] leading-relaxed">
                    🚨 <strong>Account Alert:</strong> This order is listed as Cancelled. Any pending checkout holds on your card have been automatically reversed. For inquiries, contact support at standard debrief hubs.
                  </div>
                )}

                {/* VISUAL SHIPPING MAP SIMULATION */}
                {activeOrder.status !== 'Cancelled' && (
                  <div className="p-4 bg-white/90 rounded border border-brand-black/10 shadow-xs space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold tracking-widest text-stone-400 uppercase font-mono flex items-center gap-1">
                        <Map className="w-3.5 h-3.5 text-brand-gold" /> Satellite Cruiser Map
                      </span>
                      <span className="text-[9px] font-mono uppercase font-bold text-green-700 bg-green-100/60 px-1.5 py-0.5 rounded leading-none">
                        ● GPS Live
                      </span>
                    </div>

                    {/* Styled vector roadmap mockup */}
                    <div className="h-28 bg-stone-100 rounded border border-stone-200 relative overflow-hidden flex items-center justify-center">
                      {/* Stylized background grids */}
                      <div className="absolute inset-0 opacity-[0.06] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]" />
                      
                      {/* Roadmap curves line */}
                      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                        <path 
                          d="M 40 85 C 100 85, 120 20, 190 20 C 260 20, 280 90, 360 90" 
                          fill="none" 
                          stroke="#e5e5e5" 
                          strokeWidth="6" 
                          strokeLinecap="round"
                        />
                        <path 
                          d="M 40 85 C 100 85, 120 20, 190 20 C 260 20, 280 90, 360 90" 
                          fill="none" 
                          stroke="#D4AF37" 
                          strokeWidth="3.5" 
                          strokeDasharray={
                            stepIndex === 1 ? "100 300" :
                            stepIndex === 2 ? "260 200" : "1000"
                          }
                          strokeLinecap="round"
                          className="transition-all duration-1000"
                        />
                      </svg>

                      {/* Origin Hub PIN */}
                      <div className="absolute left-[24px] bottom-[14px] flex flex-col items-center">
                        <div className="w-5 h-5 bg-brand-black text-brand-gold border-2 border-white rounded-full flex items-center justify-center shadow-xs">
                          <Package className="w-2.5 h-2.5" />
                        </div>
                        <span className="text-[8px] font-bold text-brand-black bg-white px-1 mt-1 rounded scale-90 leading-none">AFINDS HQ</span>
                      </div>

                      {/* Destination Home PIN */}
                      <div className="absolute right-[14px] bottom-[6px] flex flex-col items-center">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-xs ${
                          stepIndex === 3 ? 'bg-green-600 text-white' : 'bg-stone-400 text-white'
                        }`}>
                          <MapPin className="w-2.5 h-2.5" />
                        </div>
                        <span className="text-[8px] font-bold text-stone-600 bg-white px-1 mt-1 rounded scale-90 leading-none">Home</span>
                      </div>

                      {/* Moving Vehicle Dot */}
                      {stepIndex === 1 && (
                        <div className="absolute left-[95px] bottom-[37px] flex flex-col items-center animate-bounce">
                          <div className="w-6 h-6 bg-brand-black border border-brand-gold/40 text-brand-gold rounded-full flex items-center justify-center shadow">
                            <Truck className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      )}
                      
                      {stepIndex === 2 && (
                        <div className="absolute left-[225px] top-[26px] flex flex-col items-center animate-pulse">
                          <div className="w-6 h-6 bg-brand-black border border-brand-gold/40 text-brand-gold rounded-full flex items-center justify-center shadow">
                            <Truck className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      )}

                      {stepIndex === 3 && (
                        <div className="absolute right-[40px] bottom-[33px] flex flex-col items-center">
                          <div className="bg-green-100 text-green-700 px-1.5 py-0.5 rounded text-[8px] font-black uppercase mb-1 leading-none shadow-xs">At Door</div>
                          <div className="w-5 h-5 bg-green-600 text-white rounded-full flex items-center justify-center shadow animate-ping" />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* DELIVERY ADDRESS */}
                <div className="p-4 bg-white rounded border border-brand-black/10 shadow-xs space-y-2.5 font-sans">
                  <h4 className="text-[10px] font-bold tracking-widest text-stone-400 uppercase font-mono">
                    Consignee Coordinates
                  </h4>
                  <div className="text-xs space-y-1.5 text-stone-600">
                    <p className="font-semibold text-brand-black">Name: <span className="font-normal">{activeOrder.customerName}</span></p>
                    <p className="font-semibold text-brand-black leading-relaxed">Destination: <span className="font-normal">{activeOrder.address}</span></p>
                    <p className="font-semibold text-brand-black">Phone Contact: <span className="font-normal">{activeOrder.phone}</span></p>
                  </div>
                </div>

                {/* PURCHASED ITEMS */}
                <div className="p-4 bg-white rounded border border-brand-black/10 shadow-xs space-y-3 font-sans">
                  <h4 className="text-[10px] font-bold tracking-widest text-stone-400 uppercase font-mono">
                    Package Cargo ({activeOrder.items.length} Units)
                  </h4>
                  
                  <div className="divide-y divide-stone-100 max-h-40 overflow-y-auto pr-1">
                    {activeOrder.items.map((item, idx) => (
                      <div key={idx} className="py-2.5 flex justify-between items-center gap-2 first:pt-0 last:pb-0">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img 
                            src={item.product.image} 
                            alt={item.product.name} 
                            referrerPolicy="no-referrer"
                            className="w-10 h-11 object-cover rounded bg-stone-100 border border-stone-200 shrink-0" 
                          />
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-brand-black truncate">{item.product.name}</p>
                            <span className="text-[10px] text-stone-400 font-mono">Size: {item.selectedSize}</span>
                          </div>
                        </div>
                        <div className="text-right font-mono">
                          <span className="text-[10px] text-stone-400">Qty x{item.quantity}</span>
                          <p className="text-xs font-bold text-brand-black">${(item.product.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CHEEKY HELP ACTIONS */}
                <div className="grid grid-cols-2 gap-3 pb-4">
                  <button 
                    onClick={() => alert(`Ring Courier triggered: Calling cruiser dispatcher for ${activeOrder.id}...`)}
                    className="py-3 bg-stone-100 hover:bg-stone-200 text-brand-black text-[10px] tracking-wider uppercase font-bold rounded duration-150 flex items-center justify-center gap-1 cursor-pointer border border-stone-200"
                  >
                    <Phone className="w-3.5 h-3.5 text-brand-gold" /> Buzzer Courier
                  </button>
                  <button 
                    onClick={() => alert("Size Guarantee confirmed: Sizing swap holds saved successfully in case of fit misfit.")}
                    className="py-3 bg-stone-100 hover:bg-stone-200 text-brand-black text-[10px] tracking-wider uppercase font-bold rounded duration-150 flex items-center justify-center gap-1 cursor-pointer border border-stone-200"
                  >
                    <Inbox className="w-3.5 h-3.5 text-brand-gold" /> Swap Fit Swap
                  </button>
                </div>

              </div>
            ) : (
              /* EMPTY LOOKUP HOME LANDING SCREEN */
              <div className="p-8 sm:p-12 text-center my-auto flex flex-col items-center justify-center h-[50vh]">
                <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center text-stone-400 mb-6 border border-brand-black/10">
                  <Package className="w-7 h-7" />
                </div>
                <div className="space-y-2 max-w-xs">
                  <h3 className="font-serif text-lg font-bold text-brand-black">No Package Tracked</h3>
                  <p className="text-xs text-stone-500 leading-relaxed font-sans">
                    Look up an order ticket above (e.g., <strong>AF-928135</strong>) to load visual high-altitude status, current courier maps, and fitting swap claims.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Persistent Footer status info */}
          <div className="p-4 bg-stone-50 border-t border-brand-black/10 text-center text-[10px] text-stone-400 font-mono tracking-wider uppercase">
            AFINDS Global Logistics Network Ltd.
          </div>
        </div>
      </div>
    </div>
  );
}
