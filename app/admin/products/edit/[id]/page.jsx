"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast, { Toaster } from "react-hot-toast";

export default function EditProduct() {
  const { id } = useParams();
  const router = useRouter();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    category_id: "",
    image: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        //  Fetch single product (best practice)
        const productRes = await fetch(`http://localhost:5000/api/products/${id}`);
        const productData = await productRes.json();

        setForm({
          name: productData.name || "",
          price: productData.price || "",
          stock: productData.stock || "",
          category_id: productData.category_id || "",
          image: null, // don't preload image file
        });

        //  Fetch categories
        const catRes = await fetch("http://localhost:5000/api/categories");
        const catData = await catRes.json();
        setCategories(catData);

      } catch (error) {
        console.error(error);
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  const handleUpdate = async () => {
    try {
      const formData = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        if (value !== null && value !== "") {
          formData.append(key, value);
        }
      });

      const res = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Update failed");
      }

      toast.success("Product Updated Successfully");
      router.push("/admin/products");
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Update failed");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto mt-15">
      <Toaster />

      <Card className="shadow-lg rounded-2xl">
        <CardContent className="p-6 flex flex-col gap-4">
          <h2 className="text-xl font-bold">Edit Product</h2>

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

          <select
            className="border rounded px-3 py-2"
            value={form.category_id}
            onChange={(e) => setForm({ ...form, category_id: e.target.value })}
          >
            <option value="" disabled hidden>Select category_id</option>
             <option value="Electronics">Electronics</option>
            <option value="Clothing">Clothing</option>
            <option value="Beauty & Health">Beauty & Health</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

          <input
            type="file"
            onChange={(e) =>
              setForm({ ...form, image: e.target.files[0] })
            }
          />

          <Button onClick={handleUpdate}>Update Product</Button>
        </CardContent>
      </Card>
    </div>
  );
}
