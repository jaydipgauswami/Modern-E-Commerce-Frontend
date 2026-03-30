"use client";
import { motion } from "framer-motion";

const fashionProducts = [
  { id: 1, name: "Men's Jacket", price: "₹3,500", img: "/images/jackets.jpg" },
  { id: 2, name: "Women Dress", price: "₹2,800", img: "/images/womendress.jpg" },
  { id: 3, name: "Sneakers", price: "₹4,200", img: "/images/snekers.jpg" },
  { id: 4, name: "Watch", price: "₹6,500", img: "/images/watch.jpg" },
];

 function Fashion() {
  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-33">
        <h1 className="text-3xl font-bold mb-6">Fashion Products</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {fashionProducts.map((product) => (
            <motion.div
              key={product.id}
              className="bg-white rounded-lg shadow-lg p-4 cursor-pointer hover:shadow-xl transition-shadow"
              whileHover={{ scale: 1.05 }}
            >
              <img
                src={product.img}
                alt={product.name}
                className="w-full h-70 object-cover rounded-md mb-4"
              />
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="text-gray-500">{product.price}</p>
              <button className="mt-3 w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition-colors">
                Add to Cart
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      
    </>
  );
}
export default Fashion;