import { useParams, useNavigate } from 'react-router-dom';
import { FiChevronLeft, FiShoppingBag, FiTruck, FiRefreshCw, FiLock, FiCheckCircle } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';
import { formatPrice } from '../data/products';
import { resolveImageUrl } from '../utils/api';
import { useAdmin } from '../context/AdminContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import './ProductDetail.css';

export default function ProductDetail() {
  const { id } = useParams();
  const { productsList: products } = useAdmin();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const product = products.find((p) => p.id === Number(id));
  if (!product) return <div className="container" style={{ padding: '64px 0', textAlign: 'center' }}>Produit non trouvé.</div>;

  const handleAdd = () => {
    addToCart(product);
    showToast('ok', 'Ajouté au panier');
  };

  return (
    <section className="product-detail">
      <div className="container">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <FiChevronLeft /> Retour
        </button>
        <div className="pd-grid fade-up">
          <div className="pd-gallery">
            <img src={resolveImageUrl(product.image)} alt={product.name} onError={(e) => { e.target.src = '/placeholder.svg'; }} />
          </div>
          <div className="pd-info">
            <div className="pd-category">{product.category?.name || ''}</div>
            <h1>{product.name}</h1>
            <div className="product-rating" style={{ margin: '12px 0 16px' }}>
              <div className="stars">
                {[1, 2, 3, 4, 5].map((s) => (
                  <FaStar key={s} style={{ opacity: s <= product.rating ? 1 : 0.25 }} />
                ))}
              </div>
              <span className="rating-text">{product.rating}.0 ({Math.floor(50 + product.id * 17 % 200)} avis)</span>
            </div>
            <div className="pd-price">
              {formatPrice(product.price)}
              {product.oldPrice && <span className="old">{formatPrice(product.oldPrice)}</span>}
            </div>
            <p className="pd-desc">{product.description}</p>
            <div className="pd-actions">
              <button className="pd-add-cart" onClick={handleAdd}>
                <FiShoppingBag /> Ajouter au panier
              </button>
            </div>
            <div className="pd-features">
              <div className="pd-feature"><span className="pd-feature-icon"><FiTruck /></span>Livraison rapide</div>
              <div className="pd-feature"><span className="pd-feature-icon"><FiRefreshCw /></span>Retour 30 jours</div>
              <div className="pd-feature"><span className="pd-feature-icon"><FiLock /></span>Paiement sécurisé</div>
              <div className="pd-feature"><span className="pd-feature-icon"><FiCheckCircle /></span>Garantie qualité</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
