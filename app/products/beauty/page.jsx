"use client";
import Link from "next/link";
import { motion } from "framer-motion";



const beautyProducts = [
  { 
    id: 1, 
    name: "Skincare Kit", 
    price: "₹1,500", 
    img: "/images/skincare.jpg", 
    desc: "Complete skincare kit with cleanser, toner, and moisturizer for glowing skin." 
  },
  { 
    id: 2, 
    name: "Lipstick Set", 
    price: "₹900", 
    img: "/images/lipstik.jpg", 
    desc: "Set of vibrant lipsticks in long-lasting shades for all occasions." 
  },
  { 
    id: 3, 
    name: "Perfume", 
    price: "₹2,800", 
    img: "/images/perfyum.jpg", 
    desc: "Premium fragrance with a long-lasting scent to keep you fresh all day." 
  },
  { 
    id: 4, 
    name: "Vitamin Supplements", 
    price: "₹1,200", 
    img: "/images/vitamin.jpg", 
    desc: "Essential vitamin supplements for daily health and immunity support." 
  }];

 function Beauty() {
  return (
    <>

      <div className="max-w-7xl mx-auto px-4 py-35">
        <h1 className="text-3xl font-bold mb-6">Beauty & Health Products</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {beautyProducts.map((product) => (
             <Link
    href={`/products/beauty/${product.id}`} // Ye dynamic link hai
    key={product.id}
  >
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
             
            </motion.div>
  </Link>
            
         
          ))}
        </div>
      </div>
    </>
  );
}
export default Beauty;