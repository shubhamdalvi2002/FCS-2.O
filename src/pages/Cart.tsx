import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus } from 'lucide-react';
import { useCart } from '../CartContext';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, subtotal, deliveryCharge, cartTotal } = useCart();
  const navigate = useNavigate();

  const handleQuantityChange = (id: string, cutType: string | undefined, unit: string, delta: number) => {
    // For eggs, increment by 6, for chicken by 0.25
    const actualDelta = unit === 'egg' ? delta * 6 : delta * 0.25;
    updateQuantity(id, cutType, actualDelta);
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center space-y-8">
        <div className="bg-surface w-32 h-32 rounded-full flex items-center justify-center mx-auto border border-border">
          <ShoppingBag className="w-16 h-16 text-muted" />
        </div>
        <div className="space-y-2">
          <h2 className="text-4xl font-extrabold tracking-tighter font-syne">Your cart is empty</h2>
          <p className="text-muted text-lg">Looks like you haven't added anything yet.</p>
        </div>
        <Link 
          to="/shop" 
          className="inline-block bg-accent text-black px-10 py-4 rounded-2xl text-lg font-bold hover:translate-y-[-2px] hover:shadow-[0_12px_32px_rgba(245,166,35,0.35)] transition-all"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <div className="text-[0.72rem] text-accent uppercase tracking-[0.1em] font-bold mb-2">My Order</div>
        <h1 className="text-4xl font-extrabold font-heading tracking-tight">Shopping Cart</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          {cart.map((item) => (
            <motion.div 
              layout
              key={`${item.id}-${item.cutType}`}
              className="bg-card p-6 rounded-[32px] border border-border shadow-sm flex flex-col sm:flex-row items-center gap-6 group hover:border-accent/30 transition-colors"
            >
              <div className="w-32 h-32 rounded-3xl overflow-hidden flex-shrink-0 border-2 border-border bg-surface group-hover:border-accent/50 transition-all shadow-md">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
              </div>
              <div className="flex-grow text-center sm:text-left">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                  <h3 className="text-xl font-bold font-syne">{item.name}</h3>
                  {item.cutType && (
                    <span className="inline-block w-fit mx-auto sm:mx-0 text-[0.65rem] font-bold text-accent bg-accent/10 px-2.5 py-1 rounded-full border border-accent/20 uppercase tracking-widest">
                      {item.cutType}
                    </span>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-1">
                  <p className="text-muted text-sm uppercase tracking-widest font-medium">
                    ₹{item.price}/{item.unit}
                  </p>
                  <div className="flex items-center justify-center sm:justify-start gap-3 bg-surface border border-border rounded-xl p-1 w-fit mx-auto sm:mx-0">
                    <button 
                      onClick={() => handleQuantityChange(item.id, item.cutType, item.unit, -1)}
                      disabled={item.quantity <= (item.unit === 'egg' ? 6 : 0.25)}
                      className="p-1.5 rounded-lg hover:bg-accent/10 text-muted hover:text-accent disabled:opacity-30 transition-all"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-sm font-bold min-w-[3rem] text-center">
                      {item.quantity} {item.unit}{item.quantity > 1 && item.unit === 'egg' ? 's' : ''}
                    </span>
                    <button 
                      onClick={() => handleQuantityChange(item.id, item.cutType, item.unit, 1)}
                      className="p-1.5 rounded-lg hover:bg-accent/10 text-muted hover:text-accent transition-all"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-accent font-extrabold mt-2 text-lg font-syne">₹{Math.round(item.totalPrice)}</p>
              </div>
              <button 
                onClick={() => removeFromCart(item.id, item.cutType)}
                className="p-4 rounded-2xl bg-surface text-muted hover:bg-accent2/10 hover:text-accent2 transition-all border border-border"
              >
                <Trash2 className="w-6 h-6" />
              </button>
            </motion.div>
          ))}
        </div>

        {/* Summary */}
        <div className="space-y-6">
          <div className="bg-card p-8 rounded-[40px] border border-border shadow-2xl space-y-6 sticky top-24">
            <h3 className="text-2xl font-extrabold font-syne tracking-tight border-b border-border pb-4">Order Summary</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between text-muted text-sm">
                <span>Subtotal</span>
                <span className="font-bold text-text">₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-muted text-sm italic">
                <span>Delivery</span>
                <span className="text-accent3 font-bold">Calculated at Checkout</span>
              </div>
              <div className="border-t border-border pt-4 flex justify-between items-end">
                <span className="text-sm font-bold font-syne">Estimated Total</span>
                <span className="text-3xl font-extrabold text-accent font-syne">₹{subtotal}</span>
              </div>
            </div>

            <button 
              onClick={() => navigate('/checkout')}
              className="w-full bg-accent text-black py-5 rounded-3xl text-xl font-bold hover:translate-y-[-2px] hover:shadow-[0_12px_32px_rgba(245,166,35,0.35)] transition-all flex items-center justify-center group"
            >
              Checkout
              <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <Link to="/shop" className="block text-center text-muted font-bold hover:text-accent transition-colors text-sm uppercase tracking-widest">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
