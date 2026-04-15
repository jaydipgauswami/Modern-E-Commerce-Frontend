"use client";
import { useEffect, useState } from "react";
import { Toaster ,toast } from "sonner";


export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [editId, setEditId] = useState(null);
  const [editCategory, setEditCategory] = useState(null);
  
const [editName, setEditName] = useState("");


    useEffect(() => {
      const token = localStorage.getItem("token");
    fetch("http://localhost:5000/api/catagories" , {
        headers: {
    Authorization: `Bearer ${token}`,
  },
    })
      .then(res => res.json())
      
      .then(data => {
        console.log(data)
         setCategories(data.categories)
       });
  }, []);
 

 const handleSubmit = async () => {
  const token = localStorage.getItem("token");

  if (!name) return alert("Enter category name");

 try{
   const res = await fetch("http://localhost:5000/api/catagories", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name }),
  });
    if (!res.ok) throw new Error();
      toast.success("Category added successfully ");
    setName("");
 await fetchCategories();
 }catch(error){
  toast.error("Failed to add category ");
 }

  
};

const handleUpdate = async () => {
  const token = localStorage.getItem("token");

  if (!editName) return toast.error("Enter category name");

try{
 const res =  await fetch(`http://localhost:5000/api/catagories/${editCategory.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name: editName }),
  });
   if (!res.ok) throw new Error();
      toast.success("Category update successfully ");

  setEditCategory(null);
  setEditName("");
 await fetchCategories();
}catch(error){
 toast.error("Failed to update category");
}
};

    const fetchCategories = async () => {
    const res = await fetch("http://localhost:5000/api/catagories");
    const data = await res.json();
     setCategories(data.categories);
  };

    const handleDelete = async (id) => {
  const token = localStorage.getItem("token");

  try{
 const res =  await fetch(`http://localhost:5000/api/catagories/${id}`, {
      method: "DELETE",
       headers: {
    Authorization: `Bearer ${token}`,
  },
    });
     if (!res.ok) throw new Error();
      toast.success("Category delete successfully ");
   await fetchCategories();
  }catch(error){
toast.error("Failed to delete category");
  }
  };

   const handleEdit = (cat) => {
  setEditCategory(cat);   // pura object store
  setEditName(cat.name);  // input me value
};


  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Categories</h1>

      {/* 🔥 Add Category */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Enter category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded w-64"
        />
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </div>

      {/* 🔥 Edit Form */}
      {editCategory && (
        <div className="mb-4 p-4 border rounded bg-gray-100">
          <h2 className="mb-2 font-bold">Edit Category</h2>

          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            className="border p-2 rounded mr-2"
          />

          <button
            onClick={handleUpdate}
            className="bg-green-500 text-white px-3 py-1 rounded mr-2"
          >
            Update
          </button>

          <button
            onClick={() => setEditCategory(null)}
            className="bg-gray-400 px-3 py-1 rounded"
          >
            Cancel
          </button>
        </div>
      )}

      {/* 🔥 Category List */}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200 pb-10">
            
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {Array.isArray(categories) &&
            categories.map((cat) => (
              <tr key={cat.id} className="text-center border-t ">
                
                <td>{cat.name}</td>
                <td className="space-x-2 p-7">
                  <button
                    onClick={() => handleEdit(cat)}
                    className="bg-gray-400 px-2 py-1 rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}



