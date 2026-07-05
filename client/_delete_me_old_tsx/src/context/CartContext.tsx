import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Product } from '../types';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (product: Product, quantity: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
  total: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

const STORAGE_KEY = 'kb_cart';

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as CartItem[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  function addItem(product: Product, quantity: number) {
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

  function removeItem(productId: string) {
    setItems((prev) => prev.filter((i) => i.product._id !== productId));
  }

  function updateQuantity(productId: string, quantity: number) {
    setItems((prev) => prev.map((i) => (i.product._id === productId ? { ...i, quantity } : i)));
  }

  function clear() {
    setItems([]);
  }

  const total = items.reduce((sum, i) => sum + i.quantity * i.product.pricePerKg, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clear, total }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
