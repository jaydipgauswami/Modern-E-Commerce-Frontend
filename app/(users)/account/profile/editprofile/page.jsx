"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Toaster, toast } from "sonner";

import { FaUserCircle, FaCamera } from "react-icons/fa";

export default function EditProfile() {

    const router = useRouter();

    const [loading, setLoading] = useState(false);

    const [errors, setErrors] = useState({});

    const [form, setForm] = useState({
        first_name: "",
        last_name: "",
        email: "",
        dob: "",
        phone: "",
        address: "",
        state: "",
        country: "",
        pincode: "",
        image: "",
        preview: "",
    });

    // Handle Change
    const handleChange = (e) => {

        const { name, value } = e.target;

        setForm({
            ...form,
            [name]: value,
        });

        // Remove Error While Typing
        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));
    };

    // Handle Image
    const handleImage = (e) => {

        const file = e.target.files?.[0];

        if (!file) return;

        const previewUrl = URL.createObjectURL(file);

        setForm({
            ...form,
            image: previewUrl,
            preview: previewUrl,
        });
    };

    // Validation
    const validateForm = () => {

        const newErrors = {};

        // First Name
        if (!form.first_name.trim()) {
            newErrors.first_name = "First name is required";
        }

        // Last Name
        if (!form.last_name.trim()) {
            newErrors.last_name = "Last name is required";
        }

        // Email
        if (!form.email.trim()) {

            newErrors.email = "Email is required";

        } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
                form.email
            )
        ) {

            newErrors.email = "Invalid email address";
        }

        // Phone
        if (!form.phone.trim()) {

            newErrors.phone = "Phone number is required";

        } else if (!/^\d{10}$/.test(form.phone)) {

            newErrors.phone =
                "Phone number must be 10 digits";
        }

        // Pincode
        if (
            form.pincode &&
            !/^\d{6}$/.test(form.pincode)
        ) {

            newErrors.pincode =
                "Pincode must be 6 digits";
        }

        // DOB
        if (form.dob) {

            const today = new Date();

            const selectedDate = new Date(form.dob);

            if (selectedDate > today) {
                newErrors.dob =
                    "Future date is not allowed";
            }
        }

        // Address
        if (!form.address.trim()) {
            newErrors.address = "Address is required";
        }

        // State
        if (!form.state.trim()) {
            newErrors.state = "State is required";
        }

        // Country
        if (!form.country.trim()) {
            newErrors.country = "Country is required";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    // Submit
    const handleSubmit = async (e) => {

        e.preventDefault();

        // Validate First
        const isValid = validateForm();

        if (!isValid) {
            toast.error("Please fix validation errors");
            return;
        }

        try {

            setLoading(true);

            const token = localStorage.getItem("token");

            const res = await fetch(
                "http://localhost:5000/api/users/update-profile",
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },

                    body: JSON.stringify({
                        first_name: form.first_name || null,
                        last_name: form.last_name || null,
                        dob: form.dob || null,
                        phone: form.phone || null,
                        address: form.address || null,
                        state: form.state || null,
                        country: form.country || null,
                        pincode: form.pincode || null,
                        image: form.image || null,
                    }),
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(
                    data.message || "Failed to update profile"
                );
            }

            toast.success(
                "Profile updated successfully"
            );

            router.push("/account/profile");

        } catch (error) {

            console.log("Update Error:", error.message);

            toast.error(error.message);

        } finally {

            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">

            <Toaster position="top-right" />

            <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow">

                <h1 className="text-2xl font-bold mb-6">
                    Edit Profile
                </h1>

                <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >

                    {/* Image */}
                    <div className="md:col-span-2 flex flex-col items-center gap-4">

                        <label className="font-medium">
                            Profile Image
                        </label>

                        <div className="relative w-28 h-28">

                            <div className="w-full h-full rounded-full border flex items-center justify-center overflow-hidden bg-gray-100">

                                {form.preview ? (
                                    <img
                                        src={form.preview}
                                        alt="preview"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <FaUserCircle className="text-6xl text-gray-400" />
                                )}

                            </div>

                            <label className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full cursor-pointer hover:bg-indigo-700 shadow-md">

                                <FaCamera />

                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImage}
                                    className="hidden"
                                />
                            </label>
                        </div>
                    </div>

                    {/* First Name */}
                    <div>
                        <input
                            name="first_name"
                            placeholder="First Name"
                            value={form.first_name}
                            onChange={handleChange}
                            className="border p-3 rounded-lg w-full"
                        />

                        {errors.first_name && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.first_name}
                            </p>
                        )}
                    </div>

                    {/* Last Name */}
                    <div>
                        <input
                            name="last_name"
                            placeholder="Last Name"
                            value={form.last_name}
                            onChange={handleChange}
                            className="border p-3 rounded-lg w-full"
                        />
                        {errors.last_name && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.last_name}
                            </p>
                        )}
                    </div>
                    {/* Email */}
                    <div>
                        <input
                            name="email"
                            type="email"
                            placeholder="Email"
                            value={form.email}
                            onChange={handleChange}
                            className="border p-3 rounded-lg w-full"
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.email}
                            </p>
                        )}
                    </div>
                    {/* DOB */}
                    <div>
                        <input
                            name="dob"
                            type="date"
                            value={form.dob}
                            onChange={handleChange}
                            className="border p-3 rounded-lg w-full"
                        />
                        {errors.dob && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.dob}
                            </p>
                        )}
                    </div>

                    {/* Phone */}
                    <div>
                        <input
                            name="phone"
                            placeholder="Phone Number"
                            value={form.phone}
                            onChange={handleChange}
                            className="border p-3 rounded-lg w-full"
                        />

                        {errors.phone && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.phone}
                            </p>
                        )}
                    </div>

                    {/* Pincode */}
                        <input
                    <div>
                            name="pincode"
                            placeholder="Pincode"
                            value={form.pincode}
                            onChange={handleChange}
                            className="border p-3 rounded-lg w-full"
                        />

                        {errors.pincode && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.pincode}
                            </p>
                        )}
                    </div>

                    {/* State */}
                    <div>
                        <input
                            name="state"
                            placeholder="State"
                            value={form.state}
                            onChange={handleChange}
                            className="border p-3 rounded-lg w-full"
                        />

                        {errors.state && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.state}
                            </p>
                        )}
                    </div>

                    {/* Country */}
                    <div>
                        <input
                            name="country"
                            placeholder="Country"
                            value={form.country}
                            onChange={handleChange}
                            className="border p-3 rounded-lg w-full"
                        />

                        {errors.country && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.country}
                            </p>
                        )}
                    </div>

                    {/* Address */}
                    <div className="md:col-span-2">

                        <textarea
                            name="address"
                            placeholder="Address"
                            value={form.address}
                            onChange={handleChange}
                            className="border p-3 rounded-lg w-full"
                        />
                        {errors.address && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.address}
                            </p>
                        )}
                    </div>
                    {/* Submit */}
                    <div className="md:col-span-2 flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
                        >
                            {loading
                                ? "Saving..."
                                : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}