import { FiX } from 'react-icons/fi';
import './AdminModal.css';

export default function AdminModal({ open, onClose, title, children }) {
  if (!open) return null;

  return (
    <div className="admin-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="admin-modal">
        <div className="admin-modal-header">
          <h3>{title}</h3>
          <button className="admin-modal-close" onClick={onClose}><FiX size={18} /></button>
        </div>
        <div className="admin-modal-body">
          {children}
        </div>
      </div>
    </div>
  );
}
