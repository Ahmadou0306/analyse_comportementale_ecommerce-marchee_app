import { useNavigate } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { formatPrice } from '../../data/products';
import { resolveImageUrl } from '../../utils/api';
import './ProductCard.css';

const tagLabels = { new: 'Nouveau', sale: 'Promo', popular: 'Populaire' };

export default function ProductCard({ product, index = 0 }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const handleAdd = (e) => {
    e.stopPropagation();
    addToCart(product);
    showToast('✓', 'Ajouté au panier');
  };

  return (
    <div
      className={`product-card fade-up stagger-${(index % 8) + 1}`}
      onClick={() => navigate(`/product/${product.id}`)}
    >
      <div className="product-img-wrap">
        <img src={resolveImageUrl(product.image)} alt={product.name} loading="lazy" onError={(e) => { e.target.src = '/placeholder.svg'; }} />
        {product.tag && (
          <span className={`product-tag tag-${product.tag}`}>
            {tagLabels[product.tag]}
          </span>
        )}
      </div>
      <div className="product-info">
        <div className="product-category-label">{product.category?.name || ''}</div>
        <div className="product-name">{product.name}</div>
        <div className="product-rating">
          <div className="stars">
            {[1, 2, 3, 4, 5].map((s) => (
              <FaStar key={s} style={{ opacity: s <= product.rating ? 1 : 0.25 }} />
            ))}
          </div>
          <span className="rating-text">{product.rating}.0</span>
        </div>
        <div className="product-bottom">
          <div className="product-price">
            {formatPrice(product.price)}
            {product.oldPrice && (
              <span className="old-price">{formatPrice(product.oldPrice)}</span>
            )}
          </div>
          <button className="add-cart-btn" onClick={handleAdd} title="Ajouter au panier">
            <FiPlus />
          </button>
        </div>
      </div>
    </div>
  );
}
