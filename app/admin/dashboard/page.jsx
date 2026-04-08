"use client";

import Link from "next/link";
import { FaBox, FaUsers, FaShoppingCart, FaChartLine } from "react-icons/fa";
import { useState } from "react";

export default function AdminDashboard() {
  // Dummy products for testing
  const [products] = useState([
    { id: 1, name: "Product 1" },
    { id: 2, name: "Product 2" },
    { id: 3, name: "Product 3" },
  ]);

  const lastProduct = products[products.length - 1];

  return (
    <div className="flex min-h-screen bg-gray-100 ">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md flex flex-col">
        <div className="p-6 text-2xl font-bold border-b">Admin Panel</div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin/dashboard" className="flex items-center gap-3 p-2 rounded hover:bg-gray-100">
            <FaChartLine /> Dashboard
          </Link>
          <Link href="/admin/products" className="flex items-center gap-3 p-2 rounded hover:bg-gray-100">
            <FaBox /> Products
          </Link>
          <Link href="/admin/orders" className="flex items-center gap-3 p-2 rounded hover:bg-gray-100">
            <FaShoppingCart /> Orders
          </Link>
          <Link href="/admin/users" className="flex items-center gap-3 p-2 rounded hover:bg-gray-100">
            <FaUsers /> Users
          </Link>
          <Link href="/admin/reports" className="flex items-center gap-3 p-2 rounded hover:bg-gray-100">
            <FaChartLine /> Reports
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Top Navbar */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Admin</span>
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center font-bold">
              A
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-6 rounded shadow flex flex-col">
            <span className="text-gray-500">Total Products</span>
            <span className="text-2xl font-bold mt-2">{products.length}</span>
          </div>
          <div className="bg-white p-6 rounded shadow flex flex-col">
            <span className="text-gray-500">Total Orders</span>
            <span className="text-2xl font-bold mt-2">75</span>
          </div>
          <div className="bg-white p-6 rounded shadow flex flex-col">
            <span className="text-gray-500">Total Users</span>
            <span className="text-2xl font-bold mt-2">50</span>
          </div>
          <div className="bg-white p-6 rounded shadow flex flex-col">
            <span className="text-gray-500">Revenue</span>
            <span className="text-2xl font-bold mt-2">$12,500</span>
          </div>
        </div>

        {/* Quick Links / Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Add Product */}
          <Link href="/admin/products/add">
            <div className="bg-blue-50 p-6 rounded shadow cursor-pointer hover:bg-blue-100 transition flex flex-col items-center justify-center">
              <FaBox className="text-blue-500 text-3xl mb-2" />
              <span className="font-semibold text-blue-600">Add Product</span>
            </div>
          </Link>

          {/* Edit Last Product */}
          <Link href={`/admin/products/edit/${lastProduct.id}`}>
            <div className="bg-red-50 p-6 rounded shadow cursor-pointer hover:bg-red-100 transition flex flex-col items-center justify-center">
              <FaBox className="text-red-500 text-3xl mb-2" />
              <span className="font-semibold text-red-600">Edit Last Product</span>
            </div>
          </Link>

          {/* View Orders */}
          <Link href="/admin/orders">
            <div className="bg-green-50 p-6 rounded shadow cursor-pointer hover:bg-green-100 transition flex flex-col items-center justify-center">
              <FaShoppingCart className="text-green-500 text-3xl mb-2" />
              <span className="font-semibold text-green-600">View Orders</span>
            </div>
          </Link>

          {/* Manage Users */}
          <Link href="/admin/users">
            <div className="bg-yellow-50 p-6 rounded shadow cursor-pointer hover:bg-yellow-100 transition flex flex-col items-center justify-center">
              <FaUsers className="text-yellow-500 text-3xl mb-2" />
              <span className="font-semibold text-yellow-600">Manage Users</span>
            </div>
          </Link>

          {/* View Reports */}
          <Link href="/admin/reports">
            <div className="bg-purple-50 p-6 rounded shadow cursor-pointer hover:bg-purple-100 transition flex flex-col items-center justify-center">
              <FaChartLine className="text-purple-500 text-3xl mb-2" />
              <span className="font-semibold text-purple-600">View Reports</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}