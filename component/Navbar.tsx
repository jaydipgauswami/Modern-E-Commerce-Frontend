"use client";
import Link from "next/link"
import { useState, useEffect } from "react";

import { motion } from "framer-motion";


function Navbar() {
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

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-md" : "bg-transparent"
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
       
<li
  className="cursor-pointer hover:text-gray-500 relative"
  onMouseEnter={() => setDropdownOpen(true)}
  onMouseLeave={() => setTimeout(() => setDropdownOpen(false), 50)}
>
  Products
  {dropdownOpen && (
    <div className="absolute top-full left-0 bg-white shadow-lg border border-gray-200 mt-0 p-4 w-48 z-50">
      <ul className="space-y-2">
        <li>
          <Link href="/products/electronics"
             className="hover:text-blue-600 block">  Electronics
          </Link>
        </li>
        <li>
          <Link href="/products/clothing"
             className="hover:text-blue-600 block">Clothing & Fashion
          </Link>
        </li>
        <li>
          <Link href="/products/beauty"
             className="hover:text-blue-600 block">Beauty & Health
          </Link>
        </li>
      </ul>
    </div>
  )}
</li>
          <li className="cursor-pointer hover:text-gray-500"> <Link href="/cart">Cart</Link></li>
          <li className="cursor-pointer hover:text-gray-500"><Link href="/contact">Contact</Link></li>
  <button className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800">Login</button></ul>
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
<button className="W-full px-4 py-2 bg-black text-white rounded-lg">Login</button>
  </div>
)}
    </nav>
  );
}

export default Navbar;