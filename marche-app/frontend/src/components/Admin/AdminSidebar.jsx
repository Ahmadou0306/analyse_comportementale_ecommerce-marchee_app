import { NavLink, useNavigate } from 'react-router-dom';
import { FiGrid, FiPackage, FiShoppingBag, FiTag, FiLogOut, FiArrowLeft } from 'react-icons/fi';
import { useAdmin } from '../../context/AdminContext';
import './AdminSidebar.css';

const navItems = [
  { to: '/admin', icon: FiGrid, label: 'Tableau de bord', end: true },
  { to: '/admin/products', icon: FiPackage, label: 'Produits' },
  { to: '/admin/orders', icon: FiShoppingBag, label: 'Commandes' },
  { to: '/admin/categories', icon: FiTag, label: 'Catégories' },
];

export default function AdminSidebar() {
  const { adminLogout } = useAdmin();
  const navigate = useNavigate();

  const handleLogout = () => {
    adminLogout();
    navigate('/admin/login');
  };

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-top">
        <div className="admin-logo">
          <span className="admin-logo-text">MARCH<span className="admin-logo-accent">&Eacute;</span></span>
          <span className="admin-logo-sub">Administration</span>
        </div>
        <nav className="admin-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="admin-sidebar-bottom">
        <button className="admin-nav-link" onClick={() => navigate('/')}>
          <FiArrowLeft size={18} />
          <span>Voir la boutique</span>
        </button>
        <button className="admin-nav-link admin-logout" onClick={handleLogout}>
          <FiLogOut size={18} />
          <span>Déconnexion</span>
        </button>
      </div>
    </aside>
  );
}
