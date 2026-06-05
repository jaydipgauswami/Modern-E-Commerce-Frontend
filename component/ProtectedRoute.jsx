"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isTokenExpired } from "../app/utils/auth";

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token || isTokenExpired(token)) {
      localStorage.removeItem("token");
      router.replace("/login");
      return;
    }

    setChecking(false);
  }, [router]);

  if (checking) {
    return null; // kuch render nahi hoga
  }

  return children;
}