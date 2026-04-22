"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/context/CartContext";

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
 <div className="p-4">
      {/* Loading */}
      {loading && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="border p-3 rounded animate-pulse">
              <div className="h-40 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 mt-2"></div>
            </div>
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading && filtered.length === 0 && (
        <p className="text-center text-gray-500">No products found</p>
      )}

      {/* Grid */}
      {!loading && filtered.length > 0 && (
        <div className="grid grid-cols-sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((p) => (
            <div
              key={p.id}
              className="border rounded-xl p-3 shadow-sm hover:shadow-md transition"
            >
              {/* Click → detail page */}
              <div
                onClick={() => router.push(`/products/${p.id}`)}
                className="cursor-pointer"
              >
                <div className="h-40 bg-gray-100 rounded overflow-hidden">
                  <img
                    src={`http://localhost:5000/uploads/${p.image}`}
                    className="w-full h-full object-cover hover:scale-105 transition"
                  />
                </div>

                <h3 className="mt-2 font-semibold text-sm line-clamp-2">
                  {p.name}
                </h3>

                <p className="text-gray-500 text-sm">₹{p.price}</p>
              </div>

              {/* Actions */}
              <button
                onClick={() => addToCart(p, 1)}
                className="mt-3 w-full bg-black text-white py-1.5 rounded hover:bg-gray-800 text-sm"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}