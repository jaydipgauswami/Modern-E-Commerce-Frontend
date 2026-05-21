"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaBox, FaHeart, FaHeadset, FaTags, FaUserEdit, FaGlobe,FaUserCircle } from "react-icons/fa";

export default function AccountPage() {
  return (
    <div className="min-h-screen w-full bg-gray-100 px-4 md:px-10 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full bg-white rounded-2xl shadow-lg p-6 md:p-10"
      > 
       {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">My Account</h1>
        </div>
        {/* Top Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Link href="/orders" className="group flex flex-col items-center justify-center gap-3 p-6 border rounded-2xl hover:shadow-md hover:bg-gray-50 transition">
            <FaBox className="text-2xl text-indigo-600 group-hover:scale-110 transition" />
            <span className="font-medium">Orders</span>
          </Link>
          <Link href="/wishlist" className="group flex flex-col items-center justify-center gap-3 p-6 border rounded-2xl hover:shadow-md hover:bg-gray-50 transition">
            <FaHeart className="text-2xl text-indigo-600 group-hover:scale-110 transition" />
            <span className="font-medium">Wishlist</span>
          </Link>

          <Link href="/help" className="group flex flex-col items-center justify-center gap-3 p-6 border rounded-2xl hover:shadow-md hover:bg-gray-50 transition">
            <FaHeadset className="text-2xl text-indigo-600 group-hover:scale-110 transition" />
            <span className="font-medium">Help Center</span>
          </Link>

          <Link href="/coupons" className="group flex flex-col items-center justify-center gap-3 p-6 border rounded-2xl hover:shadow-md hover:bg-gray-50 transition">
            <FaTags className="text-2xl text-indigo-600 group-hover:scale-110 transition" />
            <span className="font-medium">Coupons</span>
          </Link>
        </div>

        {/* Bottom Section */}
        <div className="mt-10 border-t pt-8 grid grid-cols-1 md:grid-cols-2 gap-6">

          <Link
  href="/account/profile"
  className="flex items-center gap-4 p-5 border rounded-2xl hover:shadow-md hover:bg-gray-50 transition"
>
  <FaUserCircle className="text-xl text-indigo-600" />
  <span className="font-medium">Profile</span>
</Link>
          {/* <Link href="/account/editprofile" className="flex items-center gap-4 p-5 border rounded-2xl hover:shadow-md hover:bg-gray-50 transition">
            <FaUserEdit className="text-xl text-indigo-600" />
            <span className="font-medium">Edit Profile</span>
          </Link> */}
          <Link href="/language" className="flex items-center gap-4 p-5 border rounded-2xl hover:shadow-md hover:bg-gray-50 transition">
            <FaGlobe className="text-xl text-indigo-600" />
            <span className="font-medium">Select Language</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
