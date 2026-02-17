import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight, FiSmartphone, FiDollarSign, FiCreditCard, FiShoppingCart } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { formatPrice, paymentMethods } from '../data/products';
import { api, resolveImageUrl } from '../utils/api';
import './Checkout.css';

const paymentIcons = {
  mobile: <FiSmartphone />,
  cash: <FiDollarSign />,
  card: <FiCreditCard />,
};

export default function Checkout() {
  const navigate = useNavigate();
  const { items, cartSubtotal, shipping, cartGrandTotal, clearCart } = useCart();
  const { user, fetchOrders } = useAuth();
  const { showToast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    firstName: user?.firstName || '', lastName: user?.lastName || '', phone: user?.phone || '',
    address: '', city: '', commune: '', notes: '', payment: 'mobile',
  });

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const canPlace = form.firstName && form.lastName && form.phone && form.address && form.city && !submitting;

  const placeOrder = async () => {
    setSubmitting(true);
    try {
      const orderData = {
        items: items.map((item) => ({
          productId: item.product.id,
          quantity: item.qty,
          unitPrice: item.product.price,
        })),
        total: cartGrandTotal,
        shippingCost: shipping,
        address: form.address,
        city: form.city,
        commune: form.commune,
        notes: form.notes,
        paymentMethod: form.payment,
      };

      const order = await api.createOrder(orderData);
      clearCart();
      fetchOrders();
      navigate('/success/' + order.orderNumber);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      showToast('⚠️', err.message || 'Erreur lors de la commande');
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container" style={{ padding: '64px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
        <p style={{ fontSize: '2rem', marginBottom: 12, opacity: .4 }}><FiShoppingCart /></p>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--text)', marginBottom: 8 }}>Votre panier est vide</h3>
        <button className="btn-primary" style={{ maxWidth: 240, margin: '16px auto' }} onClick={() => navigate('/')}>
          Continuer mes achats
        </button>
      </div>
    );
  }

  return (
    <section className="checkout-page">
      <div className="container">
        <button className="back-btn" onClick={() => navigate('/')}>
          <FiChevronLeft /> Retour
        </button>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', marginBottom: 28 }}>
          Finaliser la commande
        </h2>
        <div className="checkout-grid">
          <div>
            <div className="checkout-section fade-up">
              <h3><span className="step-num">1</span>Informations de livraison</h3>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Prénom</label>
                  <input className="form-input" value={form.firstName} onChange={(e) => update('firstName', e.target.value)} placeholder="Votre prénom" />
                </div>
                <div className="form-group">
                  <label className="form-label">Nom</label>
                  <input className="form-input" value={form.lastName} onChange={(e) => update('lastName', e.target.value)} placeholder="Votre nom" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Téléphone</label>
                <input className="form-input" value={form.phone} readOnly style={{ opacity: 0.7 }} />
              </div>
              <div className="form-group">
                <label className="form-label">Adresse de livraison</label>
                <input className="form-input" value={form.address} onChange={(e) => update('address', e.target.value)} placeholder="Numéro, rue, avenue" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Ville</label>
                  <input className="form-input" value={form.city} onChange={(e) => update('city', e.target.value)} placeholder="Ex: Kinshasa" />
                </div>
                <div className="form-group">
                  <label className="form-label">Commune</label>
                  <input className="form-input" value={form.commune} onChange={(e) => update('commune', e.target.value)} placeholder="Ex: Gombe" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Notes (optionnel)</label>
                <textarea className="form-input" value={form.notes} onChange={(e) => update('notes', e.target.value)} placeholder="Instructions spéciales pour la livraison..." rows={3} />
              </div>
            </div>

            <div className="checkout-section fade-up stagger-1">
              <h3><span className="step-num">2</span>Mode de paiement</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {paymentMethods.map((pm) => (
                  <label
                    key={pm.id}
                    className="payment-option"
                    style={form.payment === pm.id ? { borderColor: 'var(--accent)', background: 'var(--accent-light)' } : {}}
                  >
                    <input type="radio" value={pm.id} checked={form.payment === pm.id} onChange={() => update('payment', pm.id)} style={{ accentColor: 'var(--accent)' }} />
                    <span style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center' }}>{paymentIcons[pm.id] || pm.icon}</span>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '.875rem' }}>{pm.name}</div>
                      <div style={{ fontSize: '.75rem', color: 'var(--text-muted)' }}>{pm.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="order-summary fade-up stagger-2">
            <h3>Résumé de la commande</h3>
            <div>
              {items.map((item) => (
                <div key={item.product.id} className="summary-item">
                  <div className="summary-item-img"><img src={resolveImageUrl(item.product.image)} alt={item.product.name} onError={(e) => { e.target.src = '/placeholder.svg'; }} /></div>
                  <div className="summary-item-info">
                    <div className="summary-item-name">{item.product.name}</div>
                    <div className="summary-item-qty">Quantité: {item.qty}</div>
                  </div>
                  <div className="summary-item-price">{formatPrice(item.product.price * item.qty)}</div>
                </div>
              ))}
            </div>
            <div className="cart-totals" style={{ marginTop: 16 }}>
              <div className="cart-total-row"><span>Sous-total</span><span>{formatPrice(cartSubtotal)}</span></div>
              <div className="cart-total-row"><span>Livraison</span><span>{shipping === 0 ? 'Gratuite' : formatPrice(shipping)}</span></div>
              <div className="cart-total-row total"><span>Total</span><span>{formatPrice(cartGrandTotal)}</span></div>
            </div>
            <button className="checkout-btn" onClick={placeOrder} disabled={!canPlace}>
              {submitting ? 'Traitement...' : 'Confirmer la commande'} {!submitting && <FiChevronRight />}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
