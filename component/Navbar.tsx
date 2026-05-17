"use client";
import { toast } from "sonner";
import Link from "next/link"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/app/context/AuthContext";
import { ShoppingCartOutlined, HeartOutlined, UserOutlined } from "@ant-design/icons";

function Navbar() {
const { user: authUser, logout } = useAuth();
 const router = useRouter();
  console.log("AUTH USER:", authUser);
  type User = {
  name: string;
};
  const [user, setUser] = useState<User | null>(null);
  

  const [isOpen, setIsOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
      const [productOpen, setProductOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  

 useEffect(() => {
  const handleScroll = () => {
    setScrolled(window.scrollY > 50);
  };
  window.addEventListener("scroll", handleScroll);

  return () => window.removeEventListener("scroll", handleScroll);
}, []);

  useEffect(() => {
  console.log("USER DATA:", user);
}, [user]);
 const handleLogout = async () => {
  
    try {
      const refreshToken = localStorage.getItem("refreshToken");

      await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: refreshToken }),
      });

      toast.success("Logged out successfully", { duration: 1000 });


      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setUser(null);  
       if (logout) logout();
  setTimeout(() => {
      router.push("/login");
    }, 500);
    } catch (error) {
      console.error("Logout failed:", error);
       toast.error("Logout failed. Try again!")
    }
  };
  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
         "bg-white shadow-md"
      }`}
    >
   <div className="w-full bg-white shadow px-6 py-3">
  <div className="flex items-center justify-between">

    {/* LEFT - LOGO */}
    <div className="text-2xl font-bold text-indigo-600">
      <Link href="/">QuickCart</Link>
    </div>

    {/* CENTER - SEARCH + LINKS */}
    <div className="hidden md:flex items-center gap-8 flex-1 justify-center">

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search..."
        className="w-80 border px-4 py-2 rounded-lg focus:outline-none"
      />

      {/* NAV LINKS */}
      <ul className="flex gap-6 font-medium">
        <li><Link href="/" className="hover:text-gray-500">Home</Link></li>
        <li><Link href="/products" className="hover:text-gray-500">Products</Link></li>
        <li><Link href="/contact" className="hover:text-gray-500">Contact</Link></li>
      </ul>
    </div>

    {/* RIGHT - ICONS + ACTION */}
    <div className="flex items-center gap-6">

      {/* Icons */}
    <Link href="/wishlist">
    <HeartOutlined className="text-black text-lg" />
</Link>

    <Link href="/cart">
    <ShoppingCartOutlined className="text-black text-lg" />
</Link>
   <Link href="/profile">
 
    <UserOutlined className="text-black text-lg" />
  
</Link>
      {/* Admin Dashboard */}
      {authUser?.role === "admin" && (
        <Link
          href="/admin/dashboard"
          className="px-3 py-2 bg-gray-500 text-white rounded-lg text-sm"
        >
          Dashboard
        </Link>
      )}

      {/* Auth */}
      {authUser ? (
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-3 py-2 rounded-lg text-sm"
        >
          Logout
        </button>
      ) : (
        <>
          <Link href="/login" className="text-sm">Login</Link>
          <Link
            href="/register"
            className="bg-indigo-600 text-white px-3 py-1 rounded-lg text-sm"
          >
            Register
          </Link>
        </>
      )}
    </div>

  </div>
</div>
      {/* Mobile Menu */}
    {isOpen && (
  <div className="md:hidden bg-white shadow-md px-4 py-4 space-y-4">
    <Link href="/" className="block py-2 hover:text-blue-600">Home</Link>
  <div>
            <button
              onClick={() => setProductOpen(!productOpen)}
              className="w-full text-left"
            >
              Products ⬇
            </button>

            {productOpen && (
              <div className="ml-4 mt-2 flex flex-col gap-2">
                 <Link href="/products/electronics" className="block py-1 pl-4 hover:text-blue-600">Electronics</Link>
      <Link href="/products/clothing" className="block py-1 pl-4 hover:text-blue-600">Clothing&Fashion</Link>
      <Link href="/products/beauty" className="block py-1 pl-4 hover:text-blue-600">Beauty & Health</Link>
              </div>
            )}
          </div>
    <Link href="/cart" className="block py-2 hover:text-blue-600">Cart</Link>
    <Link href="/contact" className="block py-2 hover:text-blue-600">Contact</Link>
   {authUser ? (
  <>
    {/* Admin Dashboard */}
    {authUser?.role === "admin" && (
      <Link
        href="/admin/dashboard"
         className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
      >
        Dashboard
      </Link>
    )}

    {/* Logout */}
    <button
      onClick={handleLogout}
      className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
    >
      Logout
    </button>
  </>
) : (
  <>
    <Link
      href="/login"
      className="block py-2 px-4 bg-black text-white rounded-lg text-center"
    >
      Login
    </Link>

    <Link
      href="/register"
      className="block py-2 px-4 bg-indigo-600 text-white rounded-lg text-center"
    >
      Register
    </Link>
  </>
)}
  </div>
)}
    </nav>
  );
}

export default Navbar;