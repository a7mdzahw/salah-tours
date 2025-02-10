import Link from "next/link";
import { Home, Map, FolderTree, Info, LogOut } from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: Home },
  { name: "Tours", href: "/admin/tours", icon: Map },
  { name: "Categories", href: "/admin/categories", icon: FolderTree },
  { name: "Homepage Info", href: "/admin/info", icon: Info },
];

export default function Sidebar() {
  return (
    <div className="flex h-full w-64 flex-col bg-primary-800">
      <div className="flex h-16 items-center justify-center">
        <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
      </div>
      
      <nav className="flex-1 space-y-1 px-2 py-4">
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex items-center px-2 py-2 text-base font-medium text-primary-100 hover:bg-primary-700 rounded-md"
          >
            <item.icon className="mr-4 h-6 w-6" />
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="flex items-center px-4 py-4 hover:bg-primary-700 cursor-pointer">
        <LogOut className="mr-4 h-6 w-6 text-primary-100" />
        <span className="text-primary-100">Logout</span>
      </div>
    </div>
  );
} 