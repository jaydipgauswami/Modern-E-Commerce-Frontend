"use client";

import { createContext, useState, useContext, useEffect } from "react";
import { toast } from "sonner";
import { message } from "antd";
import { useRouter } from "next/navigation";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const router = useRouter();

  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

const clearCart = () => {
  setCartItems([]);
};

const clearWishlist = () => {
  setWishlistItems([]);
};

  const getCart = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setCartItems(data.carts || []);
      }
    } catch (err) {
      console.error("Get cart error:", err);
    }
  };

  const addToCart = async (product, quantity = 1) => {
     const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:5000/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          product_id: product.id,
          quantity,
        }),
      });

      const data = await res.json();

      if (res.ok) {
       toast.success( data.message, {
  action: {
    label: "View Cart",
    onClick: () => router.push("/cart"),
  },
});
       await getCart();
      } else {
        toast.error(data.message || "Failed to add cart");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const updateQuantity = async (productId, quantity) => {
     const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `http://localhost:5000/api/cart/${productId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ quantity }),
        }
      );
         const data = await res.json();

      if (res.ok) {
               message.success(data.message)
     await   getCart();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const removeFromCart = async (productId) => {
     const token = localStorage.getItem("token");
    try {
      const res = await fetch(

        `http://localhost:5000/api/cart/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();

      if (res.ok) {
        toast.success(data.message);
     await   getCart();
      }
    } catch (err) {
      console.error(err);
    }
  };
  const getWishlist = async () => {
     const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:5000/api/wishlist", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      if (res.ok) {
        setWishlistItems(data.wishlist || []);
      }
    } catch (err) {
      console.error("Get wishlist error:", err);
    }
  };
  const addToWishlist = async (product) => {
     const token = localStorage.getItem("token");
     const productId = product.product_id || product.id;
    try {
      const res = await fetch("http://localhost:5000/api/wishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
        product_id: productId,
      }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message, {
  action: {
    label: "View wishlist",
    onClick: () => router.push("/wishlist"),
  },
});
      await  getWishlist();
      } else {
        toast.error(data.message || "Failed wishlist");
      }
    } catch (err) {
      console.error(err);
    }
  };
  const removeFromWishlist = async (productId) => {
     const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `http://localhost:5000/api/wishlist/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.ok) {
        message.success("Removed from wishlist");
       await getWishlist();
      }
    } catch (err) {
      console.error(err);
    }
  };
const handleWishlist = async (product) => {
  const productId =
    typeof product === "object"
      ? product.product_id || product.id
      : product;

  const exists = wishlistItems.find(
    (item) =>
      Number(item.product_id || item.id) === Number(productId)
  );

  if (exists) {
    await removeFromWishlist(productId);
  } else {
    await addToWishlist(
      typeof product === "object"
        ? product
        : { product_id: productId }
    );
  }
};

  const handleBuyNow = (product) => {
    router.push("/checkout");
  };
  useEffect(() => {
    if (token) {
      getCart();
      getWishlist();
    }
  }, []);
  return (
    <CartContext.Provider
      value={{
        clearCart,
        clearWishlist,
        cartItems,
        wishlistItems,
        addToCart,
        getCart,
        updateQuantity,
        removeFromCart,
        getWishlist,
        addToWishlist,
        removeFromWishlist,
        handleWishlist,
        handleBuyNow,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
export const useCart = () => useContext(CartContext);