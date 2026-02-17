import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import { getCategoryIcon } from '../../utils/categoryIcons';
import './CategoryNav.css';

export default function CategoryNav({ selected, onSelect }) {
  const navigate = useNavigate();
  const { categoriesList: categories } = useAdmin();

  const handleSelect = (slug) => {
    onSelect(slug);
    if (slug !== 'all') navigate('/catalog');
  };

  return (
    <nav className="cat-nav">
      <div className="container">
        <div className="cat-nav-inner">
          <button
            className={`cat-chip ${selected === 'all' ? 'active' : ''}`}
            onClick={() => handleSelect('all')}
          >
            Tous
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`cat-chip ${selected === cat.slug ? 'active' : ''}`}
              onClick={() => handleSelect(cat.slug)}
            >
              {getCategoryIcon(cat.slug)}
              {cat.name}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
