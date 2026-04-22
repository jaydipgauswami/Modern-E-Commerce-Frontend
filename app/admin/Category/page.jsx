"use client";
import { useEffect, useState } from "react";
import { Toaster ,toast } from "sonner";
import { apiFetch } from "../../api/api"

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [editId, setEditId] = useState(null);
  const [editCategory, setEditCategory] = useState(null);
  
const [editName, setEditName] = useState("");


   
  useEffect(() => {
  apiFetch("http://localhost:5000/api/catagories")
    .then(data => {
      console.log(data);
      setCategories(data.categories || []);
    })
    .catch(err => {
      console.error(err.message);
    });
}, []);
 
 const handleSubmit = async () => {
  if (!name) return alert("Enter category name");

  try {
    const data = await apiFetch("http://localhost:5000/api/catagories", {
      method: "POST",
      body: JSON.stringify({ name }),
    });

    toast.success("Category added successfully");

    setName("");
    await fetchCategories();

  } catch (error) {
    toast.error(error.message || "Failed to add category");
  }
};


const handleUpdate = async () => {
  if (!editName) return toast.error("Enter category name");

  try {
    const data = await apiFetch(
      `http://localhost:5000/api/catagories/${editCategory.id}`,
      {
        method: "PUT",
        body: JSON.stringify({ name: editName }),
      }
    );

    toast.success("Category updated successfully");

    setEditCategory(null);
    setEditName("");
    await fetchCategories();

  } catch (error) {
    toast.error(error.message || "Failed to update category");
  }
};

 
const fetchCategories = async () => {
  try {
    const data = await apiFetch("http://localhost:5000/api/catagories");

    setCategories(data.categories || []);

  } catch (error) {
    console.error(error);
  }
};
   const handleDelete = async (id) => {
  try {
    await apiFetch(`http://localhost:5000/api/catagories/${id}`, {
      method: "DELETE",
    });

    toast.success("Category deleted successfully");

    await fetchCategories();

  } catch (error) {
    toast.error(error.message || "Failed to delete category");
  }
};

   const handleEdit = (cat) => {
  setEditCategory(cat);   // pura object store
  setEditName(cat.name);  // input me value
};


  
  return (
    <div className="p-6 ">
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

      {/*  Edit Form */}
      {editCategory && (
        <div className="mb-4 p-4 border rounded bg-gray-200">
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

      {/*  Category List */}
      <table className="w-full  border border-collapse">
        <thead>
          <tr className="bg-gray-200 pb-10  ">
            
            <th className="p-3 text-center">Name</th>
            <th className="p-3 text-center">Actions</th>
          </tr>
        </thead>

        <tbody >
          {Array.isArray(categories) &&
            categories.map((cat) => (
              <tr key={cat.id} className="text-center border border-gray-300">
                
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

                    className="bg-gray-400 px-2 py-1 rounded"                  >
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



