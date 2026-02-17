import { useToast } from '../../context/ToastContext';
import './Toast.css';

export default function Toast() {
  const { toasts } = useToast();

  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div key={t.id} className={`toast ${t.show ? 'show' : ''}`}>
          <span className="toast-icon">{t.icon}</span>
          <span>{t.msg}</span>
        </div>
      ))}
    </div>
  );
}
