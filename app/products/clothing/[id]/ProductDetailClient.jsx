"use client";
import { useCart } from "../../../../app/context/CartContext"
import { useState } from "react";
import toast from "react-hot-toast";


export default function FashionDetailClient({ product }) {
    const {addToCart} = useCart();

  const [quantity, setQuantity] = useState(1);
  const unitPrice = Number(product.price.replace(/[^0-9.-]+/g, ""));
  const totalPrice = unitPrice * quantity;
   const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`${product.name} added to cart! ✅`); 
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-24 md:py-30">
      <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-start mt-20">

        {/* Product Image */}
       <div className="w-full md:w-1/2">
  <img
    src={product.img}
    alt={product.name}
    className="w-full h-[400px] md:h-[500px] object-cover rounded-lg shadow-md"
  />
</div>

        {/* Product Details */}
        <div className="w-full md:w-1/2 flex flex-col gap-4">
          <h1 className="text-3xl md:text-4xl font-bold">{product.name}</h1>
            <p className="text-2xl text-green-600 font-semibold mb-4">{product.price}</p>
          <p className="text-gray-600 text-base md:text-lg">{product.desc}</p>

          {/* Quantity Selector */}
          <div className="flex items-center gap-4 mt-4">
              <p className="mt-4 text-xl font-semibold">Quantity
            <button
              onClick={() => quantity > 1 && setQuantity(quantity - 1)}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
            >
              -
            </button>
            <span className="text-lg md:text-xl font-medium">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
            >
              +
            </button>
            </p>
          </div>

          {/* Total Price */}
          <p className="mt-4 text-xl md:text-2xl font-semibold">
            Total Price: ₹{totalPrice.toLocaleString()}
          </p>

          {/* Add to Cart */}
          <button  onClick={handleAddToCart} 
          className="mt-4 px-6 py-3 w-max bg-black text-white rounded-lg hover:bg-gray-800 transition">
            Add to Cart
          </button>
        </div>
      </div>

      <div className="mt-20 mb-10 ">
        <h2 className="text-2xl font-bold mb-10">Product Details</h2>
        <p className="text-gray-700 leading-relaxed">
          {product.desc} Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
          Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
      </div>
    </div>
  );
}