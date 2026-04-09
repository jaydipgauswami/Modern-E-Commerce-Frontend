"use client";

import { useState, useMemo, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toaster ,toast } from "sonner";
import { parseJwt, isTokenExpired, refreshToken } from '../../utils/auth';
import {
  Table, TableHeader, TableRow, TableHead, TableBody, TableCell
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle
} from "@/components/ui/dialog";



const PAGE_SIZE = 5;

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  // const [editing, setEditing] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
   const [files, setFile] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [page, setPage] = useState(1);

  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    category_id: "",
    image: null
  });

  // Fetch Products with search/category_id
  const fetchProducts = async () => {
  try {
    console.log("CATEGORY FILTER:", categoryFilter);

    let url = `http://localhost:5000/api/products/getproducts?search=${search}&page=${page}&limit=${PAGE_SIZE}`;

   
    if (categoryFilter) {
      url += `&category_id=${categoryFilter}`;
    }

    const res = await fetch(url);
    const data = await res.json();
     console.log("FINAL URL:", url);

    if (data.success) {
      setProducts(data.products);
    } else {
      setProducts([]);
    }
  } catch {
    toast.error("Failed to load products");
  }
};
  // Fetch Categories
  const fetchCategories = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/catagories");
      const data = await res.json();
       console.log("API RESPONSE:", data);
      setCategories(data.categories);
    } catch {
      toast.error("Failed to load categories");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Refetch products when search, filter, or page changes
  useEffect(() => {
    fetchProducts();
  }, [search, categoryFilter, page]);

  // Pagination calculation
  const totalPages = Math.ceil(products.length / PAGE_SIZE);
  const paginatedProducts = useMemo(() => {
    return products.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  }, [products, page]);

  // Add / Update Product
 const handleSubmit = async () => {
  try {
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("price", form.price);
    formData.append("stock", form.stock);
    formData.append("category_id", form.category_id);

    if (form.image) {
      formData.append("image", form.image);
    }

    const url = isEditMode
      ? `http://localhost:5000/api/products/${editId}`
      : "http://localhost:5000/api/products";

    const method = isEditMode ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await res.json();

    if (res.ok) {
      toast.success(isEditMode ? "Product Updated" : "Product Added");

      setOpen(false);
      setIsEditMode(false);
      setEditId(null);

      setForm({
        name: "",
        price: "",
        stock: "",
        category_id: "",
        image: null
      });

      setFile(null);
      fetchProducts();
    } else {
      toast.error(data.message || "Failed");
    }
  } catch (err) {
    console.log(err);
    toast.error("Something went wrong");
  }
};
  // Delete
 const handleDelete = async (id) => {
  try {
    let token = localStorage.getItem("token");

    // Token expired? Refresh karo
    if (isTokenExpired(token)) {
      console.log("Token expired, refreshing...");
      token = await refreshToken();
      if (!token) return; // refresh fail → login page redirect
    }

    // DELETE request
    const res = await fetch(`http://localhost:5000/api/products/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const data = await res.json();
      toast.error(data.message || "Delete failed");
      return;
    }

    toast.success("Product Deleted");
    fetchProducts();
  } catch (err) {
    console.error(err);
    toast.error("Delete failed");
  }
};

const handleAddNew = () => {
  setIsEditMode(false);
  setEditId(null);

  setForm({
    name: "",
    price: "",
    stock: "",
    category_id: "",
    image: null
  });

  setOpen(true);
};
 const handleEdit = (product) => {
  setIsEditMode(true);
  setEditId(product.id);

  setForm({
    name: product.name,
    price: product.price,
    stock: product.stock,
    category_id: product.category_id,
    image: null
  });

  setOpen(true);
};

  const handleImageUpload = (e) => {
    setForm({ ...form, image: e.target.files[0]});
  };

  return (
    <div className="p-6">
      <Toaster position="top-right" />

      <div className="flex justify-between items-center mb-4 mt-25">
        <h1 className="text-2xl font-bold">Product Management</h1>
       <Button onClick={handleAddNew}>Add Product</Button>
      </div>

      {/* Search + Filter */}
      <div className="flex gap-4 mb-4">
        <Input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border rounded px-3 py-2"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
         <option value="">All</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <Card>
        <CardContent className="p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>category_id</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {paginatedProducts.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    {p.image && (
                      <img
                        src={`http://localhost:5000/uploads/${p.image}`}
                        className="w-12 h-12 object-cover rounded"
                      />
                    )}
                  </TableCell>
                  <TableCell>{p.name}</TableCell>
                  <TableCell>{p.category_id}</TableCell>
                  <TableCell>₹{p.price}</TableCell>
                  <TableCell className={p.stock < 5 ? "text-red-500 font-bold" : ""}>{p.stock}</TableCell>
                  <TableCell className="flex gap-2">
                    <Button onClick={() => handleEdit(p)}>Edit</Button>
                    <Button onClick={() => handleDelete(p.id)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-2 mt-4">
            <Button onClick={() => setPage(prev => prev - 1)} disabled={page === 1}>Prev</Button>
            {Array.from({ length: totalPages }, (_, i) => (
              <Button
                key={i}
                onClick={() => setPage(i + 1)}
                variant={page === i + 1 ? "default" : "outline"}
              >
                {i + 1}
              </Button>
            ))}
            <Button onClick={() => setPage(prev => prev + 1)} disabled={page === totalPages}>Next</Button>
          </div>
        </CardContent>
      </Card>

      {/* Add / Edit Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Edit Product" : "Add Product"}</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-3">
            <Input
              placeholder="Product Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <Input
              placeholder="Price"
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />
            <Input
              placeholder="Stock"
              type="number"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
            />

            <select
              className="border rounded px-3 py-2"
              value={form.category_id}
              onChange={(e) => setForm({ ...form, category_id: e.target.value })}
            >
              <option value="" disabled hidden>Select category_id</option>
              
             {categories?.map((c) => (
  <option key={c.id} value={c.id}>
    {c.name}
  </option>
))}
            </select>

            <input type="file" onChange={handleImageUpload} />

            <Button onClick={handleSubmit}>{isEditMode ? "Update" : "Create"}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}