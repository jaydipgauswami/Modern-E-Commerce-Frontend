"use client";
import { toast } from "sonner";
import { createContext, useState, useContext, useEffect } from "react";
import { message } from "antd";
 
// Cart Context create
const CartContext = createContext();

// Provider Component
export const CartProvider = ({ children }) => {
 
  
  const [cartItems, setCartItems] = useState([]);
   const [wishlistItems, setWishlistItems] =
  useState([]);
  useEffect(() => {
    const saveCart = localStorage.getItem("cart");
    if (saveCart) {
      setCartItems(JSON.parse(saveCart));
    }
  }, []);
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);
  

  // Add to cart function
  const addToCart = (product, quantity = 1) => {
    const cleanPrice = Number(
      product.price.toString().replace(/[^0-9.-]+/g, ""),
    );

    setCartItems((prevCart) => {
      const exist = prevCart.find(
        (item) => item.id === product.id && item.size === product.size,
      );

      let updatedCart;

      if (exist) {
        updatedCart = prevCart.map((item) =>
          item.id === product.id && item.size === product.size
            ? {
                ...item,
                quantity: item.quantity + quantity,
              }
            : item,
        );

        toast.success("Quantity updated");
      } else {
        updatedCart = [
          ...prevCart,
          {
            ...product,
            price: cleanPrice,
            quantity,
          },
        ];

        toast.success("Product added to cart");
      }
      return updatedCart;
    });
  };

  // Update quantity
  const updateQuantity = (id, quantity) => {
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item)),
    );
  };

  // Remove from cart
  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleWishlist = (product) => {
  const exists = wishlistItems.find(
    (item) => item.id === product.id
  );

  if (exists) {
    setWishlistItems(
      wishlistItems.filter(
        (item) => item.id !== product.id
      )
    );

    message.warning(
      "Removed from Wishlist"
    );
  } else {
    setWishlistItems([
      ...wishlistItems,
      product,
    ]);

    message.success(
      "Added to Wishlist"
    );
  }
};
  



  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
          wishlistItems,
setWishlistItems,
        handleWishlist,
    
      }}
    >
      {children}
    </CartContext.Provider>
  ); 
};

export const useCart = () => useContext(CartContext);
