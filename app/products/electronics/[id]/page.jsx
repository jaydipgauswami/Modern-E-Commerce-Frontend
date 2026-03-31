"use client";
import { useParams } from "next/navigation";
import ProductDetailClient from "./ProductDetailClient";

const products = [
  { id: 1, name: "Laptop Pro 15", price: "₹75,000", desc: "High performance laptop for work and gaming.", img: "/images/laptop.jpg" },
  { id: 2, name: "Smartphone X", price: "₹45,000", desc: "Latest smartphone with powerful camera.", img: "/images/smartphone.jpg" },
  { id: 3, name: "Smartwatch Series 9", price: "₹20,000", desc: "Keep track of your health and notifications.", img: "/images/smartwatch.jpg" },
  { id: 4, name: "Wireless Headphones", price: "₹10,500", desc: "High-quality wireless headphones with deep bass and comfortable fit.", img: "/images/headphone.jpg" },
];

export default function ProductDetail() {
  const params = useParams();
  const id = Number(params.id);
  const product = products.find((p) => p.id === id);

  if (!product)
    return <h1 className="text-center mt-20 text-2xl">Product not found</h1>;

  return <ProductDetailClient product={product} />;
}