import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Mail, Lock, ArrowRight, Github } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.email === 'admin@fcs.com') {
      navigate('/admin');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card p-10 rounded-[40px] shadow-2xl border border-border w-full max-w-md space-y-8"
      >
        <div className="text-center space-y-2">
          <div className="text-[0.72rem] text-accent uppercase tracking-[0.1em] font-bold mb-2">Welcome Back</div>
          <h1 className="text-4xl font-extrabold font-heading tracking-tight">Login</h1>
          <p className="text-muted text-sm">Access your FCS 2.0 account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[0.72rem] font-bold text-muted uppercase tracking-widest">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
              <input 
                required
                type="email" 
                placeholder="name@example.com"
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-surface border-border text-text focus:ring-accent focus:border-accent font-medium"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-[0.72rem] font-bold text-muted uppercase tracking-widest">Password</label>
              <button type="button" className="text-[0.65rem] font-bold text-accent hover:underline uppercase tracking-widest">Forgot Password?</button>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
              <input 
                required
                type="password" 
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-surface border-border text-text focus:ring-accent focus:border-accent font-medium"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-accent text-black py-5 rounded-3xl text-xl font-bold hover:translate-y-[-2px] hover:shadow-[0_12px_32px_rgba(245,166,35,0.35)] transition-all flex items-center justify-center group"
          >
            Login
            <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border"></div></div>
          <div className="relative flex justify-center text-[0.65rem] uppercase tracking-widest font-bold"><span className="px-4 bg-card text-muted">Or continue with</span></div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <button className="flex items-center justify-center space-x-3 p-4 rounded-2xl border border-border bg-surface hover:bg-accent/5 hover:border-accent/30 transition-all font-bold text-sm">
            <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
            <span>Google Account</span>
          </button>
        </div>

        <p className="text-center text-muted text-sm font-medium">
          Don't have an account? <Link to="/signup" className="text-accent font-bold hover:underline">Sign Up</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
