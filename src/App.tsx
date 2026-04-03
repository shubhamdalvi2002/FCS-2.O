import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, Phone, MapPin, Clock, ChevronRight, Facebook, Instagram, Twitter, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CartProvider, useCart } from './CartContext';
import ScrollToTop from './components/ScrollToTop';

// Pages (to be implemented)
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AdminDashboard';
import OrderSuccess from './pages/OrderSuccess';

const Navbar = () => {
  const { cart, isShopOpen, settings } = useCart();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  if (isAdminPage) return null;

  return (
    <>
      <div className="bg-accent text-black py-1.5 overflow-hidden whitespace-nowrap border-b border-black/10">
        <div className="inline-block animate-marquee px-4">
          <span className="mx-8 font-bold text-[0.65rem] uppercase tracking-widest">Farm Fresh Daily</span>
          <span className="mx-8 font-bold text-[0.65rem] uppercase tracking-widest">Quick Confirmation</span>
          <span className="mx-8 font-bold text-[0.65rem] uppercase tracking-widest">Home Delivery</span>
          <span className="mx-8 font-bold text-[0.65rem] uppercase tracking-widest">Halal Certified</span>
          <span className="mx-8 font-bold text-[0.65rem] uppercase tracking-widest">Farm Fresh Daily</span>
          <span className="mx-8 font-bold text-[0.65rem] uppercase tracking-widest">Quick Confirmation</span>
          <span className="mx-8 font-bold text-[0.65rem] uppercase tracking-widest">Home Delivery</span>
          <span className="mx-8 font-bold text-[0.65rem] uppercase tracking-widest">Halal Certified</span>
        </div>
      </div>
      <div className="accent-line"></div>
      <nav className="bg-bg/92 backdrop-blur-lg border-b border-border sticky top-0 z-50 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-9 h-9 bg-accent rounded-xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
              <ShoppingBag className="w-5 h-5 text-black" />
            </div>
            <span className="text-xl font-extrabold tracking-tighter font-heading">
              FCS <span className="text-accent">2.0</span>
            </span>
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex items-center gap-2 text-[0.78rem] text-muted font-medium group relative cursor-help">
              <div className={`w-2 h-2 rounded-full ${isShopOpen ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]'}`}></div>
              {isShopOpen ? (
                <span className="text-emerald-500 font-bold">Open Now</span>
              ) : (
                <span className="text-red-500 font-bold">Closed Now</span>
              )}
              <div className="absolute top-full left-0 mt-2 p-2 bg-black text-white text-[0.65rem] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-[60] pointer-events-none border border-white/10 shadow-xl">
                Shop Hours: {settings.openHour > 12 ? settings.openHour - 12 : settings.openHour} {settings.openHour >= 12 ? 'PM' : 'AM'} - {settings.closeHour > 12 ? settings.closeHour - 12 : settings.closeHour} {settings.closeHour >= 12 ? 'PM' : 'AM'} (IST)
              </div>
            </div>
            <Link to="/" className="text-muted hover:text-accent font-medium transition-colors">Home</Link>
            <Link to="/shop" className="text-muted hover:text-accent font-medium transition-colors">Shop</Link>
            <Link to="/cart" className="bg-accent text-black px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 hover:scale-105 transition-all">
              My Order
              <span className="bg-black text-accent rounded-full w-5 h-5 flex items-center justify-center text-[0.7rem] font-extrabold">
                {cart.length}
              </span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <Link to="/cart" className="relative p-2 text-accent">
              <ShoppingCart className="w-6 h-6" />
              {cart.length > 0 && (
                <span className="absolute top-0 right-0 bg-accent2 text-white text-[0.6rem] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </Link>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-text">
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-surface border-b border-border overflow-hidden"
            >
              <div className="px-4 py-6 space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted font-medium pb-2 border-b border-border/50">
                  <div className={`w-2 h-2 rounded-full ${isShopOpen ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]'}`}></div>
                  {isShopOpen ? (
                    <span className="text-emerald-500 font-bold">Open Now</span>
                  ) : (
                    <span className="text-red-500 font-bold">Closed Now</span>
                  )}
                  <span className="text-[0.65rem] text-muted ml-auto">
                    {settings.openHour > 12 ? settings.openHour - 12 : settings.openHour}{settings.openHour >= 12 ? 'PM' : 'AM'} - {settings.closeHour > 12 ? settings.closeHour - 12 : settings.closeHour}{settings.closeHour >= 12 ? 'PM' : 'AM'}
                  </span>
                </div>
                <Link to="/" onClick={() => setIsMenuOpen(false)} className="block text-lg font-bold hover:text-accent">Home</Link>
                <Link to="/shop" onClick={() => setIsMenuOpen(false)} className="block text-lg font-bold hover:text-accent">Shop</Link>
                <Link to="/cart" onClick={() => setIsMenuOpen(false)} className="block bg-accent text-black p-4 rounded-xl font-bold text-center">
                  My Order ({cart.length})
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
};

const Footer = () => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  if (isAdminPage) return null;

  return (
    <footer className="bg-surface border-t border-border pt-12 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-black">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <span className="text-xl font-extrabold tracking-tighter font-heading">
                FCS <span className="text-accent">2.0</span>
              </span>
            </Link>
            <p className="text-muted text-sm leading-relaxed">
              Premium quality farm-fresh chicken and eggs delivered to your doorstep. We prioritize hygiene, freshness, and customer satisfaction in every order.
            </p>
            <div className="flex items-center space-x-4">
              <a href="https://www.instagram.com/fcs2.o" target="_blank" className="w-10 h-10 bg-card border border-border rounded-xl flex items-center justify-center text-muted hover:border-accent hover:text-accent transition-all">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-card border border-border rounded-xl flex items-center justify-center text-muted hover:border-accent hover:text-accent transition-all">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-card border border-border rounded-xl flex items-center justify-center text-muted hover:border-accent hover:text-accent transition-all">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-bold font-heading uppercase tracking-widest text-text mb-6">Quick Links</h4>
            <ul className="space-y-4 text-sm text-muted">
              <li><Link to="/" className="hover:text-accent transition-colors">Home</Link></li>
              <li><Link to="/shop" className="hover:text-accent transition-colors">Shop Menu</Link></li>
              <li><Link to="/cart" className="hover:text-accent transition-colors">My Cart</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold font-heading uppercase tracking-widest text-text mb-6">Contact Info</h4>
            <ul className="space-y-4 text-sm text-muted">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-accent shrink-0" />
                <span>Near Agasti Kirana Shop Dhumalwadi road, Akole 422601</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-accent shrink-0" />
                <span>+91 98905 01565</span>
              </li>
              <li className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-accent shrink-0" />
                <span>Open Daily: 8AM – 9PM</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold font-heading uppercase tracking-widest text-text mb-6">Newsletter</h4>
            <p className="text-muted text-sm mb-4">Subscribe to get updates on fresh stock and special offers.</p>
          <div className="flex flex-col sm:flex-row gap-2">
            <input 
              type="email" 
              placeholder="Your email" 
              className="bg-card border border-border rounded-xl px-4 py-2 text-sm w-full focus:ring-1 focus:ring-accent outline-none"
            />
            <button className="bg-accent text-black px-4 py-2 rounded-xl font-bold text-sm hover:bg-accent-hover transition-colors whitespace-nowrap">
              Join
            </button>
          </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-muted text-xs">
            © 2025 FCS 2.0 · Owned by Gunjal Om Kailas · All rights reserved.
          </div>
          <div className="flex items-center space-x-6 text-xs text-muted">
            <a href="#" className="hover:text-accent">Privacy Policy</a>
            <a href="#" className="hover:text-accent">Terms of Service</a>
            <a href="#" className="hover:text-accent">Refund Policy</a>
          </div>
        </div>
      </div>
      {location.pathname === '/' && (
        <a href="https://wa.me/919890501565" target="_blank" className="fixed bottom-6 right-6 bg-[#25D366] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-[900]">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.556 4.122 1.527 5.856L.057 23.998l6.285-1.449A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.95 0-3.775-.5-5.362-1.375l-.384-.222-3.986.919.95-3.878-.25-.4A9.932 9.932 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
        </a>
      )}
    </footer>
  );
};

export default function App() {
  return (
    <CartProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-bg font-sans">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/admin/*" element={<AdminDashboard />} />
              <Route path="/order-success/:orderId" element={<OrderSuccess />} />
            </Routes>
          </main>
          <Footer />
          <RecentOrderNotification />
          <ScrollToTop />
        </div>
      </Router>
    </CartProvider>
  );
}

const RecentOrderNotification = () => {
  const [lastOrder, setLastOrder] = React.useState<string | null>(null);
  const location = useLocation();

  React.useEffect(() => {
    const orderId = localStorage.getItem('lastOrderId');
    if (orderId && !location.pathname.includes('/order-success')) {
      setLastOrder(orderId);
    } else {
      setLastOrder(null);
    }
  }, [location.pathname]);

  if (!lastOrder) return null;

  return (
    <motion.div 
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-6 left-6 right-6 sm:left-auto sm:right-6 sm:w-96 z-[1000]"
    >
      <div className="bg-card border border-accent/30 p-5 rounded-[2rem] shadow-2xl flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center text-accent">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[0.6rem] font-bold uppercase tracking-widest text-muted">Recent Order</p>
              <p className="text-sm font-bold font-syne">#{lastOrder}</p>
            </div>
          </div>
          <button 
            onClick={() => {
              localStorage.removeItem('lastOrderId');
              setLastOrder(null);
            }}
            className="p-2 text-muted hover:text-accent transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex gap-2">
          <Link 
            to={`/order-success/${lastOrder}`}
            className="flex-1 bg-accent text-black px-4 py-3 rounded-2xl text-[0.75rem] font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all"
          >
            <ShoppingBag className="w-4 h-4" />
            View Order
          </Link>
          <a 
            href={`https://wa.me/919890501565?text=Hi, I have a query about my order #${lastOrder}`}
            target="_blank"
            className="bg-[#25D366] text-white px-4 py-3 rounded-2xl text-[0.75rem] font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.556 4.122 1.527 5.856L.057 23.998l6.285-1.449A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.95 0-3.775-.5-5.362-1.375l-.384-.222-3.986.919.95-3.878-.25-.4A9.932 9.932 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
            WhatsApp
          </a>
        </div>
      </div>
    </motion.div>
  );
};
