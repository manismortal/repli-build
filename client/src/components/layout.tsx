import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { 
  LayoutDashboard, 
  User, 
  Bell,
  Ship,
  Languages,
  LogOut,
  Package
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout, language, setLanguage } = useAuth();
  const [location] = useLocation();

  if (!user) return <div className="min-h-screen bg-secondary/30">{children}</div>;

  const NavItem = ({ href, icon: Icon, label, labelBn }: { href: string; icon: any; label: string; labelBn: string }) => {
    const isActive = location === href || (href === "/profile" && ["/wallet", "/tasks", "/settings", "/team"].includes(location));
    const displayLabel = language === "bn" ? labelBn : label;
    
    return (
      <Link href={href}>
        <div className="relative flex flex-col items-center justify-center cursor-pointer px-6 py-2">
          <motion.div 
            initial={false}
            animate={{ 
              scale: isActive ? 1.1 : 1,
            }}
            className={`p-3 rounded-2xl transition-all duration-300 ${
              isActive 
                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30' 
                : 'text-muted-foreground hover:bg-secondary/50'
            }`}
          >
            <Icon className="h-6 w-6" />
          </motion.div>
          <span className={`text-[11px] font-bold mt-1.5 transition-colors duration-300 ${
            isActive ? 'text-primary' : 'text-muted-foreground'
          }`}>
            {displayLabel}
          </span>
          {isActive && (
            <motion.div 
              layoutId="nav-glow"
              className="absolute -bottom-1 h-1.5 w-1.5 bg-primary rounded-full shadow-[0_0_10px_rgba(var(--primary),0.8)]"
            />
          )}
        </div>
      </Link>
    );
  };

  const navigation = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Home", labelBn: "মূলপাতা" },
    { href: "/products", icon: Package, label: "Packages", labelBn: "প্যাকেজ" },
    { href: "/notifications", icon: Bell, label: "Notifications", labelBn: "বিজ্ঞপ্তি" },
    { href: "/profile", icon: User, label: "Profile", labelBn: "প্রোফাইল" },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans">
      {/* Top Header */}
      <header className="h-16 border-b bg-card/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 p-1.5 rounded-lg">
            <Ship className="h-5 w-5 text-primary" />
          </div>
          <span className="font-heading font-bold text-lg tracking-tight">MAERSK.LINE</span>
        </div>
        <div className="flex items-center gap-3">
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
              {language === "bn" ? "ব্যালেন্স" : "Balance"}
            </span>
            <span className="text-sm font-bold text-primary">৳{user.balance.toLocaleString()}</span>
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
      <div className="fixed bottom-6 left-0 right-0 z-50 px-6 pointer-events-none">
        <nav className="max-w-sm mx-auto h-20 bg-card/90 backdrop-blur-xl border border-white/20 rounded-[2.5rem] flex items-center justify-between px-4 shadow-[0_20px_50px_rgba(0,0,0,0.15)] pointer-events-auto">
          {navigation.map((item) => (
            <NavItem key={item.href} {...item} />
          ))}
        </nav>
      </div>
    </div>
  );
}
