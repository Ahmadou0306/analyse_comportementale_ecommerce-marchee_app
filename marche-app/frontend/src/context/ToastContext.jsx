import { createContext, useContext, useState, useCallback, useRef } from 'react';

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const showToast = useCallback((icon, msg) => {
    const id = ++idRef.current;
    setToasts((prev) => [...prev, { id, icon, msg, show: false }]);

    requestAnimationFrame(() => {
      setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, show: true } : t)));
    });

    setTimeout(() => {
      setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, show: false } : t)));
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 400);
    }, 2500);
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, showToast }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
