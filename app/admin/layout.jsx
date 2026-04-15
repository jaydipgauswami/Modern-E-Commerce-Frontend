import Link from "next/link";
import { FaChartLine, FaBox, FaShoppingCart, FaUsers , FaThLarge } from "react-icons/fa";

const SidebarLink = ({ href, icon, label }) => {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 p-2 rounded hover:bg-gray-100"
    >
      {icon}
      {label}
    </Link>
  );
};

export default function AdminLayout({ children }) {
  return (
    <div className="flex h-screen mt-20">

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