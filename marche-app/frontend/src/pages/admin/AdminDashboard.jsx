import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiDollarSign, FiShoppingBag, FiPackage, FiTag } from 'react-icons/fi';
import { useAdmin } from '../../context/AdminContext';
import { formatPrice } from '../../data/products';
import { api } from '../../utils/api';
import StatsCard from '../../components/Admin/StatsCard';
import './AdminDashboard.css';

const STATUS_LABELS = {
  CONFIRMED: 'Confirmée', PROCESSING: 'En traitement',
  SHIPPED: 'Expédiée', DELIVERED: 'Livrée', CANCELLED: 'Annulée',
};
const STATUS_COLORS = {
  CONFIRMED: 'sage', PROCESSING: 'gold', SHIPPED: 'accent', DELIVERED: 'sage', CANCELLED: 'coral',
};

export default function AdminDashboard() {
  const { productsList, categoriesList, orders } = useAdmin();
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    api.getDashboard().then(setDashboard).catch(() => {});
  }, []);

  const totalRevenue = dashboard?.totalRevenue || orders.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = dashboard?.totalOrders || orders.length;
  const revenueByCategory = dashboard?.revenueByCategory || [];
  const maxCatRev = Math.max(...revenueByCategory.map((c) => c.revenue), 1);

  return (
    <div>
      <div className="admin-page-header">
        <h1>Tableau de bord</h1>
        <p>Vue d'ensemble de votre boutique</p>
      </div>

      <div className="admin-stats-grid">
        <StatsCard icon={<FiDollarSign />} label="Revenus" value={formatPrice(totalRevenue)} color="accent" />
        <StatsCard icon={<FiShoppingBag />} label="Commandes" value={totalOrders} color="sage" />
        <StatsCard icon={<FiPackage />} label="Produits" value={dashboard?.totalProducts || productsList.length} color="coral" />
        <StatsCard icon={<FiTag />} label="Catégories" value={dashboard?.totalCategories || categoriesList.length} color="gold" />
      </div>

      <div className="admin-dashboard-grid">
        <div className="admin-card">
          <div className="admin-card-header">
            <h3>Commandes récentes</h3>
            <button className="admin-card-link" onClick={() => navigate('/admin/orders')}>Voir tout</button>
          </div>
          {orders.length === 0 ? (
            <p className="admin-empty">Aucune commande pour le moment</p>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Client</th>
                    <th>Articles</th>
                    <th>Total</th>
                    <th>Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 5).map((o) => (
                    <tr key={o.id} onClick={() => navigate('/admin/orders')} style={{ cursor: 'pointer' }}>
                      <td className="admin-table-id">#MRC-{o.orderNumber}</td>
                      <td>{o.user?.firstName || o.user?.phone || '-'}</td>
                      <td>{o.items.reduce((s, i) => s + i.quantity, 0)} article(s)</td>
                      <td className="admin-table-bold">{formatPrice(o.total)}</td>
                      <td>
                        <span className={`admin-status admin-status--${STATUS_COLORS[o.status]}`}>
                          {STATUS_LABELS[o.status]}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="admin-card">
          <div className="admin-card-header">
            <h3>Revenus par catégorie</h3>
          </div>
          {revenueByCategory.length === 0 ? (
            <p className="admin-empty">Pas encore de données</p>
          ) : (
            <div className="admin-bars">
              {revenueByCategory.map((cat) => {
                const pct = maxCatRev > 0 ? (cat.revenue / maxCatRev) * 100 : 0;
                return (
                  <div key={cat.id} className="admin-bar-row">
                    <div className="admin-bar-label">
                      <span>{cat.name}</span>
                      <span className="admin-bar-val">{formatPrice(cat.revenue)}</span>
                    </div>
                    <div className="admin-bar-track">
                      <div className="admin-bar-fill" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
