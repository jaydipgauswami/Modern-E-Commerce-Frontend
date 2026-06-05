"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/component/Navbar";
import Footer from "@/component/Footer";

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();

  const hideLayoutRoutes = ["/login", "/register"];

  const shouldHideLayout = hideLayoutRoutes.includes(pathname);

  return (
    <>
      {!shouldHideLayout && <Navbar />}

    <main className={!shouldHideLayout ? "pt-20 grow" : "grow"}>
        {children}
      </main>
      {!shouldHideLayout && <Footer />}
    </>
  );
}