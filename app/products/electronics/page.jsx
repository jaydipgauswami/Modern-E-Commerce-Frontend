"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

// Example product data (tumhare image URLs ke saath)
const products = [
  {
    id: 1,
    name: "Laptop Pro 15",
    price: "₹75,000",
    desc: "High performance laptop for work and gaming.",
    img: "/images/laptop.jpg",
  },
  {
    id: 2,
    name: "Smartphone X",
    price: "₹45,000",
    desc: "Latest smartphone with powerful camera.",
    img: "/images/smartphone.jpg",
  },
  {
    id: 3,
    name: "Smartwatch Series 9",
    price: "₹20,000",
    desc: "Keep track of your health and notifications.",
    img: "/images/smartwatch.jpg",
  },
  { 
    id: 4,
    name: "Wireless Headphones",
    price: "₹10,500",
       desc: "High-quality wireless headphones with deep bass, comfortable fit, and long-lasting battery life for all-day listening.",

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
  <Link
    href={`/products/electronics/${product.id}`} // Ye dynamic link hai
    key={product.id}
  >
    <motion.div
      className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer border border-gray-100 hover:shadow-2xl transition-shadow duration-300 flex flex-col"
      whileHover={{ scale: 1.05 }}
    >
      <div className="relative w-full h-60 md:h-64 lg:h-72">
        <Image src={product.img} alt={product.name} fill className="object-cover" />
      </div>
      <div className="p-5 flex flex-col flex-grow justify-between">
        <h3>{product.name}</h3>
        <p>{product.price}</p>
      </div>
    </motion.div>
  </Link>
))}
      </div>
    </div>
  );
}