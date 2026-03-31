"use client"
import { useParams } from "next/navigation";
import FashionDetailClient from "./ProductDetailClient";

// ✅ Static product data (future me API fetch bhi ho sakta hai)
const products = [
  { id: 1, name: "Men's Jacket", price: "₹3,500", img: "/images/jackets.jpg", desc: "Stylish men's jacket, perfect for casual and formal wear."  },
  { id: 2, name: "Women Dress", price: "₹2,800", img: "/images/womendress.jpg", desc: "Elegant women's dress suitable for parties and events."  },
  { id: 3, name: "Sneakers", price: "₹4,200", img: "/images/snekers.jpg",  desc: "Comfortable sneakers ideal for daily wear and sports."  },
  { id: 4, name: "Watch", price: "₹6,500", img: "/images/watch.jpg",desc: "Classic analog watch with leather strap for a premium look."  },
];

export default  function FashionDetailPage() {
  const params = useParams();
   const id = Number(params.id);
   const product = products.find((p) => p.id === id);

  if (!product) {
    return <h1 className="text-center mt-20 text-2xl">Product not found</h1>;
  }

  return <FashionDetailClient product={product} />;
}