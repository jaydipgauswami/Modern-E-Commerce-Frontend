"use client";

import { useState } from "react";
import  Sidebar from "../../components/features/sidebar";
import ProductList from "@/components/features/productlist";

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  return (
    <div className="flex min-h-screen bg-gray-50">
      
      {/* Sidebar */}
     <Sidebar
  selectedCategory={selectedCategory}
  setSelectedCategory={setSelectedCategory}
/>

      {/* Mobile Sidebar handled inside component */}

      {/* Main Content */}
     <div className="flex-1 md:ml-64">
        
        {/* Header */}
        <div className="p-4 border-b bg-white flex justify-between items-center">
          <h1 className="text-xl font-semibold">Products</h1>
        </div>

        {/* Product List */}
        <ProductList selectedCategory={selectedCategory} />
      </div>
    </div>
  );
}