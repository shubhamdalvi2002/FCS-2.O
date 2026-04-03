import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { ShoppingCart, Filter, Search } from 'lucide-react';
import axios from 'axios';
import { Product } from '../types';

const Shop = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get('cat');
  const [activeCategory, setActiveCategory] = useState(categoryFilter || 'All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('/api/products');
        setProducts(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(p => {
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="text-[0.72rem] text-accent uppercase tracking-[0.1em] font-bold mb-2">Our Shop</div>
          <h1 className="text-4xl font-extrabold font-heading tracking-tight">Pick Your Cut</h1>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input 
              type="text" 
              placeholder="Search products..." 
              className="pl-10 pr-4 py-2.5 rounded-xl bg-card border-border text-sm focus:ring-accent focus:border-accent w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex bg-card rounded-xl p-1 border border-border w-full sm:w-auto overflow-x-auto">
            {['All', 'Chicken', 'Eggs'].map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-1 sm:flex-none px-6 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  activeCategory === cat ? 'bg-accent text-black shadow-lg' : 'text-muted hover:text-text'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-card rounded-3xl h-96 animate-pulse border border-border"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              key={product.id}
              className="group bg-card rounded-[24px] overflow-hidden border border-border hover:border-accent/40 hover:shadow-[0_16px_40px_rgba(0,0,0,0.4)] transition-all"
            >
              <Link to={`/product/${product.id}`} className="block relative aspect-[4/3] overflow-hidden bg-surface">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3">
                  <span className="bg-bg/80 backdrop-blur-md px-3 py-1 rounded-full text-[0.65rem] font-bold text-accent uppercase tracking-wider">
                    {product.category}
                  </span>
                </div>
              </Link>
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-lg font-bold font-syne group-hover:text-accent transition-colors">{product.name}</h3>
                  <p className="text-muted text-xs line-clamp-2 leading-relaxed">{product.description}</p>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <div className="flex flex-col">
                    <span className="text-xl font-extrabold text-accent font-syne">₹{product.price}</span>
                    <span className="text-muted text-[0.65rem] font-medium uppercase tracking-widest">per {product.unit}</span>
                  </div>
                  <Link 
                    to={`/product/${product.id}`}
                    className="bg-surface text-text p-3 rounded-xl border border-border hover:bg-accent hover:text-black hover:border-accent transition-all"
                  >
                    <ShoppingCart className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {!loading && filteredProducts.length === 0 && (
        <div className="text-center py-20 space-y-4">
          <div className="bg-card w-20 h-20 rounded-full flex items-center justify-center mx-auto border border-border">
            <Search className="w-8 h-8 text-muted" />
          </div>
          <h3 className="text-xl font-bold font-syne">No products found</h3>
          <p className="text-muted text-sm">Try adjusting your search or category filter.</p>
        </div>
      )}
    </div>
  );
};

export default Shop;
