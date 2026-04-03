import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, CheckCircle2, Clock, Truck, Package } from 'lucide-react';
import axios from 'axios';
import { Order } from '../../types';

const OrdersManagement = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get('/api/orders');
        setOrders(res.data.reverse());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered': return 'bg-emerald-100 text-emerald-600';
      case 'Out for Delivery': return 'bg-blue-100 text-blue-600';
      case 'Preparing': return 'bg-orange-100 text-orange-600';
      default: return 'bg-zinc-100 text-zinc-600';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black">Orders Management</h2>
          <p className="text-zinc-500">Track and update customer orders in real-time</p>
        </div>
      </div>

      <div className="bg-white rounded-[40px] shadow-sm border border-zinc-100 overflow-hidden">
        <div className="p-6 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input 
              type="text" 
              placeholder="Search orders..." 
              className="w-full pl-10 pr-4 py-2 rounded-xl border-zinc-200 text-sm focus:ring-red-500"
            />
          </div>
          <div className="flex space-x-2">
            <button className="px-4 py-2 rounded-xl border border-zinc-200 text-sm font-bold text-zinc-500 hover:bg-zinc-50 flex items-center">
              <Filter className="w-4 h-4 mr-2" /> Filter
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-zinc-400 text-xs font-bold uppercase tracking-widest border-b border-zinc-100">
                <th className="px-8 py-4">Order ID</th>
                <th className="px-8 py-4">Customer</th>
                <th className="px-8 py-4">Total</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4">Date</th>
                <th className="px-8 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-zinc-50 transition-colors">
                  <td className="px-8 py-4 font-bold text-zinc-900">{order.id}</td>
                  <td className="px-8 py-4">
                    <div>
                      <p className="font-bold">{order.customerName}</p>
                      <p className="text-zinc-400 text-xs">{order.customerPhone}</p>
                    </div>
                  </td>
                  <td className="px-8 py-4 font-black text-red-600">₹{order.total}</td>
                  <td className="px-8 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-8 py-4 text-zinc-500 text-sm">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-8 py-4 text-right">
                    <button className="p-2 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-all">
                      <Eye className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrdersManagement;
