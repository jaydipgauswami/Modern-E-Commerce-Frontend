"use client";
import { useCart } from "../../../../app/context/CartContext"
import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";


export default function ProductDetailClient({ product }) {
    const {addToCart} = useCart();

  const [quantity, setQuantity] = useState(1);
    const unitPrice = Number(product.price.replace(/[^0-9.-]+/g, ""));
  const totalPrice = unitPrice * quantity;

  const handleIncrement = () => setQuantity(quantity + 1);
  const handleDecrement = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };
   const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`${product.name} added to cart! ✅`); 
  };


  return (
    <div className="max-w-6xl mx-auto p-6 md:p-12 mt-10">
      <div className="flex flex-col md:flex-row gap-8 md:gap-16 mt-20">
        {/* Product Image */}
        <div className="md:w-1/2 flex justify-center items-center">
          <motion.img
            src={product.img}
            alt={product.name}
            className="rounded-xl shadow-lg object-cover w-full h-80 md:h-[28rem]"
            whileHover={{ scale: 1.05 }}
          />
        </div>

        {/* Product Info */}
        <div className="md:w-1/2 flex flex-col justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{product.name}</h1>
            <p className="text-2xl text-green-600 font-semibold mb-4">{product.price}</p>
            <p className="text-gray-700 mb-6">{product.desc}</p>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 mt-4"> 
                <p className="mt-4 text-xl font-semibold">Quantity
            <button
              onClick={handleDecrement}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              -
            </button>
            <span className="text-lg">{quantity}</span>
            <button
              onClick={handleIncrement}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              +
            </button>
            </p>
          </div>

          {/* Total Price */}
          <p className="mt-4 text-xl font-semibold">
            Total Price: ₹{totalPrice.toLocaleString()}
          </p>

            {/* Add to Cart Button */}
            <button   onClick={handleAddToCart } 
            className=" mt-10 px-6 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition w-full md:w-auto">
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* Additional Details / Description Section */}
      <div className="mt-20">
        <h2 className="text-2xl font-bold mb-10">Product Details</h2>
        <p className="text-gray-700 leading-relaxed">
          {product.desc} Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
          Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
      </div>
    </div>
  );
}