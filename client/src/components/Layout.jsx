import React from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Users, LogOut } from 'lucide-react';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    // Clear the JWT token to end the session
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Simple helper to highlight the active menu item
  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex h-screen bg-gray-100">
      
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-2xl font-bold text-blue-600 tracking-tight">Allied.</h1>
          <p className="text-xs text-gray-400 mt-1">Inventory Management</p>
        </div>
        
        <nav className="flex-1 mt-6">
          <Link 
            to="/dashboard" 
            className={`flex items-center px-6 py-3 transition-colors ${isActive('/dashboard') ? 'text-blue-600 bg-blue-50 border-r-4 border-blue-600' : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'}`}
          >
            <LayoutDashboard className="w-5 h-5 mr-3" />
            Dashboard
          </Link>
          <Link 
            to="/inventory" 
            className={`flex items-center px-6 py-3 transition-colors ${isActive('/inventory') ? 'text-blue-600 bg-blue-50 border-r-4 border-blue-600' : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'}`}
          >
            <Package className="w-5 h-5 mr-3" />
            Inventory
          </Link>
          <Link 
            to="/orders" 
            className={`flex items-center px-6 py-3 transition-colors ${isActive('/orders') ? 'text-blue-600 bg-blue-50 border-r-4 border-blue-600' : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'}`}
          >
            <ShoppingCart className="w-5 h-5 mr-3" />
            Orders
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button 
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Top Header */}
        <header className="flex justify-between items-center p-6 bg-white shadow-sm z-10">
          <h2 className="text-xl font-semibold text-gray-800 capitalize">
            {location.pathname.replace('/', '') || 'Dashboard'}
          </h2>
          <div className="flex items-center space-x-4">
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
              A
            </div>
            <span className="text-sm font-medium text-gray-700">Admin User</span>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          {children}
        </main>
      </div>

    </div>
  );
};

export default Layout;