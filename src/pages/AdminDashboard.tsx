import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, ShoppingBag, Users, BarChart3, Settings, 
  LogOut, Package, TrendingUp, DollarSign, Users2, Bell, Search,
  ChevronRight, MoreVertical, Edit, Trash2, CheckCircle2, Clock, Truck, Menu, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import axios from 'axios';
import { AdminStats, Order, Product } from '../types';

const Sidebar = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const location = useLocation();
  const menuItems = [
    { icon: LayoutDashboard, label: 'Overview', path: '/admin' },
    { icon: ShoppingBag, label: 'Products', path: '/admin/products' },
    { icon: Package, label: 'Orders', path: '/admin/orders' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] lg:hidden"
          />
        )}
      </AnimatePresence>

      <div className={`fixed lg:sticky top-0 left-0 w-64 bg-zinc-900 text-white h-screen flex flex-col z-[101] transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-8 flex justify-between items-center border-b border-zinc-800/50 mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-900/40">
              <Package className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-black text-white tracking-tighter uppercase">FCS Admin</h2>
          </div>
          <button onClick={onClose} className="lg:hidden p-2 text-zinc-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        <nav className="flex-grow px-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => { if (window.innerWidth < 1024) onClose(); }}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                location.pathname === item.path ? 'bg-red-600 text-white shadow-lg shadow-red-900/20' : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-bold">{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-zinc-800">
          <Link to="/" className="flex items-center space-x-3 px-4 py-3 text-zinc-400 hover:text-white transition-colors">
            <LogOut className="w-5 h-5" />
            <span className="font-bold">Logout</span>
          </Link>
        </div>
      </div>
    </>
  );
};

const Overview = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await axios.get('/api/admin/stats');
        setStats(statsRes.data);
        const ordersRes = await axios.get('/api/orders');
        setRecentOrders(ordersRes.data.slice(-5).reverse());
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const cards = [
    { label: 'Total Orders', value: stats?.totalOrders || 0, icon: Package, color: 'bg-blue-500' },
    { label: 'Total Revenue', value: `₹${stats?.totalRevenue || 0}`, icon: DollarSign, color: 'bg-emerald-500' },
    { label: 'Total Customers', value: stats?.totalCustomers || 0, icon: Users2, color: 'bg-purple-500' },
    { label: 'Products Sold Today', value: stats?.productsSoldToday || 0, icon: TrendingUp, color: 'bg-orange-500' },
  ];

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        {cards.map((card, i) => (
          <div key={i} className="bg-white p-6 lg:p-8 rounded-[32px] shadow-sm border border-zinc-100 flex items-center space-x-6 hover:shadow-md transition-shadow">
            <div className={`${card.color} p-4 rounded-2xl text-white shadow-lg shadow-${card.color.split('-')[1]}-100 shrink-0`}>
              <card.icon className="w-7 h-7 lg:w-8 lg:h-8" />
            </div>
            <div className="min-w-0">
              <p className="text-zinc-400 text-[0.65rem] lg:text-xs font-black uppercase tracking-[0.15em] truncate">{card.label}</p>
              <h3 className="text-2xl lg:text-3xl font-black truncate">{card.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-zinc-100 space-y-8">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-black">Recent Orders</h3>
            <Link to="/admin/orders" className="text-red-600 font-bold hover:underline">View All</Link>
          </div>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 rounded-2xl bg-zinc-50 hover:bg-zinc-100 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center font-black text-red-600 shadow-sm">
                    {order.customerName[0]}
                  </div>
                  <div>
                    <p className="font-bold">{order.customerName}</p>
                    <p className="text-zinc-400 text-xs">{order.id}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black">₹{order.total}</p>
                  <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${
                    order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-zinc-100 space-y-8">
          <h3 className="text-2xl font-black">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-6 rounded-3xl bg-red-50 text-red-600 border border-red-100 hover:bg-red-600 hover:text-white transition-all text-left space-y-2 group">
              <Package className="w-8 h-8" />
              <p className="font-bold">Add New Product</p>
            </button>
            <button className="p-6 rounded-3xl bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-600 hover:text-white transition-all text-left space-y-2 group">
              <BarChart3 className="w-8 h-8" />
              <p className="font-bold">Generate Report</p>
            </button>
            <button className="p-6 rounded-3xl bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-600 hover:text-white transition-all text-left space-y-2 group">
              <Settings className="w-8 h-8" />
              <p className="font-bold">Shop Settings</p>
            </button>
            <button className="p-6 rounded-3xl bg-purple-50 text-purple-600 border border-purple-100 hover:bg-purple-600 hover:text-white transition-all text-left space-y-2 group">
              <Users className="w-8 h-8" />
              <p className="font-bold">Manage Customers</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

import ProductsManagement from './admin/ProductsManagement';
import OrdersManagement from './admin/OrdersManagement';
import SettingsPage from './admin/Settings';

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-zinc-50">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex-grow min-w-0">
        <header className="bg-white h-20 border-b border-zinc-100 flex items-center justify-between px-6 lg:px-12 sticky top-0 z-40 backdrop-blur-md bg-white/80">
          <div className="flex items-center gap-6 flex-grow">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-zinc-400 hover:text-red-600 transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="relative w-full max-w-md hidden sm:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input 
                type="text" 
                placeholder="Search anything..." 
                className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-100 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-sm transition-all"
              />
            </div>
          </div>
          <div className="flex items-center space-x-3 sm:space-x-6">
            <button className="relative p-2 text-zinc-400 hover:text-red-600 transition-colors hidden sm:block">
              <Bell className="w-6 h-6" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center space-x-3 sm:pl-6 sm:border-l border-zinc-100">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold">Admin User</p>
                <p className="text-xs text-zinc-400 uppercase font-bold tracking-widest">Super Admin</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white font-black">
                A
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-8 lg:p-12">
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/products" element={<ProductsManagement />} />
            <Route path="/orders" element={<OrdersManagement />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
