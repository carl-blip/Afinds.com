import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Search, ShieldCheck, Mail, Phone, MapPin, Calendar, Trash2, ChevronDown, ChevronUp, Package, Plus, DollarSign, Tag, TrendingUp } from 'lucide-react';
import { Order } from '../types';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
  onDeleteOrder: (orderId: string) => void;
  onAddDemoOrders: () => void;
}

export default function AdminDashboard({
  isOpen,
  onClose,
  orders,
  onUpdateOrderStatus,
  onDeleteOrder,
  onAddDemoOrders,
}: AdminDashboardProps) {
  const [isAuthorized, setIsAuthorized] = useState(() => {
    try {
      return sessionStorage.getItem('afinds_admin_authorized') === 'true';
    } catch {
      return false;
    }
  });
  const [passcode, setPasscode] = useState('');
  const [passError, setPassError] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [expandedOrders, setExpandedOrders] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<'all' | Order['status']>('all');

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === 'anikanik1') {
      setIsAuthorized(true);
      setPassError('');
      try {
        sessionStorage.setItem('afinds_admin_authorized', 'true');
      } catch (err) {
        console.error(err);
      }
    } else {
      setPassError('Invalid Owner Passcode. Please try again.');
    }
  };

  const handleLogoutAdmin = () => {
    setIsAuthorized(false);
    setPasscode('');
    try {
      sessionStorage.removeItem('afinds_admin_authorized');
    } catch (err) {
      console.error(err);
    }
  };

  // Toggle order expanded viewing details
  const toggleExpand = (id: string) => {
    setExpandedOrders(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Filter orders by search string (name, email, order ID) and status
  const matchedOrders = orders.filter(order => {
    const matchesSearch = 
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.phone && order.phone.includes(searchTerm));
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // KPI Calculations
  const totalRevenue = orders
    .filter(o => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + o.total, 0);
  
  const pendingOrdersCount = orders.filter(o => o.status === 'Pending').length;
  const totalItemsSoldCount = orders
    .filter(o => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + o.items.reduce((acc, item) => acc + item.quantity, 0), 0);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" id="admin-dashboard-modal">
      {/* Dark overlay backdrop */}
      <div 
        className="fixed inset-0 bg-brand-black/75 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />

      <div className="flex items-center justify-center min-h-screen p-4 sm:p-6 md:p-10 relative">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="w-full max-w-5xl bg-brand-cream border border-brand-black/20 rounded shadow-2xl flex flex-col overflow-hidden text-brand-black relative z-10"
        >
          {/* Header */}
          <div className="p-6 bg-brand-black text-brand-cream border-b border-brand-gold/40 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="bg-brand-gold/20 p-1.5 rounded border border-brand-gold/30">
                <ShieldCheck className="w-5.5 h-5.5 text-brand-gold animate-pulse" />
              </div>
              <div>
                <h2 className="font-serif text-xl sm:text-2xl font-extrabold tracking-tight">
                  Store Management Portal
                </h2>
                <p className="text-[10px] text-brand-gold font-sans uppercase tracking-[0.2em] font-bold">
                  Track Customer Purchases & Streetwear Orders
                </p>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="p-1 text-stone-400 hover:text-brand-gold hover:scale-105 transition-all outline-none"
              aria-label="Close Admin View"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {!isAuthorized ? (
            /* SECURITY VAULT PASSCODE GATE */
            <div className="p-8 sm:p-12 md:p-16 flex flex-col items-center justify-center text-center bg-brand-cream">
              <div className="w-16 h-16 bg-brand-black text-brand-gold rounded-full flex items-center justify-center border border-brand-gold/30 shadow-lg mb-6">
                <ShieldCheck className="w-8 h-8 animate-pulse" />
              </div>

              <div className="space-y-2 max-w-sm mb-8">
                <span className="text-[10px] text-brand-gold font-bold tracking-[0.25em] uppercase block font-mono">
                  OWNER SECURITY VAULT
                </span>
                <h3 className="font-serif text-2xl font-black text-brand-black animate-fade-in">Access Authorization</h3>
                <p className="text-xs text-stone-500 leading-relaxed font-sans">
                  The Store Management Portal contains sensitive customer delivery records, tracking coordinates, and street purchase history. Please enter the Owner passcode.
                </p>
              </div>

              <form onSubmit={handleLoginSubmit} className="w-full max-w-xs space-y-4">
                <div className="space-y-1 text-left">
                  <label className="text-[10px] uppercase font-bold text-stone-400 tracking-wider block font-sans">
                    System Passcode / Numeric PIN
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••"
                    value={passcode}
                    onChange={(e) => {
                      setPasscode(e.target.value);
                      if (passError) setPassError('');
                    }}
                    className={`w-full bg-white text-brand-black border ${passError ? 'border-red-500' : 'border-brand-black/15'} px-4 py-3 rounded text-center font-mono font-bold tracking-widest text-base focus:outline-none focus:border-brand-gold`}
                  />
                  {passError && (
                    <p className="text-[10px] text-red-500 font-sans font-medium text-center mt-1.5 leading-relaxed">
                      ❌ {passError}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-brand-black text-brand-cream hover:bg-brand-gold hover:text-brand-black text-xs font-sans tracking-widest font-bold uppercase transition-all rounded shadow-sm cursor-pointer border border-transparent hover:border-brand-black"
                >
                  Authorize Entry ⚡
                </button>
              </form>
            </div>
          ) : (
            <>
              {/* Quick Metrics KPI Ribbons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-brand-black/10 bg-stone-50 border-b border-brand-black/10">
            <div className="p-5 flex items-center gap-4">
              <div className="w-10 h-10 bg-green-100 rounded flex items-center justify-center text-green-700">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-stone-400 font-bold font-sans">Total Gross Sales</span>
                <p className="font-serif text-xl sm:text-2xl font-black mt-0.5 text-brand-black font-mono">
                  ${totalRevenue.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="p-5 flex items-center gap-4">
              <div className="w-10 h-10 bg-brand-gold/15 rounded flex items-center justify-center text-brand-gold">
                <Package className="w-5 h-5 animate-bounce" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-stone-400 font-bold font-sans">Active/Pending Orders</span>
                <p className="font-serif text-xl sm:text-2xl font-black mt-0.5 text-brand-black font-mono">
                  {pendingOrdersCount} <span className="text-xs text-stone-400 font-normal">orders</span>
                </p>
              </div>
            </div>

            <div className="p-5 flex items-center gap-4">
              <div className="w-10 h-10 bg-stone-200 rounded flex items-center justify-center text-stone-700">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-stone-400 font-bold font-sans">Total Wardrobes Shipped</span>
                <p className="font-serif text-xl sm:text-2xl font-black mt-0.5 text-brand-black font-mono">
                  {totalItemsSoldCount} <span className="text-xs text-stone-400 font-normal">items</span>
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6 flex-1 max-h-[65vh] overflow-y-auto">
            {/* Search Filter Controls Row */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-brand-cream/80 border border-brand-black/10 p-4 rounded">
              <div className="relative w-full sm:max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="Search by customer name, email, or #AF order ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white text-xs text-brand-black rounded border border-brand-black/15 focus:outline-none focus:border-brand-gold"
                />
              </div>

              {/* Status Filters & Demo Generation */}
              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
                <div className="flex gap-1.5 bg-stone-100 rounded p-1 text-xs">
                  {['all', 'Pending', 'Shipped', 'Delivered'].map((filterVal) => (
                    <button
                      key={filterVal}
                      onClick={() => setStatusFilter(filterVal as any)}
                      className={`px-3 py-1.5 rounded uppercase text-[9px] tracking-wider font-extrabold transition-all cursor-pointer ${
                        statusFilter === filterVal
                          ? 'bg-brand-black text-brand-cream'
                          : 'text-stone-500 hover:text-brand-black'
                      }`}
                    >
                      {filterVal}
                    </button>
                  ))}
                </div>

                {orders.length === 0 && (
                  <button
                    onClick={onAddDemoOrders}
                    className="px-3.5 py-2.5 bg-brand-gold hover:bg-brand-gold/80 text-brand-black text-[9px] font-extrabold uppercase tracking-widest rounded flex items-center gap-1.5 shadow transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Inject Demo Orders
                  </button>
                )}
              </div>
            </div>

            {/* Orders Table Container */}
            {matchedOrders.length === 0 ? (
              <div className="text-center py-16 bg-white border border-dashed border-brand-black/10 rounded flex flex-col items-center justify-center p-6">
                <Package className="w-12 h-12 text-stone-300 mb-3" />
                <h4 className="font-serif text-base font-bold text-brand-black">No matching purchases found</h4>
                <p className="text-xs text-stone-500 max-w-sm mt-1 mb-6 leading-relaxed">
                  {orders.length === 0 
                    ? "Your storefront orders queue is currently clean and empty. Simulate a streetwear purchase in the Checkout bag or click the Inject button to load demo purchases!"
                    : "No purchases match your current search terms or status toggles. Let's adjust filters to view everything!"
                  }
                </p>
                {orders.length === 0 && (
                  <button
                    onClick={onAddDemoOrders}
                    className="px-5 py-3 bg-brand-black text-brand-cream hover:bg-brand-gold hover:text-brand-black text-[10px] tracking-widest font-bold uppercase transition-transform cursor-pointer"
                  >
                    Load Sample Streetwear Purchases
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {matchedOrders.map((order) => {
                  const isExpanded = expandedOrders.includes(order.id);
                  return (
                    <div 
                      key={order.id}
                      className="bg-white rounded border border-brand-black/10 overflow-hidden shadow-xs hover:shadow-sm transition-shadow"
                    >
                      {/* Accordion Trigger Row */}
                      <div 
                        onClick={() => toggleExpand(order.id)}
                        className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-stone-50/50 transition-all"
                      >
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="font-mono text-xs font-bold text-brand-gold bg-brand-gold/10 px-2.5 py-1 rounded border border-brand-gold/15">
                            {order.id}
                          </span>
                          <div>
                            <h3 className="text-xs sm:text-sm font-bold text-brand-black">{order.customerName}</h3>
                            <p className="text-[10px] text-stone-400 mt-0.5 font-mono">{order.customerEmail}</p>
                          </div>
                        </div>

                        {/* Order info details summary */}
                        <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto font-sans">
                          {/* Date placed indicator */}
                          <div className="text-left md:text-right hidden sm:block">
                            <span className="text-[9px] text-stone-400 font-bold block uppercase tracking-wider">Order Date</span>
                            <span className="text-xs text-brand-black flex items-center gap-1 mt-0.5">
                              <Calendar className="w-3.5 h-3.5 text-stone-400" />
                              {new Date(order.date).toLocaleDateString(undefined, {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>

                          {/* Order items count indicator */}
                          <div className="text-left md:text-right">
                            <span className="text-[9px] text-stone-400 font-bold block uppercase tracking-wider">Garments</span>
                            <span className="text-xs font-mono font-bold text-brand-black">
                              {order.items.reduce((sum, item) => sum + item.quantity, 0)} pcs
                            </span>
                          </div>

                          {/* Order Total amount */}
                          <div className="text-left md:text-right">
                            <span className="text-[9px] text-stone-400 font-bold block uppercase tracking-wider">Total Sum</span>
                            <span className="text-xs sm:text-sm font-mono font-black text-brand-black block">
                              ${order.total.toFixed(2)}
                            </span>
                          </div>

                          {/* Status Badge */}
                          <div onClick={(e) => e.stopPropagation() /* Prevent expand trigger click propagation */}>
                            <select
                              value={order.status}
                              onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as Order['status'])}
                              className={`px-2.5 py-1.5 rounded text-[10px] font-extrabold uppercase tracking-wide border cursor-pointer outline-none transition-all ${
                                order.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100' :
                                order.status === 'Shipped' ? 'bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100' :
                                order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' :
                                'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                              }`}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </div>

                          {/* Dropdown Chevron */}
                          <div className="text-stone-400">
                            {isExpanded ? <ChevronUp className="w-4.5 h-4.5" /> : <ChevronDown className="w-4.5 h-4.5" />}
                          </div>
                        </div>
                      </div>

                      {/* Expanded Accordion Area containing Order details and items */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: 'auto' }}
                            exit={{ height: 0 }}
                            className="overflow-hidden border-t border-brand-black/5 bg-stone-50/40"
                          >
                            <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-6">
                              {/* Left Columns - Client Shipping & Contact details */}
                              <div className="md:col-span-4 space-y-4 font-sans text-xs">
                                <div>
                                  <h4 className="font-extrabold text-[10px] text-stone-400 uppercase tracking-widest mb-1.5">
                                    Delivery Details
                                  </h4>
                                  <div className="space-y-2 bg-white p-3.5 rounded border border-brand-black/5">
                                    <div className="flex items-start gap-2">
                                      <MapPin className="w-4 h-4 text-brand-gold mt-0.5 flex-shrink-0" />
                                      <p className="text-brand-black font-medium leading-relaxed">
                                        {order.address}
                                      </p>
                                    </div>
                                    {order.phone && (
                                      <div className="flex items-center gap-2 border-t border-stone-100 pt-2.5 mt-2.5">
                                        <Phone className="w-4 h-4 text-stone-400 flex-shrink-0" />
                                        <span className="text-stone-600 font-mono font-medium">{order.phone}</span>
                                      </div>
                                    )}
                                    <div className="flex items-center gap-2 border-t border-stone-100 pt-2.5 mt-2.5">
                                      <Mail className="w-4 h-4 text-stone-400 flex-shrink-0" />
                                      <span className="text-stone-600 font-mono truncate">{order.customerEmail}</span>
                                    </div>
                                  </div>
                                </div>

                                {/* Order financial summary breakdown */}
                                <div>
                                  <h4 className="font-extrabold text-[10px] text-stone-400 uppercase tracking-widest mb-1.5">
                                    Receipt Summation
                                  </h4>
                                  <div className="bg-white p-3.5 rounded border border-brand-black/5 space-y-1.5 text-stone-500">
                                    <div className="flex justify-between">
                                      <span>Items Subtotal:</span>
                                      <span className="font-mono text-brand-black">${order.subtotal.toFixed(2)}</span>
                                    </div>
                                    {order.discount > 0 && (
                                      <div className="flex justify-between text-green-700 font-bold">
                                        <span className="flex items-center gap-1"><Tag className="w-3.5 h-3.5" /> Coupon Discount:</span>
                                        <span className="font-mono">-${order.discount.toFixed(2)}</span>
                                      </div>
                                    )}
                                    <div className="flex justify-between">
                                      <span>Estimated Courier:</span>
                                      <span className="font-mono text-brand-black">
                                        {order.shipping === 0 ? 'FREE' : `$${order.shipping.toFixed(2)}`}
                                      </span>
                                    </div>
                                    <div className="flex justify-between font-bold text-sm text-brand-black border-t border-brand-black/5 pt-2 mt-2">
                                      <span>Final Total:</span>
                                      <span className="font-mono text-brand-gold font-extrabold">${order.total.toFixed(2)}</span>
                                    </div>
                                  </div>
                                </div>

                                {/* Deletion trigger */}
                                <button
                                  onClick={() => {
                                    if(confirm(`Are you sure you want to delete order ${order.id}?`)) {
                                      onDeleteOrder(order.id);
                                    }
                                  }}
                                  className="text-stone-400 hover:text-red-500 hover:bg-red-50 px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 mt-4 text-[10px] uppercase font-bold tracking-wider"
                                >
                                  <Trash2 className="w-3.5 h-3.5" /> Erase Order Record
                                </button>
                              </div>

                              {/* Right Columns - Detailed Garments Ordered */}
                              <div className="md:col-span-8 space-y-3">
                                <h4 className="font-extrabold text-[10px] text-stone-400 uppercase tracking-widest mb-1.5">
                                  Items Ordered ({order.items.length})
                                </h4>

                                <div className="space-y-2 bg-white rounded border border-brand-black/5 p-4 divide-y divide-stone-100">
                                  {order.items.map((item, idx) => (
                                    <div 
                                      key={`${order.id}-item-${idx}`} 
                                      className="flex justify-between items-center py-2.5 first:pt-0 last:pb-0 font-sans"
                                    >
                                      <div className="flex items-center gap-3">
                                        <div className="w-12 h-14 bg-stone-100 rounded border border-brand-black/5 overflow-hidden flex-shrink-0">
                                          <img 
                                            src={item.product.image} 
                                            alt={item.product.name} 
                                            referrerPolicy="no-referrer"
                                            className="w-full h-full object-cover object-top" 
                                          />
                                        </div>
                                        <div>
                                          <h5 className="text-xs font-bold text-brand-black">
                                            {item.product.name}
                                          </h5>
                                          <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[9px] uppercase font-extrabold px-1.5 py-0.5 bg-brand-gold/15 text-brand-gold rounded border border-brand-gold/10 font-mono">
                                              Size {item.selectedSize}
                                            </span>
                                            <span className="text-[10px] text-stone-400 font-mono">
                                              Qty: {item.quantity}
                                            </span>
                                          </div>
                                        </div>
                                      </div>

                                      <div className="text-right">
                                        <span className="text-xs font-mono font-bold text-brand-black block">
                                          ${(item.product.price * item.quantity).toFixed(2)}
                                        </span>
                                        <span className="text-[10px] text-stone-400 font-mono block">
                                          ${item.product.price.toFixed(2)} each
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            )}
          </div></>)}

          {/* Footer */}
          <div className="p-4 bg-stone-50 border-t border-brand-black/10 flex items-center justify-between text-[11px] text-stone-500 font-sans px-6">
            {isAuthorized ? (
              <>
                <span>Logged in as <strong>Store Owner</strong></span>
                <button
                  onClick={handleLogoutAdmin}
                  className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-600 font-extrabold uppercase text-[9px] tracking-wider rounded border border-red-200 cursor-pointer transition-all flex items-center gap-1"
                >
                  Lock Portal 🔒
                </button>
              </>
            ) : (
              <>
                <span>Connection Status: <strong>Secure & Gated</strong></span>
                <span>Passcode Protected</span>
              </>
            )}
            <span>Total: <strong>{orders.length} orders saved</strong></span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
