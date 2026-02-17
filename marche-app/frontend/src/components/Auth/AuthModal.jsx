import { useState, useRef, useCallback } from 'react';
import { FiX, FiChevronRight } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import './AuthModal.css';

const countryCode = import.meta.env.VITE_COUNTRY_CODE || '+243';

export default function AuthModal({ open, onClose }) {
  const [step, setStep] = useState('phone'); // phone | otp | profile
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [profile, setProfile] = useState({ firstName: '', lastName: '', dateOfBirth: '', email: '' });
  const otpRefs = useRef([]);
  const { sendOtp, verifyOtp, completeProfile } = useAuth();
  const { showToast } = useToast();

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setStep('phone');
      setPhone('');
      setOtp(['', '', '', '', '', '']);
      setError('');
      setProfile({ firstName: '', lastName: '', dateOfBirth: '', email: '' });
    }, 300);
  };

  const handleSendOtp = async () => {
    if (phone.length < 6) return;
    setSubmitting(true);
    setError('');
    try {
      const fullPhone = countryCode + phone;
      await sendOtp(fullPhone);
      setStep('otp');
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleOtpChange = useCallback((value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  }, [otp]);

  const handleOtpKeyDown = useCallback((e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  }, [otp]);

  const handlePaste = useCallback((e) => {
    const paste = e.clipboardData.getData('text').trim();
    if (paste.length === 6 && /^\d+$/.test(paste)) {
      e.preventDefault();
      setOtp(paste.split(''));
    }
  }, []);

  const handleVerifyOtp = async () => {
    const code = otp.join('');
    if (code.length < 6) return;
    setSubmitting(true);
    setError('');
    try {
      const fullPhone = countryCode + phone;
      const result = await verifyOtp(fullPhone, code);
      if (result.isNewUser) {
        setStep('profile');
      } else {
        handleClose();
        showToast('👋', `Bienvenue, ${result.user.firstName || 'sur Marché'} !`);
      }
    } catch (err) {
      setError(err.message || 'Code invalide');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCompleteProfile = async () => {
    if (!profile.firstName || !profile.lastName || !profile.dateOfBirth) return;
    setSubmitting(true);
    setError('');
    try {
      await completeProfile(profile);
      handleClose();
      showToast('👋', `Bienvenue, ${profile.firstName} !`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const updateProfile = (field, value) => setProfile((prev) => ({ ...prev, [field]: value }));
  const otpCode = otp.join('');

  return (
    <div className={`modal-overlay ${open ? 'open' : ''}`} onClick={(e) => e.target === e.currentTarget && handleClose()}>
      <div className="modal">
        <button className="modal-close" onClick={handleClose}><FiX size={18} /></button>

        {step === 'phone' && (
          <div>
            <div className="modal-icon">📱</div>
            <h2>Connexion</h2>
            <p>Entrez votre numéro de téléphone pour recevoir un code de vérification.</p>
            <div className="form-group">
              <label className="form-label">Numéro de téléphone</label>
              <div className="form-phone">
                <input className="form-input phone-prefix" value={countryCode} readOnly />
                <input
                  className="form-input"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="xxx xxx xxx"
                  onKeyDown={(e) => e.key === 'Enter' && handleSendOtp()}
                  maxLength={15}
                />
              </div>
            </div>
            {error && <p style={{ color: 'var(--coral)', textAlign: 'center', fontSize: '.8125rem' }}>{error}</p>}
            <button className="btn-primary" onClick={handleSendOtp} disabled={phone.length < 6 || submitting}>
              {submitting ? 'Envoi...' : 'Recevoir le code'}
              {!submitting && <FiChevronRight />}
            </button>
          </div>
        )}

        {step === 'otp' && (
          <div>
            <div className="modal-icon">🔐</div>
            <h2>Vérification</h2>
            <p>Entrez le code à 6 chiffres envoyé au {countryCode} {phone}</p>
            <div className="otp-inputs">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => (otpRefs.current[i] = el)}
                  className="otp-input"
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(e.target.value, i)}
                  onKeyDown={(e) => handleOtpKeyDown(e, i)}
                  onPaste={handlePaste}
                />
              ))}
            </div>
            {error && <p style={{ color: 'var(--coral)', textAlign: 'center', marginTop: 12, fontSize: '.8125rem' }}>{error}</p>}
            <button className="btn-primary" onClick={handleVerifyOtp} disabled={otpCode.length < 6 || submitting}>
              {submitting ? 'Vérification...' : 'Vérifier'}
            </button>
            <div className="otp-resend">
              <span>Code non reçu ? </span>
              <button onClick={() => { setStep('phone'); setOtp(['', '', '', '', '', '']); setError(''); }}>Renvoyer</button>
            </div>
          </div>
        )}

        {step === 'profile' && (
          <div>
            <div className="modal-icon">👤</div>
            <h2>Complétez votre profil</h2>
            <p>Quelques informations pour finaliser votre inscription.</p>
            <div className="form-group">
              <label className="form-label">Prénom *</label>
              <input className="form-input" value={profile.firstName} onChange={(e) => updateProfile('firstName', e.target.value)} placeholder="Votre prénom" />
            </div>
            <div className="form-group">
              <label className="form-label">Nom *</label>
              <input className="form-input" value={profile.lastName} onChange={(e) => updateProfile('lastName', e.target.value)} placeholder="Votre nom" />
            </div>
            <div className="form-group">
              <label className="form-label">Date de naissance *</label>
              <input className="form-input" type="date" value={profile.dateOfBirth} onChange={(e) => updateProfile('dateOfBirth', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Email (optionnel)</label>
              <input className="form-input" type="email" value={profile.email} onChange={(e) => updateProfile('email', e.target.value)} placeholder="votre@email.com" />
            </div>
            {error && <p style={{ color: 'var(--coral)', textAlign: 'center', fontSize: '.8125rem' }}>{error}</p>}
            <button
              className="btn-primary"
              onClick={handleCompleteProfile}
              disabled={!profile.firstName || !profile.lastName || !profile.dateOfBirth || submitting}
            >
              {submitting ? 'Enregistrement...' : "Terminer l'inscription"}
              {!submitting && <FiChevronRight />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
