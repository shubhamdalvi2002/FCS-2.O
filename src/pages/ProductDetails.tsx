import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ShoppingCart, ArrowLeft, ShieldCheck, Truck, Clock, Plus, Minus } from 'lucide-react';
import axios from 'axios';
import { Product } from '../types';
import { useCart } from '../CartContext';
import { FALLBACK_PRODUCTS } from '../data/products';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [cutType, setCutType] = useState('Curry Cut');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get('/api/products');
        const found = res.data.find((p: Product) => p.id === id);
        if (found) {
          setProduct(found);
        } else {
          // Try fallback if not found in API
          const fallbackFound = FALLBACK_PRODUCTS.find((p: Product) => p.id === id);
          setProduct(fallbackFound || null);
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        // Use fallback on error
        const fallbackFound = FALLBACK_PRODUCTS.find((p: Product) => p.id === id);
        setProduct(fallbackFound || null);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-muted">Loading...</div>;
  if (!product) return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-muted">Product not found</div>;

  const handleAddToCart = () => {
    addToCart(product, quantity, product.category === 'Chicken' ? cutType : undefined);
    navigate('/cart');
  };

  const chickenQuantities = [0.25, 0.5, 0.75, 1, 1.5, 2];
  const eggQuantities = [6, 12, 30];
  const quantities = product.category === 'Chicken' ? chickenQuantities : eggQuantities;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-muted hover:text-accent font-bold mb-8 transition-colors text-sm uppercase tracking-wider"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Shop
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Product Image */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-[40px] overflow-hidden border border-border aspect-square bg-surface"
        >
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
            loading="lazy"
          />
        </motion.div>

        {/* Product Info */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-8"
        >
          <div className="space-y-4">
            <span className="bg-accent/10 text-accent border border-accent/20 px-4 py-1 rounded-full text-[0.7rem] font-bold uppercase tracking-widest">
              {product.category}
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tighter font-syne">{product.name}</h1>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl sm:text-4xl font-extrabold text-accent font-syne">₹{product.price}</span>
              <span className="text-muted font-medium uppercase text-[0.65rem] sm:text-xs tracking-widest">per {product.unit}</span>
            </div>
            <p className="text-muted text-base sm:text-lg leading-relaxed max-w-lg">
              {product.description}
            </p>
          </div>

          <div className="space-y-8">
            {/* Quantity Selection */}
            <div className="space-y-4">
              <label className="text-[0.72rem] font-bold text-muted uppercase tracking-widest">Select Quantity</label>
              <div className="flex flex-wrap gap-3">
                {quantities.map((q) => (
                  <button
                    key={q}
                    onClick={() => setQuantity(q)}
                    className={`px-6 py-3 rounded-2xl font-bold transition-all border-2 text-sm ${
                      quantity === q 
                        ? 'bg-accent border-accent text-black shadow-[0_8px_24px_rgba(245,166,35,0.3)]' 
                        : 'bg-card border-border text-muted hover:border-accent/50 hover:text-text'
                    }`}
                  >
                    {q} {product.unit}{q > 1 && product.unit === 'egg' ? 's' : ''}
                  </button>
                ))}
              </div>
            </div>

            {/* Cut Type Selection (Only for Chicken) */}
            {product.category === 'Chicken' && (
              <div className="space-y-4">
                <label className="text-[0.72rem] font-bold text-muted uppercase tracking-widest">Select Cut Type</label>
                <div className="flex flex-wrap gap-3">
                  {['Curry Cut', 'Biryani Cut', 'Boneless'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setCutType(type)}
                      className={`px-6 py-3 rounded-2xl font-bold transition-all border-2 text-sm ${
                        cutType === type 
                          ? 'bg-accent border-accent text-black shadow-[0_8px_24px_rgba(245,166,35,0.3)]' 
                          : 'bg-card border-border text-muted hover:border-accent/50 hover:text-text'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="pt-8">
            <button 
              onClick={handleAddToCart}
              className="w-full bg-accent text-black px-8 py-5 rounded-[24px] text-xl font-bold hover:translate-y-[-2px] hover:shadow-[0_12px_32px_rgba(245,166,35,0.35)] transition-all flex items-center justify-center group"
            >
              <ShoppingCart className="mr-3 w-6 h-6 group-hover:scale-110 transition-transform" />
              Add to Cart - ₹{Math.round(quantity * product.price)}
            </button>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-4 pt-8 border-t border-border">
            {[
              { icon: ShieldCheck, label: 'Hygienic', color: 'text-accent3' },
              { icon: Truck, label: 'Fast Delivery', color: 'text-accent2' },
              { icon: Clock, label: 'Fresh Daily', color: 'text-accent' }
            ].map((badge, i) => (
              <div key={i} className="flex flex-col items-center text-center space-y-2">
                <badge.icon className={`w-6 h-6 ${badge.color}`} />
                <span className="text-[0.65rem] font-bold text-muted uppercase tracking-widest">{badge.label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetails;
