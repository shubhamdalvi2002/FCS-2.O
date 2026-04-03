import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Truck, Store, CreditCard, Wallet, Banknote, CheckCircle2, Home } from 'lucide-react';
import axios from 'axios';
import { useCart } from '../CartContext';

const Checkout = () => {
  const { cart, subtotal, deliveryCharge, clearCart } = useCart();
  const navigate = useNavigate();
  const [deliveryType, setDeliveryType] = useState<'Delivery' | 'Pickup'>('Delivery');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'COD'>('COD');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    timePreference: '',
    specialInstructions: ''
  });

  const currentDeliveryCharge = deliveryType === 'Delivery' ? deliveryCharge : 0;
  const total = subtotal + currentDeliveryCharge;

  const isDeliveryAllowed = subtotal >= 500;

  // Auto-switch to Pickup if Delivery is not allowed
  useEffect(() => {
    if (!isDeliveryAllowed && deliveryType === 'Delivery') {
      setDeliveryType('Pickup');
    }
  }, [isDeliveryAllowed, deliveryType]);

  const handleWhatsAppOrder = (currentCart: any[], sTotal: number, dCharge: number, fTotal: number, useWindowOpen: boolean = false) => {
    if (!formData.name || !formData.phone || (deliveryType === 'Delivery' && !formData.address)) {
      setError('Please fill in all required fields (Name, Phone, and Address for delivery).');
      return;
    }
    setError(null);

    const orderLines = currentCart.map(item => `• ${item.name} (${item.quantity} ${item.unit}${item.quantity > 1 && item.unit === 'egg' ? 's' : ''}) = ₹${item.price * item.quantity}`).join('\n');
    
    const msg = `🍗 *FCS 2.0 - NEW ORDER* 🍗\n\n` +
      `👤 *Customer Details:*\n` +
      `• *Name:* ${formData.name}\n` +
      `• *Phone:* ${formData.phone}\n` +
      (formData.email ? `• *Email:* ${formData.email}\n` : '') +
      `• *Order Type:* ${deliveryType === 'Delivery' ? '🚀 Home Delivery' : '🏪 Shop Pickup'}\n` +
      (deliveryType === 'Delivery' ? `📍 *Address:* ${formData.address}\n` : '') +
      (formData.timePreference ? `⏰ *Preferred Time:* ${formData.timePreference}\n` : '') +
      (formData.specialInstructions ? `📝 *Instructions:* ${formData.specialInstructions}\n` : '') +
      `\n📦 *Order Summary:*\n${orderLines}\n` +
      `• *Subtotal:* ₹${sTotal}\n` +
      `• *Delivery Charge:* ₹${dCharge}\n\n` +
      `💰 *Total Amount: ₹${fTotal}*\n\n` +
      `✅ *Please confirm my order. Thank you!*`;

    const encoded = encodeURIComponent(msg);
    const waURL = `https://wa.me/919890501565?text=${encoded}`;
    
    if (useWindowOpen) {
      window.open(waURL, '_blank');
    } else {
      window.location.href = waURL;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    try {
      const orderData = {
        items: cart,
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        address: formData.address,
        deliveryType,
        paymentMethod,
        subtotal: subtotal,
        deliveryCharge: currentDeliveryCharge,
        total,
        timePreference: formData.timePreference,
        specialInstructions: formData.specialInstructions
      };

      // Fallback ID if API fails
      const orderId = `FCS-${Math.floor(1000 + Math.random() * 9000)}`;
      let finalOrderId = orderId;

      // Try to save to DB, but don't block WhatsApp if it fails
      try {
        const res = await axios.post('/api/orders', orderData);
        if (res.data && res.data.id) {
          finalOrderId = res.data.id;
          // Store in localStorage as fallback
          localStorage.setItem(`order_${finalOrderId}`, JSON.stringify(res.data));
        } else {
          localStorage.setItem(`order_${finalOrderId}`, JSON.stringify({ ...orderData, id: finalOrderId, createdAt: new Date().toISOString() }));
        }
      } catch (apiErr) {
        console.warn('API order saving failed, proceeding to WhatsApp:', apiErr);
        // Store in localStorage as fallback
        localStorage.setItem(`order_${finalOrderId}`, JSON.stringify({ ...orderData, id: finalOrderId, createdAt: new Date().toISOString() }));
      }

      const itemsToOrder = [...cart];
      const finalSubtotal = subtotal;
      const finalDeliveryCharge = currentDeliveryCharge;
      const finalTotal = total;

      // 1. Clear Cart first to prevent duplicate orders
      clearCart();
      
      // 2. Redirect to WhatsApp using window.location.href for reliability
      handleWhatsAppOrder(itemsToOrder, finalSubtotal, finalDeliveryCharge, finalTotal, false);
      
      // 3. Navigate to Success Page as a fallback/history entry
      localStorage.setItem('lastOrderId', finalOrderId);
      navigate(`/order-success/${finalOrderId}`);
    } catch (err) {
      console.error('Checkout error:', err);
      if (axios.isAxiosError(err)) {
        setError(`Server error: ${err.response?.data?.message || err.message}. Please try again.`);
      } else {
        setError('Something went wrong while placing your order. Please try again.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <div className="text-[0.72rem] text-accent uppercase tracking-[0.1em] font-bold mb-2">Checkout</div>
        <h1 className="text-4xl font-extrabold font-heading tracking-tight">Complete Your Order</h1>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Details */}
        <div className="lg:col-span-2 space-y-12">
          {error && (
            <div className="p-4 bg-accent2/10 border border-accent2/20 rounded-2xl text-accent2 text-sm font-bold animate-shake">
              {error}
            </div>
          )}
          {/* Delivery Method */}
          <section className="space-y-6">
            <h3 className="text-xl font-bold font-syne flex items-center gap-3">
              <Truck className="text-accent" /> Delivery Method
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative">
                <button
                  type="button"
                  disabled={!isDeliveryAllowed}
                  onClick={() => setDeliveryType('Delivery')}
                  className={`w-full p-6 rounded-[24px] border-2 text-left transition-all ${
                    deliveryType === 'Delivery' ? 'border-accent bg-accent/5' : 'border-border bg-card'
                  } ${!isDeliveryAllowed ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
                >
                  <Truck className={`w-8 h-8 mb-4 ${deliveryType === 'Delivery' ? 'text-accent' : 'text-muted'}`} />
                  <div className="font-bold text-lg font-syne">Home Delivery</div>
                  <div className="text-muted text-sm">Delivered to your door (₹{deliveryCharge})</div>
                </button>
                {!isDeliveryAllowed && (
                  <div className="mt-3 p-3 bg-accent2/10 border border-accent2/20 rounded-xl text-[0.7rem] text-accent2 font-bold uppercase tracking-wider flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent2 animate-pulse"></div>
                    Min: 1kg Chicken or 30+ Eggs
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => setDeliveryType('Pickup')}
                className={`p-6 rounded-[24px] border-2 text-left transition-all ${
                  deliveryType === 'Pickup' ? 'border-accent bg-accent/5' : 'border-border bg-card'
                }`}
              >
                <Store className={`w-8 h-8 mb-4 ${deliveryType === 'Pickup' ? 'text-accent' : 'text-muted'}`} />
                <div className="font-bold text-lg font-syne">Shop Pickup</div>
                <div className="text-muted text-sm">Collect from: Near Agasti Kirana Shop, Akole</div>
              </button>
            </div>
          </section>

          {/* Customer Info */}
          <section className="space-y-6">
            <h3 className="text-xl font-bold font-syne">Customer Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[0.72rem] font-bold text-muted uppercase tracking-wider">Full Name *</label>
                <input 
                  required
                  type="text" 
                  placeholder="e.g. Rahul Sharma"
                  className="w-full p-4 rounded-xl bg-card border-border text-text focus:ring-accent focus:border-accent"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[0.72rem] font-bold text-muted uppercase tracking-wider">Phone Number *</label>
                <input 
                  required
                  type="tel" 
                  placeholder="+91 98765 43210"
                  className="w-full p-4 rounded-xl bg-card border-border text-text focus:ring-accent focus:border-accent"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
              <div className="sm:col-span-2 space-y-2">
                <label className="text-[0.72rem] font-bold text-muted uppercase tracking-wider">Email Address</label>
                <input 
                  type="email" 
                  placeholder="rahul@example.com"
                  className="w-full p-4 rounded-xl bg-card border-border text-text focus:ring-accent focus:border-accent"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              {deliveryType === 'Delivery' && (
                <div className="sm:col-span-2 space-y-2">
                  <label className="text-[0.72rem] font-bold text-muted uppercase tracking-wider">Delivery Address *</label>
                  <textarea 
                    required
                    rows={3}
                    placeholder="House No., Street, Area, City..."
                    className="w-full p-4 rounded-xl bg-card border-border text-text focus:ring-accent focus:border-accent"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                  ></textarea>
                </div>
              )}
              <div className="space-y-2">
                <label className="text-[0.72rem] font-bold text-muted uppercase tracking-wider">Delivery Time Preference</label>
                <select 
                  className="w-full p-4 rounded-xl bg-card border-border text-text focus:ring-accent focus:border-accent appearance-none"
                  value={formData.timePreference}
                  onChange={(e) => setFormData({...formData, timePreference: e.target.value})}
                >
                  <option value="">As soon as possible</option>
                  <option value="Morning (8AM–12PM)">Morning (8AM–12PM)</option>
                  <option value="Afternoon (12PM–4PM)">Afternoon (12PM–4PM)</option>
                  <option value="Evening (4PM–9PM)">Evening (4PM–9PM)</option>
                </select>
              </div>
              <div className="space-y-4">
                <label className="text-[0.72rem] font-bold text-muted uppercase tracking-wider">Special Instructions</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {['Small Cutting', 'Medium Cutting', 'For Curry', 'For Biryani', 'For Fry', 'Leg Pieces', 'Lollipops'].map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => {
                        const current = formData.specialInstructions;
                        const newVal = current ? `${current}, ${chip}` : chip;
                        setFormData({...formData, specialInstructions: newVal});
                      }}
                      className="px-3 py-1.5 rounded-lg bg-surface border border-border text-[0.65rem] font-bold text-muted hover:border-accent hover:text-accent transition-all"
                    >
                      + {chip}
                    </button>
                  ))}
                </div>
                <input 
                  type="text" 
                  placeholder="e.g. Cut small, no skin, etc."
                  className="w-full p-4 rounded-xl bg-card border-border text-text focus:ring-accent focus:border-accent"
                  value={formData.specialInstructions}
                  onChange={(e) => setFormData({...formData, specialInstructions: e.target.value})}
                />
              </div>
            </div>
          </section>

          {/* Payment Method */}
          <section className="space-y-6">
            <h3 className="text-xl font-bold font-syne flex items-center gap-3">
              <CreditCard className="text-accent" /> Payment Method
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { id: 'UPI', icon: Wallet, label: 'UPI' },
                { id: 'Card', icon: CreditCard, label: 'Debit/Credit Card' },
                { id: 'COD', icon: Banknote, label: 'Cash on Delivery' }
              ].map((method) => (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setPaymentMethod(method.id as any)}
                  className={`p-6 rounded-[24px] border-2 text-center transition-all flex flex-col items-center ${
                    paymentMethod === method.id ? 'border-accent bg-accent/5' : 'border-border bg-card'
                  }`}
                >
                  <method.icon className={`w-8 h-8 mb-4 ${paymentMethod === method.id ? 'text-accent' : 'text-muted'}`} />
                  <div className="font-bold font-syne">{method.label}</div>
                </button>
              ))}
            </div>
          </section>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <div className="bg-card p-8 rounded-[32px] border border-border shadow-2xl space-y-6 sticky top-24">
            <h3 className="text-xl font-bold font-heading tracking-tight border-b border-border pb-4">Order Summary</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between text-muted text-sm">
                <span>Subtotal</span>
                <span className="font-bold text-text">₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-muted text-sm">
                <span>Delivery Charge</span>
                <span className={`font-bold ${currentDeliveryCharge === 0 ? 'text-emerald-500' : 'text-text'}`}>
                  {currentDeliveryCharge === 0 ? 'FREE' : `₹${currentDeliveryCharge}`}
                </span>
              </div>
              <div className="border-t border-border pt-4 flex justify-between items-end">
                <span className="text-sm font-bold font-syne">Total</span>
                <span className="text-3xl font-extrabold text-accent font-syne">₹{total}</span>
              </div>
            </div>

            <button 
              disabled={isProcessing}
              type="submit"
              className="w-full bg-[#25D366] text-white py-5 rounded-2xl text-lg font-bold hover:translate-y-[-2px] hover:shadow-[0_8px_24px_rgba(37,211,102,0.35)] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.556 4.122 1.527 5.856L.057 23.998l6.285-1.449A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.95 0-3.775-.5-5.362-1.375l-.384-.222-3.986.919.95-3.878-.25-.4A9.932 9.932 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
              {isProcessing ? 'Processing...' : 'Send Order on WhatsApp'}
            </button>
            <div className="text-center text-[0.72rem] text-muted leading-relaxed">
              Your order details will be sent directly to the shop owner via WhatsApp for fast processing.
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
