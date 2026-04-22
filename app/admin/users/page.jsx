"use client";

import { useEffect, useState, useMemo } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const API_URL = "http://localhost:5000/api/admin/users";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [selectedUsers, setSelectedUsers] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "User",
    status: "Active",
  });

  const [loading, setLoading] = useState(false);

  const handleAuthError = (res) => {
  if (res.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "/login";
    return true;
  }
  return false;
};

  // 🔹 Fetch Users
  const fetchUsers = async () => {
    try {
          const token = localStorage.getItem("token");

      const res = await fetch(API_URL,{
         method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      });
      if (handleAuthError(res)) return;
      const data = await res.json();
        if (!res.ok) {
      throw new Error(data.message || "Failed to fetch users");
    }
      setUsers(data.users || data);
    } catch (err) {
      toast.error("Failed to fetch users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 🔹 Filtered Users (UI only)
 const filteredUsers = useMemo(() => {
  return users
    .filter((u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    )
   .filter((u) => {
  if (roleFilter === "all") return true;
  return (u.role || "").trim().toLowerCase() === roleFilter.toLowerCase();
})
    .filter((u) => {
         
      if (statusFilter === "all") return true;
      return (u.status || "").toLowerCase() === statusFilter.toLowerCase();
    });
}, [users, search, roleFilter, statusFilter]);

  //  Checkbox
  const toggleSelect = (id) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map((u) => u.id));
    }
  };

  //  Open Add/Edit Modal
  const openAddModal = () => {
    setForm({ name: "", email: "", password: "", role: "User", status: "Active" });
    setEditId(null);
    setModalOpen(true);
  };

  const openEditModal = (user) => {
    setForm({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
      status: user.status,
    });
    setEditId(user.id);
    setModalOpen(true);
  };

  // add user 
  const addUser = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });
      if (handleAuthError(res)) return;


    const data = await res.json();

    if (!res.ok) throw new Error(data.message);

    toast.success("User created successfully");
    setModalOpen(false);
    fetchUsers();
  
  } catch (err) {
    toast.error(err.message || "Failed to create user");
  }
};
// update user 

const updateUser = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_URL}/${editId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });
      if (handleAuthError(res)) return;


    const data = await res.json();

    if (!res.ok) throw new Error(data.message);

    toast.success("User updated successfully");
    setModalOpen(false);
    setEditId(null);
    fetchUsers();

  } catch (err) {
    toast.error(err.message || "Failed to update user");
  }
};
const handleSubmit = (e) => {
  e.preventDefault();
//  console.log("editId at submit:", editId);
  if (editId) {
    updateUser();
  } else {
    addUser();
  }
};
  // Delete User
  const deleteUser = async (id) => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
      if (handleAuthError(res)) return;


    const data = await res.json();

    //  IMPORTANT: check response
    if (!res.ok) {
      throw new Error(data.message || "Unauthorized or failed");
    }

    toast.success("User deleted successfully");
    fetchUsers();

  } catch (err) {
    toast.error(  err.message || "Delete failed" );
  }
};
const handleBlockUser = async (user) => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `http://localhost:5000/api/users/${user.id}/block`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          is_blocked: !user.is_blocked, // toggle
        }),
      }
    );
     if (handleAuthError(res)) return;

    const data = await res.json();
     if (!res.ok) {
      throw new Error(data.message || "Unauthorized or failed");
    }

    toast.success("User Blocked successfully");
    fetchUsers();
  } catch (error) {
     toast.error(  err.message || "Blocked  failed" );
  }
};

  // 🔹 Bulk Delete
  const deleteSelected = async () => {
  try {
    if (!selectedUsers || selectedUsers.length === 0) {
      toast.error("No users selected");
      return;
    }

    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:5000/api/admin/users/bulk", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ids: selectedUsers,
        action: "delete",
      }),
    });
      if (handleAuthError(res)) return;


    const data = await res.json();

    //  IMPORTANT: check response
    if (!res.ok) {
      throw new Error(data.message || "Bulk delete failed");
    }

    toast.success(data.message || "Selected users deleted");

    setSelectedUsers([]);
    fetchUsers();

  } catch (err) {
    toast.error(err.message || "Something went wrong");
  }
};

  const badge = (type, value) => {
    const base = "px-2 py-1 rounded-full text-xs font-medium";
    const colors =
      type === "role"
        ? {
            Admin: "bg-red-100 text-red-600",
            Manager: "bg-yellow-100 text-yellow-700",
            User: "bg-green-100 text-green-700",
          }
        : {
            Active: "bg-green-100 text-green-700",
           inactive: "bg-gray-300 text-gray-700",
            Blocked: "bg-red-100 text-red-600",
          };

    return <span className={`${base} ${colors[value]}`}>{value}</span>;
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">

      {/* 🔹 Top Bar */}
      <div className="bg-white p-4 rounded-2xl shadow flex flex-col md:flex-row gap-3 justify-between">
        <input
          className="border border-gray-300 p-2 rounded-lg w-full md:w-1/3"
          placeholder="Search name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="flex gap-2 flex-wrap">
          <select className="border p-2 rounded-lg" onChange={(e) => setRoleFilter(e.target.value)}>
            <option value="all">All Roles</option>
            <option>Admin</option>
            <option>Manager</option>
            <option>User</option>
          </select>

          <select className="border p-2 rounded-lg" onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option>Active</option> 
            <option>Inactive</option>
            <option>Blocked</option>
          </select>

          <button onClick={() => { setSearch(""); setRoleFilter("all"); setStatusFilter("all"); }}
            className="px-3 py-2 bg-gray-200 rounded-lg">
            Clear
          </button>

         <button onClick={openAddModal} className="bg-blue-600 text-white px-4 py-2 rounded">
  + Add User
</button>
        </div>
      </div>

      {/* 🔹 Bulk Actions */}
      {selectedUsers.length > 0 && (
        <div className="mt-3 p-3 bg-white rounded-xl shadow flex gap-3">
          <button onClick={deleteSelected} className="bg-red-500 text-white px-3 py-1 rounded">
            Delete Selected
          </button>
        </div>
      )}

      {/* 🔹 Table */}
      <div className="mt-4 overflow-x-auto bg-white rounded- shadow">
        <table className="w-full min-w-800px">
          <thead className="bg-gray-100 sticky top-0">

            <tr className="border border-gray-300">
                  <th className="p-3 w-10"></th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-center">Role</th>
              <th className="p-3 text-center ">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>

            
          </thead>

          <tbody>
            {filteredUsers.map((u) => (
              <tr key={u.id} className=" border border-gray-300">
                <td className="p-3">
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(u.id)}
                    onChange={() => toggleSelect(u.id)}
                  />
                </td>
               

                <td className="p-3">{u.name}</td>
                <td className="p-3">{u.email}</td>

                <td className="p-3 text-center">{badge("role", u.role)}</td>
                <td className="p-3 text-center">{badge("status", u.status)}</td>

                <td className="p-3 flex gap-2 justify-end">
                  <Button onClick={() => openEditModal(u)}>
                    Edit
                  </ Button>
                  < Button onClick={() => deleteUser(u.id)} className="text-red-500  ">
                    Delete
                  </ Button>
                    <Button onClick={() => handleBlockUser(u)}>
  {u.is_blocked ? "Unblock" : "Block"}
</Button>
                
                </td>
                
              </tr>
            ))}
          
          </tbody>
             
        </table>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-2xl w-[40%] md:w-400px">
            <h2 className="text-xl font-semibold mb-3">
              {editId ? "Edit User" : "Add User"}
            </h2>

            <input
              className="border p-2 w-full mb-2 rounded"
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <input
              className="border p-2 w-full mb-2 rounded"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            {!editId && (
              <input
                className="border p-2 w-full mb-2 rounded"
                placeholder="Password"
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            )}

            <select
              className="border p-2 w-full mb-2 rounded"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option>User</option>
              <option>Manager</option>
              <option>Admin</option>
            </select>

            <select
              className="border p-2 w-full mb-3 rounded"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option>Active</option>
              <option>Inactive</option>
              <option>Blocked</option>
            </select>

            <div className="flex justify-end gap-2">
              <button onClick={() => setModalOpen(false)} className="px-3 py-2 bg-gray-200 rounded">
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-3 py-2 bg-blue-600 text-white rounded"
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}