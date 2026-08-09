"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Spin } from "antd";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaBoxOpen,
  FaHeart,
  FaHeadset,
  FaTags,
  FaUserCircle,
  FaMapMarkerAlt,
  FaCog,
  FaSignOutAlt,
  FaChevronRight,
  FaRegEdit,
  FaCamera,
} from "react-icons/fa";
import { useCart } from "../../context/CartContext";
// --- Types ---
type Tab =
  | "profile"
  | "orders"
  | "wishlist"
  | "addresses"
  | "settings"
  | "cart";

const MOCK_ORDERS = [
  {
    id: "#ORD-9821",
    date: "Oct 24, 2023",
    status: "Delivered",
    amount: "$129.99",
    items: 2,
  },
  {
    id: "#ORD-9754",
    date: "Sep 12, 2023",
    status: "Processing",
    amount: "$45.00",
    items: 1,
  },
  {
    id: "#ORD-9632",
    date: "Aug 05, 2023",
    status: "Shipped",
    amount: "$210.50",
    items: 4,
  },
];

// --- Main Component ---
export default function AccountPage() {
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const { cartItems, wishlistItems } = useCart();
  // Simulate data fetching
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:5000/api/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (res.ok) {
          setUser(data.user);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const NAV_ITEMS = [
    { id: "profile", label: "My Profile", icon: FaUserCircle },
    { id: "orders", label: "Order History", icon: FaBoxOpen },
    { id: "wishlist", label: "Wishlist", icon: FaHeart },
    { id: "cart", label: "Cart List", icon: FaBoxOpen },
    { id: "addresses", label: "Saved Addresses", icon: FaMapMarkerAlt },
    { id: "settings", label: "Account Settings", icon: FaCog },
  ];
  if (loading) {
    return (
      <div className="h-[80vh] flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <Spin size="large" />
          <span className="text-gray-400 text-xs font-semibold">
            loading....
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            My Account
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Manage your profile, orders, and preferences.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <aside className="w-full lg:w-72 flex-shrink-0">
            <nav className="flex lg:flex-col overflow-x-auto lg:overflow-visible gap-2 pb-4 lg:pb-0 scrollbar-hide">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as Tab)}
                  className={`
                    relative flex items-center w-full min-w-max lg:min-w-0 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200
                    ${
                      activeTab === item.id
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                        : "text-gray-600 hover:bg-white hover:shadow-sm hover:text-indigo-600"
                    }
                  `}
                >
                  <item.icon
                    className={`text-lg mr-3 ${activeTab === item.id ? "text-indigo-200" : "text-gray-400 group-hover:text-indigo-500"}`}
                  />
                  {item.label}
                  {activeTab === item.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 border-2 border-indigo-600 rounded-xl"
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    />
                  )}
                </button>
              ))}

              <div className="hidden lg:block my-4 border-t border-gray-200"></div>

              {/* Extra Links (Help/Logout) */}
              <Link
                href="/help"
                className="hidden lg:flex items-center px-4 py-3 text-sm font-medium text-gray-600 rounded-xl hover:bg-white hover:shadow-sm transition-all"
              >
                <FaHeadset className="text-lg mr-3 text-gray-400" /> Help Center
              </Link>
              <button className="hidden lg:flex items-center px-4 py-3 text-sm font-medium text-red-600 rounded-xl hover:bg-red-50 transition-all">
                <FaSignOutAlt className="text-lg mr-3 text-red-400" /> Sign Out
              </button>
            </nav>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 min-w-0">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 min-h-[500px]"
            >
              {loading ? (
                <SkeletonLoader />
              ) : (
                <AnimatePresence mode="wait">
                  {activeTab === "profile" && <ProfileSection user={user} />}
                  {activeTab === "orders" && <OrdersSection />}
                  {activeTab === "wishlist" && (
                    <WishlistSection wishlistItems={wishlistItems} />
                  )}

                  {activeTab === "addresses" && (
                    <AddressesSection user={user} />
                  )}
                  {activeTab === "cart" && (
                    <CartSection cartItems={cartItems} />
                  )}
                  {activeTab === "settings" && <SettingsSection />}
                </AnimatePresence>
              )}
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
}

// --- Sub-components ---

function ProfileSection({ user }: any) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-8 border-b border-gray-100">
        <div className="relative group">
          <img
            src={
              user?.image
                ? user.image
                : `https://ui-avatars.com/api/?name=${user?.first_name}+${user?.last_name}`
            }
            alt="Profile"
            className="w-32 h-30 md:w-30 md:h-30 rounded-full object-cover border-4 border-white shadow-lg"
          />
        </div>
        <div className="text-center sm:text-left">
          <h2 className="text-2xl font-bold text-gray-900">{`${user?.first_name || ""} ${user?.last_name || ""}`}</h2>
          <p className="text-gray-500 mt-1">{user?.email}</p>
          <div className="mt-4 flex flex-wrap justify-center sm:justify-start gap-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Verified Account
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              Member since {}
            </span>
          </div>
        </div>
        <Link
          href="/account/profile/editprofile"
          className="mt-4 sm:mt-0 sm:ml-auto inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
        >
          <FaRegEdit />
          Edit Profile
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-5 rounded-xl border border-gray-100 bg-gray-50/50">
          <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">
            Personal Information
          </h3>
          <div className="space-y-4 text-sm">
            <div className="flex justify-between border-b border-gray-200 pb-2">
              <span className="text-gray-500">Full Name</span>
              <span className="font-medium text-gray-900">{`${user?.first_name || ""} ${user?.last_name || ""}`}</span>
            </div>
            <div className="flex justify-between border-b border-gray-200 pb-2">
              <span className="text-gray-500">Email Address</span>
              <span className="font-medium text-gray-900">{user?.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Phone Number</span>
              <span className="font-medium text-gray-900">{user?.phone}</span>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-xl border border-indigo-100 bg-indigo-50/30">
          <h3 className="text-sm font-semibold text-indigo-900 mb-2 uppercase tracking-wider">
            Store Credits
          </h3>
          <p className="text-3xl font-bold text-indigo-600">$120.00</p>
          <p className="text-xs text-indigo-500 mt-2">
            Available for your next purchase.
          </p>
          <Link
            href="/coupons"
            className="inline-flex items-center gap-2 mt-4 text-sm font-medium text-indigo-600 hover:text-indigo-800 group"
          >
            <FaTags /> View Coupons
            <FaChevronRight className="text-xs group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

function OrdersSection() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
        <Link
          href="/orders"
          className="text-sm text-indigo-600 hover:text-indigo-800 font-medium hover:underline"
        >
          View all
        </Link>
      </div>
      <div className="space-y-4">
        {MOCK_ORDERS.map((order, i) => (
          <div
            key={i}
            className="flex flex-col sm:flex-row items-center justify-between p-4 sm:p-5 rounded-xl border border-gray-100 hover:shadow-md transition-shadow bg-white"
          >
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                <FaBoxOpen className="text-xl" />
              </div>
              <div>
                <p className="font-bold text-gray-900">{order.id}</p>
                <p className="text-xs text-gray-500">
                  {order.date} • {order.items} Items
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between w-full sm:w-auto mt-4 sm:mt-0 gap-6">
              <div className="text-right">
                <p className="font-bold text-gray-900">{order.amount}</p>
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full ${
                    order.status === "Delivered"
                      ? "bg-green-100 text-green-700"
                      : order.status === "Processing"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {order.status}
                </span>
              </div>
              <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition">
                <FaChevronRight />
              </button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function CartSection({ cartItems }: any) {
  if (!cartItems?.length) {
    return (
      <div className="text-center py-20">
        <h3 className="text-xl font-semibold">Cart Empty</h3>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">My Cart</h2>

      <div className="space-y-4">
        {cartItems.map((item: any) => (
          <div
            key={item.product_id}
            className="flex gap-4 border rounded-xl p-4"
          >
            <img
              src={`http://localhost:5000/uploads/${item.image}`}
              alt={item.name}
              className="w-24 h-24 object-cover rounded-lg"
            />

            <div className="flex-1">
              <h3 className="font-semibold">{item.name}</h3>

              <p className="text-gray-500">Qty: {item.quantity}</p>

              <p className="font-bold text-indigo-600">₹{item.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function WishlistSection({ wishlistItems }: any) {
  if (!wishlistItems?.length) {
    return (
      <div className="text-center py-20">
        <h3 className="text-xl font-semibold">Wishlist Empty</h3>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">My Wishlist</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {wishlistItems.map((item: any) => (
          <div key={item.id} className="border rounded-xl overflow-hidden">
            <img
              src={`http://localhost:5000/uploads/${item.image}`}
              alt={item.name}
              className="h-52 w-full object-cover"
            />

            <div className="p-4">
              <h3 className="font-semibold">{item.name}</h3>

              <p className="text-indigo-600 font-bold mt-2">₹{item.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AddressesSection({ user }: any) {
  const router = useRouter();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Saved Addresses</h2>

        <button
          onClick={() => router.push("/profile/edit")}
          className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
        >
          Edit Address
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* User Profile Address */}
        <div className="p-5 rounded-xl border-2 border-indigo-600 bg-indigo-50/10 relative">
          <span className="absolute top-4 right-4 text-xs font-bold text-indigo-600 bg-indigo-100 px-2 py-1 rounded">
            DEFAULT
          </span>

          <h3 className="font-bold text-gray-900">Home</h3>

          <p className="text-sm text-gray-500 mt-2">
            {user?.first_name} {user?.last_name}
            <br />
            {user?.address}
            <br />
            {user?.city && `${user.city}, `}
            {user?.state} - {user?.pincode}
            <br />
            {user?.country}
            <br />
            Phone: {user?.phone}
          </p>

          <div className="mt-4 flex gap-3 text-sm">
            <button
              onClick={() => router.push("/account/profile/editprofile")}
              className="text-indigo-600 font-medium hover:underline"
            >
              Edit
            </button>
          </div>
        </div>

        {/* Static Office Address */}
        <div className="p-5 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors">
          <h3 className="font-bold text-gray-900">Office</h3>

          <p className="text-sm text-gray-500 mt-2">
            88 Tech Park Building, Floor 4,
            <br />
            San Jose, CA 95134
            <br />
            United States
          </p>

          <div className="mt-4 flex gap-3 text-sm">
            <button
              onClick={() => router.push("/profile/edit")}
              className="text-indigo-600 font-medium hover:underline"
            >
              Edit
            </button>

            <button
              className="text-red-500 font-medium hover:underline"
              disabled
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function SettingsSection() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <h2 className="text-xl font-bold text-gray-900 mb-6">Account Settings</h2>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl">
          <div>
            <h4 className="font-semibold text-gray-900">Email Notifications</h4>
            <p className="text-xs text-gray-500 mt-1">
              Receive updates on orders and promotions.
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" defaultChecked />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl">
          <div>
            <h4 className="font-semibold text-gray-900">SMS Alerts</h4>
            <p className="text-xs text-gray-500 mt-1">
              Get text messages for delivery updates.
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
          </label>
        </div>
      </div>

      <div className="pt-6 border-t border-gray-100">
        <button className="text-red-500 text-sm font-medium hover:underline">
          Deactivate Account
        </button>
      </div>
    </motion.div>
  );
}

function SkeletonLoader() {
  return (
    <div className="animate-pulse space-y-8">
      <div className="flex items-center gap-6">
        <div className="w-24 h-24 bg-gray-200 rounded-full"></div>
        <div className="space-y-3 flex-1">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="h-48 bg-gray-100 rounded-xl"></div>
        <div className="h-48 bg-gray-100 rounded-xl"></div>
      </div>
    </div>
  );
}
