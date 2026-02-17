import { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import Header from './components/Layout/Header';
import CategoryNav from './components/Layout/CategoryNav';
import Footer from './components/Layout/Footer';
import CartSidebar from './components/Cart/CartSidebar';
import AuthModal from './components/Auth/AuthModal';
import Toast from './components/UI/Toast';

import Home from './pages/Home';
import Catalog from './pages/Catalog';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import Success from './pages/Success';
import Profile from './pages/Profile';

import AdminLayout from './components/Admin/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminCategories from './pages/admin/AdminCategories';

import './pages/Home.css';

export default function App() {
  const [cartOpen, setCartOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const location = useLocation();

  const isAdmin = location.pathname.startsWith('/admin');
  const showCategoryNav = !isAdmin && (location.pathname === '/' || location.pathname === '/catalog');
  const showFooter = !isAdmin && (location.pathname === '/' || location.pathname === '/catalog');

  return (
    <>
      {!isAdmin && (
        <Header
          onCartOpen={() => setCartOpen(true)}
          onAuthOpen={() => setAuthOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      )}

      {showCategoryNav && (
        <CategoryNav selected={selectedCategory} onSelect={setSelectedCategory} />
      )}

      <Routes>
        {/* Storefront */}
        <Route
          path="/"
          element={
            <Home onCategorySelect={setSelectedCategory} onAuthOpen={() => setAuthOpen(true)} />
          }
        />
        <Route
          path="/catalog"
          element={<Catalog selectedCategory={selectedCategory} searchQuery={searchQuery} />}
        />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/success/:orderId" element={<Success />} />
        <Route path="/profile" element={<Profile />} />

        {/* Admin */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="categories" element={<AdminCategories />} />
        </Route>
      </Routes>

      {showFooter && <Footer onCategorySelect={setSelectedCategory} />}

      {!isAdmin && (
        <>
          <CartSidebar
            open={cartOpen}
            onClose={() => setCartOpen(false)}
            onAuthOpen={() => setAuthOpen(true)}
          />
          <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
        </>
      )}
      <Toast />
    </>
  );
}
