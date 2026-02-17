import { FiCpu, FiShoppingBag, FiHome, FiActivity, FiStar, FiBookOpen, FiGrid } from 'react-icons/fi';

const iconMap = {
  electronics: <FiCpu />,
  fashion: <FiShoppingBag />,
  home: <FiHome />,
  sports: <FiActivity />,
  beauty: <FiStar />,
  books: <FiBookOpen />,
};

export function getCategoryIcon(slug) {
  return iconMap[slug] || <FiGrid />;
}
