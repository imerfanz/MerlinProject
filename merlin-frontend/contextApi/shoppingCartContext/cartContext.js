import { useState, useContext, createContext } from "react";

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const addToCart = (itemObject) => {
    try {
      const newCart = [...cart, itemObject];
      setCart(newCart);
      return true;
    } catch (error) {
      return false;
    }
  };
  const deleteFromCart = (itemId) => {
    try {
      const newCart = cart.filter(item => item.productId !== itemId);
      setCart(newCart);
      return true;
    } catch (error) {
      return false;
    }
  };
  const clearCart = (prop) => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, deleteFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}
