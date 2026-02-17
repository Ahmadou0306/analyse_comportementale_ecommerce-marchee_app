import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { api } from '../utils/api';

const AdminContext = createContext();

export function AdminProvider({ children }) {
  const [adminUser, setAdminUser] = useState(() => {
    try {
      const saved = sessionStorage.getItem('marcheAdmin');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });

  const [productsList, setProductsList] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  // Fetch public data on mount (products + categories)
  useEffect(() => {
    Promise.all([
      api.getProducts().catch(() => []),
      api.getCategories().catch(() => []),
    ]).then(([prods, cats]) => {
      setProductsList(prods);
      setCategoriesList(cats);
      setLoadingData(false);
    });
  }, []);

  // Fetch orders when admin is logged in
  useEffect(() => {
    if (adminUser) {
      api.getAllOrders().then(setOrders).catch(() => {});
    }
  }, [adminUser]);

  // Admin auth via phone+OTP (uses same token from AuthContext)
  const adminLogin = useCallback((user, token) => {
    if (user.role !== 'ADMIN') return false;
    const adminData = { ...user, token };
    setAdminUser(adminData);
    sessionStorage.setItem('marcheAdmin', JSON.stringify(adminData));
    localStorage.setItem('marche_token', token);
    localStorage.setItem('marche_user', JSON.stringify(user));
    return true;
  }, []);

  const adminLogout = useCallback(() => {
    setAdminUser(null);
    setOrders([]);
    sessionStorage.removeItem('marcheAdmin');
  }, []);

  // Products CRUD via API (avec support upload image)
  const addProduct = useCallback(async (product, imageFile) => {
    const created = await api.createProduct(product, imageFile);
    setProductsList((prev) => [created, ...prev]);
    return created;
  }, []);

  const updateProduct = useCallback(async (id, updates, imageFile) => {
    const updated = await api.updateProduct(id, updates, imageFile);
    setProductsList((prev) => prev.map((p) => (p.id === id ? updated : p)));
    return updated;
  }, []);

  const deleteProduct = useCallback(async (id) => {
    await api.deleteProduct(id);
    setProductsList((prev) => prev.filter((p) => p.id !== id));
  }, []);

  // Categories CRUD via API
  const addCategory = useCallback(async (category) => {
    const created = await api.createCategory(category);
    setCategoriesList((prev) => [...prev, created]);
    return created;
  }, []);

  const updateCategory = useCallback(async (id, updates) => {
    const updated = await api.updateCategory(id, updates);
    setCategoriesList((prev) => prev.map((c) => (c.id === id ? updated : c)));
    return updated;
  }, []);

  const deleteCategory = useCallback(async (id) => {
    await api.deleteCategory(id);
    setCategoriesList((prev) => prev.filter((c) => c.id !== id));
  }, []);

  // Orders
  const fetchOrders = useCallback(async () => {
    if (!adminUser) return;
    const data = await api.getAllOrders();
    setOrders(data);
  }, [adminUser]);

  const updateOrderStatus = useCallback(async (id, status) => {
    const updated = await api.updateOrderStatus(id, status);
    setOrders((prev) => prev.map((o) => (o.id === id ? updated : o)));
    return updated;
  }, []);

  // Refresh products/categories (after admin CRUD)
  const refreshData = useCallback(async () => {
    const [prods, cats] = await Promise.all([
      api.getProducts(),
      api.getCategories(),
    ]);
    setProductsList(prods);
    setCategoriesList(cats);
  }, []);

  return (
    <AdminContext.Provider
      value={{
        adminUser, adminLogin, adminLogout,
        productsList, addProduct, updateProduct, deleteProduct,
        categoriesList, addCategory, updateCategory, deleteCategory,
        orders, fetchOrders, updateOrderStatus,
        loadingData, refreshData,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider');
  return ctx;
}
