"use client";
import { useParams } from "next/navigation";
import BeautyDetailClient from "./ProductDetailClient";



const products = [
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

export default function ProductDetail() {
  const params = useParams();
  const id = Number(params.id);
  const product = products.find((p) => p.id === id);

  if (!product)
    return <h1 className="text-center mt-20 text-2xl">Product not found</h1>;

  return <BeautyDetailClient product={product} />;
}