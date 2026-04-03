import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ShoppingBag, Truck, ShieldCheck, Clock, ArrowRight, Star, Instagram, Zap, MessageSquare, Home as HomeIcon, Leaf, Store } from 'lucide-react';

const Home = () => {
  return (
    <div className="space-y-0 pb-10">
      {/* Hero Section */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-12 md:pt-16 md:pb-20 lg:pt-24 lg:pb-28">
        <div className="space-y-10 text-center lg:text-left">
          <div className="flex flex-col items-center lg:items-start gap-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2.5 bg-accent/10 border border-accent/25 rounded-full px-5 py-2 text-[0.75rem] text-accent font-bold uppercase tracking-[0.15em] shadow-sm"
            >
              <Store className="w-3.5 h-3.5" /> Locally Owned · Freshly Sourced
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[10rem] 2xl:text-[12rem] font-black leading-[0.85] tracking-tighter font-heading"
            >
              Fresh Chicken,<br /> <span className="text-accent">Delivered Fast.</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-muted text-lg md:text-xl lg:text-3xl leading-relaxed max-w-4xl mx-auto lg:mx-0 font-medium"
            >
              Order fresh chicken cuts and farm eggs from your local shop. Place your order in seconds — we'll confirm via WhatsApp instantly.
            </motion.p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-[1px] bg-border"></div>
      </div>

      {/* Featured Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="space-y-2 mb-12">
          <div className="text-[0.72rem] text-accent uppercase tracking-[0.1em] font-bold">Our Menu</div>
          <h2 className="text-3xl font-extrabold font-heading tracking-tight">Pick Your Cut</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link to="/shop?cat=Chicken" className="group relative h-80 rounded-[32px] overflow-hidden border border-border">
            <img 
              src="https://images.unsplash.com/photo-1612170153139-6f881ff067e0?q=90&w=1200" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-[0.7]"
              alt="Chicken"
              referrerPolicy="no-referrer"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent flex flex-col justify-end p-8">
              <h3 className="text-3xl font-bold font-syne text-text">Fresh Chicken</h3>
              <p className="text-muted">Broiler, Desi & RR Chicken</p>
            </div>
          </Link>
          <Link to="/shop?cat=Eggs" className="group relative h-80 rounded-[32px] overflow-hidden border border-border">
            <img 
              src="https://images.unsplash.com/photo-1506976785307-8732e854ad03?q=90&w=1200" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-[0.7]"
              alt="Eggs"
              referrerPolicy="no-referrer"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent flex flex-col justify-end p-8">
              <h3 className="text-3xl font-bold font-syne text-text">Farm Eggs</h3>
              <p className="text-muted">Broiler & Gavathi Eggs</p>
            </div>
          </Link>
        </div>
      </section>

      {/* Trust Section */}
      <section className="bg-surface border-y border-border py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-16">
            {[
              { icon: ShieldCheck, title: 'Farm Fresh Daily', desc: 'All chicken sourced fresh every morning, never frozen.' },
              { icon: Zap, title: 'Quick Confirmation', desc: 'WhatsApp confirmation within minutes of placing your order.' },
              { icon: HomeIcon, title: 'Home Delivery', desc: 'Convenient delivery to your doorstep within the area.' },
              { icon: Leaf, title: 'Halal Certified', desc: 'All products are freshly slaughtered and halal certified.' }
            ].map((info, i) => (
              <div key={i} className="flex flex-col items-center text-center space-y-6 group">
                <div className="w-16 h-16 rounded-3xl bg-accent/10 flex items-center justify-center text-accent group-hover:scale-110 transition-transform shadow-lg shadow-accent/5">
                  <info.icon className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h4 className="font-black font-heading text-xl tracking-tight">{info.title}</h4>
                  <p className="text-muted text-sm leading-relaxed max-w-[240px] mx-auto">{info.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
