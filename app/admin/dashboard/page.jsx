"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ProtectedRoute from "../../../component/ProtectedRoute";
import { Card, Table, Tag, Badge, Space, Row, Col, Spin, message , Empty} from "antd";
import { 
  FaBox, 
  FaUsers, 
  FaShoppingCart, 
  FaChartLine, 
  FaArrowUp, 
  FaUserShield 
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

export default function AdminDashboard() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  
  // Catalog products list
  const [products, setProducts] = useState([
    { id: 1, name: "Product 1" },
    { id: 2, name: "Product 2" },
    { id: 3, name: "Product 3" },
  ]);

  // Live Users count state
  const [totalUsersCount, setTotalUsersCount] = useState(); // Fallback count

  // Authenticate user is Admin
  useEffect(() => {
    if (!authLoading) {
      if (!user || user.role !== "admin") {
        router.push("/");
      }
    }
  }, [user, authLoading, router]);

  // Fetch live statistics
  useEffect(() => {
    // 1. Fetch real products count
    const fetchRealProductCount = async () => {
      try {
         const token = localStorage.getItem("token");
        if (!token) return;
        const res = await fetch("http://localhost:5000/api/products/getproducts?limit=100000" , {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (data.success && Array.isArray(data.products)) {
          setProducts(data.products);
        }
      } catch (err) {
        console.warn("Could not connect to live products API, utilizing fallback local states.");
      }
    };

    // 2. Fetch live total users from admin API
    const fetchUsersCount = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch("http://localhost:5000/api/admin/users", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();

        // Handle various potential backend payload shapes flexibly
        if (data.success && Array.isArray(data.users)) {
          setTotalUsersCount(data.users.length);
        } else if (data.success && typeof data.total === "number") {
          setTotalUsersCount(data.total);
        } else if (Array.isArray(data)) {
          setTotalUsersCount(data.length);
        }
      } catch (err) {
        console.warn("Could not connect to live users API, using fallback statistics.");
      }
    };

    fetchRealProductCount();
    fetchUsersCount();
  }, []);

  // Safeguard last product access from throwing undefined errors on load
  const lastProduct = useMemo(() => {
    return products[products.length - 1] || { id: 1 };
  }, [products]);

  // Dashboard Table Data
  const recentOrders = [
    { key: "1", id: "#ORD-9843", customer: "John Doe", date: "Jun 1, 2026", amount: "₹4,200", status: "Delivered" },
    { key: "2", id: "#ORD-9842", customer: "Jane Smith", date: "May 31, 2026", amount: "₹12,500", status: "Processing" },
    { key: "3", id: "#ORD-9841", customer: "Rajesh Kumar", date: "May 30, 2026", amount: "₹8,990", status: "Shipped" },
    { key: "4", id: "#ORD-9840", customer: "Alice Brown", date: "May 29, 2026", amount: "₹1,500", status: "Cancelled" },
  ];

  const columns = [
    {
      title: "Order ID",
      dataIndex: "id",
      key: "id",
      render: (text) => <span className="font-mono font-bold text-gray-800">{text}</span>,
    },
    {
      title: "Customer",
      dataIndex: "customer",
      key: "customer",
      render: (text) => <span className="font-semibold text-gray-700">{text}</span>,
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (text) => <span className="text-gray-400 text-xs">{text}</span>,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (text) => <span className="font-bold text-indigo-600">{text}</span>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let tagColor = "default";
        if (status === "Delivered") tagColor = "green";
        if (status === "Processing") tagColor = "orange";
        if (status === "Shipped") tagColor = "blue";
        if (status === "Cancelled") tagColor = "red";
        return <Tag className="rounded-full px-3 border-none" color={tagColor}>{status}</Tag>;
      },
    },
  ];

  // Prevent flash of layout if user is verifying credentials
  if (authLoading || (user && user.role !== "admin")) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Spin size="large" />
          <span className="text-gray-400 text-sm font-semibold">Verifying Admin Credentials...</span>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
<div className="p-4 sm:p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      
      {/* Top Welcome Navbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Dashboard
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">
            Hi {user?.name || "Admin"}, here is what is happening across your store catalog today.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-white border border-gray-200 px-4 py-2 rounded-xl shadow-sm">
          <div className="flex flex-col items-end">
            <span className="text-xs font-bold text-gray-800">{user?.name || "Administrator"}</span>
            <span className="text-[10px] text-gray-400 font-semibold tracking-wider uppercase">System Admin</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold text-sm shadow-inner">
            {user?.name ? user.name.charAt(0).toUpperCase() : <FaUserShield />}
          </div>
        </div>
      </div>

      {/* Stats Cards Section */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card className="hover:shadow-md transition-shadow duration-300 border-l-4 border-l-blue-500 rounded-xl shadow-sm" styles={{ body: { padding: "16px" } }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">Total Products</p>
                <h3 className="text-2xl font-black text-gray-800">{products.length}</h3>
                <span className="text-green-500 text-[10px] font-semibold flex items-center mt-1">
                  <FaArrowUp className="mr-0.5" /> +12% vs last week
                </span>
              </div>
              <div className="p-3 bg-blue-50 text-blue-500 rounded-lg flex-shrink-0">
                <FaBox className="text-xl" />
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="hover:shadow-md transition-shadow duration-300 border-l-4 border-l-green-500 rounded-xl shadow-sm" styles={{ body: { padding: "16px" } }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">Total Orders</p>
                <h3 className="text-2xl font-black text-gray-800">75</h3>
                <span className="text-green-500 text-[10px] font-semibold flex items-center mt-1">
                  <FaArrowUp className="mr-0.5" /> +8.5% this month
                </span>
              </div>
              <div className="p-3 bg-green-50 text-green-500 rounded-lg flex-shrink-0">
                <FaShoppingCart className="text-xl" />
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="hover:shadow-md transition-shadow duration-300 border-l-4 border-l-amber-500 rounded-xl shadow-sm" styles={{ body: { padding: "16px" } }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">Total Users</p>
                <h3 className="text-2xl font-black text-gray-800">{totalUsersCount}</h3>
                <span className="text-green-500 text-[10px] font-semibold flex items-center mt-1">
                  <FaArrowUp className="mr-0.5" /> +4.2% active list
                </span>
              </div>
              <div className="p-3 bg-amber-50 text-amber-500 rounded-lg flex-shrink-0">
                <FaUsers className="text-xl" />
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="hover:shadow-md transition-shadow duration-300 border-l-4 border-l-indigo-500 rounded-xl shadow-sm" styles={{ body: { padding: "16px" } }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">Total Revenue</p>
                <h3 className="text-2xl font-black text-gray-800">$12,500</h3>
                <span className="text-green-500 text-[10px] font-semibold flex items-center mt-1">
                  <FaArrowUp className="mr-0.5" /> +15.3% sales lift
                </span>
              </div>
              <div className="p-3 bg-indigo-50 text-indigo-500 rounded-lg flex-shrink-0">
                <FaChartLine className="text-xl" />
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Analytics & Quick Links Grid */}
      <Row gutter={[24, 24]} className="mb-6">
        
        {/* Sales Chart Section */}
        <Col xs={24} lg={16}>
          <Card 
            title={<span className="text-sm font-bold text-gray-800">Sales & Revenue Analytics</span>}
            className="shadow-sm border-gray-200 rounded-xl h-full"
            styles={{ body: { padding: "20px" } }}
          >
            {/* Inline responsive SVG chart */}
            <div className="w-full overflow-hidden mt-2">
              <svg className="w-full h-auto max-h-56" viewBox="0 0 500 200" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4"/>
                    <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0"/>
                  </linearGradient>
                </defs>
                {/* Gridlines */}
                <line x1="20" y1="20" x2="480" y2="20" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="20" y1="60" x2="480" y2="60" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="20" y1="100" x2="480" y2="100" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="20" y1="140" x2="480" y2="140" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="20" y1="180" x2="480" y2="180" stroke="#e2e8f0" strokeWidth="1.5" />
                
                {/* Fill Area Chart */}
                <path
                  d="M 20 150 L 100 120 L 180 140 L 260 80 L 340 100 L 420 40 L 480 60 L 480 180 L 20 180 Z"
                  fill="url(#chartGradient)"
                />
                
                {/* Colored Trend Line */}
                <path
                  d="M 20 150 L 100 120 L 180 140 L 260 80 L 340 100 L 420 40 L 480 60"
                  fill="none"
                  stroke="#6366f1"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                
                {/* Data Points */}
                <circle cx="20" cy="150" r="4.5" fill="#ffffff" stroke="#6366f1" strokeWidth="2.5" />
                <circle cx="100" cy="120" r="4.5" fill="#ffffff" stroke="#6366f1" strokeWidth="2.5" />
                <circle cx="180" cy="140" r="4.5" fill="#ffffff" stroke="#6366f1" strokeWidth="2.5" />
                <circle cx="260" cy="80" r="4.5" fill="#ffffff" stroke="#6366f1" strokeWidth="2.5" />
                <circle cx="340" cy="100" r="4.5" fill="#ffffff" stroke="#6366f1" strokeWidth="2.5" />
                <circle cx="420" cy="40" r="4.5" fill="#ffffff" stroke="#6366f1" strokeWidth="2.5" />
                <circle cx="480" cy="60" r="4.5" fill="#ffffff" stroke="#6366f1" strokeWidth="2.5" />
              </svg>
            </div>
            
            {/* Axis labels */}
            <div className="flex justify-between items-center text-[10px] text-gray-400 font-bold uppercase tracking-wider px-2 mt-3 select-none">
              <span>Monday</span>
              <span>Tuesday</span>
              <span>Wednesday</span>
              <span>Thursday</span>
              <span>Friday</span>
              <span>Saturday</span>
              <span>Sunday</span>
            </div>
          </Card>
        </Col>

        {/* Quick Links Section */}
        <Col xs={24} lg={8}>
          <Card 
            title={<span className="text-sm font-bold text-gray-800">Quick Administrative Operations</span>}
            className="shadow-sm border-gray-200 rounded-xl h-full flex flex-col justify-between"
            styles={{ body: { padding: "16px", flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" } }}
          >
            <div className="grid grid-cols-1 gap-2.5 w-full">
              {/* Add Product */}
              <Link href="/admin/products">
                <div className="border border-blue-100 bg-blue-50/50 hover:bg-blue-100/60 p-3.5 rounded-xl cursor-pointer transition-all duration-200 flex items-center gap-3">
                  <div className="p-2.5 bg-blue-500 text-white rounded-lg"><FaBox className="text-base" /></div>
                  <div className="flex flex-col">
                    <span className="font-bold text-xs text-blue-800">Create Catalog Item</span>
                    <span className="text-[10px] text-blue-500">Publish a new inventory entry</span>
                  </div>
                </div>
              </Link>

              {/* Edit Last Product */}
              <Link href={`/admin/products`}>
                <div className="border border-rose-100 bg-rose-50/50 hover:bg-rose-100/60 p-3.5 rounded-xl cursor-pointer transition-all duration-200 flex items-center gap-3">
                  <div className="p-2.5 bg-rose-500 text-white rounded-lg"><FaBox className="text-base" /></div>
                  <div className="flex flex-col">
                    <span className="font-bold text-xs text-rose-800">Edit Catalog List</span>
                    <span className="text-[10px] text-rose-500">Quick override for product IDs</span>
                  </div>
                </div>
              </Link>

              {/* View Orders */}
              <Link href="/admin/orders">
                <div className="border border-green-100 bg-green-50/50 hover:bg-green-100/60 p-3.5 rounded-xl cursor-pointer transition-all duration-200 flex items-center gap-3">
                  <div className="p-2.5 bg-green-500 text-white rounded-lg"><FaShoppingCart className="text-base" /></div>
                  <div className="flex flex-col">
                    <span className="font-bold text-xs text-green-800">Review Open Orders</span>
                    <span className="text-[10px] text-green-500">Inspect deliveries and logistics</span>
                  </div>
                </div>
              </Link>

              {/* Manage Users */}
              <Link href="/admin/users">
                <div className="border border-amber-100 bg-amber-50/50 hover:bg-amber-100/60 p-3.5 rounded-xl cursor-pointer transition-all duration-200 flex items-center gap-3">
                  <div className="p-2.5 bg-amber-500 text-white rounded-lg"><FaUsers className="text-base" /></div>
                  <div className="flex flex-col">
                    <span className="font-bold text-xs text-amber-800">Manage Store Users</span>
                    <span className="text-[10px] text-amber-500">Update system accounts and roles</span>
                  </div>
                </div>
              </Link>

              {/* View Reports */}
              <Link href="/admin/reports">
                <div className="border border-purple-100 bg-purple-50/50 hover:bg-purple-100/60 p-3.5 rounded-xl cursor-pointer transition-all duration-200 flex items-center gap-3">
                  <div className="p-2.5 bg-purple-500 text-white rounded-lg"><FaChartLine className="text-base" /></div>
                  <div className="flex flex-col">
                    <span className="font-bold text-xs text-purple-800">Open Auditing Reports</span>
                    <span className="text-[10px] text-purple-500">Review charts and statistics logs</span>
                  </div>
                </div>
              </Link>
            </div>
          </Card>
        </Col>

      </Row>

      {/* Recent Orders Section */}
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Card 
            title={<span className="text-sm font-bold text-gray-800">Recent Customer Operations</span>}
            className="shadow-sm border-gray-200 rounded-xl overflow-hidden"
            styles={{ body: { padding: 0 } }}
          >
            <Table 
              dataSource={recentOrders}
              columns={columns}
              pagination={false}
              scroll={{ x: 600 }}
              locale={{
                emptyText: <Empty description="No operations processed today" />
              }}
            />
          </Card>
        </Col>
      </Row>

    </div>
    </ProtectedRoute>
    
  );
}