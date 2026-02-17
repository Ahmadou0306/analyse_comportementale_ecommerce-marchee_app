import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiSearch, FiShoppingBag, FiUser } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

export default function Header({ onCartOpen, onAuthOpen, searchQuery, onSearchChange }) {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { cartTotal } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const handleSearchChange = (e) => {
    onSearchChange(e.target.value);
    if (e.target.value.length > 0 && location.pathname !== '/catalog') {
      navigate('/catalog');
    }
  };

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="container header-inner">
        <a href="/" className="logo" onClick={(e) => { e.preventDefault(); navigate('/'); }}>
          MARCH<span>&Eacute;</span>
        </a>

        <div
          className={`search-bar ${searchOpen ? 'open' : ''}`}
          onClick={() => {
            setSearchOpen(true);
            setTimeout(() => searchRef.current?.focus(), 100);
          }}
        >
          <FiSearch />
          <input
            ref={searchRef}
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Rechercher un produit..."
            onBlur={() => setSearchOpen(searchQuery.length > 0)}
          />
        </div>

        <div className="header-actions">
          <button className="header-btn" onClick={onCartOpen} title="Panier">
            <FiShoppingBag />
            <span className={`cart-count ${cartTotal > 0 ? 'show' : ''}`}>{cartTotal}</span>
          </button>

          {!user ? (
            <button className="user-btn-text" onClick={onAuthOpen}>
              <div className="user-avatar">
                <FiUser size={14} color="#fff" />
              </div>
              <span>Connexion</span>
            </button>
          ) : (
            <button className="user-btn-text" onClick={() => navigate('/profile')}>
              <div className="user-avatar">{user.phone.slice(-2)}</div>
              <span>Mon Compte</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
