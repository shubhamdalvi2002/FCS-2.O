import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Filter } from 'lucide-react';
import axios from 'axios';
import { AdminStats, Order, Product } from '../../types';

const ProductsManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black">Products Management</h2>
          <p className="text-zinc-500">Manage your shop inventory and prices</p>
        </div>
        <button className="w-full sm:w-auto bg-red-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-red-700 transition-all flex items-center justify-center shadow-lg shadow-red-100">
          <Plus className="w-5 h-5 mr-2" /> Add Product
        </button>
      </div>

      <div className="bg-white rounded-[40px] shadow-sm border border-zinc-100 overflow-hidden">
        <div className="p-6 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input 
              type="text" 
              placeholder="Search products..." 
              className="w-full pl-10 pr-4 py-2 rounded-xl border-zinc-200 text-sm focus:ring-red-500"
            />
          </div>
          <div className="flex space-x-2">
            <button className="p-2 rounded-lg border border-zinc-200 text-zinc-500 hover:bg-zinc-50">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-zinc-400 text-xs font-bold uppercase tracking-widest border-b border-zinc-100">
                <th className="px-8 py-4">Product</th>
                <th className="px-8 py-4">Category</th>
                <th className="px-8 py-4">Price</th>
                <th className="px-8 py-4">Stock</th>
                <th className="px-8 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-zinc-50 transition-colors">
                  <td className="px-8 py-4">
                    <div className="flex items-center space-x-4">
                      <img src={product.image} className="w-12 h-12 rounded-xl object-cover" alt="" referrerPolicy="no-referrer" />
                      <span className="font-bold">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-4">
                    <span className="px-3 py-1 rounded-full bg-zinc-100 text-zinc-600 text-xs font-bold uppercase">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-8 py-4 font-black text-red-600">₹{product.price}</td>
                  <td className="px-8 py-4">
                    <span className="text-emerald-600 font-bold">In Stock</span>
                  </td>
                  <td className="px-8 py-4 text-right">
                    <div className="flex justify-end space-x-2">
                      <button className="p-2 rounded-lg text-zinc-400 hover:text-blue-600 hover:bg-blue-50 transition-all">
                        <Edit className="w-5 h-5" />
                      </button>
                      <button className="p-2 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-all">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
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

export default ProductsManagement;
