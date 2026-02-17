import { useState, useRef, useCallback } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { FiLock, FiChevronRight } from 'react-icons/fi';
import { useAdmin } from '../../context/AdminContext';
import { useToast } from '../../context/ToastContext';
import { api } from '../../utils/api';
import './AdminLogin.css';

const countryCode = import.meta.env.VITE_COUNTRY_CODE || '+243';

export default function AdminLogin() {
  const [step, setStep] = useState('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const otpRefs = useRef([]);
  const { adminLogin, adminUser } = useAdmin();
  const { showToast } = useToast();
  const navigate = useNavigate();

  if (adminUser) return <Navigate to="/admin" replace />;

  const handleSendOtp = async (e) => {
    e?.preventDefault();
    if (phone.length < 6) return;
    setSubmitting(true);
    setError('');
    try {
      const fullPhone = countryCode + phone;
      await api.sendOtp(fullPhone);
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

  const handleVerifyOtp = async (e) => {
    e?.preventDefault();
    const code = otp.join('');
    if (code.length < 6) return;
    setSubmitting(true);
    setError('');
    try {
      const fullPhone = countryCode + phone;
      const result = await api.verifyOtp(fullPhone, code);

      if (result.user.role !== 'ADMIN') {
        setError('Ce compte n\'a pas les droits administrateur');
        return;
      }

      const success = adminLogin(result.user, result.token);
      if (success) {
        showToast('🔐', 'Bienvenue, administrateur');
        navigate('/admin');
      }
    } catch (err) {
      setError(err.message || 'Code invalide');
    } finally {
      setSubmitting(false);
    }
  };

  const otpCode = otp.join('');

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-icon"><FiLock size={28} /></div>
        <div className="admin-login-brand">
          MARCH<span>&Eacute;</span>
        </div>
        <p className="admin-login-sub">Panneau d'administration</p>

        {step === 'phone' && (
          <form onSubmit={handleSendOtp}>
            <div className="form-group">
              <label className="form-label">Numéro de téléphone admin</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  className="form-input"
                  value={countryCode}
                  readOnly
                  style={{ width: 70, textAlign: 'center', flexShrink: 0 }}
                />
                <input
                  className="form-input"
                  value={phone}
                  onChange={(e) => { setPhone(e.target.value); setError(''); }}
                  placeholder="xxx xxx xxx"
                  maxLength={15}
                />
              </div>
            </div>

            {error && <p className="admin-login-error">{error}</p>}

            <button className="btn-primary" type="submit" disabled={phone.length < 6 || submitting}>
              {submitting ? 'Envoi...' : 'Recevoir le code'}
              {!submitting && <FiChevronRight />}
            </button>
          </form>
        )}

        {step === 'otp' && (
          <form onSubmit={handleVerifyOtp}>
            <p style={{ fontSize: '.875rem', color: 'var(--text-muted)', marginBottom: 16, textAlign: 'center' }}>
              Code envoyé au {countryCode} {phone}
            </p>
            <div className="otp-inputs" style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 20 }}>
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
                  style={{ width: 44, height: 48, textAlign: 'center', fontSize: '1.25rem', borderRadius: 8, border: '1px solid var(--border)' }}
                />
              ))}
            </div>

            {error && <p className="admin-login-error">{error}</p>}

            <button className="btn-primary" type="submit" disabled={otpCode.length < 6 || submitting}>
              {submitting ? 'Vérification...' : 'Vérifier'}
              {!submitting && <FiChevronRight />}
            </button>

            <p style={{ textAlign: 'center', marginTop: 12, fontSize: '.8125rem', color: 'var(--text-muted)' }}>
              <button
                type="button"
                onClick={() => { setStep('phone'); setOtp(['', '', '', '', '', '']); setError(''); }}
                style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Changer de numéro
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
