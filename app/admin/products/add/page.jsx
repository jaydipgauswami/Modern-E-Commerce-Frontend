"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function AddProduct() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    category_id: "",
    image: null,
  });

  const handleSubmit = async () => {
    if (!form.name || !form.price || !form.stock || !form.category_id || !form.image) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });

      const res = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to add product");

      toast.success("Product Added Successfully");
      router.push("/admin/products");
    } catch (err) {
      console.error(err);
      toast.error("Error adding product");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto mt-20">
      <Toaster />
      <Card className="shadow-lg rounded-2xl">
        <CardContent className="p-6 flex flex-col gap-4">
          <h2 className="text-xl font-bold">Add Product</h2>

          <Input
            placeholder="Product Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <Input
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />

          <Input
            type="number"
            placeholder="Stock"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
          />

          {/* Categories Dropdown */}
          <select
            className="border rounded px-3 py-2"
            value={form.category_id}
            onChange={(e) => setForm({ ...form, category_id: e.target.value })}
          >
            <option value="" disabled hidden>
    Select category_id
  </option>
            <option value="Electronics">Electronics</option>
            <option value="Clothing">Clothing</option>
            <option value="Beauty & Health">Beauty & Health</option>
          </select>

          {/* Image Upload */}
          <input
            type="file"
            onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
          />

          <Button onClick={handleSubmit}>Create Product</Button>
        </CardContent>
      </Card>
    </div>
  );
}