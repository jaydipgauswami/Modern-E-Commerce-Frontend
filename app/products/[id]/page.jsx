"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ProductDetailClient from "./productdetail";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/products/${id}`
        );
        const data = await res.json();

        console.log("API RESPONSE:", data);

        setProduct(data.product);
      } catch (err) {
        console.log(err);
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) {
    return <p className="text-center mt-20">Loading...</p>;
  }

  return <ProductDetailClient product={product} />;
}