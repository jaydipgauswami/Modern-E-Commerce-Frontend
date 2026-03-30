"use client";

import { motion } from "framer-motion";

export default function FeaturedProducts() {
  const products = [
    {
      name: "Nike Shoes",
      price: "₹2999",
      img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&auto=format&fit=crop&q=60",
    },
    {
      name: "Smart Watch",
      price: "₹1999",
      img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&auto=format&fit=crop&q=60",
    },
    {
      name: "Headphones",
      price: "₹1499",
      img: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8aGVhZHBob25lc3xlbnwwfHwwfHx8MA%3D%3D",
    },
  ];

  return (
    <section className="p-10 bg-white">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
        Featured Products
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {products.map((product, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            viewport={{ once: true }}
            className="bg-gray-50 rounded-2xl shadow-md overflow-hidden group"
          >
            {/* Image */}
            <div className="overflow-hidden">
              <img
                src={product.img}
                alt={product.name}
                className="w-full h-56 object-cover group-hover:scale-110 transition duration-500"
              />
            </div>

            {/* Content */}
            <div className="p-5">
              <h3 className="text-lg font-semibold mb-2">
                {product.name}
              </h3>

              <p className="text-gray-600 mb-4">{product.price}</p>

              <button className="w-full py-2 bg-black text-white rounded-xl hover:bg-gray-800 hover:scale-105 transition duration-300">
                Add to Cart
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
