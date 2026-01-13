import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import { 
  LayoutDashboard, 
  User, 
  Bell,
  Ship,
  Languages,
  LogOut,
  Package,
  ShieldCheck,
  HeadphonesIcon,
  CheckSquare,
  Users,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout, language, setLanguage } = useAuth();
  const { t } = useTranslation();
  const [location] = useLocation();
  
  const { data: notifications = [] } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await fetch("/api/notifications");
      if (!res.ok) return [];
      return res.json();
    },
    enabled: !!user,
  });

  const unreadCount = Array.isArray(notifications) ? notifications.filter((n: any) => !n.isRead).length : 0;

  const NavItem = ({ href, icon: Icon, labelKey }: { href: string; icon: any; labelKey: string }) => {
    const isActive = location === href || (href === "/profile" && ["/wallet", "/settings", "/team"].includes(location));
    const displayLabel = t(labelKey);
    
    return (
      <Link href={href}>
        <div className="relative flex flex-col items-center justify-center cursor-pointer flex-1 py-1">
          <motion.div 
            initial={false}
            animate={{ 
              scale: isActive ? 1.1 : 1,
            }}
            className={`p-2.5 rounded-2xl transition-all duration-300 ${
              isActive 
                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30' 
                : 'text-muted-foreground hover:bg-secondary/50'
            }`}
          >
            <Icon className="h-5 w-5" />
          </motion.div>
          <span className={`text-[10px] font-bold mt-1 transition-colors duration-300 ${
            isActive ? 'text-primary' : 'text-muted-foreground'
          }`}>
            {displayLabel}
          </span>
          {isActive && (
            <motion.div 
              layoutId="nav-glow"
              className="absolute -bottom-1 h-1 w-1 bg-primary rounded-full shadow-[0_0_10px_rgba(var(--primary),0.8)]"
            />
          )}
        </div>
      </Link>
    );
  };

  const navigation = [
    { href: "/dashboard", icon: LayoutDashboard, labelKey: "nav.home" },
    { href: "/products", icon: Package, labelKey: "nav.packages" },
    { href: "/tasks", icon: CheckSquare, labelKey: "nav.tasks" },
    { href: "/team", icon: Users, labelKey: "nav.referral" },
    { href: "/profile", icon: User, labelKey: "nav.profile" },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans">
      {/* Top Header */}
      <header className="h-16 border-b bg-card/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-50">
        <Link href="/dashboard">
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="bg-primary/10 p-1.5 rounded-lg">
              <Ship className="h-5 w-5 text-primary" />
            </div>
            <span className="font-heading font-bold text-lg tracking-tight">MAERSK.LINE</span>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          <Link href="/notifications">
            <Button variant="ghost" size="icon" className="text-muted-foreground h-9 w-9 rounded-xl hover:bg-secondary relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full ring-2 ring-white animate-pulse" />
              )}
            </Button>
          </Link>

          <Link href="/about">
            <Button variant="ghost" size="icon" className="text-muted-foreground h-9 w-9 rounded-xl hover:bg-secondary">
              <Info className="h-5 w-5" />
            </Button>
          </Link>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-muted-foreground h-9 w-9 rounded-xl">
                <Languages className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-xl">
              <DropdownMenuItem onClick={() => setLanguage("bn")}>বাংলা</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage("en")}>English</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex flex-col items-end px-3 py-1 bg-secondary/50 rounded-xl border">
            <span className="text-[9px] font-bold text-muted-foreground uppercase leading-tight">
              {t("common.balance")}
            </span>
            <span className="text-sm font-bold text-primary">৳{Number(user?.balance || 0).toLocaleString()}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pb-32 overflow-y-auto">
        <div className="p-4 md:p-8 max-w-lg mx-auto md:max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-700">
          {children}
        </div>
      </main>

      {/* Modern Consolidated Bottom Navigation */}
      <div className="fixed bottom-4 left-0 right-0 z-50 px-4 pointer-events-none">
        <nav className="max-w-md mx-auto h-18 bg-card/90 backdrop-blur-xl border border-white/20 rounded-3xl flex items-center justify-around px-2 shadow-[0_10px_30px_rgba(0,0,0,0.1)] pointer-events-auto">
          {navigation.map((item) => (
            <NavItem key={item.href} {...item} />
          ))}
        </nav>
      </div>
    </div>
  );
}
