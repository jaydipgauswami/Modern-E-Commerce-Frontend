"use client";

import { motion } from "framer-motion";
import Image from "next/image";

// Example product data (tumhare image URLs ke saath)
const products = [
  {
    id: 1,
    name: "Laptop Pro 15",
    price: "₹75,000",
    img: "/images/laptop.jpg",
  },
  {
    id: 2,
    name: "Smartphone X",
    price: "₹45,000",
    img: "/images/smartphone.jpg",
  },
  {
    id: 3,
    name: "Smartwatch Series 9",
    price: "₹20,000",
    img: "/images/smartwatch.jpg",
  },
  { 
    id: 4,
    name: "Wireless Headphones",
    price: "₹10,500",
    img: "/images/headphone.jpg",
  },
];

export default function Electronics() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-26">
      {/* Page Heading */}
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-10 text-center">
        Electronics Products
      </h1>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <motion.div
            key={product.id}
            className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer border border-gray-100 hover:shadow-2xl transition-shadow duration-300 flex flex-col"
            whileHover={{ scale: 1.05 }}
          >
            {/* Product Image */}
            <div className="relative w-full h-60 md:h-64 lg:h-72">
              <Image
                src={product.img}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>

            {/* Product Info */}
            <div className="p-5 flex flex-col flex-grow justify-between">
              <div>
                <h3 className="text-lg md:text-xl font-semibold text-gray-800">
                  {product.name}
                </h3>
                <p className="text-gray-500 mt-2 md:mt-3">{product.price}</p>
              </div>

              {/* Add to Cart Button */}
              <button className="mt-4 w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition-colors">
                Add to Cart
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}