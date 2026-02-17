import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import './Footer.css';

export default function Footer({ onCategorySelect }) {
  const navigate = useNavigate();
  const { categoriesList: categories } = useAdmin();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="logo" style={{ color: '#fff' }}>
              MARCHE
            </div>
            <p>
              Votre marketplace premium. Des produits de qualité soigneusement
              sélectionnés pour vous offrir la meilleure expérience d'achat en ligne.
            </p>
          </div>
          <div>
            <h4>Boutique</h4>
            <ul>
              <li>
                <a href="/catalog" onClick={(e) => { e.preventDefault(); navigate('/catalog'); }}>
                  Tous les produits
                </a>
              </li>
              {categories.slice(0, 4).map((cat) => (
                <li key={cat.id}>
                  <a
                    href="#"
                    onClick={(e) => { e.preventDefault(); onCategorySelect(cat.slug); navigate('/catalog'); }}
                  >
                    {cat.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Aide</h4>
            <ul>
              <li><a href="#">FAQ</a></li>
              <li><a href="#">Livraison</a></li>
              <li><a href="#">Retours</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4>Légal</h4>
            <ul>
              <li><a href="#">Conditions générales</a></li>
              <li><a href="#">Confidentialité</a></li>
              <li><a href="#">Cookies</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>&copy; 2026 M. Tous droits réservés.</span>
          <div className="footer-payments">
            <div className="payment-icon">VISA</div>
            <div className="payment-icon">MC</div>
            <div className="payment-icon">M.P</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
