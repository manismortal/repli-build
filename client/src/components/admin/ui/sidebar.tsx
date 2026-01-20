import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Wallet,
  Settings,
  Package,
  ArrowDownLeft,
  ArrowUpRight,
  Bell,
  LogOut,
  ShieldAlert,
  FileText,
  Smartphone,
  CheckSquare,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const [location] = useLocation();
  const { logout } = useAuth();

  const menu = [
    { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/admin/users", icon: Users, label: "User Management" },
    { href: "/admin/deposits", icon: ArrowDownLeft, label: "Deposits" },
    { href: "/admin/withdrawals", icon: ArrowUpRight, label: "Withdrawals" },
    { href: "/admin/packages", icon: Package, label: "Packages" },
    { href: "/admin/tasks", icon: CheckSquare, label: "Tasks" },
    { href: "/admin/banking", icon: Clock, label: "Banking Hours" },
    { href: "/admin/agents", icon: Smartphone, label: "Agent Numbers" },
    { href: "/admin/reports", icon: FileText, label: "Reports" },
    { href: "/admin/notifications", icon: Bell, label: "Notifications" },
    { href: "/admin/settings", icon: Settings, label: "Site Settings" },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 h-full w-64 bg-card border-r z-50 transition-transform duration-300 ease-in-out md:translate-x-0 md:static",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-16 flex items-center px-6 border-b">
          <ShieldAlert className="h-6 w-6 text-primary mr-2" />
          <span className="font-heading font-bold text-xl tracking-tight">Admin<span className="text-primary">Panel</span></span>
        </div>

        <div className="p-4 space-y-1 overflow-y-auto h-[calc(100%-4rem)] flex flex-col">
          <p className="px-4 py-2 text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Main Menu</p>
          {menu.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;
            
            return (
              <Link key={item.href} href={item.href}>
                <div className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer group",
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25" 
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                )}>
                  <Icon className="h-5 w-5" />
                  <span className="text-sm font-bold">{item.label}</span>
                  {isActive && <div className="ml-auto h-1.5 w-1.5 rounded-full bg-white animate-pulse" />}
                </div>
              </Link>
            );
          })}

          <div className="mt-auto pt-4 border-t">
            <Button 
              variant="destructive" 
              className="w-full justify-start rounded-xl h-12 pl-4 font-bold"
              onClick={() => logout()}
            >
              <LogOut className="h-5 w-5 mr-3" />
              Logout
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
