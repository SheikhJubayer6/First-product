
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Bell, 
  Phone, 
  Plus, 
  Minus, 
  Heart, 
  ShoppingCart, 
  Home as HomeIcon, 
  ClipboardList, 
  User, 
  ChevronRight, 
  ChevronDown,
  LogOut,
  ChevronLeft,
  X,
  History as HistoryIcon,
  Star,
  Info,
  MapPin,
  CreditCard,
  History,
  HelpCircle,
  Zap,
  ShieldCheck,
  Clock,
  FileText,
  Ticket,
  MessageSquare,
  Package,
  Facebook,
  Mail as MailIcon,
  Camera
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI, Type } from "@google/genai";
import { Product, CartItem, OrderStatus, Category, Brand } from '../types';
import { BANNERS, PAYMENT_METHODS } from '../data';
import { api } from '../services/api';
import { useUserAuth, AuthProviderType } from './UserAuthContext';

interface ProductCardProps {
  key?: React.Key;
  product: Product;
  onClick: () => void;
  onAddToCart: (e?: React.MouseEvent | React.TouchEvent) => void;
  variant?: 'default' | 'flash';
}

const MIN_ORDER_AMOUNT = 100;
const MIN_ORDER_QTY = 3;

const ScrollProgressBar = () => {
  const [scroll, setScroll] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const winScroll = document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      setScroll(scrolled);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-1 z-[100] pointer-events-none">
      <motion.div 
        className="h-full bg-primary"
        style={{ width: `${scroll}%` }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      />
    </div>
  );
};

const ProductCard = ({ 
  product, 
  onClick, 
  onAddToCart,
  variant = 'default' 
}: ProductCardProps) => {
  const discountLabel = Math.round(((product.mrp - product.discountPrice) / product.mrp) * 100);
  
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4, shadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative min-w-[160px] max-w-[180px] bg-white rounded-card p-3 shadow-polish border border-slate-100 cursor-pointer overflow-hidden transition-all duration-300 ${variant === 'flash' ? 'ring-1 ring-danger/10' : ''}`}
    >
      <div className={`absolute top-2 right-2 px-2 py-0.5 rounded-lg text-[10px] font-bold text-white z-10 ${variant === 'flash' ? 'bg-danger' : 'bg-primary'}`}>
        {discountLabel}% OFF
      </div>

      {product.isNewLaunched && (
        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-lg text-[10px] font-bold text-white z-10 bg-emerald-500 shadow-sm shadow-emerald-200">
          NEW
        </div>
      )}

      <div className="relative h-28 bg-app-bg rounded-2xl mb-2 flex items-center justify-center overflow-hidden">
        <motion.img 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>

      <div className="flex justify-between items-start gap-1">
        <h3 className="text-xs font-bold text-text-main truncate leading-tight w-2/3">{product.name}</h3>
        <span className="text-[9px] font-bold text-primary bg-primary-light px-1.5 py-0.5 rounded h-max whitespace-nowrap">{product.brand}</span>
      </div>
      
      <p className="text-[10px] text-text-muted truncate mt-1">{product.generic}</p>
      
      <div className="mt-2 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[10px] line-through text-text-muted opacity-60">৳{product.mrp}</span>
          <span className="text-sm font-extrabold text-text-main">৳{product.discountPrice}</span>
        </div>
        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(e);
          }}
          className={`w-8 h-8 rounded-xl flex items-center justify-center shadow-lg transition-colors ${variant === 'flash' ? 'bg-danger shadow-danger/20' : 'bg-primary shadow-primary/20'} text-white`}
        >
          <Plus size={18} />
        </motion.button>
      </div>
    </motion.div>
  );
};

const ProductCardSkeleton = () => (
  <div className="min-w-[160px] max-w-[180px] bg-white rounded-card p-3 shadow-polish border border-slate-50 animate-pulse">
    <div className="h-28 bg-slate-100 rounded-2xl mb-3" />
    <div className="h-3 bg-slate-100 rounded-full w-3/4 mb-2" />
    <div className="h-2 bg-slate-100 rounded-full w-1/2 mb-4" />
    <div className="flex justify-between items-center">
      <div className="h-4 bg-slate-100 rounded-full w-1/3" />
      <div className="w-8 h-8 bg-slate-100 rounded-xl" />
    </div>
  </div>
);

const CategorySkeleton = () => (
  <div className="flex flex-col items-center gap-2 min-w-[70px] animate-pulse">
    <div className="w-16 h-16 bg-white rounded-card shadow-sm border border-slate-50" />
    <div className="h-2 bg-slate-100 rounded-full w-10" />
  </div>
);

export function Storefront() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<'home' | 'wishlist' | 'cart' | 'orders' | 'profile'>('home');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [scrolled, setScrolled] = useState(false);
  const [activeOrderTab, setActiveOrderTab] = useState<'Running' | 'Delivered' | 'Cancelled'>('Running');
  const [aiSuggestions, setAiSuggestions] = useState<Product[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  
  const { user, login, logout, updateProfile, isLoading: isAuthLoading } = useUserAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  
  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    avatar: user?.avatar || ''
  });

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        avatar: user.avatar || ''
      });
    }
  }, [user]);

  const [authStep, setAuthStep] = useState<'options' | 'input'>('options');
  const [selectedProvider, setSelectedProvider] = useState<AuthProviderType | null>(null);
  
  // Advance Cart Options
  const [deliverySlot, setDeliverySlot] = useState<'Express' | 'Scheduled'>('Express');
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Digital'>('Cash');
  const [promoCode, setPromoCode] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [prescriptionAttached, setPrescriptionAttached] = useState(false);

  // Advance Profile Options
  const [pushNotifications, setPushNotifications] = useState(true);
  const [smsUpdates, setSmsUpdates] = useState(false);
  const [language, setLanguage] = useState<'EN' | 'BN'>('EN');
  const [biometricLogin, setBiometricLogin] = useState(true);

  // Initialize AI Suggestions
  const generateAiSuggestions = async (allProducts: Product[], history: string[]) => {
    if (allProducts.length === 0 || aiSuggestions.length > 0) return;
    
    setIsAiLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });
      
      const productContext = allProducts.map(p => ({ id: p.id, name: p.name, category: p.category, generic: p.generic }));
      const historyContext = history.length > 0 ? history.join(", ") : "general health trends";

      const prompt = `Based on the user's search history: "${historyContext}", suggest 5 relevant products from this inventory: ${JSON.stringify(productContext)}. Return only the IDs of the products.`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              suggestedIds: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ["suggestedIds"]
          }
        }
      });

      const result = JSON.parse(response.text);
      const suggestedProds = allProducts.filter(p => result.suggestedIds.includes(p.id));
      setAiSuggestions(suggestedProds);
    } catch (error) {
      console.error("AI Recommendation Error:", error);
      // Fallback: take first 5 products
      setAiSuggestions(allProducts.slice(0, 5));
    } finally {
      setIsAiLoading(false);
    }
  };

  useEffect(() => {
    if (products.length > 0 && currentPage === 'home' && aiSuggestions.length === 0) {
      generateAiSuggestions(products, searchHistory);
    }
  }, [products, searchHistory, currentPage]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [prodData, catData, brandData, historyData] = await Promise.all([
          api.getProducts(),
          api.getCategories(),
          api.getBrands(),
          api.getSearchHistory()
        ]);
        setProducts(prodData);
        setCategories(catData);
        setBrands(brandData);
        setSearchHistory(historyData);
      } catch (err) {
        console.error('Failed to fetch initial data:', err);
      } finally {
        setTimeout(() => setIsLoading(false), 300); // Slight delay for smoothness
      }
    };
    fetchData();
  }, []);

  // Disable body scroll when overlay is open
  useEffect(() => {
    if (searchFocused || selectedProduct) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [searchFocused, selectedProduct]);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === productId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const totalPrice = cart.reduce((acc, item) => acc + (item.discountPrice * item.quantity), 0);
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const toggleWishlist = (id: string) => {
    setWishlist(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const filteredProducts = useMemo(() => {
    if (!searchQuery) return [];
    return products.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.generic.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, products]);

  return (
    <div className="min-h-screen bg-app-bg text-text-main font-sans pb-24">
      <ScrollProgressBar />

      {/* Header */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-xl border-b border-slate-100 shadow-sm' : 'bg-app-bg'
      }`}>
        <div className={`px-4 transition-all duration-300 ${scrolled ? 'py-3' : 'pt-4 pb-2'} space-y-3`}>
          {/* Top Row: Brand & Profile/Notifications */}
          <div className={`flex items-center justify-between transition-all duration-300 ${scrolled ? 'h-0 opacity-0 overflow-hidden mb-0' : 'h-10 opacity-100 mb-2'}`}>
            <div className="flex items-center gap-2">
              <motion.div 
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20"
              >
                <span className="text-white font-black text-lg">P</span>
              </motion.div>
              <div>
                <h1 className="text-base font-black tracking-tight text-text-main leading-tight italic">PharmaQuick</h1>
                <div className="flex items-center gap-1 text-[10px] font-bold text-primary cursor-pointer hover:opacity-70 transition-opacity">
                  <MapPin size={10} />
                  <span>Deliver to: Uttara, Dhaka</span>
                  <ChevronDown size={10} />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="w-10 h-10 rounded-2xl bg-white text-text-main flex items-center justify-center relative shadow-sm border border-slate-100 active:scale-90 transition-all">
                <Bell size={18} />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-danger rounded-full border-2 border-white" />
              </button>
              <button 
                onClick={() => setCurrentPage('profile')}
                className="w-10 h-10 rounded-2xl overflow-hidden border border-slate-100 shadow-sm active:scale-90 transition-all"
              >
                <img src="https://picsum.photos/seed/jubayer/100/100" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </button>
            </div>
          </div>

          {/* Search Bar Row */}
          <div 
            onClick={() => setSearchFocused(true)}
            className="flex items-center gap-3 bg-white h-12 px-4 rounded-2xl cursor-pointer border border-slate-100 shadow-sm hover:border-primary/30 transition-all group"
          >
            <Search size={18} className="text-primary group-hover:scale-110 transition-transform" />
            <span className="text-xs text-text-muted font-bold flex-1">Search medicines, healthcare...</span>
            <div className="px-2 py-1 bg-primary/5 rounded-lg border border-primary/10">
              <Zap size={12} className="text-primary" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="px-4">
        <AnimatePresence mode="wait">
          {currentPage === 'home' && (
            <motion.div 
              key="home"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Banner Slider */}
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x">
              {BANNERS.map(banner => (
                <div key={banner.id} className={`min-w-[85%] snap-center rounded-card p-5 bg-gradient-to-r ${banner.color} text-white shadow-polish`}>
                  <p className="text-sm font-bold opacity-90 uppercase tracking-widest mb-1">Offer</p>
                  <h2 className="text-lg font-black leading-tight mb-3 pr-4">{banner.text}</h2>
                  <button className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-black">
                    {banner.code || banner.action || banner.note}
                  </button>
                </div>
              ))}
            </div>

            {/* Categories */}
            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-black text-text-main">Categories</h2>
                <button className="text-xs font-bold text-primary bg-primary-light px-3 py-1.5 rounded-full">See All</button>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {isLoading ? (
                  [1, 2, 3, 4, 5].map(i => <CategorySkeleton key={i} />)
                ) : (
                  categories.map(cat => (
                    <div key={cat.id} className="flex flex-col items-center gap-2 min-w-[70px]">
                      <div className="w-16 h-16 bg-white rounded-card shadow-polish flex items-center justify-center text-2xl border border-slate-50">
                        {cat.icon}
                      </div>
                      <span className="text-[11px] font-bold text-text-muted">{cat.name}</span>
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* AI Smart Suggestions */}
            <section className="py-2">
              <div className="bg-gradient-to-br from-primary/5 to-purple-500/5 rounded-[32px] p-5 border border-primary/10 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/5 blur-3xl rounded-full" />
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative z-10"
                >
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-primary rounded-xl text-white shadow-lg shadow-primary/20">
                        <Zap size={18} fill="currentColor" />
                      </div>
                      <div>
                        <h2 className="text-lg font-black text-text-main leading-tight">Smart Picks</h2>
                        <p className="text-[10px] font-black text-primary tracking-tighter uppercase flex items-center gap-1">
                          <span className="w-1 h-1 bg-primary rounded-full animate-pulse" /> AI Powered For You
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                    {isAiLoading || isLoading ? (
                      [1, 2, 3].map(i => <ProductCardSkeleton key={i} />)
                    ) : (
                      aiSuggestions.map(p => (
                        <ProductCard 
                          key={p.id} 
                          product={p} 
                          onClick={() => setSelectedProduct(p)} 
                          onAddToCart={() => addToCart(p)}
                        />
                      ))
                    )}
                  </div>
                </motion.div>
              </div>
            </section>

            {/* Flash Sale */}
            <section>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-black text-text-main">Flash Sale</h2>
                  <div className="bg-danger/10 text-danger text-[10px] font-black px-2 py-0.5 rounded animate-pulse">
                    08:04:22
                  </div>
                </div>
                <button className="text-xs font-bold text-danger bg-danger/5 px-3 py-1.5 rounded-full">Explore</button>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {isLoading ? (
                  [1, 2, 3].map(i => <ProductCardSkeleton key={i} />)
                ) : (
                  products.filter(p => p.isFlashSale).map(p => (
                    <ProductCard 
                      key={p.id} 
                      product={p} 
                      variant="flash"
                      onClick={() => setSelectedProduct(p)} 
                      onAddToCart={() => addToCart(p)}
                    />
                  ))
                )}
              </div>
            </section>

            {/* New Launched */}
            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-black text-text-main">New Launched</h2>
                <button className="text-xs font-bold text-primary bg-primary-light px-3 py-1.5 rounded-full">New Arrival</button>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {isLoading ? (
                  [1, 2, 3].map(i => <ProductCardSkeleton key={i} />)
                ) : (
                  products.filter(p => p.isNewLaunched).map(p => (
                    <ProductCard 
                      key={p.id} 
                      product={p} 
                      onClick={() => setSelectedProduct(p)} 
                      onAddToCart={() => addToCart(p)}
                    />
                  ))
                )}
              </div>
            </section>

            {/* Trending Products */}
            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-black text-text-main">Trending</h2>
                <button className="text-xs font-bold text-primary bg-primary-light px-3 py-1.5 rounded-full">See All</button>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {isLoading ? (
                  [1, 2, 3].map(i => <ProductCardSkeleton key={i} />)
                ) : (
                  products.map(p => (
                    <ProductCard 
                      key={p.id} 
                      product={p} 
                      onClick={() => setSelectedProduct(p)} 
                      onAddToCart={() => addToCart(p)}
                    />
                  ))
                )}
              </div>
            </section>

            {/* Brand List */}
            <section className="pb-8">
              <h2 className="text-lg font-black text-text-main mb-4">Top Brands</h2>
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {brands.map(brand => (
                  <div key={brand.id} className="flex flex-col items-center gap-2 min-w-[80px]">
                    <div className="w-14 h-14 bg-white rounded-full border border-slate-100 flex items-center justify-center text-primary font-black shadow-sm">
                      {brand.logo}
                    </div>
                    <span className="text-[10px] font-black text-text-muted">{brand.name}</span>
                  </div>
                ))}
              </div>
            </section>
          </motion.div>
        )}

        {currentPage === 'cart' && (
          <motion.div 
            key="cart"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-black text-text-main">My Cart</h2>
            {cart.length === 0 ? (
              <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-20 h-20 bg-primary-light rounded-full flex items-center justify-center text-primary">
                  <ShoppingCart size={40} />
                </div>
                <p className="text-text-muted font-bold">Your cart is empty</p>
                <button onClick={() => setCurrentPage('home')} className="bg-primary text-white px-8 py-3 rounded-full font-black shadow-lg shadow-primary/20">Shop Now</button>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {cart.map(item => (
                    <motion.div layout key={item.id} className="bg-white p-4 rounded-card shadow-polish flex gap-4 border border-slate-50">
                      <div className="w-20 h-20 bg-app-bg rounded-2xl flex items-center justify-center overflow-hidden">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div className="flex-1 py-1">
                        <div className="flex justify-between">
                          <h3 className="text-sm font-black text-text-main">{item.name}</h3>
                          <button onClick={() => removeFromCart(item.id)} className="text-danger">
                            <X size={16} />
                          </button>
                        </div>
                        <p className="text-[10px] text-text-muted mb-2">{item.generic}</p>
                        <div className="flex justify-between items-center">
                          <span className="font-black text-primary">৳{item.discountPrice * item.quantity}</span>
                          <div className="flex items-center gap-4 bg-app-bg px-2 py-1 rounded-xl">
                            <button onClick={() => updateQuantity(item.id, -1)} className="text-primary"><Minus size={14} /></button>
                            <span className="text-xs font-black">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, 1)} className="text-primary"><Plus size={14} /></button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="bg-white p-6 rounded-card shadow-polish space-y-6 border border-slate-50">
                  {/* Delivery Address */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-black text-text-muted uppercase tracking-widest">Delivery Address</label>
                      {!user?.isGuest && (
                        <button 
                          onClick={() => {
                            setCurrentPage('profile');
                            setTimeout(() => setShowEditProfileModal(true), 100);
                          }}
                          className="text-[10px] font-black text-primary px-2 py-1 bg-primary/5 rounded-lg border border-primary/10"
                        >
                          Change
                        </button>
                      )}
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-app-bg/50 rounded-2xl border border-slate-100">
                      <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-primary shadow-sm shrink-0">
                        <MapPin size={16} />
                      </div>
                      <p className="text-xs font-bold text-slate-700 leading-relaxed">
                        {user?.address || 'Set your delivery address in profile to continue'}
                      </p>
                    </div>
                  </div>

                  {/* Promo Code */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-text-muted uppercase tracking-widest">Offers & Promo</label>
                    <div className="flex gap-2">
                      <div className="flex-1 relative">
                        <Ticket size={16} className="absolute left-3 top-3 text-primary" />
                        <input 
                          type="text" 
                          placeholder="Enter promo code"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          className="w-full bg-app-bg h-10 pl-10 pr-4 rounded-xl text-xs font-bold border border-slate-100 focus:ring-1 focus:ring-primary/20 outline-none"
                        />
                      </div>
                      <button className="px-4 bg-primary/5 text-primary text-xs font-black rounded-xl border border-primary/10 hover:bg-primary/10 transition-colors">
                        Apply
                      </button>
                    </div>
                  </div>

                  {/* Advance Options Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Delivery Slot */}
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-text-muted uppercase tracking-widest">Delivery Type</label>
                      <div className="flex flex-col gap-2">
                        {[
                          { id: 'Express', icon: <Zap size={14} />, note: '30-45 mins' },
                          { id: 'Scheduled', icon: <Clock size={14} />, note: 'Choose time' }
                        ].map(slot => (
                          <button 
                            key={slot.id}
                            onClick={() => setDeliverySlot(slot.id as any)}
                            className={`flex items-center gap-2 p-3 rounded-xl border transition-all ${
                              deliverySlot === slot.id 
                                ? 'bg-primary/5 border-primary text-primary shadow-sm' 
                                : 'bg-white border-slate-100 text-text-muted'
                            }`}
                          >
                            <div className={`${deliverySlot === slot.id ? 'text-primary' : 'text-slate-400'}`}>
                              {slot.icon}
                            </div>
                            <div className="text-left">
                              <p className="text-[10px] font-black leading-none mb-1">{slot.id}</p>
                              <p className="text-[8px] font-bold opacity-70">{slot.note}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Payment Method */}
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-text-muted uppercase tracking-widest">Payment</label>
                      <div className="flex flex-col gap-2">
                        {[
                          { id: 'Cash', icon: <CreditCard size={14} />, note: 'On Delivery' },
                          { id: 'Digital', icon: <Zap size={14} />, note: 'SSLCommerz' }
                        ].map(method => (
                          <button 
                            key={method.id}
                            onClick={() => setPaymentMethod(method.id as any)}
                            className={`flex items-center gap-2 p-3 rounded-xl border transition-all ${
                              paymentMethod === method.id 
                                ? 'bg-primary/5 border-primary text-primary shadow-sm' 
                                : 'bg-white border-slate-100 text-text-muted'
                            }`}
                          >
                            <div className={`${paymentMethod === method.id ? 'text-primary' : 'text-slate-400'}`}>
                              {method.icon}
                            </div>
                            <div className="text-left">
                              <p className="text-[10px] font-black leading-none mb-1">{method.id}</p>
                              <p className="text-[8px] font-bold opacity-70">{method.note}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Prescription Section */}
                  <div className="bg-app-bg/50 p-4 rounded-2xl border border-dashed border-slate-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <FileText size={16} className="text-primary" />
                        <span className="text-xs font-black text-text-main">Prescription</span>
                      </div>
                      <span className="text-[8px] font-black bg-primary/10 text-primary px-2 py-0.5 rounded-full uppercase tracking-widest">Required</span>
                    </div>
                    <button 
                      onClick={() => setPrescriptionAttached(!prescriptionAttached)}
                      className={`w-full py-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
                        prescriptionAttached 
                          ? 'bg-success text-white shadow-lg shadow-success/20' 
                          : 'bg-white border border-slate-100 text-text-muted hover:border-primary/30 shadow-sm'
                      }`}
                    >
                      {prescriptionAttached ? (
                        <><ShieldCheck size={16} /> Prescription Attached</>
                      ) : (
                        <><Plus size={16} /> Upload Prescription</>
                      )}
                    </button>
                  </div>

                  {/* Order Notes */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <MessageSquare size={14} className="text-text-muted" />
                      <label className="text-[10px] font-black text-text-muted uppercase tracking-widest">Order Notes</label>
                    </div>
                    <textarea 
                      placeholder="Special instructions for pharmacist..."
                      value={orderNotes}
                      onChange={(e) => setOrderNotes(e.target.value)}
                      className="w-full bg-app-bg p-3 rounded-xl text-xs font-bold border border-slate-100 focus:ring-1 focus:ring-primary/20 outline-none min-h-[60px]"
                    />
                  </div>

                  <div className="h-px bg-slate-100" />

                  {/* Final Summary Component */}
                  <div className="space-y-3 pt-2">
                    <div className="flex justify-between text-sm text-text-muted font-bold">
                      <span>Subtotal</span>
                      <span>৳{totalPrice}</span>
                    </div>
                    <div className="flex justify-between text-sm text-success font-black">
                      <span>Discount (PROMO5)</span>
                      <span>-৳{(totalPrice * 0.1).toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-primary font-black">
                      <span>Delivery Fee</span>
                      <span>৳{deliverySlot === 'Express' ? 45 : 20}</span>
                    </div>
                    <div className="h-px bg-slate-100 my-2" />
                    <div className="flex justify-between text-lg font-black text-text-main">
                      <span>Total Amount</span>
                      <span>৳{(totalPrice * 0.9 + (deliverySlot === 'Express' ? 45 : 20)).toFixed(0)}</span>
                    </div>
                  </div>

                  {totalPrice < MIN_ORDER_AMOUNT && (
                    <div className="bg-rose-50 border border-emerald-50 p-3 rounded-2xl flex items-center gap-3">
                      <Info size={16} className="text-rose-500 shrink-0" />
                      <p className="text-[10px] font-bold text-rose-600">
                        Minimum order amount is <span className="font-black">৳{MIN_ORDER_AMOUNT}</span>. Add ৳{MIN_ORDER_AMOUNT - totalPrice} more to proceed.
                      </p>
                    </div>
                  )}

                  {cart.length < MIN_ORDER_QTY && (
                    <div className="bg-orange-50 border border-orange-50 p-3 rounded-2xl flex items-center gap-3">
                      <Package size={16} className="text-orange-500 shrink-0" />
                      <p className="text-[10px] font-bold text-orange-600">
                        Minimum <span className="font-black">{MIN_ORDER_QTY} items</span> required. You have {cart.length} in cart.
                      </p>
                    </div>
                  )}

                  <button 
                    disabled={totalPrice < MIN_ORDER_AMOUNT || cart.length < MIN_ORDER_QTY || !!user?.isGuest || (!user?.isGuest && !user?.address)}
                    onClick={() => {
                      if (user?.isGuest) {
                        setShowAuthModal(true);
                        return;
                      }
                      // Handle successful order
                    }}
                    className={`w-full py-4 rounded-full font-black text-lg shadow-lg transition-all flex items-center justify-center gap-3 group active:scale-95 ${
                      (totalPrice < MIN_ORDER_AMOUNT || cart.length < MIN_ORDER_QTY || !!user?.isGuest || (!user?.isGuest && !user?.address))
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                        : 'bg-primary text-white shadow-primary/20 hover:brightness-110'
                    }`}
                  >
                    {!user?.isGuest && !user?.address ? 'Set Address to Order' : (user?.isGuest ? 'Login to Order' : 'Place Order')} <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </>
            )}
          </motion.div>
        )}

        {currentPage === 'orders' && (
          <motion.div 
            key="orders"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-black text-text-main">Track Orders</h2>
            <div className="flex gap-2 bg-white p-1 rounded-full shadow-polish border border-slate-50">
              {['Running', 'Delivered', 'Cancelled'].map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveOrderTab(tab as any)}
                  className={`flex-1 py-2 rounded-full text-xs font-black transition-all ${
                    activeOrderTab === tab ? 'bg-primary text-white shadow-md' : 'text-text-muted'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            
            <div className="space-y-4">
              {activeOrderTab === 'Running' ? (
                <div className="bg-white p-5 rounded-card shadow-polish border border-slate-50 space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-[10px] text-text-muted uppercase font-black tracking-widest">Order ID</p>
                      <h3 className="text-sm font-black text-text-main">#PH992102-BD</h3>
                    </div>
                    <div className="bg-primary/10 text-primary text-[10px] font-black px-3 py-1 rounded-full">
                      Processing
                    </div>
                  </div>
                  <div className="flex items-center gap-4 py-3 border-y border-slate-50">
                    <div className="w-12 h-12 bg-app-bg rounded-xl flex items-center justify-center text-primary">
                      <MapPin size={24} />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] text-text-muted font-bold">Delivery Address</p>
                      <p className="text-xs font-black truncate">Sector 7, Uttara, Dhaka-1230</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-app-bg flex items-center justify-center overflow-hidden">
                          <img src={`https://picsum.photos/seed/${i * 10}/50/50`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                      ))}
                    </div>
                    <button className="text-xs font-black text-primary flex items-center gap-1">
                      Track Live <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="py-20 flex flex-col items-center justify-center text-text-muted font-bold">
                  No {activeOrderTab} orders found
                </div>
              )}
            </div>
          </motion.div>
        )}

        {currentPage === 'profile' && (
          <motion.div 
            key="profile"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="space-y-6"
          >
            {user?.isGuest ? (
              <div className="bg-white p-8 rounded-[32px] shadow-polish border border-slate-50 text-center space-y-6">
                <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mx-auto text-primary">
                  <User size={40} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-800">Ready to Order?</h3>
                  <p className="text-xs font-bold text-slate-500 mt-2">Log in to track orders, save history and access wholesale features.</p>
                </div>
                <button 
                  onClick={() => setShowAuthModal(true)}
                  className="w-full bg-primary text-white py-4 rounded-2xl font-black text-sm shadow-lg shadow-primary/10 active:scale-95 transition-all"
                >
                  Join / Login 🚀
                </button>
              </div>
            ) : (
              /* Profile Header */
              <div className="bg-white p-6 rounded-card shadow-polish border border-slate-50 relative overflow-hidden group">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
                
                <div className="relative flex flex-col items-center space-y-4">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full border-4 border-primary-light p-1 bg-white overflow-hidden shadow-polish">
                      <img src={user?.avatar || "https://picsum.photos/seed/jubayer/200/200"} className="w-full h-full rounded-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div className="absolute bottom-1 right-1 w-7 h-7 bg-success rounded-full border-2 border-white flex items-center justify-center text-white shadow-lg">
                      <ShieldCheck size={14} />
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <h3 className="text-xl font-black text-text-main flex items-center justify-center gap-2">
                      {user?.name} 
                      <span className="px-2 py-0.5 bg-success/10 text-success text-[8px] font-black uppercase rounded-full border border-success/20">Verified</span>
                    </h3>
                    <p className="text-xs font-bold text-text-muted">{user?.email || user?.phone || 'Premium Member'}</p>
                    <p className="text-[10px] font-black text-primary mt-1 uppercase tracking-widest">{user?.provider} Account</p>
                  </div>

                  <div className="w-full bg-amber-50 border border-amber-100 p-4 rounded-2xl flex flex-col items-center gap-2 text-center">
                    <Clock size={20} className="text-amber-500" />
                    <div>
                      <p className="text-xs font-black text-amber-800">Account Approval Pending</p>
                      <p className="text-[10px] font-bold text-amber-600 leading-tight mt-1">
                        Your business account is waiting for admin approval. Access to wholesale features will be granted shortly.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button 
                      onClick={() => setShowEditProfileModal(true)}
                      className="px-4 py-1.5 bg-primary/5 text-primary text-[10px] font-black rounded-full border border-primary/10 transition-colors hover:bg-primary/10"
                    >
                      Edit Profile
                    </button>
                    <button onClick={logout} className="px-4 py-1.5 bg-rose-50 text-rose-600 text-[10px] font-black rounded-full border border-rose-100 flex items-center gap-1 transition-colors hover:bg-rose-100">
                      <LogOut size={12} /> Logout
                    </button>
                  </div>
                </div>

                {/* Profile Details */}
                {!user?.isGuest && (
                  <div className="mt-6 pt-6 border-t border-slate-50 space-y-4 w-full">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                        <MailIcon size={16} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</p>
                        <p className="text-xs font-bold text-slate-700">{user?.email || 'Not provided'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                        <Phone size={16} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone</p>
                        <p className="text-xs font-bold text-slate-700">{user?.phone || 'Not provided'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                        <MapPin size={16} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Default Address</p>
                        <p className="text-xs font-bold text-slate-700 leading-relaxed">{user?.address || 'No address saved'}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Impact Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-card shadow-polish border border-slate-50">
                <div className="w-10 h-10 bg-primary-light text-primary rounded-xl flex items-center justify-center mb-3">
                  <ShoppingCart size={20} />
                </div>
                <p className="text-2xl font-black text-text-main">15</p>
                <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Total Orders</p>
              </div>
              <div className="bg-white p-4 rounded-card shadow-polish border border-slate-50">
                <div className="w-10 h-10 bg-success/10 text-success rounded-xl flex items-center justify-center mb-3">
                  <Heart size={20} />
                </div>
                <p className="text-2xl font-black text-success">850</p>
                <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Pharma Points</p>
              </div>
            </div>

            {/* Menu options */}
            <div className="bg-white rounded-card shadow-polish border border-slate-50 divide-y divide-slate-50">
              {[
                { icon: <MapPin size={18} />, label: 'My Address', color: 'text-primary' },
                { icon: <CreditCard size={18} />, label: 'Payment Methods', color: 'text-primary' },
                { icon: <History size={18} />, label: 'Medical History', color: 'text-primary' },
                { icon: <ShieldCheck size={18} />, label: 'Admin Panel', color: 'text-purple-600', path: '/admin/login' },
                { icon: <Info size={18} />, label: 'About App', color: 'text-primary' },
                { icon: <HelpCircle size={18} />, label: 'Support Center', color: 'text-primary' },
              ].map((item, idx) => (
                <button 
                  key={idx} 
                  onClick={() => item.path && navigate(item.path)}
                  className="w-full px-5 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors first:rounded-t-card last:rounded-b-card"
                >
                  <div className="flex items-center gap-4">
                    <div className={`${item.color}`}>{item.icon}</div>
                    <span className="text-sm font-black text-text-main">{item.label}</span>
                  </div>
                  <ChevronRight size={16} className="text-text-muted" />
                </button>
              ))}
            </div>

            {/* Advance Settings Section */}
            <div className="space-y-4 pt-2">
              <h3 className="text-xs font-black text-text-muted uppercase tracking-widest pl-2">Preferences</h3>
              <div className="bg-white rounded-card shadow-polish border border-slate-50 divide-y divide-slate-50">
                {/* Language Selection */}
                <div className="px-5 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                      <Zap size={18} />
                    </div>
                    <div>
                      <span className="text-sm font-black text-text-main block">Language</span>
                      <span className="text-[10px] font-bold text-text-muted">Select App Language</span>
                    </div>
                  </div>
                  <div className="bg-app-bg p-1 rounded-xl flex gap-1 border border-slate-100">
                    <button 
                      onClick={() => setLanguage('EN')}
                      className={`px-3 py-1 text-[10px] font-black rounded-lg transition-all ${language === 'EN' ? 'bg-primary text-white shadow-sm' : 'text-text-muted'}`}
                    >
                      EN
                    </button>
                    <button 
                      onClick={() => setLanguage('BN')}
                      className={`px-3 py-1 text-[10px] font-black rounded-lg transition-all ${language === 'BN' ? 'bg-primary text-white shadow-sm' : 'text-text-muted'}`}
                    >
                      BN
                    </button>
                  </div>
                </div>

                {/* Notifications Toggles */}
                <div className="px-5 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                      <Bell size={18} />
                    </div>
                    <div>
                      <span className="text-sm font-black text-text-main block">Order Updates</span>
                      <span className="text-[10px] font-bold text-text-muted">Push Notifications</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setPushNotifications(!pushNotifications)}
                    className={`w-10 h-5 rounded-full relative transition-all ${pushNotifications ? 'bg-primary' : 'bg-slate-200'}`}
                  >
                    <motion.div 
                      animate={{ x: pushNotifications ? 20 : 2 }}
                      className="absolute top-1 w-3 h-3 bg-white rounded-full shadow-sm"
                    />
                  </button>
                </div>

                {/* Biometric Security */}
                <div className="px-5 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                      <ShieldCheck size={18} />
                    </div>
                    <div>
                      <span className="text-sm font-black text-text-main block">Biometric Login</span>
                      <span className="text-[10px] font-bold text-text-muted">Fingerprint/FaceID</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setBiometricLogin(!biometricLogin)}
                    className={`w-10 h-5 rounded-full relative transition-all ${biometricLogin ? 'bg-success' : 'bg-slate-200'}`}
                  >
                    <motion.div 
                      animate={{ x: biometricLogin ? 20 : 2 }}
                      className="absolute top-1 w-3 h-3 bg-white rounded-full shadow-sm"
                    />
                  </button>
                </div>
              </div>
            </div>

            <button className="w-full flex items-center justify-center gap-2 py-4 text-danger font-black bg-white rounded-card shadow-polish border border-danger/5 active:scale-95 transition-all">
              <LogOut size={20} /> Logout
            </button>
          </motion.div>
        )}
        </AnimatePresence>
      </main>

      {/* Product Details Overlay */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-md flex items-end"
          >
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="bg-app-bg w-full h-[85vh] rounded-t-[40px] relative flex flex-col overflow-hidden"
            >
              <button 
                onClick={() => setSelectedProduct(null)}
                className="absolute top-6 right-6 z-10 w-10 h-10 bg-white shadow-polish rounded-full flex items-center justify-center text-text-main"
              >
                <X size={24} />
              </button>

              <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6">
                <div className="bg-white rounded-[32px] p-6 shadow-polish flex items-center justify-center h-64 border border-slate-50">
                  <img src={selectedProduct.image} alt={selectedProduct.name} className="max-h-full object-contain" referrerPolicy="no-referrer" />
                </div>

                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-2xl font-black text-text-main">{selectedProduct.name}</h2>
                    <span className="bg-primary-light text-primary px-3 py-1 rounded-full text-xs font-black">{selectedProduct.brand}</span>
                  </div>
                  <p className="text-text-muted font-bold mb-4">{selectedProduct.generic}</p>
                  
                  <div className="flex gap-2 mb-6">
                    <div className="bg-white px-3 py-1.5 rounded-xl text-[10px] font-black shadow-sm text-text-muted">EXP: 12/26</div>
                    <div className="bg-white px-3 py-1.5 rounded-xl text-[10px] font-black shadow-sm text-text-muted">UNIT: {selectedProduct.type}</div>
                    <div className="bg-white px-3 py-1.5 rounded-xl text-[10px] font-black shadow-sm text-success">STOCK: {selectedProduct.stock}+</div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-black text-text-main flex items-center gap-2 mb-2">
                        <Info size={16} className="text-primary" /> Description
                      </h4>
                      <p className="text-xs text-text-muted leading-relaxed font-semibold">
                        {selectedProduct.description}
                      </p>
                    </div>

                    <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10">
                      <h4 className="text-sm font-black text-primary flex items-center gap-2 mb-2">
                         Usage & Dosage
                      </h4>
                      <p className="text-xs text-primary font-bold leading-relaxed">
                        {selectedProduct.dosage}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Add to Cart Bar */}
              <div className="bg-white p-6 shadow-polish border-t border-slate-100 flex items-center justify-between gap-6">
                 <div>
                    <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">Total Price</p>
                    <div className="flex items-center gap-2">
                       <span className="text-sm line-through text-text-muted opacity-50 font-bold">৳{selectedProduct.mrp}</span>
                       <span className="text-2xl font-black text-text-main">৳{selectedProduct.discountPrice}</span>
                    </div>
                 </div>
                 <button 
                  onClick={() => {
                    addToCart(selectedProduct);
                    setSelectedProduct(null);
                  }}
                  className="flex-1 bg-primary text-white py-4 rounded-full font-black text-lg shadow-lg shadow-primary/20 flex items-center justify-center gap-2 active:scale-95 transition-all"
                 >
                   <Plus size={20} /> Add to Cart
                 </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full Search Overlay */}
      <AnimatePresence>
        {searchFocused && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-white p-4"
          >
            <div className="flex items-center gap-3 mb-6 bg-white sticky top-0 py-2">
              <div className="flex-1 relative group">
                <input 
                  autoFocus
                  type="text" 
                  placeholder="Search medications, generics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-app-bg h-12 pl-12 pr-4 rounded-2xl text-sm font-bold border border-slate-100 focus:ring-2 focus:ring-primary/20 focus:bg-white focus:border-primary/30 transition-all outline-none"
                />
                <Search size={18} className="absolute left-4 top-3.5 text-primary group-focus-within:scale-110 transition-transform" />
              </div>
              <button 
                onClick={() => setSearchFocused(false)}
                className="text-sm font-bold text-text-muted hover:text-primary transition-colors pr-2"
              >
                Cancel
              </button>
            </div>

            {/* History Section */}
            {!searchQuery && (
              <motion.section 
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.1 }
                  }
                }}
                className="space-y-4"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-black text-text-main flex items-center gap-2">
                    <HistoryIcon size={16} className="text-text-muted" /> Recent Searches
                  </h3>
                  <button onClick={() => setSearchHistory([])} className="text-[10px] font-black text-danger uppercase tracking-widest">Clear</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {searchHistory.map((term, i) => (
                    <motion.button 
                      variants={{
                        hidden: { opacity: 0, scale: 0.8 },
                        visible: { opacity: 1, scale: 1 }
                      }}
                      key={i} 
                      onClick={() => setSearchQuery(term)}
                      className="bg-app-bg px-4 py-2 rounded-xl text-xs font-bold text-text-muted border border-slate-50 hover:border-primary/20 transition-all"
                    >
                      {term}
                    </motion.button>
                  ))}
                </div>

                <div className="pt-4">
                  <h3 className="text-sm font-black text-text-main flex items-center gap-2 mb-4">
                    <Zap size={16} className="text-amber-500" /> Trending Topics
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {['Insulin', 'Napa Extra', 'Surgical Mask', 'Vitamin C', 'Omeprazole'].map((tag, i) => (
                      <button 
                        key={i}
                        onClick={() => setSearchQuery(tag)}
                        className="px-4 py-2 rounded-xl text-xs font-bold bg-primary/5 text-primary border border-primary/10"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.section>
            )}

            {searchQuery && (
              <motion.section 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                <h3 className="text-sm font-black text-text-main">Search Results</h3>
                <motion.div 
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: { staggerChildren: 0.05 }
                    }
                  }}
                  className="grid grid-cols-2 gap-4 pb-20 overflow-y-auto max-h-[75vh] scrollbar-hide"
                >
                  {filteredProducts.map(p => (
                    <ProductCard 
                      key={p.id} 
                      product={p} 
                      onClick={async () => {
                        if (!searchHistory.includes(p.name)) {
                          await api.saveSearch(p.name);
                          setSearchHistory(prev => [p.name, ...prev.slice(0, 4)]);
                        }
                        setSelectedProduct(p);
                        setSearchFocused(false);
                        setSearchQuery('');
                      }} 
                      onAddToCart={() => addToCart(p)}
                    />
                  ))}
                </motion.div>
              </motion.section>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Edit Profile Modal */}
      <AnimatePresence>
        {showEditProfileModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-slate-900/60 backdrop-blur-md flex items-end sm:items-center justify-center p-4"
          >
            <motion.div 
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="bg-white w-full max-w-sm rounded-[40px] shadow-2xl overflow-hidden p-6 space-y-6"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-black text-slate-800 tracking-tight">Edit Profile</h2>
                <button onClick={() => setShowEditProfileModal(false)} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
                  <X size={20} className="text-slate-400" />
                </button>
              </div>

              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full border-4 border-primary-light p-1 bg-white overflow-hidden shadow-polish">
                    <img src={profileForm.avatar || "https://picsum.photos/seed/jubayer/200/200"} className="w-full h-full rounded-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-white rounded-full border-2 border-white flex items-center justify-center shadow-lg active:scale-90 transition-transform">
                    <Camera size={14} />
                  </button>
                </div>
              </div>

              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                  <input 
                    type="text" 
                    value={profileForm.name}
                    onChange={(e) => setProfileForm(p => ({ ...p, name: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-xs font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                  <input 
                    type="email" 
                    value={profileForm.email}
                    onChange={(e) => setProfileForm(p => ({ ...p, email: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-xs font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                  <input 
                    type="tel" 
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm(p => ({ ...p, phone: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-xs font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Delivery Address</label>
                  <textarea 
                    value={profileForm.address}
                    onChange={(e) => setProfileForm(p => ({ ...p, address: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-xs font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all min-h-[80px]"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => setShowEditProfileModal(false)}
                  className="flex-1 py-4 bg-slate-50 text-slate-400 rounded-2xl font-black text-sm active:scale-95 transition-all"
                >
                  Close
                </button>
                <button 
                  onClick={() => {
                    updateProfile(profileForm);
                    setShowEditProfileModal(false);
                  }}
                  className="flex-[2] bg-primary text-white py-4 rounded-2xl font-black text-sm shadow-lg shadow-primary/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  Save Changes 🚀
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Auth Modal */}
      <AnimatePresence>
        {showAuthModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-md flex items-end sm:items-center justify-center p-4"
          >
            <motion.div 
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="bg-white w-full max-w-sm rounded-[40px] shadow-2xl overflow-hidden p-8 space-y-8"
            >
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-primary/5 rounded-3xl flex items-center justify-center mx-auto text-primary">
                  <Zap size={32} />
                </div>
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">Access Rewards</h2>
                <p className="text-xs font-bold text-slate-400 capitalize">Sign in to unlock wholesale benefits</p>
              </div>

              {isAuthLoading ? (
                <div className="py-20 flex flex-col items-center justify-center gap-4">
                  <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                  <p className="text-xs font-black text-primary animate-pulse uppercase tracking-widest">Authorizing...</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <button 
                    onClick={() => { login('google', { name: 'Sheikh Jubayer', email: 'jubayer@gmail.com' }); setShowAuthModal(false); }}
                    className="w-full flex items-center justify-center gap-3 py-4 bg-slate-50 rounded-2xl border border-slate-100 font-black text-sm text-slate-700 hover:bg-slate-100 transition-all"
                  >
                    <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" className="w-5 h-5" /> Continue with Google
                  </button>
                  <button 
                    onClick={() => { login('facebook', { name: 'Jubayer Tech', email: 'fb.user@domain.com' }); setShowAuthModal(false); }}
                    className="w-full flex items-center justify-center gap-3 py-4 bg-[#1877F2]/5 rounded-2xl border border-[#1877F2]/10 font-black text-sm text-[#1877F2] hover:bg-[#1877F2]/10 transition-all"
                  >
                    <Facebook size={20} fill="currentColor" /> Continue with Facebook
                  </button>
                  <button 
                    onClick={() => { login('phone', { name: 'Phone User', phone: '+88017...' }); setShowAuthModal(false); }}
                    className="w-full flex items-center justify-center gap-3 py-4 bg-emerald-50 rounded-2xl border border-emerald-100 font-black text-sm text-emerald-600 hover:bg-emerald-100 transition-all"
                  >
                    <Phone size={20} /> Use Phone Number
                  </button>
                  <button 
                    onClick={() => { login('email', { name: 'New Member', email: 'welcome@pharma.com' }); setShowAuthModal(false); }}
                    className="w-full flex items-center justify-center gap-3 py-4 bg-primary/5 rounded-2xl border border-primary/10 font-black text-sm text-primary hover:bg-primary/10 transition-all"
                  >
                    <MailIcon size={20} /> Use Email Address
                  </button>
                  
                  <button 
                    onClick={() => setShowAuthModal(false)}
                    className="w-full py-4 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors"
                  >
                    Stay as Guest
                  </button>
                </div>
              )}

              <p className="text-[10px] text-center text-slate-400 font-bold px-4">
                By continuing, you agree to our <span className="text-primary underline">Terms of Service</span> and <span className="text-primary underline">Privacy Policy</span>.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Navigation */}
      <motion.nav 
        className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-t border-slate-100 px-6 py-3 flex items-center justify-between shadow-2xl rounded-t-[30px]"
      >
        {[
          { icon: <HomeIcon size={22} />, label: 'Home', view: 'home' },
          { icon: <ClipboardList size={22} />, label: 'Orders', view: 'orders' },
          { icon: <ShoppingCart size={22} />, label: 'Cart', view: 'cart' },
          { icon: <Heart size={22} />, label: 'Wishlist', view: 'wishlist' },
          { icon: <User size={22} />, label: 'Profile', view: 'profile' },
        ].map((item, idx) => (
          <button 
            key={idx}
            onClick={() => setCurrentPage(item.view as any)}
            className="flex flex-col items-center gap-1.5 relative group"
          >
            <div className="relative">
              {currentPage === item.view && (
                <motion.div 
                  layoutId="nav-indicator"
                  className="absolute -inset-2 bg-primary/10 rounded-xl"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <div className={`transition-all duration-300 relative z-10 ${currentPage === item.view ? 'text-primary scale-110' : 'text-text-muted hover:text-primary/60'}`}>
                {item.icon}
                {item.view === 'cart' && totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-danger text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-black border border-white">
                    {totalItems}
                  </span>
                )}
              </div>
            </div>
            <span className={`text-[10px] font-black transition-all duration-300 ${currentPage === item.view ? 'text-primary' : 'text-text-muted opacity-0 translate-y-1'}`}>
              {item.label}
            </span>
          </button>
        ))}
      </motion.nav>
    </div>
  );
}
