// src/hooks/useCartNotification.tsx

import { create } from 'zustand';
import { useCart } from '@shopify/hydrogen-react';
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CartNotificationState {
  isVisible: boolean;
  message: string;
  cartCount: number;
  showNotification: (message: string) => void;
  hideNotification: () => void;
  setCartCount: (count: number) => void;
}

const useCartNotificationStore = create<CartNotificationState>((set) => ({
  isVisible: false,
  message: '',
  cartCount: 0,
  showNotification: (message) => {
    set({ isVisible: true, message });
    setTimeout(() => set({ isVisible: false }), 2000);
  },
  hideNotification: () => set({ isVisible: false }),
  setCartCount: (count) => set({ cartCount: count }),
}));

// This is the UI component for the pop-up
export const CartToast = () => {
    const { isVisible, message } = useCartNotificationStore();
    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-6 py-3 bg-white text-black font-sans font-bold text-sm rounded-full shadow-lg"
                >
                    {message}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

// This is the hook we will use in other components
export const useCartNotification = () => {
    const { showNotification, setCartCount, cartCount } = useCartNotificationStore();
    const { totalQuantity } = useCart();

    useEffect(() => {
        setCartCount(totalQuantity ?? 0);
    }, [totalQuantity, setCartCount]);
    
    return { showNotification, cartCount };
};