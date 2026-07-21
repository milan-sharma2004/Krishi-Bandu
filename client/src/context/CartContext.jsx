import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext(undefined);

const STORAGE_KEY = 'kb_cart';

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  function addItem(product, quantity) {
    setItems((prev) => {
      const existing = prev.find((i) => i.product._id === product._id);
      if (existing) {
        return prev.map((i) =>
          i.product._id === product._id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...prev, { product, quantity }];
    });
  }

  // Sets the cart quantity for a product outright instead of adding on top of
  // whatever's already there. Used by "Buy Now" so clicking it after "Add to
  // Cart" reflects the selected quantity once, rather than stacking both.
  function setItem(product, quantity) {
    setItems((prev) => {
      const existing = prev.find((i) => i.product._id === product._id);
      if (existing) {
        return prev.map((i) => (i.product._id === product._id ? { ...i, quantity } : i));
      }
      return [...prev, { product, quantity }];
    });
  }

  function removeItem(productId) {
    setItems((prev) => prev.filter((i) => i.product._id !== productId));
  }

  function updateQuantity(productId, quantity) {
    setItems((prev) => prev.map((i) => (i.product._id === productId ? { ...i, quantity } : i)));
  }

  function clear() {
    setItems([]);
  }

  const total = items.reduce((sum, i) => sum + i.quantity * i.product.pricePerKg, 0);

  return (
    <CartContext.Provider value={{ items, addItem, setItem, removeItem, updateQuantity, clear, total }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
