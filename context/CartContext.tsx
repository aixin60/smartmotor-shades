"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { createCartItemId } from "@/lib/cart";

export interface CartItem {
  id: string;
  slug: string;
  name: string;
  category: string;
  color: string;
  width: string;
  height: string;
  structure?: string;
  hardware?: string;
  motor: string;
  mountType: "inside" | "outside";
  roomName?: string;
  price: number;
  quantity: number;
  imageColor: string;
}

export interface SavedItem {
  id: string;
  slug: string;
  name: string;
  category: string;
  color: string;
  width: string;
  height: string;
  structure?: string;
  hardware?: string;
  motor: string;
  mountType: "inside" | "outside";
  price: number;
  quantity: number;
  imageColor: string;
  roomName?: string;
  factoryCost?: number;
}

export type AddToCartInput = Omit<CartItem, "id" | "quantity"> & {
  quantity?: number;
};

interface CartContextValue {
  cart: CartItem[];
  savedItems: SavedItem[];
  cartCount: number;
  isHydrated: boolean;
  addToCart: (item: AddToCartInput) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  saveForLater: (id: string) => void;
  moveToCart: (id: string) => void;
  removeFromSaved: (id: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const CART_STORAGE_KEY = "smartmotorshades-cart";
const SAVED_STORAGE_KEY = "smartmotorshades-saved";
const LEGACY_CART_STORAGE_KEY = "lumiere-cart";
const LEGACY_SAVED_STORAGE_KEY = "lumiere-saved";

function loadFromStorage<T>(key: string, legacyKey: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(key);
    if (stored) return JSON.parse(stored) as T[];
    const legacy = localStorage.getItem(legacyKey);
    if (!legacy) return [];
    localStorage.setItem(key, legacy);
    localStorage.removeItem(legacyKey);
    return JSON.parse(legacy) as T[];
  } catch {
    return [];
  }
}

function saveToStorage<T>(key: string, data: T[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(data));
}

function toSavedItem(item: CartItem): SavedItem {
  const { id, ...rest } = item;
  return { id, ...rest };
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setCart(loadFromStorage<CartItem>(CART_STORAGE_KEY, LEGACY_CART_STORAGE_KEY));
    setSavedItems(
      loadFromStorage<SavedItem>(SAVED_STORAGE_KEY, LEGACY_SAVED_STORAGE_KEY)
    );
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    saveToStorage(CART_STORAGE_KEY, cart);
  }, [cart, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    saveToStorage(SAVED_STORAGE_KEY, savedItems);
  }, [savedItems, isHydrated]);

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const addToCart = useCallback((item: AddToCartInput) => {
    const id = createCartItemId({
      slug: item.slug,
      color: item.color,
      width: item.width,
      height: item.height,
      motor: item.motor,
      structure: item.structure,
      hardware: item.hardware,
      mountType: item.mountType,
      roomName: item.roomName,
    });
    const quantity = item.quantity ?? 1;

    setCart((prev) => {
      const existing = prev.find((cartItem) => cartItem.id === id);
      if (existing) {
        return prev.map((cartItem) =>
          cartItem.id === id
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
            : cartItem
        );
      }
      return [...prev, { ...item, id, quantity }];
    });
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const updateQuantity = useCallback(
    (id: string, quantity: number) => {
      if (quantity <= 0) {
        removeFromCart(id);
        return;
      }
      setCart((prev) =>
        prev.map((item) => (item.id === id ? { ...item, quantity } : item))
      );
    },
    [removeFromCart]
  );

  const saveForLater = useCallback((id: string) => {
    setCart((prevCart) => {
      const item = prevCart.find((cartItem) => cartItem.id === id);
      if (!item) return prevCart;

      setSavedItems((prevSaved) => {
        const existing = prevSaved.find((saved) => saved.id === id);
        if (existing) {
          return prevSaved.map((saved) =>
            saved.id === id
              ? { ...saved, quantity: saved.quantity + item.quantity }
              : saved
          );
        }
        return [...prevSaved, toSavedItem(item)];
      });

      return prevCart.filter((cartItem) => cartItem.id !== id);
    });
  }, []);

  const moveToCart = useCallback(
    (id: string) => {
      setSavedItems((prevSaved) => {
        const item = prevSaved.find((saved) => saved.id === id);
        if (!item) return prevSaved;

        addToCart({ ...item, quantity: item.quantity });
        return prevSaved.filter((saved) => saved.id !== id);
      });
    },
    [addToCart]
  );

  const removeFromSaved = useCallback((id: string) => {
    setSavedItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const value = useMemo(
    () => ({
      cart,
      savedItems,
      cartCount,
      isHydrated,
      addToCart,
      removeFromCart,
      updateQuantity,
      saveForLater,
      moveToCart,
      removeFromSaved,
      clearCart,
    }),
    [
      cart,
      savedItems,
      cartCount,
      isHydrated,
      addToCart,
      removeFromCart,
      updateQuantity,
      saveForLater,
      moveToCart,
      removeFromSaved,
      clearCart,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
