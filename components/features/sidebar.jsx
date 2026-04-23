"use client";

import { useEffect, useState } from "react";

export default function Sidebar({ selectedCategory, setSelectedCategory }) {
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false); // mobile toggle

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/catagories");
        const data = await res.json();
        setCategories(data.categories || []);
      } catch (err) {
        console.log("Category fetch error:", err);
      }
    };

    fetchCategories();
  }, []);

  return (
    <>
      {/* 🔹 Mobile Toggle Button */}
      <button
        className="md:hidden p-2 border m-2 rounded"
        onClick={() => setOpen(true)}
      >
        ☰ Categories
      </button>

      {/* 🔹 Overlay (mobile) */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* 🔹 Sidebar */}
     <div
  className={`
  w-64  bg-white border-r
  transform transition-transform duration-300
  ${open ? "translate-x-0" : "-translate-x-full"}
  md:translate-x-0 md:relative  flex flex-col
`}  
>
        {/* Header */}
       <div className="flex justify-between items-center p-4 border-b">
    <h2 className="font-bold text-lg">
      Categories
    </h2>

    {/* ONLY MOBILE BUTTON */}
    <button
      className="md:hidden"
      onClick={() => setOpen(false)}
    >
      ✕
    </button>
  </div>

        {/* Category List */}
        <ul className="p-3 space-y-2">
          {/* All */}
          <li
            onClick={() => {
              setSelectedCategory("all");
              setOpen(false);
            }}
            className={`cursor-pointer px-3 py-2 rounded ${
              selectedCategory === "all"
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-100"
            }`}
          >
            All
          </li>

          {/* Dynamic categories */}
          {categories.map((cat) => (
            <li
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setOpen(false);
              }}
              className={`cursor-pointer px-3 py-2 rounded ${
                selectedCategory === cat.id
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              {cat.name}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}