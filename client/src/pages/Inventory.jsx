import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import { Plus, Search, Edit, Trash2, X, Image as ImageIcon } from 'lucide-react';

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: '',
    quantity: '',
    minStockLevel: '10', // NEW
    sellingPrice: '',
    purchasePrice: '',
    supplier: '',
    image: '' // NEW
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/products', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(response.data.data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch products");
      setLoading(false);
    }
  };

  const getStatusBadge = (quantity, minStockLevel) => {
    if (quantity === 0) return 'bg-red-50 text-red-600 border-red-200';
    if (quantity < minStockLevel) return 'bg-amber-50 text-amber-600 border-amber-200';
    return 'bg-emerald-50 text-emerald-600 border-emerald-200';
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/products', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setProducts([response.data.data, ...products]);
      setIsModalOpen(false);
      setFormData({ name: '', sku: '', category: '', quantity: '', minStockLevel: '10', sellingPrice: '', purchasePrice: '', supplier: '', image: '' });
      
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save product. Ensure selling price > purchase price.');
    }
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Inventory Management</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your enterprise product catalog.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center transition-colors cursor-pointer"
        >
          <Plus className="w-5 h-5 mr-2" /> Add Product
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search by Code or Name..." className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 bg-white"/>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                <th className="px-6 py-4 font-medium">Image</th>
                <th className="px-6 py-4 font-medium">Code / Name</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Stock / Min</th>
                <th className="px-6 py-4 font-medium">Price</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan="6" className="text-center py-8 text-gray-500">Loading products...</td></tr>
              ) : products.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    {product.image && product.image !== 'default-product.png' ? (
                      <img src={product.image} alt={product.name} className="w-10 h-10 rounded object-cover border border-gray-200" />
                    ) : (
                      <div className="w-10 h-10 rounded bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400"><ImageIcon className="w-5 h-5" /></div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs font-mono text-blue-600 font-medium mb-1">{product.productCode || 'Pending'}</p>
                    <p className="text-sm font-semibold text-gray-800">{product.name}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{product.category}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className="font-medium text-gray-700">{product.quantity}</span> 
                    <span className="text-gray-400 text-xs ml-1">/ {product.minStockLevel}</span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-700">${Number(product.sellingPrice).toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(product.quantity, product.minStockLevel)}`}>
                      {product.quantity === 0 ? 'Out of Stock' : product.quantity < product.minStockLevel ? 'Low Stock' : 'In Stock'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer"><X className="w-5 h-5" /></button>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Add New Product</h2>
            {error && <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</div>}
            
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                  <input type="text" name="sku" value={formData.sku} onChange={handleInputChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <input type="text" name="category" value={formData.category} onChange={handleInputChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                  <input type="number" name="quantity" value={formData.quantity} onChange={handleInputChange} min="0" required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min Stock Level</label>
                  <input type="number" name="minStockLevel" value={formData.minStockLevel} onChange={handleInputChange} min="1" required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Price ($)</label>
                  <input type="number" name="purchasePrice" value={formData.purchasePrice} onChange={handleInputChange} step="0.01" min="0" required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Selling Price ($)</label>
                  <input type="number" name="sellingPrice" value={formData.sellingPrice} onChange={handleInputChange} step="0.01" min="0" required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
                <input type="text" name="supplier" value={formData.supplier} onChange={handleInputChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL (Optional)</label>
                <input type="url" name="image" value={formData.image} onChange={handleInputChange} placeholder="https://example.com/image.png" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
              </div>

              <div className="pt-4 flex justify-end space-x-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md font-medium cursor-pointer">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium cursor-pointer">Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Inventory;