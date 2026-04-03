"use client";
import { createContext, useState, useContext } from "react";

// Cart Context create
const CartContext = createContext();

//  Provider Component
export const CartProvider  = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Add to cart function
 const addToCart = (product, quantity = 1) => {
  const cleanPrice = Number(product.price.toString().replace(/[^0-9.-]+/g, ""));

  setCartItems(prevCart => {
    // find exact match by id + options (like size, color)
    const exist = prevCart.find(item => item.id === product.id && item.size === product.size);

    if (exist) {
      return prevCart.map(item =>
        item.id === product.id && item.size === product.size
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
    const cleanPrice = Number(product.price.toString().replace(/[^0-9.-]+/g, ""));
      return [...prevCart, { ...product, price: cleanPrice, quantity }];
    }
  });
};
  const updateQuantity = (id, quantity) => {
  setCartItems(
    cartItems.map((item) =>
      item.id === id ? { ...item, quantity: quantity } : item
    )
  );
};

  // Remove from cart (optional)
  const removeFromCart = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart,updateQuantity }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);