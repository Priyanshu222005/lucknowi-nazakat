import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  size: string;
  quantity: number;
}

interface CartStore {
  cart: CartItem[];
  isOpen: boolean;
  addToCart: (item: Omit<CartItem, 'quantity'>, size?: string) => void;
  removeFromCart: (id: string, size: string) => void;
  updateQuantity: (id: string, size: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: [],
      isOpen: false,
      addToCart: (item, selectedSize = 'M') => {
        const currentCart = get().cart;
        const existingItemIndex = currentCart.findIndex(
          (i) => i.id === item.id && i.size === selectedSize
        );

        if (existingItemIndex > -1) {
          const updatedCart = [...currentCart];
          updatedCart[existingItemIndex].quantity += 1;
          set({ cart: updatedCart, isOpen: true });
        } else {
          set({
            cart: [...currentCart, { ...item, size: selectedSize, quantity: 1 }],
            isOpen: true,
          });
        }
      },
      removeFromCart: (id, size) => {
        set({
          cart: get().cart.filter((item) => !(item.id === id && item.size === size)),
        });
      },
      updateQuantity: (id, size, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(id, size);
          return;
        }
        set({
          cart: get().cart.map((item) =>
            item.id === id && item.size === size ? { ...item, quantity } : item
          ),
        });
      },
      clearCart: () => set({ cart: [] }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      getTotalItems: () => get().cart.reduce((total, item) => total + item.quantity, 0),
      getTotalPrice: () =>
        get().cart.reduce((total, item) => total + item.price * item.quantity, 0),
    }),
    {
      name: 'lucknowi-nazakat-cart',
    }
  )
);