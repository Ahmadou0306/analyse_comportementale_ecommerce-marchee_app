import { useState, useMemo } from 'react';
import { useAdmin } from '../context/AdminContext';
import ProductCard from '../components/Product/ProductCard';
import '../components/Product/ProductCard.css';

export default function Catalog({ selectedCategory, searchQuery }) {
  const { productsList: products, categoriesList: categories } = useAdmin();
  const [sortBy, setSortBy] = useState('default');

  const getCategoryName = (slug) => categories.find((c) => c.slug === slug)?.name || slug;

  const filteredProducts = useMemo(() => {
    let list = selectedCategory === 'all'
      ? [...products]
      : products.filter((p) => p.category?.slug === selectedCategory);

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) => p.name.toLowerCase().includes(q) || (p.category?.name || '').toLowerCase().includes(q)
      );
    }

    switch (sortBy) {
      case 'price-asc': list.sort((a, b) => a.price - b.price); break;
      case 'price-desc': list.sort((a, b) => b.price - a.price); break;
      case 'rating': list.sort((a, b) => b.rating - a.rating); break;
      case 'name': list.sort((a, b) => a.name.localeCompare(b.name)); break;
    }
    return list;
  }, [products, selectedCategory, searchQuery, sortBy]);

  const title = selectedCategory === 'all' ? 'Tous les Produits' : getCategoryName(selectedCategory);

  return (
    <section style={{ padding: '40px 0' }}>
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', letterSpacing: '-.01em' }}>
            {title}
          </h2>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: '8px 14px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)',
              fontSize: '.8125rem', fontFamily: 'inherit', background: 'var(--surface)', cursor: 'pointer',
            }}
          >
            <option value="default">Trier par</option>
            <option value="price-asc">Prix croissant</option>
            <option value="price-desc">Prix décroissant</option>
            <option value="rating">Mieux notés</option>
            <option value="name">Nom A-Z</option>
          </select>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="products-grid">
            {filteredProducts.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        ) : (
          <p style={{ textAlign: 'center', padding: '64px 0', color: 'var(--text-muted)' }}>
            Aucun produit trouvé.
          </p>
        )}
      </div>
    </section>
  );
}
