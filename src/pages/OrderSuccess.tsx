import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle2, ShoppingBag, ArrowRight, MessageSquare, Phone } from 'lucide-react';
import axios from 'axios';

const OrderSuccess = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(`/api/orders/${orderId}`);
        setOrder(res.data);
        // Store last order ID for automatic retrieval if they return to home
        localStorage.setItem('lastOrderId', orderId || '');
      } catch (err) {
        console.error('Error fetching order from API, trying localStorage:', err);
        // Try to get from localStorage
        const localOrder = localStorage.getItem(`order_${orderId}`);
        if (localOrder) {
          setOrder(JSON.parse(localOrder));
          localStorage.setItem('lastOrderId', orderId || '');
        } else {
          setError('Order not found or something went wrong.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const handleWhatsAppConfirm = () => {
    if (!order) return;
    
    const orderLines = order.items.map((item: any) => `• ${item.name} (${item.quantity} ${item.unit}${item.quantity > 1 && item.unit === 'egg' ? 's' : ''}) = ₹${item.price * item.quantity}`).join('\n');
    
    const msg = `🍗 *FCS 2.0 - ORDER CONFIRMATION* 🍗\n\n` +
      `🆔 *Order ID:* ${order.id}\n` +
      `👤 *Name:* ${order.customerName}\n` +
      `📦 *Order Summary:*\n${orderLines}\n` +
      `💰 *Total Amount: ₹${order.total}*\n\n` +
      `✅ *I am back on the platform. Please confirm my order status!*`;

    const encoded = encodeURIComponent(msg);
    window.open(`https://wa.me/919890501565?text=${encoded}`, '_blank');
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center">
        <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-muted font-bold animate-pulse">Retrieving your order details...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center space-y-8">
        <div className="bg-accent2/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto border border-accent2/20">
          <ShoppingBag className="w-12 h-12 text-accent2" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-extrabold font-syne">Oops! Order not found</h2>
          <p className="text-muted">We couldn't find the order details you're looking for.</p>
        </div>
        <Link to="/shop" className="inline-block bg-accent text-black px-8 py-3 rounded-xl font-bold">
          Back to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:py-20">
      <div className="max-w-3xl mx-auto space-y-12">
        <div className="text-center space-y-6">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="bg-emerald-500/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20"
          >
            <CheckCircle2 className="w-12 h-12 text-emerald-500" />
          </motion.div>
          
          <div className="space-y-3">
            <h1 className="text-4xl sm:text-6xl font-black tracking-tighter font-syne text-text">Order Confirmed!</h1>
            <p className="text-muted text-lg">
              Thank you, <span className="text-text font-bold">{order.customerName}</span>. Your order <span className="text-accent font-bold">#{order.id}</span> has been placed successfully.
            </p>
          </div>
        </div>

        <div className="bg-card rounded-[32px] border border-border overflow-hidden shadow-2xl">
          <div className="p-8 border-b border-border bg-surface/50">
            <h3 className="text-xl font-bold font-syne">Order Details</h3>
          </div>
          <div className="p-8 space-y-6">
            <div className="space-y-4">
              {order.items.map((item: any, idx: number) => (
                <div key={idx} className="flex justify-between items-center py-2 border-b border-border/50 last:border-0">
                  <div className="flex flex-col">
                    <span className="font-bold text-sm">{item.name}</span>
                    <span className="text-[0.7rem] text-muted uppercase tracking-wider">
                      {item.quantity} {item.unit}{item.quantity > 1 && item.unit === 'egg' ? 's' : ''} {item.cutType ? `· ${item.cutType}` : ''}
                    </span>
                  </div>
                  <span className="font-bold text-accent">₹{Math.round(item.totalPrice)}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 space-y-2">
              <div className="flex justify-between text-sm text-muted">
                <span>Subtotal</span>
                <span className="font-bold text-text">₹{order.subtotal}</span>
              </div>
              <div className="flex justify-between text-sm text-muted">
                <span>Delivery Charge</span>
                <span className="font-bold text-text">₹{order.deliveryCharge}</span>
              </div>
              <div className="flex justify-between text-xl font-black font-syne pt-4 border-t border-border">
                <span>Total Paid</span>
                <span className="text-accent">₹{order.total}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <button
            onClick={handleWhatsAppConfirm}
            className="w-full sm:w-auto flex items-center justify-center gap-3 bg-[#25D366] text-white px-12 py-5 rounded-2xl font-bold text-lg hover:translate-y-[-2px] hover:shadow-xl transition-all"
          >
            <MessageSquare className="w-6 h-6" />
            Chat with Shop
          </button>
        </div>

        <div className="text-center">
          <Link to="/shop" className="inline-flex items-center gap-2 text-muted hover:text-accent font-bold transition-colors uppercase tracking-widest text-sm">
            Continue Shopping <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
