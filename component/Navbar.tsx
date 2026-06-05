"use client";
import { toast } from "sonner";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/app/context/AuthContext";

import {
  ShoppingCartOutlined,
  HeartOutlined,
  UserOutlined,
  SearchOutlined,
  CloseOutlined,
  MenuOutlined,
 
} from "@ant-design/icons";
import { Badge } from "antd";
import { useCart } from "../app/context/CartContext";

type User = {
  name: string;
};

/* ─── animation variants ─── */
const navVariants = {
  hidden: { y: -80, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 120, damping: 20 },
  },
};

const linkHover = {
  rest: { scale: 1 },
  hover: { scale: 1.05, y: -1, transition: { type: "spring", stiffness: 400 } },
};

const mobileMenuVariants = {
  hidden: { height: 0, opacity: 0, transition: { duration: 0.3, ease: "easeInOut" } },
  visible: {
    height: "auto",
    opacity: 1,
    transition: { duration: 0.35, ease: "easeOut", staggerChildren: 0.06, delayChildren: 0.1 },
  },
  exit: { height: 0, opacity: 0, transition: { duration: 0.25, ease: "easeIn" } },
};

const mobileItemVariants = {
  hidden: { x: -24, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 24 } },
  exit: { x: -24, opacity: 0 },
};

const iconPulse = {
  rest: { scale: 1 },
  hover: { scale: 1.2, transition: { type: "spring", stiffness: 500 } },
  tap: { scale: 0.9 },
};

function Navbar() {
  const { user: authUser, logout } = useAuth();
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const { cartItems, wishlistItems , clearCart , clearWishlist} = useCart();

  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const [searchText, setSearchText] = useState("");

  /* ── scroll listener ── */
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ── close mobile menu on outside click ── */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      // Don't close if clicking the hamburger button (it has its own toggle logic)
      if (hamburgerRef.current && hamburgerRef.current.contains(target)) return;
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  /* ── close mobile menu on resize to desktop ── */
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
 
  /* ── logout ── */
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
         clearCart();
    clearWishlist();
      setUser(null);
      
      if (logout) logout();
       
      setTimeout(() =>  router.push("/"), 500);
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Try again!");
    }
  };
   const handleSearchChange = (e) => {
  const value = e.target.value;

  setSearchText(value);

  if (value.trim()) {
    router.push(
      `/products?search=${encodeURIComponent(value)}`
    );
  } else {
    router.push("/products");
  }
};


  return (
    <motion.nav
      variants={navVariants}
      initial="hidden"
      animate="visible"
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/90 backdrop-blur-md shadow-lg"
          : "bg-white shadow-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* ── LEFT: Logo ── */}
          <motion.div
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="flex-shrink-0"
          >
            <Link
              href="/"
              className="text-2xl font-extrabold bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent tracking-tight"
            >
              QuickCart
            </Link>
          </motion.div>

          {/* ── CENTER: Search + Links (desktop) ── */}
          <div className="hidden md:flex items-center gap-6 flex-1 justify-center">
            {/* Search */}
            <motion.div
              animate={{ width: searchFocused ? 340 : 280 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative"
            >
              <SearchOutlined className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none" />
             <input
  type="text"
  value={searchText}
  onChange={handleSearchChange}
  
  placeholder="Search products..."
  onFocus={() => setSearchFocused(true)}
  onBlur={() => setSearchFocused(false)}
  className={`w-full pl-9 pr-4 py-2 rounded-full border text-sm transition-all duration-300 focus:outline-none ${
    searchFocused
      ? "border-indigo-400 ring-2 ring-indigo-100 bg-white"
      : "border-gray-200 bg-gray-50"
  }`}
/>
            </motion.div>

            {/* Nav Links */}
            <ul className="flex gap-1 font-medium text-sm">
              {[
                { href: "/", label: "Home" },
                { href: "/products", label: "Products" },
                { href: "/contact", label: "Contact" },
              ].map((link) => (
                <motion.li
                  key={link.href}
                  variants={linkHover}
                  initial="rest"
                  whileHover="hover"
                >
                  <Link
                    href={link.href}
                    className="relative px-4 py-2 rounded-lg text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-colors duration-200 block"
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* ── RIGHT: Icons + Auth (desktop) ── */}
          <div className="hidden md:flex items-center gap-3">
            {/* Wishlist */}
            <motion.div variants={iconPulse} initial="rest" whileHover="hover" whileTap="tap">
              <Badge
                count={wishlistItems.length}
                size="small"
                style={{ backgroundColor: "#6366f1" }}
              >
                <Link
                  href="/wishlist"
                  className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <HeartOutlined className="text-gray-700 text-lg" />
                </Link>
              </Badge>
            </motion.div>

            {/* Cart */}
            <motion.div variants={iconPulse} initial="rest" whileHover="hover" whileTap="tap">
              <Badge
                count={cartItems.length}
                showZero
                size="small"
                style={{ backgroundColor: "#6366f1" }}
              >
                <Link
                  href="/cart"
                  className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <ShoppingCartOutlined className="text-gray-700 text-lg" />
                </Link>
              </Badge>
            </motion.div>

            {/* Account */}
            <motion.div variants={iconPulse} initial="rest" whileHover="hover" whileTap="tap">
              <Link
                href="/account"
                className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-gray-100 transition-colors"
              >
                <UserOutlined className="text-gray-700 text-lg" />
              </Link>
            </motion.div>

            {/* Divider */}
            <div className="w-px h-6 bg-gray-200 mx-1" />

            {/* Admin Dashboard */}
            {authUser?.role === "admin" && (
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href="/admin/dashboard"
                  className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full text-xs font-semibold shadow-sm hover:shadow-md transition-shadow"
                >
                  Dashboard
                </Link>
              </motion.div>
            )}

            {/* Auth Buttons */}
            {authUser ? (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleLogout}
                className="px-4 py-1.5 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-full text-xs font-semibold shadow-sm hover:shadow-md transition-shadow"
              >
                Logout
              </motion.button>
            ) : (
              <div className="flex items-center gap-2">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    href="/login"
                    className="px-4 py-1.5 text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
                  >
                    Login
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    href="/register"
                    className="px-4 py-1.5 bg-gradient-to-r from-indigo-600 to-violet-500 text-white rounded-full text-xs font-semibold shadow-sm hover:shadow-md transition-shadow"
                  >
                    Register
                  </Link>
                </motion.div>
              </div>
            )}
          </div>

          {/* ── MOBILE: Icons + Hamburger ── */}
        {/* ── MOBILE: Wishlist + Cart + Hamburger ── */}
<div className="flex md:hidden items-center gap-2">
  {/* Wishlist */}
  <Badge
    count={wishlistItems.length}
    size="small"
    style={{ backgroundColor: "#6366f1" }}
  >
    <Link
      href="/wishlist"
      className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-gray-100 transition-colors"
    >
      <HeartOutlined className="text-gray-700 text-lg" />
    </Link>
  </Badge>

  {/* Cart */}
  <Badge
    count={cartItems.length}
    showZero
    size="small"
    style={{ backgroundColor: "#6366f1" }}
  >
    <Link
      href="/cart"
      className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-gray-100 transition-colors"
    >
      <ShoppingCartOutlined className="text-gray-700 text-lg" />
    </Link>
  </Badge>

  {/* Hamburger Toggle */}
  <motion.button
    ref={hamburgerRef}
    whileTap={{ scale: 0.85 }}
    onClick={() => setIsOpen((prev) => !prev)}
    className="flex items-center justify-center w-10 h-10 rounded-xl hover:bg-gray-100 transition-colors focus:outline-none"
    aria-label="Toggle navigation"
  >
    <AnimatePresence mode="wait">
      {isOpen ? (
        <motion.span
          key="close"
          initial={{ rotate: -90, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          exit={{ rotate: 90, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <CloseOutlined className="text-lg text-gray-700" />
        </motion.span>
      ) : (
        <motion.span
          key="menu"
          initial={{ rotate: 90, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          exit={{ rotate: -90, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <MenuOutlined className="text-lg text-gray-700" />
        </motion.span>
      )}
    </AnimatePresence>
  </motion.button>
</div>
        </div>
      </div>

      {/* ── MOBILE MENU ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={mobileMenuRef}
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="md:hidden overflow-hidden bg-white border-t border-gray-100"
          >
            <div className="px-4 py-4 space-y-1">
              {/* Mobile Search */}
              <motion.div variants={mobileItemVariants} className="pb-3">
                <div className="relative">
                  <SearchOutlined className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none" />
                  <input
  type="text"
  value={searchText}
  onChange={(e) => setSearchText(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      setIsOpen(false);

      router.push(
        `/products?search=${encodeURIComponent(searchText)}`
      );
    }
  }}
  placeholder="Search products..."
  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm"
/>
                </div>
              </motion.div>

            {/* Mobile Nav Links */}
{[
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/account", label: "My Account" },
  { href: "/contact", label: "Contact" },
].map((link) => (
  <motion.div key={link.href} variants={mobileItemVariants}>
    <Link
      href={link.href}
      onClick={() => setIsOpen(false)}
      className="flex items-center px-3 py-2.5 rounded-xl text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors text-sm font-medium"
    >
      {link.label}
    </Link>
  </motion.div>
))}

{/* Wishlist Link */}
{/* <motion.div variants={mobileItemVariants}>
  <Link
    href="/wishlist"
    onClick={() => setIsOpen(false)}
    className="flex items-center justify-between px-3 py-2.5 rounded-xl text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors text-sm font-medium"
  >
    <div className="flex items-center gap-2">
      <HeartOutlined />
      <span>Wishlist</span>
    </div>

    <Badge
      count={wishlistItems.length}
      size="small"
      style={{ backgroundColor: "#6366f1" }}
    />
  </Link>
</motion.div> */}

              {/* Divider */}
              <motion.div variants={mobileItemVariants}>
                <div className="my-2 border-t border-gray-100" />
              </motion.div>

              {/* Auth Section */}
              {authUser ? (
                <>
                  {authUser?.role === "admin" && (
                    <motion.div variants={mobileItemVariants}>
                      <Link
                        href="/admin/dashboard"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center justify-center w-full px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl text-sm font-semibold shadow-sm hover:shadow-md transition-shadow"
                      >
                        Dashboard
                      </Link>
                    </motion.div>
                  )}
                  <motion.div variants={mobileItemVariants}>
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        handleLogout();
                      }}
                      className="w-full px-4 py-2.5 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-xl text-sm font-semibold shadow-sm hover:shadow-md transition-shadow"
                    >
                      Logout
                    </button>
                  </motion.div>
                </>
              ) : (
                <motion.div variants={mobileItemVariants} className="flex gap-2">
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="flex-1 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-center text-sm font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsOpen(false)}
                    className="flex-1 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-500 text-white rounded-xl text-center text-sm font-semibold shadow-sm hover:shadow-md transition-shadow"
                  >
                    Register
                  </Link>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

export default Navbar;