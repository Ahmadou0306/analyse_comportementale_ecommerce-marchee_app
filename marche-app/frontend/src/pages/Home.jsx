import { useNavigate } from 'react-router-dom';
import { FiChevronRight, FiArrowRight } from 'react-icons/fi';
import { useAdmin } from '../context/AdminContext';
import { getCategoryIcon } from '../utils/categoryIcons';
import ProductCard from '../components/Product/ProductCard';
import './Home.css';

export default function Home({ onCategorySelect, onAuthOpen }) {
  const navigate = useNavigate();
  const { productsList: products, categoriesList: categories } = useAdmin();

  const getProductsByCategory = (slug) => products.filter((p) => p.category?.slug === slug);
  const featuredProducts = products.filter((p) => p.tag === 'popular' || p.tag === 'sale').slice(0, 8);
  const newArrivals = products.filter((p) => p.tag === 'new').slice(0, 4);

  const goToCatalog = () => {
    navigate('/catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="container">
          <div className="hero-grid">
            <div className="hero-main fade-up">
              <div className="hero-badge"><span>Nouveau</span></div>
              <h1 className="hero-title">Découvrez notre collection exclusive</h1>
              <p className="hero-subtitle">
                Des milliers de produits sélectionnés avec soin pour vous offrir le meilleur de chaque catégorie.
              </p>
              <button className="hero-cta" onClick={goToCatalog}>
                Explorer <FiArrowRight />
              </button>
            </div>
            <div className="hero-side">
              <div className="hero-card hero-card-1 fade-up stagger-1" onClick={() => { onCategorySelect('electronics'); navigate('/catalog'); }}>
                <span className="hero-card-tag">Électronique</span>
                <h3>Gadgets Tendance</h3>
                <p>Jusqu'à -30%</p>
              </div>
              <div className="hero-card hero-card-2 fade-up stagger-2" onClick={() => { onCategorySelect('beauty'); navigate('/catalog'); }}>
                <span className="hero-card-tag">Beauté</span>
                <h3>Soins Naturels</h3>
                <p>Nouveautés 2026</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Catégories</h2>
            <button className="section-link" onClick={goToCatalog}>
              Voir tout <FiChevronRight />
            </button>
          </div>
          <div className="categories-grid">
            {categories.map((cat, i) => (
              <div
                key={cat.id}
                className={`category-card fade-up stagger-${i + 1} cat-${cat.slug}`}
                onClick={() => { onCategorySelect(cat.slug); navigate('/catalog'); }}
              >
                <div className="category-icon">{getCategoryIcon(cat.slug)}</div>
                <div className="category-name">{cat.name}</div>
                <div className="category-count">{getProductsByCategory(cat.slug).length} articles</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Produits Populaires</h2>
            <button className="section-link" onClick={goToCatalog}>
              Voir tout <FiChevronRight />
            </button>
          </div>
          <div className="products-grid">
            {featuredProducts.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Promo Banner */}
      <section className="section">
        <div className="container">
          <div className="promo-banner fade-up">
            <div className="promo-content">
              <div className="promo-badge">Offre limitée</div>
              <h2>Livraison gratuite sur votre première commande</h2>
              <p>Inscrivez-vous maintenant et bénéficiez de la livraison offerte sur votre première commande, sans minimum d'achat.</p>
              <button className="promo-cta" onClick={onAuthOpen}>S'inscrire maintenant</button>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Nouveautés</h2>
          </div>
          <div className="products-grid">
            {newArrivals.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
