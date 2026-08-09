"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isTokenExpired } from "../app/utils/auth";

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem("token");

      

      if (!token || isTokenExpired(token)) {
        console.log("Redirecting to login...");
        localStorage.removeItem("token");
        router.replace("/login");
        return false;
      }

      return true;
    };

    // Initial check
    const valid = checkToken();

    if (valid) {
      setChecking(false);
    }

    // Check every 10 seconds
    const interval = setInterval(() => {
      checkToken();
    }, 10000);

    return () => clearInterval(interval);
  }, [router]);

  if (checking) {
    return null;
  }

  return children;
}