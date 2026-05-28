"use client";
import Link from "next/link";
import { FaChartLine, FaBox, FaShoppingCart, FaUsers , FaThLarge } from "react-icons/fa";
import { useEffect} from "react";
import { useRouter , usePathname } from "next/navigation";
const SidebarLink = ({ href, icon, label }) => {
   const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Link
      href={href}
className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200
        ${
          isActive
            ? "bg-blue-500 text-white shadow-md"
            : "text-gray-700 hover:bg-gray-100 hover:text-blue-500"
        }
      `}    >
       <span className="text-lg">{icon}</span>
      <span className="font-medium">{label}</span>
    </Link>
  );
};

export default function AdminLayout({ children }) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    //  agar token nahi hai → login
    if (!token) {
      router.push("/login");
    }
  }, []);
  return (
    <div className="flex h-screen mt-0">

      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md flex flex-col">
        
        <div className="p-6 text-2xl font-bold border-b">
          Admin Panel
        </div>

        <nav className="flex-1 p-4 space-y-2">

          <SidebarLink
            href="/admin/dashboard"
            icon={<FaChartLine />}
            label="Dashboard"
          />

          <SidebarLink
            href="/admin/products"
            icon={<FaBox />}
            label="Products"
          />
             <SidebarLink
            href="/admin/Category"
            icon={ <FaThLarge /> }
            label="Category"
          />

          <SidebarLink
            href="/admin/orders"
            icon={<FaShoppingCart />}
            label="Orders"
          />

          <SidebarLink
            href="/admin/users"
            icon={<FaUsers />}
            label="Users"
          />

             <SidebarLink
            href="/admin/reports"
            icon={ <FaChartLine /> }
            label="Reports"
          />

         

        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-4 overflow-auto">
        {children}
      </div>

    </div>
  );
}