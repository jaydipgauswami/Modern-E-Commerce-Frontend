"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/context/CartContext";
import { motion } from "framer-motion";

export default function ProductList({ selectedCategory }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const { addToCart } = useCart();

 useEffect(() => {
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        "http://localhost:5000/api/products/getproducts"
      );
      const data = await res.json();
      setProducts(data.products || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  fetchProducts();
}, [selectedCategory]);

  const filtered =
    selectedCategory === "all"
      ? products
      : products.filter(
          (p) => Number(p.category_id) === Number(selectedCategory)
        );
return (
  
<motion.div
  initial="hidden"
  animate="show"
  variants={{
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.08
      }
    }
  }}
  className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
>
  
  {filtered.map((p) => (
    <motion.div
      key={p.id}
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
      }}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 1.0 }}
      className="bg-white border rounded-xl shadow-sm hover:shadow-xl overflow-hidden"
    >
      

      {/* Image */}
      <div
        onClick={() => router.push(`/products/${p.id}`)}
        className="cursor-pointer w-full h-40 overflow-hidden"
      >
        <motion.img
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.4 }}
          src={`http://localhost:5000/uploads/${p.image}`}
          className="w-full h-44 object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-3">

        <h3 className="font-semibold text-sm line-clamp-2 min-h-40px">
          {p.name}
        </h3>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-green-600 font-bold mt-1"
        >
          ₹{p.price}
        </motion.p>

        {/* Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => addToCart(p, 1)}
          className="mt-3 w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition text-sm"
        >
          Add to Cart
        </motion.button>

      </div>
    </motion.div>
  ))}
</motion.div>
);
}