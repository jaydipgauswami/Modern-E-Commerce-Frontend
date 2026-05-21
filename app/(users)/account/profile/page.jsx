"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  FaUserCircle,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaGlobe,
  FaMapPin,
  FaBirthdayCake,
  FaUserEdit,
} from "react-icons/fa";

export default function ProfilePage() {

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  // Fetch Profile
  const fetchProfile = async () => {

    try {

      const token = localStorage.getItem("token");

      const res = await fetch(
        "http://localhost:5000/api/users/me",
        {
          method: "GET",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch profile");
      }

      setUser(data.user);

    } catch (error) {

      console.log("Profile Error:", error.message);

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-xl font-semibold">
          Loading Profile...
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-lg overflow-hidden">

        {/* Header */}
        <div className="bg-indigo-600 p-5 text-white flex flex-col md:flex-row items-center justify-between gap-6">

          <div className="flex items-center gap-5">

            <div className="w-28 h-28 rounded-full overflow-hidden bg-white flex items-center justify-center border-4 border-white shadow-md">

              {user?.image ? (
                <img
                  src={user.image}
                  alt="profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <FaUserCircle className="text-7xl text-gray-400" />
              )}

            </div>

            <div>

              {user?.first_name || user?.name}

              <p className="text-indigo-100 mt-1">
                {user?.email}
              </p>

            </div>
          </div>

          <Link
            href="/account/profile/editprofile"
            className="flex items-center gap-2 bg-white text-indigo-600 px-5 py-3 rounded-xl font-medium hover:bg-gray-100 transition"
          >
            <FaUserEdit />
            Edit Profile 
          </Link>
        </div>
        {/* Details Section */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* First Name */}
          <div className="border rounded-2xl p-5 bg-gray-50">
            <p className="text-gray-500 text-sm mb-1">
              First Name
            </p>
            <h3 className="font-semibold text-lg">
              {user?.first_name || "N/A"}
            </h3>
          </div>

          {/* Last Name */}
          <div className="border rounded-2xl p-5 bg-gray-50">
            <p className="text-gray-500 text-sm mb-1">
              Last Name
            </p>

            <h3 className="font-semibold text-lg">
              {user?.last_name || "N/A"}
            </h3>
          </div>

          {/* Email */}
          <div className="border rounded-2xl p-5 bg-gray-50 flex items-start gap-3">

            <FaEnvelope className="text-indigo-600 text-xl mt-1" />

            <div>

              <p className="text-gray-500 text-sm mb-1">
                Email
              </p>

              <h3 className="font-semibold">
                {user?.email || "N/A"}
              </h3>

            </div>
          </div>

          {/* DOB */}
          <div className="border rounded-2xl p-5 bg-gray-50 flex items-start gap-3">

            <FaBirthdayCake className="text-indigo-600 text-xl mt-1" />

            <div>

              <p className="text-gray-500 text-sm mb-1">
                Date of Birth
              </p>

              <h3 className="font-semibold">
                {user?.dob || "N/A"}
              </h3>

            </div>
          </div>

          {/* Phone */}
          <div className="border rounded-2xl p-5 bg-gray-50 flex items-start gap-3">

            <FaPhone className="text-indigo-600 text-xl mt-1" />

            <div>

              <p className="text-gray-500 text-sm mb-1">
                Phone
              </p>

              <h3 className="font-semibold">
                {user?.phone || "N/A"}
              </h3>

            </div>
          </div>

          {/* Pincode */}
          <div className="border rounded-2xl p-5 bg-gray-50 flex items-start gap-3">

            <FaMapPin className="text-indigo-600 text-xl mt-1" />

            <div>

              <p className="text-gray-500 text-sm mb-1">
                Pincode
              </p>

              <h3 className="font-semibold">
                {user?.pincode || "N/A"}
              </h3>

            </div>
          </div>

          {/* State */}
          <div className="border rounded-2xl p-5 bg-gray-50 flex items-start gap-3">

            <FaMapMarkerAlt className="text-indigo-600 text-xl mt-1" />

            <div>

              <p className="text-gray-500 text-sm mb-1">
                State
              </p>

              <h3 className="font-semibold">
                {user?.state || "N/A"}
              </h3>

            </div>
          </div>

          {/* Country */}
          <div className="border rounded-2xl p-5 bg-gray-50 flex items-start gap-3">

            <FaGlobe className="text-indigo-600 text-xl mt-1" />

            <div>

              <p className="text-gray-500 text-sm mb-1">
                Country
              </p>

              <h3 className="font-semibold">
                {user?.country || "N/A"}
              </h3>

            </div>
          </div>

          {/* Address */}
          <div className="md:col-span-2 border rounded-2xl p-5 bg-gray-50">

            <p className="text-gray-500 text-sm mb-2">
              Address
            </p>

            <h3 className="font-semibold text-lg leading-relaxed">
              {user?.address || "N/A"}
            </h3>

          </div>

        </div>
      </div>
    </div>
  );
}