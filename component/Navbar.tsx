"use client";
import { toast } from "sonner";
import Link from "next/link"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/app/context/AuthContext";



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
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        
        {/* Logo */}
        <h1 className="text-2xl font-bold">QuickCart</h1>


          <div className="flex-1 flex justify-center">
    <input
      type="text"
      placeholder="Search products..."
      className="w-1/2 px-4 py-2 border rounded-lg"
    />
  </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-8 items-center font-medium">
          <li className="cursor-pointer hover:text-gray-500"><Link href="/">Home</Link></li>
       
          <li className="cursor-pointer hover:text-gray-500"><Link href="/products">Products</Link></li>

          <li className="cursor-pointer hover:text-gray-500"> <Link href="/cart">Cart</Link></li>

       
          <li className="cursor-pointer hover:text-gray-500"><Link href="/contact">Contact</Link></li>

            {authUser?.role === "admin" && (
    <Link
      href="/admin/dashboard"
      className="w-full px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
    >
      Dashboard
    </Link>
  )}
          
  <div className="space-x-4">
  {authUser ? (
    <>
  
      <button
        onClick={handleLogout} // ya handleLogout agar tu extra logic use kar raha hai
        className="text-white bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition"
      >
        Logout
      </button>
    </>
  ) : (
    <>
      <Link
        href="/login"
        className="text-gray-700 hover:text-indigo-600 font-medium"
      >
        Login
      </Link>

      <Link
        href="/register"
        className="text-white bg-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
      >
        Register
      </Link>
    </>
  )}
</div>  </ul>
  
        {/* Hamburger */}
        <div
          className="md:hidden cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="w-6 h-0.5 bg-black mb-1"></div>
          <div className="w-6 h-0.5 bg-black mb-1"></div>
          <div className="w-6 h-0.5 bg-black"></div>
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