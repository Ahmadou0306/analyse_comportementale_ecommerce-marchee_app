import { useState, useEffect } from 'react';
import { FiChevronDown, FiPhone, FiMapPin, FiCalendar } from 'react-icons/fi';
import { useAdmin } from '../../context/AdminContext';
import { useToast } from '../../context/ToastContext';
import { formatPrice } from '../../data/products';
import { resolveImageUrl } from '../../utils/api';
import './AdminOrders.css';

const ORDER_STATUSES = [
  { id: 'CONFIRMED', label: 'Confirmée', color: 'sage' },
  { id: 'PROCESSING', label: 'En traitement', color: 'gold' },
  { id: 'SHIPPED', label: 'Expédiée', color: 'accent' },
  { id: 'DELIVERED', label: 'Livrée', color: 'sage' },
  { id: 'CANCELLED', label: 'Annulée', color: 'coral' },
];

export default function AdminOrders() {
  const { orders, fetchOrders, updateOrderStatus } = useAdmin();
  const { showToast } = useToast();
  const [filter, setFilter] = useState('all');
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const filtered = filter === 'all' ? orders : orders.filter((o) => o.status === filter);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      const label = ORDER_STATUSES.find((s) => s.id === newStatus)?.label || newStatus;
      showToast('✅', `Commande mise à jour : ${label}`);
    } catch (err) {
      showToast('⚠️', err.message || 'Erreur');
    }
  };

  const getStatusInfo = (status) => ORDER_STATUSES.find((s) => s.id === status) || ORDER_STATUSES[0];

  return (
    <div>
      <div className="admin-page-header">
        <h1>Commandes</h1>
        <p>{orders.length} commande(s) au total</p>
      </div>

      <div className="admin-order-filters">
        <button className={`admin-filter-chip ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
          Toutes ({orders.length})
        </button>
        {ORDER_STATUSES.map((s) => {
          const count = orders.filter((o) => o.status === s.id).length;
          return (
            <button
              key={s.id}
              className={`admin-filter-chip ${filter === s.id ? 'active' : ''}`}
              onClick={() => setFilter(s.id)}
            >
              {s.label} ({count})
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="admin-card" style={{ marginTop: 16 }}>
          <p className="admin-empty">Aucune commande {filter !== 'all' ? 'avec ce statut' : 'pour le moment'}</p>
        </div>
      ) : (
        <div className="admin-orders-list">
          {filtered.map((order) => {
            const statusInfo = getStatusInfo(order.status);
            const isOpen = expanded === order.id;
            return (
              <div key={order.id} className={`admin-order-card ${isOpen ? 'expanded' : ''}`}>
                <div className="admin-order-top" onClick={() => setExpanded(isOpen ? null : order.id)}>
                  <div className="admin-order-main">
                    <span className="admin-order-id">#MRC-{order.orderNumber}</span>
                    <span className={`admin-status admin-status--${statusInfo.color}`}>{statusInfo.label}</span>
                  </div>
                  <div className="admin-order-meta">
                    <span><FiCalendar size={13} /> {new Date(order.createdAt).toLocaleDateString('fr-FR')}</span>
                    <span>{order.items.reduce((s, i) => s + i.quantity, 0)} article(s)</span>
                    <span className="admin-order-total">{formatPrice(order.total)}</span>
                  </div>
                  <div className="admin-order-images">
                    {order.items.slice(0, 4).map((item) => (
                      <img key={item.id} src={resolveImageUrl(item.product.image)} alt={item.product.name} onError={(e) => { e.target.src = '/placeholder.svg'; }} />
                    ))}
                    {order.items.length > 4 && <span className="admin-order-more">+{order.items.length - 4}</span>}
                  </div>
                  <FiChevronDown className={`admin-order-chevron ${isOpen ? 'open' : ''}`} />
                </div>

                {isOpen && (
                  <div className="admin-order-detail">
                    <div className="admin-order-customer">
                      <h4>Client</h4>
                      <p><FiPhone size={13} /> {order.user?.phone || '-'}</p>
                      {order.user?.firstName && <p>{order.user.firstName} {order.user.lastName}</p>}
                      <p><FiMapPin size={13} /> {order.address}, {order.commune} - {order.city}</p>
                      {order.notes && <p className="admin-order-notes">Note : {order.notes}</p>}
                    </div>

                    <div className="admin-order-items">
                      <h4>Articles</h4>
                      {order.items.map((item) => (
                        <div key={item.id} className="admin-order-item">
                          <img src={resolveImageUrl(item.product.image)} alt={item.product.name} onError={(e) => { e.target.src = '/placeholder.svg'; }} />
                          <div className="admin-order-item-info">
                            <span className="admin-order-item-name">{item.product.name}</span>
                            <span className="admin-order-item-qty">x{item.quantity}</span>
                          </div>
                          <span className="admin-order-item-price">{formatPrice(item.unitPrice * item.quantity)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="admin-order-status-change">
                      <h4>Modifier le statut</h4>
                      <div className="admin-status-buttons">
                        {ORDER_STATUSES.map((s) => (
                          <button
                            key={s.id}
                            className={`admin-status-btn ${order.status === s.id ? 'active' : ''}`}
                            onClick={() => handleStatusChange(order.id, s.id)}
                          >
                            {s.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
