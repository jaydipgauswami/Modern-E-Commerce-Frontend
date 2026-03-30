"use client";

import { motion } from "framer-motion";


export default function Hero() {
  return (
    <section className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-white to-gray-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">

        {/* Left Content */}
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-extrabold leading-tight"
          >
            Discover Premium <br />
            <span className="text-black relative inline-block">
              Products
              <span className="absolute left-0 bottom-0 w-full h-1 bg-black scale-x-0 origin-left transition-transform duration-500 hover:scale-x-100"></span>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mt-6 text-gray-600 text-lg"
          >
            Explore high-quality collections with modern design, smooth
            experience and fast delivery.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-8 flex gap-4"
          >
            <button className="px-6 py-3 bg-black text-white rounded-xl shadow-md hover:scale-105 hover:bg-gray-800 transition duration-300">
              Shop Now
            </button>

            <button className="px-6 py-3 border rounded-xl hover:bg-gray-100 hover:scale-105 transition duration-300">
              Explore
            </button>
          </motion.div>
        </div>

        {/* Right Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <img
            src="https://images.unsplash.com/photo-1523275335684-37898b6baf30"
            alt="product"
            className="rounded-2xl shadow-2xl hover:scale-105 transition duration-500"
          />

          {/* Floating effect */}
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-black/10 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-black/10 rounded-full blur-2xl animate-pulse"></div>
        </motion.div>
      </div>
    </section>
  );
}
