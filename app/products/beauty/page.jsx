"use client";
import { motion } from "framer-motion";

const beautyProducts = [
  { id: 1, name: "Skincare Kit", price: "₹1,500", img: "/images/skincare.jpg" },
  { id: 2, name: "Lipstick Set", price: "₹900", img: "/images/lipstik.jpg" },
  { id: 3, name: "Perfume", price: "₹2,800", img: "/images/perfyum.jpg" },
  { id: 4, name: "Vitamin Supplements", price: "₹1,200", img: "/images/vitamin.jpg" },
];

 function Beauty() {
  return (
    <>

      <div className="max-w-7xl mx-auto px-4 py-35">
        <h1 className="text-3xl font-bold mb-6">Beauty & Health Products</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {beautyProducts.map((product) => (
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
export default Beauty;