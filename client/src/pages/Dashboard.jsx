import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import { Package, AlertTriangle, TrendingUp, DollarSign, XCircle, ShoppingCart } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const [metrics, setMetrics] = useState({
    totalProducts: 0,
    lowStock: 0,
    outOfStock: 0,
    totalOrders: 0,
    inventoryValue: 0,
    totalSuppliers: 0
  });
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        // Fetch both products and orders simultaneously
        const [productsRes, ordersRes] = await Promise.all([
          axios.get('/api/products', { headers }),
          axios.get('/api/orders', { headers })
        ]);

        const products = productsRes.data.data;
        const orders = ordersRes.data.data;

        // Calculate Metrics based on strict assignment requirements
        let lowStockCount = 0;
        let outOfStockCount = 0;
        let invValue = 0;
        const uniqueSuppliers = new Set();
        const categoryData = {};

        products.forEach(p => {
          if (p.quantity === 0) outOfStockCount++;
          else if (p.quantity < 10) lowStockCount++; // Assuming < 10 is the low stock threshold
          
          invValue += (p.quantity * p.purchasePrice);
          if (p.supplier) uniqueSuppliers.add(p.supplier);

          // Prepare data for the chart
          if (categoryData[p.category]) {
            categoryData[p.category] += p.quantity;
          } else {
            categoryData[p.category] = p.quantity;
          }
        });

        // Format chart data for Recharts
        const formattedChartData = Object.keys(categoryData).map(key => ({
          name: key,
          stock: categoryData[key]
        }));

        setMetrics({
          totalProducts: products.length,
          lowStock: lowStockCount,
          outOfStock: outOfStockCount,
          totalOrders: orders.length,
          inventoryValue: invValue,
          totalSuppliers: uniqueSuppliers.size
        });
        setChartData(formattedChartData);
        setLoading(false);

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="flex h-64 items-center justify-center text-gray-500">Loading Dashboard Metrics...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Inventory Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Real-time overview of your enterprise metrics.</p>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center">
          <div className="p-3 rounded-lg bg-blue-50 text-blue-600 mr-4">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Products</p>
            <p className="text-2xl font-bold text-gray-800">{metrics.totalProducts}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center">
          <div className="p-3 rounded-lg bg-emerald-50 text-emerald-600 mr-4">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Inventory Value</p>
            <p className="text-2xl font-bold text-gray-800">${metrics.inventoryValue.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center">
          <div className="p-3 rounded-lg bg-purple-50 text-purple-600 mr-4">
            <ShoppingCart className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Orders</p>
            <p className="text-2xl font-bold text-gray-800">{metrics.totalOrders}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center">
          <div className="p-3 rounded-lg bg-amber-50 text-amber-600 mr-4">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Low Stock Products</p>
            <p className="text-2xl font-bold text-gray-800">{metrics.lowStock}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center">
          <div className="p-3 rounded-lg bg-red-50 text-red-600 mr-4">
            <XCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Out of Stock</p>
            <p className="text-2xl font-bold text-gray-800">{metrics.outOfStock}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center">
          <div className="p-3 rounded-lg bg-indigo-50 text-indigo-600 mr-4">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Suppliers</p>
            <p className="text-2xl font-bold text-gray-800">{metrics.totalSuppliers}</p>
          </div>
        </div>
      </div>

      {/* Main Chart Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-[400px]">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">Stock Volume by Category</h3>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280'}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280'}} />
              <Tooltip 
                cursor={{fill: '#F3F4F6'}}
                contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
              />
              <Bar dataKey="stock" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
            Add products to see category distributions.
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;