import { useParams, useNavigate } from 'react-router-dom';
import { FiCheck, FiArrowRight } from 'react-icons/fi';
import './Success.css';

export default function Success() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  return (
    <section className="success-page">
      <div className="success-content fade-up">
        <div className="success-check">
          <FiCheck size={40} />
        </div>
        <h1>Commande confirmée !</h1>
        <div className="order-number">#MRC-{orderId}</div>
        <p>
          Merci pour votre commande ! Vous recevrez une notification par SMS
          lorsque votre commande sera en cours de livraison.
        </p>
        <button
          className="btn-primary"
          style={{ maxWidth: 280, margin: '0 auto' }}
          onClick={() => { navigate('/'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
        >
          Continuer mes achats <FiArrowRight />
        </button>
      </div>
    </section>
  );
}
