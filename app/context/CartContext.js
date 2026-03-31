"use client";
import { createContext, useState, useContext } from "react";

// 1️⃣ Cart Context create
const CartContext = createContext();

// 2️⃣ Provider Component
export const CartProvider  = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Add to cart function
  const addToCart = (product,quantity = 1) => {
    // Check if product already in cart
    const exist = cartItems.find((item) => item.id === product.id);
    if (exist) {
      // Agar product already hai to quantity increase
      setCartItems(
        cartItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity}
            : item
        )
      );
    } else {
      // Naya product add karo
      setCartItems([...cartItems, { ...product, quantity}]);
    }
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

// 3️⃣ Custom hook for easy use
export const useCart = () => useContext(CartContext);