import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import { ShoppingCart, Search, Eye, Filter, X } from 'lucide-react';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newOrder, setNewOrder] = useState({
    customerName: '',
    customerEmail: '',
    productId: '',
    quantity: 1
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        
        const [ordersRes, productsRes] = await Promise.all([
          axios.get('/api/orders', { headers }),
          axios.get('/api/products', { headers })
        ]);
        
        setOrders(ordersRes.data.data);
        // Only show products that are actually in stock for the dropdown
        setProducts(productsRes.data.data.filter(p => p.quantity > 0));
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch data from the server.');
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-emerald-50 text-emerald-600 border-emerald-200';
      case 'Processing': return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'Cancelled': return 'bg-red-50 text-red-600 border-red-200';
      default: return 'bg-amber-50 text-amber-600 border-amber-200'; 
    }
  };

  const handleInputChange = (e) => {
    setNewOrder({ ...newOrder, [e.target.name]: e.target.value });
  };

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const token = localStorage.getItem('token');
      const orderPayload = {
        customerName: newOrder.customerName,
        customerEmail: newOrder.customerEmail,
        orderedProducts: [{
          productId: newOrder.productId,
          quantity: Number(newOrder.quantity)
        }]
      };

      const response = await axios.post('/api/orders', orderPayload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Refresh orders list and close modal
      setOrders([response.data.data, ...orders]);
      setIsModalOpen(false);
      setNewOrder({ customerName: '', customerEmail: '', productId: '', quantity: 1 });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create order. Check stock levels.');
    }
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Order Management</h1>
          <p className="text-gray-500 text-sm mt-1">Track and manage customer orders and statuses.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center transition-colors cursor-pointer"
        >
          <ShoppingCart className="w-5 h-5 mr-2" />
          New Order
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search by customer or email..." className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 bg-white" />
          </div>
          <button className="text-gray-600 hover:text-blue-600 flex items-center px-3 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium transition-colors">
            <Filter className="w-4 h-4 mr-2" /> Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Total Amount</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">Loading orders...</td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">No orders found. Create one to get started!</td></tr>
              ) : (
                orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-gray-800">{order.customerName}</p>
                      <p className="text-xs text-gray-500">{order.customerEmail}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{new Date(order.orderDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">${Number(order.totalAmount || 0).toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(order.status)}`}>{order.status}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-gray-400 hover:text-blue-600 mx-2 transition-colors cursor-pointer"><Eye className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Order Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Create New Order</h2>
            
            {error && <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</div>}
            
            <form onSubmit={handleCreateOrder} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                <input type="text" name="customerName" value={newOrder.customerName} onChange={handleInputChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer Email</label>
                <input type="email" name="customerEmail" value={newOrder.customerEmail} onChange={handleInputChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Product</label>
                  <select name="productId" value={newOrder.productId} onChange={handleInputChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
                    <option value="">Choose a product...</option>
                    {products.map(p => (
                      <option key={p._id} value={p._id}>{p.name} (Stock: {p.quantity})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Qty</label>
                  <input type="number" name="quantity" min="1" value={newOrder.quantity} onChange={handleInputChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
                </div>
              </div>
              <div className="pt-4 flex justify-end space-x-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md font-medium cursor-pointer">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium cursor-pointer">Place Order</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Orders;