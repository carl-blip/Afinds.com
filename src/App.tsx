import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUp, Star, Trash2, ShoppingBag, Heart, ShieldCheck, X, Sparkles } from 'lucide-react';

// Data and Types
import { Product, CartItem, Order, Review } from './types';
import { products } from './data';

// Components
import Header from './components/Header';
import Hero from './components/Hero';
import TrustBar from './components/TrustBar';
import ProductCard from './components/ProductCard';
import CategoryBanner from './components/CategoryBanner';
import Carousel from './components/Carousel';
import BrandStory from './components/BrandStory';
import Reviews from './components/Reviews';
import CartDrawer from './components/CartDrawer';
import QuickViewModal from './components/QuickViewModal';
import StickyCTA from './components/StickyCTA';
import NewsletterPopup from './components/NewsletterPopup';
import Footer from './components/Footer';
import AdminDashboard from './components/AdminDashboard';
import TrackingDrawer from './components/TrackingDrawer';

export default function App() {
  const [productList, setProductList] = useState<Product[]>(() => {
    try {
      const stored = localStorage.getItem('afinds_product_list');
      return stored ? JSON.parse(stored) : products;
    } catch {
      return products;
    }
  });

  const [productReviews, setProductReviews] = useState<Record<number, Review[]>>(() => {
    try {
      const stored = localStorage.getItem('afinds_product_reviews');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error("Failed to parse stored reviews", e);
    }

    const initialReviews: Record<number, Review[]> = {};
    products.forEach((p) => {
      if (p.id === 1) {
        initialReviews[p.id] = [
          {
            id: 101,
            initials: "JC",
            name: "Julian C.",
            rating: 5,
            text: "Bought the Signature Shirt. Less than 24 hours later, a girl asked me for directions, smiled, and complemented my fit. Coincidence? My therapist says yes, but Afinds says no. 10/10 would buy again.",
            verified: true,
            date: "2 days ago",
            fit: "true"
          },
          {
            id: 102,
            initials: "CM",
            name: "Clara M.",
            rating: 5,
            text: "Unbelievable quality. The heavyweight material falls correctly and looks spectacular.",
            verified: true,
            date: "1 week ago",
            fit: "true"
          }
        ];
      } else if (p.id === 2) {
        initialReviews[p.id] = [
          {
            id: 201,
            initials: "SK",
            name: "Sarah K.",
            rating: 5,
            text: "I bought the Over-sized Linen Blazer. My confidence skyrocketed. Extremely chic design!",
            verified: true,
            date: "3 days ago",
            fit: "large"
          }
        ];
      } else if (p.id === 3) {
        initialReviews[p.id] = [
          {
            id: 301,
            initials: "ML",
            name: "Marcus L.",
            rating: 4,
            text: "Slim Fit Cargo Pants are excellent! Fits perfectly and looks great.",
            verified: true,
            date: "1 week ago",
            fit: "small"
          }
        ];
      } else if (p.id === 4) {
        initialReviews[p.id] = [
          {
            id: 401,
            initials: "JD",
            name: "Jane D.",
            rating: 5,
            text: "The Satin Slip Dress is gorgeous. The material is so soft and elegant. Got so many compliments at dinner.",
            verified: true,
            date: "5 days ago",
            fit: "true"
          }
        ];
      } else {
        const names = ["Alex V.", "Devon K.", "Rene B."];
        const initials = ["AV", "DK", "RB"];
        const texts = [
          "Absolutely worth the investment. The workmanship and texture of this piece is exceptional.",
          "Perfect high-street draping. Matches perfectly with my neutral streetwear aesthetic.",
          "Incredible feel to the fabric. Super breathable but heavy knit that holds shape cleanly."
        ];
        const seed = p.id % 3;
        const fits: ('small' | 'true' | 'large')[] = ["true", "large", "small"];
        initialReviews[p.id] = [
          {
            id: p.id * 1000 + 1,
            initials: initials[seed],
            name: names[seed],
            rating: p.rating >= 4.8 ? 5 : 4,
            text: texts[seed],
            verified: true,
            date: "Recently",
            fit: fits[seed]
          }
        ];
      }
    });
    return initialReviews;
  });

  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'men' | 'women' | 'sale'>('all');
  
  // UI states
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [trackingOpen, setTrackingOpen] = useState(false);
  const [trackingOrderId, setTrackingOrderId] = useState('');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Initialize and load persistent states from local storage
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem('afinds_cart');
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      }
      
      const storedWishlist = localStorage.getItem('afinds_wishlist');
      if (storedWishlist) {
        setWishlist(JSON.parse(storedWishlist));
      }

      const storedOrders = localStorage.getItem('afinds_orders');
      if (storedOrders) {
        setOrders(JSON.parse(storedOrders));
      } else {
        const initialDemo: Order[] = [
          {
            id: 'AF-928135',
            customerName: 'Sarah Jenkins',
            customerEmail: 'sarah.j@example.com',
            phone: '+1 (555) 321-9876',
            address: '912 Brentwood Lane, Los Angeles, CA 90024',
            items: [
              {
                product: products[0],
                selectedSize: 'M',
                quantity: 1,
              },
              {
                product: products[2] || products[0],
                selectedSize: 'L',
                quantity: 1,
              }
            ],
            subtotal: 137.00,
            discount: 13.70,
            shipping: 0.00,
            total: 123.30,
            date: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
            status: 'Pending',
          },
          {
            id: 'AF-201834',
            customerName: 'Marcus Lin',
            customerEmail: 'marcus.lin@example.com',
            phone: '+1 (555) 789-1234',
            address: '148 Tribeca St, Apt 4B, New York, NY 10013',
            items: [
              {
                product: products[1] || products[0],
                selectedSize: 'S',
                quantity: 1,
              }
            ],
            subtotal: 75.00,
            discount: 0.00,
            shipping: 0.00,
            total: 75.00,
            date: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
            status: 'Shipped',
          }
        ];
        setOrders(initialDemo);
        localStorage.setItem('afinds_orders', JSON.stringify(initialDemo));
      }
    } catch (e) {
      console.error("Failed to parse cart/wishlist/orders local storage state", e);
    }
  }, []);

  // Back-to-top button tracker
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Save Cart to local Storage
  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem('afinds_cart', JSON.stringify(newCart));
  };

  // Save Wishlist to local storage
  const saveWishlist = (newWishlist: number[]) => {
    setWishlist(newWishlist);
    localStorage.setItem('afinds_wishlist', JSON.stringify(newWishlist));
  };

  // Add Item to cart
  const handleAddToCart = (product: Product, selectedSize: string) => {
    // Check if item already exists in cart with this size
    const existingIndex = cart.findIndex(
      (item) => item.product.id === product.id && item.selectedSize === selectedSize
    );

    if (existingIndex > -1) {
      const updated = [...cart];
      updated[existingIndex].quantity += 1;
      saveCart(updated);
    } else {
      const updated = [...cart, { product, quantity: 1, selectedSize }];
      saveCart(updated);
    }
  };

  // Update item quantity
  const handleUpdateQuantity = (productId: number, size: string, change: number) => {
    const updated = cart
      .map((item) => {
        if (item.product.id === productId && item.selectedSize === size) {
          const newQty = item.quantity + change;
          return { ...item, quantity: newQty < 1 ? 1 : newQty };
        }
        return item;
      });
    saveCart(updated);
  };

  // Remove individual item from cart
  const handleRemoveItem = (productId: number, size: string) => {
    const updated = cart.filter(
      (item) => !(item.product.id === productId && item.selectedSize === size)
    );
    saveCart(updated);
  };

  const handleClearCart = () => {
    saveCart([]);
  };

  // Wishlist toggle trigger
  const handleToggleWishlist = (productId: number) => {
    if (wishlist.includes(productId)) {
      const updated = wishlist.filter((id) => id !== productId);
      saveWishlist(updated);
    } else {
      const updated = [...wishlist, productId];
      saveWishlist(updated);
    }
  };

  // Place structured purchase order
  const handlePlaceOrder = (newOrder: Order) => {
    const updated = [newOrder, ...orders];
    setOrders(updated);
    localStorage.setItem('afinds_orders', JSON.stringify(updated));
  };

  // Update an order shipping status
  const handleUpdateOrderStatus = (orderId: string, status: Order['status']) => {
    const updated = orders.map((order) => 
      order.id === orderId ? { ...order, status } : order
    );
    setOrders(updated);
    localStorage.setItem('afinds_orders', JSON.stringify(updated));
  };

  // Erase a purchase record
  const handleDeleteOrder = (orderId: string) => {
    const updated = orders.filter((order) => order.id !== orderId);
    setOrders(updated);
    localStorage.setItem('afinds_orders', JSON.stringify(updated));
  };

  // Pre-populate sample checkout rows for testing purposes
  const handleInjectDemoOrders = () => {
    const demoOrders: Order[] = [
      {
        id: 'AF-928135',
        customerName: 'Sarah Jenkins',
        customerEmail: 'sarah.j@example.com',
        phone: '+1 (555) 321-9876',
        address: '912 Brentwood Lane, Los Angeles, CA 90024',
        items: [
          {
            product: products[0],
            selectedSize: 'M',
            quantity: 1,
          },
          {
            product: products[2] || products[0],
            selectedSize: 'L',
            quantity: 1,
          }
        ],
        subtotal: 137.00,
        discount: 13.70,
        shipping: 0.00,
        total: 123.30,
        date: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
        status: 'Pending',
      },
      {
        id: 'AF-201834',
        customerName: 'Marcus Lin',
        customerEmail: 'marcus.lin@example.com',
        phone: '+1 (555) 789-1234',
        address: '148 Tribeca St, Apt 4B, New York, NY 10013',
        items: [
          {
            product: products[1] || products[0],
            selectedSize: 'S',
            quantity: 1,
          }
        ],
        subtotal: 75.00,
        discount: 0.00,
        shipping: 0.00,
        total: 75.00,
        date: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
        status: 'Shipped',
      }
    ];

    setOrders(demoOrders);
    localStorage.setItem('afinds_orders', JSON.stringify(demoOrders));
  };

  // Add customer feedback review to single product
  const handleAddReview = (productId: number, reviewerName: string, rating: number, reviewText: string, fit?: 'small' | 'true' | 'large') => {
    const initials = reviewerName
      .trim()
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'BY';

    const newReview: Review = {
      id: Date.now(),
      initials,
      name: reviewerName,
      rating,
      text: reviewText,
      verified: true,
      date: 'Just now',
      fit,
    };

    const currentReviews = productReviews[productId] || [];
    const updatedReviews = [newReview, ...currentReviews];
    const newProductReviews = {
      ...productReviews,
      [productId]: updatedReviews,
    };
    setProductReviews(newProductReviews);
    localStorage.setItem('afinds_product_reviews', JSON.stringify(newProductReviews));

    const updatedProductList = productList.map((p) => {
      if (p.id === productId) {
        const totalReviews = p.reviews + 1;
        // Simple running average
        const newRating = Number(((p.rating * p.reviews + rating) / totalReviews).toFixed(1));
        return {
          ...p,
          reviews: totalReviews,
          rating: newRating,
        };
      }
      return p;
    });
    setProductList(updatedProductList);
    localStorage.setItem('afinds_product_list', JSON.stringify(updatedProductList));

    // Update active modal selected product in real-time
    if (quickViewProduct && quickViewProduct.id === productId) {
      const match = updatedProductList.find(item => item.id === productId);
      if (match) {
        setQuickViewProduct(match);
      }
    }
  };

  // Filters product array based on category parameter and search string text
  const filteredProducts = productList.filter((p) => {
    // 1. Category Filter checks
    let matchCategory = true;
    if (activeCategory === 'men') {
      matchCategory = p.category === 'men';
    } else if (activeCategory === 'women') {
      matchCategory = p.category === 'women';
    } else if (activeCategory === 'sale') {
      matchCategory = p.badge === 'Sale';
    }

    // 2. Search Text checks
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());

    return matchCategory && matchSearch;
  });

  // Action helper to scroll and buy centerpiece bestseller shirt
  const handleGetSignatureShirt = () => {
    const signatureShirt = productList.find((p) => p.id === 1);
    if (signatureShirt) {
      setQuickViewProduct(signatureShirt);
    }
  };

  return (
    <div id="afinds-storefront-wrapper" className="min-h-screen bg-brand-cream relative">
      <NewsletterPopup />

      {/* Main Header navigation */}
      <Header
        cart={cart}
        wishlist={wishlist}
        onOpenCart={() => setCartOpen(true)}
        onOpenWishlist={() => setWishlistOpen(true)}
        onSearchChange={setSearchQuery}
        onCategorySelect={setActiveCategory}
        activeCategory={activeCategory}
        onOpenAdmin={() => setAdminOpen(true)}
        onOpenTracking={() => {
          setTrackingOrderId('');
          setTrackingOpen(true);
        }}
      />

      {/* Hero Visual Area */}
      <Hero 
        onShopCategory={setActiveCategory} 
        onGetTheShirt={handleGetSignatureShirt} 
      />

      {/* Trust benefits bar */}
      <TrustBar />

      {/* Category Split panels */}
      <CategoryBanner onSelectCategory={setActiveCategory} />

      {/* MAIN PRODUCTS GRID LIST */}
      <main id="products-section" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Caption Row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-brand-black/5 pb-6">
          <div>
            <span className="text-[10px] text-brand-gold font-bold tracking-[0.25em] uppercase block mb-1">
              CURATED ORIGINAL ROADMAPS
            </span>
            <h2 className="font-serif text-3xl md:text-4.5xl font-extrabold tracking-tight text-brand-black">
              {activeCategory === 'all' && 'New Arrivals'}
              {activeCategory === 'men' && "Men's Original Drip"}
              {activeCategory === 'women' && "Women's High Streetwear"}
              {activeCategory === 'sale' && '⚡ Red Hot Deals'}
            </h2>
          </div>

          {/* Quick tab controls inline */}
          <div className="flex flex-wrap gap-2 mt-6 md:mt-0 font-sans text-xs tracking-wider uppercase font-semibold">
            {['all', 'men', 'women', 'sale'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat as 'all' | 'men' | 'women' | 'sale')}
                className={`px-4 py-2 rounded transition-colors ${
                  activeCategory === cat
                    ? 'bg-brand-black text-brand-cream'
                    : 'bg-stone-100 hover:bg-stone-200 text-brand-black/80'
                }`}
              >
                {cat === 'all' ? 'All Pieces' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Search Term Info */}
        {searchQuery && (
          <p className="text-xs text-stone-500 mb-6 font-sans tracking-wide">
            Filtering by search label "<strong>{searchQuery}</strong>" (Found {filteredProducts.length} entries)
          </p>
        )}

        {/* Grid Area */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-24 bg-stone-50 border border-dashed border-stone-200 rounded p-6">
            <h3 className="font-serif text-lg font-bold text-brand-black">Nothing matching found</h3>
            <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
              Our designs are exclusive, but we might restock soon. Let's reset your filters to start over.
            </p>
            <button
              onClick={() => {
                setActiveCategory('all');
                setSearchQuery('');
              }}
              className="mt-6 px-6 py-2.5 bg-brand-black text-brand-cream hover:bg-brand-gold hover:text-brand-black uppercase text-[10px] tracking-widest font-bold transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {filteredProducts.map((product) => (
              <div key={product.id}>
                <ProductCard
                  product={product}
                  isWishlisted={wishlist.includes(product.id)}
                  onToggleWishlist={handleToggleWishlist}
                  onAddToCart={handleAddToCart}
                  onOpenQuickView={(p) => setQuickViewProduct(p)}
                />
              </div>
            ))}
          </div>
        )}

      </main>

      {/* Bestsellers Carousel Row */}
      <Carousel
        products={productList}
        wishlist={wishlist}
        onToggleWishlist={handleToggleWishlist}
        onAddToCart={handleAddToCart}
        onOpenQuickView={setQuickViewProduct}
      />

      {/* Storytelling Section */}
      <BrandStory />

      {/* Social proof testimonials */}
      <Reviews />

      {/* Main footer layout details */}
      <Footer 
        onOpenTracking={() => {
          setTrackingOrderId('');
          setTrackingOpen(true);
        }}
      />

      {/* Sticky Bottom CTA for bestseller Signature Shirt (Product ID 1) */}
      <StickyCTA 
        product={productList[0]} 
        onAddToCart={handleAddToCart} 
      />

      {/* CART SLIDE-OUT DRAWER */}
      <CartDrawer
        isOpen={cartOpen}
        cart={cart}
        onClose={() => setCartOpen(false)}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onPlaceOrder={handlePlaceOrder}
        onTrackOrder={(orderId) => {
          setTrackingOrderId(orderId);
          setTrackingOpen(true);
        }}
      />

      {/* ADMIN DASHBOARD OVERLAY */}
      <AnimatePresence>
        {adminOpen && (
          <AdminDashboard
            isOpen={adminOpen}
            onClose={() => setAdminOpen(false)}
            orders={orders}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onDeleteOrder={handleDeleteOrder}
            onAddDemoOrders={handleInjectDemoOrders}
          />
        )}
      </AnimatePresence>

      {/* WISHLIST SIDE DRAWER VISUALS */}
      {wishlistOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden" id="wishlist-drawer-root">
          <div 
            className="absolute inset-0 bg-brand-black/60 backdrop-blur-xs transition-opacity animate-fadeIn" 
            onClick={() => setWishlistOpen(false)} 
          />
          <div className="absolute inset-y-0 right-0 max-w-full flex">
            <div className="w-screen max-w-md bg-brand-cream border-l border-brand-black/10 shadow-2xl flex flex-col animate-slideLeft">
              
              {/* Header */}
              <div className="p-6 border-b border-brand-black/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-500 fill-red-500 animate-pulse" />
                  <h2 className="font-serif text-lg font-bold tracking-tight text-brand-black">Your Wishlist</h2>
                </div>
                <button
                  onClick={() => setWishlistOpen(false)}
                  className="p-2 text-brand-black hover:text-brand-gold transition-colors"
                >
                  <X className="w-5.5 h-5.5" />
                </button>
              </div>

              {/* Wishlist Items List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {wishlist.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-3">
                    <Heart className="w-10 h-10 text-stone-300" />
                    <h3 className="font-serif text-sm font-bold">Your wishlist is dry</h3>
                    <p className="text-xs text-stone-500 max-w-[200px] mx-auto">
                      Click the hearts on our signature cards to stash pieces you love here.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {wishlist.map((productId) => {
                      const prod = productList.find((p) => p.id === productId);
                      if (!prod) return null;
                      return (
                        <div key={prod.id} className="flex items-center gap-4 py-3 border-b border-brand-black/5">
                          <img 
                            src={prod.image} 
                            alt={prod.name} 
                            className="w-16 h-20 object-cover rounded border border-brand-black/5" 
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-sans text-xs sm:text-sm font-bold text-brand-black truncate">{prod.name}</h4>
                            <p className="font-serif text-xs text-brand-gold font-bold mt-1">${prod.price.toFixed(2)}</p>
                            
                            <div className="flex items-center gap-4 mt-3">
                              <button
                                onClick={() => {
                                  handleAddToCart(prod, 'M');
                                  setWishlistOpen(false);
                                  setCartOpen(true);
                                }}
                                className="text-[10px] uppercase font-black tracking-widest text-brand-black hover:text-brand-gold transition-colors underline underline-offset-4"
                              >
                                Quick Buy (M)
                              </button>
                              <button
                                onClick={() => handleToggleWishlist(prod.id)}
                                className="text-[10px] uppercase font-bold tracking-widest text-stone-400 hover:text-red-500 transition-colors"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      )}

      {/* QUICK VIEW DYNAMIC OVERLAY MODAL */}
      <QuickViewModal
        product={quickViewProduct ? productList.find(p => p.id === quickViewProduct.id) || quickViewProduct : null}
        isOpen={quickViewProduct !== null}
        isWishlisted={quickViewProduct ? wishlist.includes(quickViewProduct.id) : false}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
        onToggleWishlist={handleToggleWishlist}
        reviews={quickViewProduct ? (productReviews[quickViewProduct.id] || []) : []}
        onAddReview={handleAddReview}
      />

      {/* REAL-TIME ORDER TRACKING DYNAMIC OVERLAY */}
      {trackingOpen && (
        <TrackingDrawer
          isOpen={trackingOpen}
          onClose={() => setTrackingOpen(false)}
          orders={orders}
          initialOrderId={trackingOrderId}
        />
      )}

      {/* BACK TO TOP FLOATING ACTUATOR BUTTON */}
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-20 right-6 sm:right-8 z-40 bg-brand-black hover:bg-brand-gold text-brand-cream hover:text-brand-black p-3 rounded shadow-2xl transition-all cursor-pointer border border-brand-cream/15"
          aria-label="Back to top fold"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}

    </div>
  );
}
