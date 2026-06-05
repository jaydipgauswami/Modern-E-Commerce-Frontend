"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Drawer, message, Popconfirm } from "antd";
import { 
  FaChartLine, 
  FaBox, 
  FaShoppingCart, 
  FaUsers, 
  FaThLarge, 
  FaBars, 
  FaSignOutAlt 
} from "react-icons/fa";

const SidebarLink = ({ href, icon, label, onClick }) => {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200
        ${
          isActive
            ? "bg-blue-500 text-white shadow-md font-semibold"
            : "text-gray-700 hover:bg-gray-100 hover:text-blue-500 font-medium"
        }
      `}
    >
      <span className="text-lg flex-shrink-0">{icon}</span>
      <span>{label}</span>
    </Link>
  );
};

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    // Redirect to login page if token is missing
    if (!token) {
      router.push("/login");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    message.success("Logged out successfully");
    router.push("/login");
  };

  const menuItems = [
    { href: "/admin/dashboard", icon: <FaChartLine />, label: "Dashboard" },
    { href: "/admin/products", icon: <FaBox />, label: "Products" },
    { href: "/admin/Category", icon: <FaThLarge />, label: "Category" },
    { href: "/admin/orders", icon: <FaShoppingCart />, label: "Orders" },
    { href: "/admin/users", icon: <FaUsers />, label: "Users" },
    { href: "/admin/reports", icon: <FaChartLine />, label: "Reports" },
  ];

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50 mt-0 overflow-hidden">
      
      {/* Mobile Top Header (Visible on Mobile & Tablet) */}
      <header className="flex md:hidden items-center justify-between px-4 py-3 bg-white border-b border-gray-200 shadow-sm w-full flex-shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600 focus:outline-none border-none cursor-pointer flex items-center justify-center"
            aria-label="Open navigation menu"
          >
            <FaBars className="text-lg" />
          </button>
          <span className="font-extrabold text-lg text-gray-900 tracking-tight">Admin Panel</span>
        </div>
        <div className="w-8 h-8 bg-blue-500 text-white font-bold rounded-full flex items-center justify-center text-sm shadow-sm select-none">
          A
        </div>
      </header>

      {/* Mobile Drawer Navigation overlay */}
      <Drawer
        title={<span className="text-xl font-bold text-gray-800">Admin Panel</span>}
        placement="left"
        onClose={() => setIsMobileMenuOpen(false)}
        open={isMobileMenuOpen}
size="default"
        styles={{ body: { padding: "16px", display: "flex", flexDirection: "column", height: "100%" } }}
        className="md:hidden"
      >
        <nav className="space-y-1.5 flex-1">
          {menuItems.map((item) => (
            <SidebarLink
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              onClick={() => setIsMobileMenuOpen(false)}
            />
          ))}
        </nav>
        
        <Popconfirm
          title="Log out"
          description="Are you sure you want to log out?"
          onConfirm={handleLogout}
          okText="Yes"
          cancelText="No"
          okButtonProps={{ danger: true }}
        >
          <button
            className="flex items-center gap-3 p-3 w-full rounded-lg transition-all duration-200 text-red-600 hover:bg-red-50 font-semibold mt-auto border-none cursor-pointer text-left bg-transparent"
          >
            <FaSignOutAlt className="text-lg flex-shrink-0" />
            <span>Logout</span>
          </button>
        </Popconfirm>
      </Drawer>

      {/* Desktop Sidebar (Fixed left panel visible only on Desktop Screens) */}
      <aside className="hidden md:flex w-64 bg-white border-r border-gray-200 shadow-sm flex-col flex-shrink-0">
        <div className="p-6 text-xl font-extrabold border-b border-gray-100 tracking-tight text-gray-800">
          Admin Panel
        </div>
        
        <div className="flex-1 p-4 flex flex-col justify-between overflow-y-auto">
          <nav className="space-y-1.5">
            {menuItems.map((item) => (
              <SidebarLink
                key={item.href}
                href={item.href}
                icon={item.icon}
                label={item.label}
              />
            ))}
          </nav>
          
          <Popconfirm
            title="Log out"
            description="Are you sure you want to log out of your session?"
            onConfirm={handleLogout}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <button
              className="flex items-center gap-3 p-3 w-full rounded-lg transition-all duration-200 text-red-600 hover:bg-red-50 font-semibold mt-auto border-none cursor-pointer text-left bg-transparent"
            >
              <FaSignOutAlt className="text-lg flex-shrink-0" />
              <span>Logout</span>
            </button>
          </Popconfirm>
        </div>
      </aside>

      {/* Main Content Area Layout */}
      <main className="flex-grow flex flex-col min-w-0 overflow-y-auto bg-gray-50">
        <div className="p-4 sm:p-6 flex-grow">
          {children}
        </div>
      </main>

    </div>
  );
}