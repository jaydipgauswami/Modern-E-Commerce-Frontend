"use client";
import { motion } from "framer-motion";
import Link from "next/link";

const fashionProducts = [
  { id: 1, name: "Men's Jacket", price: "₹3,500", img: "/images/jackets.jpg", desc: "Stylish men's jacket, perfect for casual and formal wear."  },
  { id: 2, name: "Women Dress", price: "₹2,800", img: "/images/womendress.jpg", desc: "Elegant women's dress suitable for parties and events."  },
  { id: 3, name: "Sneakers", price: "₹4,200", img: "/images/snekers.jpg",  desc: "Comfortable sneakers ideal for daily wear and sports."  },
  { id: 4, name: "Watch", price: "₹6,500", img: "/images/watch.jpg",desc: "Classic analog watch with leather strap for a premium look."  },
];

 function Fashion() {
  return (
    
      <div className="max-w-7xl mx-auto px-4 py-33">
        <h1 className="text-3xl font-bold mb-6">Fashion Products</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {fashionProducts.map((product) => (  
            
            <motion.div
              key={product.id}
              className="bg-white rounded-lg shadow-lg p-4 cursor-pointer hover:shadow-xl transition-shadow"
              whileHover={{ scale: 1.05 }}
            >
                   <Link href={`/products/clothing/${product.id}`} className="flex flex-col">
                    <img
                src={product.img}
                alt={product.name}
                className="w-full h-70 object-cover rounded-md mb-4"
              />
              <h3 className="text-lg font-semibold">{product.name}</h3></Link>
             
              <p className="text-gray-500">{product.price}</p>
            
            </motion.div>
          ))}
        </div>
      </div>

      
    
  );
}
export default Fashion;