import { useNavigate } from 'react-router-dom';
import { FiX, FiMinus, FiPlus } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { formatPrice } from '../../data/products';
import { resolveImageUrl } from '../../utils/api';
import './CartSidebar.css';

export default function CartSidebar({ open, onClose, onAuthOpen }) {
  const navigate = useNavigate();
  const { items, updateQty, removeFromCart, cartTotal, cartSubtotal, shipping, cartGrandTotal } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();

  const handleRemove = (productId) => {
    removeFromCart(productId);
    showToast('🗑', 'Article supprimé');
  };

  const handleCheckout = () => {
    if (!user) {
      onAuthOpen();
      onClose();
      return;
    }
    onClose();
    navigate('/checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <div className={`cart-overlay ${open ? 'open' : ''}`} onClick={onClose} />
      <div className={`cart-sidebar ${open ? 'open' : ''}`}>
        <div className="cart-header">
          <h2>Panier ({cartTotal})</h2>
          <button className="cart-close" onClick={onClose}><FiX size={20} /></button>
        </div>

        <div className="cart-body">
          {items.length === 0 ? (
            <div className="cart-empty">
              <div className="cart-empty-icon">🛒</div>
              <h3>Votre panier est vide</h3>
              <p>Ajoutez des articles pour commencer</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.product.id} className="cart-item">
                <div className="cart-item-img">
                  <img src={resolveImageUrl(item.product.image)} alt={item.product.name} onError={(e) => { e.target.src = '/placeholder.svg'; }} />
                </div>
                <div className="cart-item-info">
                  <div className="cart-item-name">{item.product.name}</div>
                  <div className="cart-item-cat">{item.product.category?.name || ''}</div>
                  <div className="cart-item-actions">
                    <div className="qty-control">
                      <button className="qty-btn" onClick={() => updateQty(item.product.id, -1)}>
                        <FiMinus size={14} />
                      </button>
                      <span className="qty-value">{item.qty}</span>
                      <button className="qty-btn" onClick={() => updateQty(item.product.id, 1)}>
                        <FiPlus size={14} />
                      </button>
                    </div>
                    <div className="cart-item-price">{formatPrice(item.product.price * item.qty)}</div>
                  </div>
                  <button className="cart-item-remove" onClick={() => handleRemove(item.product.id)}>
                    Supprimer
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="cart-footer">
            <div className="cart-totals">
              <div className="cart-total-row">
                <span>Sous-total</span><span>{formatPrice(cartSubtotal)}</span>
              </div>
              <div className="cart-total-row">
                <span>Livraison</span><span>{shipping === 0 ? 'Gratuite' : formatPrice(shipping)}</span>
              </div>
              <div className="cart-total-row total">
                <span>Total</span><span>{formatPrice(cartGrandTotal)}</span>
              </div>
            </div>
            <button className="checkout-btn" onClick={handleCheckout}>
              Passer la commande
              <FiPlus style={{ transform: 'rotate(45deg)', display: 'none' }} />
              <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </>
  );
}
