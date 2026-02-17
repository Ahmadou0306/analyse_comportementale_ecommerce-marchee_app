const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const BACKEND_URL = API_BASE.replace(/\/api$/, '');

/**
 * Résout l'URL d'une image produit.
 * - Si l'URL commence par http, elle est utilisée telle quelle.
 * - Si c'est un chemin local (/images/...), on préfixe avec l'URL du backend.
 */
export function resolveImageUrl(imagePath) {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;
  return `${BACKEND_URL}${imagePath}`;
}

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('marche_token');

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const res = await fetch(`${API_BASE}${endpoint}`, config);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Erreur serveur');
  }

  return data;
}

/**
 * Envoie un FormData (multipart) au backend.
 * Ne pas mettre Content-Type — le navigateur le génère avec le boundary.
 */
async function uploadRequest(endpoint, formData, method = 'POST') {
  const token = localStorage.getItem('marche_token');

  const res = await fetch(`${API_BASE}${endpoint}`, {
    method,
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Erreur serveur');
  }
  return data;
}

export const api = {
  // Auth
  sendOtp: (phone) => request('/auth/send-otp', { method: 'POST', body: JSON.stringify({ phone }) }),
  verifyOtp: (phone, code) => request('/auth/verify-otp', { method: 'POST', body: JSON.stringify({ phone, code }) }),
  completeProfile: (data) => request('/auth/complete-profile', { method: 'PUT', body: JSON.stringify(data) }),

  // Products
  getProducts: () => request('/products'),
  getProduct: (id) => request(`/products/${id}`),
  deleteProduct: (id) => request(`/products/${id}`, { method: 'DELETE' }),

  // Création/modification produit avec support fichier image
  createProduct: (data, imageFile) => {
    if (imageFile) {
      const fd = new FormData();
      fd.append('imageFile', imageFile);
      Object.entries(data).forEach(([k, v]) => { if (v !== null && v !== undefined) fd.append(k, v); });
      return uploadRequest('/products', fd, 'POST');
    }
    return request('/products', { method: 'POST', body: JSON.stringify(data) });
  },

  updateProduct: (id, data, imageFile) => {
    if (imageFile) {
      const fd = new FormData();
      fd.append('imageFile', imageFile);
      Object.entries(data).forEach(([k, v]) => { if (v !== null && v !== undefined) fd.append(k, v); });
      return uploadRequest(`/products/${id}`, fd, 'PUT');
    }
    return request(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  },

  // Categories
  getCategories: () => request('/categories'),
  createCategory: (data) => request('/categories', { method: 'POST', body: JSON.stringify(data) }),
  updateCategory: (id, data) => request(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCategory: (id) => request(`/categories/${id}`, { method: 'DELETE' }),

  // Orders
  createOrder: (data) => request('/orders', { method: 'POST', body: JSON.stringify(data) }),
  getMyOrders: () => request('/orders/my'),
  getAllOrders: () => request('/orders'),
  updateOrderStatus: (id, status) => request(`/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),

  // Admin dashboard
  getDashboard: () => request('/admin/dashboard'),
};
