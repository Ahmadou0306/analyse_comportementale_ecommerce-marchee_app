import { createContext, useContext, useReducer, useCallback } from 'react';

const CartContext = createContext();

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const idx = state.items.findIndex((i) => i.product.id === action.product.id);
      if (idx > -1) {
        const items = [...state.items];
        items[idx] = { ...items[idx], qty: items[idx].qty + 1 };
        return { ...state, items };
      }
      return { ...state, items: [...state.items, { product: action.product, qty: 1 }] };
    }
    case 'REMOVE':
      return { ...state, items: state.items.filter((i) => i.product.id !== action.productId) };
    case 'UPDATE_QTY': {
      const items = state.items
        .map((i) =>
          i.product.id === action.productId ? { ...i, qty: i.qty + action.delta } : i
        )
        .filter((i) => i.qty > 0);
      return { ...state, items };
    }
    case 'CLEAR':
      return { ...state, items: [] };
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  const addToCart = useCallback((product) => dispatch({ type: 'ADD', product }), []);
  const removeFromCart = useCallback((productId) => dispatch({ type: 'REMOVE', productId }), []);
  const updateQty = useCallback((productId, delta) => dispatch({ type: 'UPDATE_QTY', productId, delta }), []);
  const clearCart = useCallback(() => dispatch({ type: 'CLEAR' }), []);

  const cartTotal = state.items.reduce((s, i) => s + i.qty, 0);
  const cartSubtotal = state.items.reduce((s, i) => s + i.product.price * i.qty, 0);
  const freeThreshold = Number(import.meta.env.VITE_FREE_SHIPPING_THRESHOLD) || 50000;
  const shippingCost = Number(import.meta.env.VITE_SHIPPING_COST) || 5000;
  const shipping = cartSubtotal >= freeThreshold ? 0 : shippingCost;
  const cartGrandTotal = cartSubtotal + shipping;

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        cartTotal,
        cartSubtotal,
        shipping,
        cartGrandTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
