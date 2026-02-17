import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiChevronLeft } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { formatPrice } from '../data/products';
import { resolveImageUrl } from '../utils/api';
import './Profile.css';

const statusLabels = {
  CONFIRMED: 'Confirmée',
  PROCESSING: 'En préparation',
  SHIPPED: 'Expédiée',
  DELIVERED: 'Livrée',
  CANCELLED: 'Annulée',
};

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout, orders, fetchOrders } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  if (!user) {
    navigate('/');
    return null;
  }

  const handleLogout = () => {
    logout();
    showToast('👋', 'Déconnexion réussie');
    navigate('/');
  };

  return (
    <section className="profile-page">
      <div className="container">
        <button className="back-btn" onClick={() => navigate('/')}>
          <FiChevronLeft /> Retour
        </button>

        <div className="profile-header fade-up">
          <div className="profile-avatar">
            {user.firstName ? user.firstName[0] + (user.lastName?.[0] || '') : user.phone.slice(-2)}
          </div>
          <div className="profile-info">
            <h1>{user.firstName ? `${user.firstName} ${user.lastName}` : 'Mon Compte'}</h1>
            <p>{user.phone}</p>
          </div>
        </div>

        <div className="profile-tabs">
          <button className="profile-tab active">Commandes</button>
        </div>

        {orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px 0', color: 'var(--text-muted)' }}>
            <p style={{ fontSize: '2rem', marginBottom: 12, opacity: .4 }}>📦</p>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--text)', marginBottom: 8 }}>
              Aucune commande
            </h3>
            <p style={{ fontSize: '.875rem' }}>Vos commandes apparaîtront ici.</p>
          </div>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="order-card fade-up">
              <div className="order-card-header">
                <span className="order-id">#MRC-{order.orderNumber}</span>
                <span className={`order-status status-${order.status.toLowerCase()}`}>
                  {statusLabels[order.status] || order.status}
                </span>
              </div>
              <div className="order-items-preview">
                {order.items.slice(0, 4).map((item) => (
                  <img key={item.id} src={resolveImageUrl(item.product.image)} alt={item.product.name} onError={(e) => { e.target.src = '/placeholder.svg'; }} />
                ))}
                {order.items.length > 4 && (
                  <span className="order-items-more">+{order.items.length - 4}</span>
                )}
              </div>
              <div className="order-card-footer">
                <span>{new Date(order.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                <span className="order-total">{formatPrice(order.total)}</span>
              </div>
            </div>
          ))
        )}

        <button
          className="btn-secondary"
          style={{ maxWidth: 200, marginTop: 24, color: 'var(--coral)' }}
          onClick={handleLogout}
        >
          Se déconnecter
        </button>
      </div>
    </section>
  );
}
