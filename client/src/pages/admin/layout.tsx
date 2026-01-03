import { Link, useLocation } from "wouter";
import { LayoutDashboard, Users, CreditCard, Package, LogOut, Wallet } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { logout } = useAuth();

  const links = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/deposits", label: "Deposits", icon: Wallet },
    { href: "/admin/withdrawals", label: "Withdrawals", icon: CreditCard },
    { href: "/admin/packages", label: "Packages", icon: Package },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-white border-r">
        <div className="p-6">
          <h1 className="text-2xl font-bold font-heading">Admin Panel</h1>
        </div>
        <nav className="space-y-1 px-3">
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              <a className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                location === link.href ? "bg-primary/10 text-primary" : "text-gray-700 hover:bg-gray-50"
              }`}>
                <link.icon className="mr-3 h-5 w-5" />
                {link.label}
              </a>
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 w-64 p-4 border-t">
          <Button variant="ghost" className="w-full justify-start text-red-600" onClick={() => logout()}>
            <LogOut className="mr-3 h-5 w-5" />
            Logout
          </Button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
}
