
"use client";

import { motion } from "framer-motion";

 function Categories() {
  const categories = [
    {
      name: "Clothes",
      img: "https://images.unsplash.com/photo-1521334884684-d80222895322?w=400&auto=format&fit=crop&q=60",
    },
    {
      name: "Shoes",
      img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&auto=format&fit=crop&q=60",
    },
    {
      name: "Accessories",
      img: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&auto=format&fit=crop&q=60",
    },
    {
      name: "Bags",
      img: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&auto=format&fit=crop&q=60",
    },
    {
      name: "Electronics",
      img: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&auto=format&fit=crop&q=60",
    },
    {
      name: "Gadgets",
      img: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=400&auto=format&fit=crop&q=60",
    },
    {
      name: "Watches",
      img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&auto=format&fit=crop&q=60",
    },
  ];

  return (
    <section className="p-10 bg-gray-50">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
        Shop by Category
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((cat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="relative rounded-2xl overflow-hidden cursor-pointer group shadow-md"
          >
            {/* Image */}
            <img
              src={cat.img}
              alt={cat.name}
              className="w-full h-40 object-cover group-hover:scale-110 transition duration-500"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition"></div>

            {/* Text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <h3 className="text-white text-lg md:text-xl font-semibold tracking-wide group-hover:scale-110 transition">
                {cat.name}
              </h3>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
 export default Categories;
