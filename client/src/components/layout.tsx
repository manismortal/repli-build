import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { 
  LayoutDashboard, 
  Package, 
  CheckSquare, 
  Wallet, 
  Users, 
  Settings,
  LogOut, 
  Ship,
  Languages
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout, language, setLanguage } = useAuth();
  const [location] = useLocation();

  if (!user) return <div className="min-h-screen bg-secondary/30">{children}</div>;

  const NavItem = ({ href, icon: Icon, label, labelBn }: { href: string; icon: any; label: string; labelBn: string }) => {
    const isActive = location === href;
    const displayLabel = language === "bn" ? labelBn : label;
    
    return (
      <Link href={href}>
        <div className="relative flex flex-col items-center justify-center flex-1 cursor-pointer min-w-[60px] py-2">
          <motion.div 
            initial={false}
            animate={{ 
              scale: isActive ? 1.2 : 1,
              y: isActive ? -4 : 0
            }}
            className={`p-2 rounded-2xl transition-all duration-300 ${
              isActive 
                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30' 
                : 'text-muted-foreground hover:bg-secondary/50'
            }`}
          >
            <Icon className="h-5 w-5" />
          </motion.div>
          <span className={`text-[10px] font-bold mt-1.5 transition-colors duration-300 ${
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
    { href: "/products", icon: Package, label: "Invest", labelBn: "প্যাকেজ" },
    { href: "/tasks", icon: CheckSquare, label: "Tasks", labelBn: "টাস্ক" },
    { href: "/wallet", icon: Wallet, label: "Wallet", labelBn: "ওয়ালেট" },
    { href: "/team", icon: Users, label: "Team", labelBn: "নেটওয়ার্ক" },
    { href: "/settings", icon: Settings, label: "Settings", labelBn: "সেটিংস" },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans">
      {/* Top Header - Global */}
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
              <Button variant="ghost" size="icon" className="text-muted-foreground h-9 w-9 rounded-xl hover:bg-secondary">
                <Languages className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-xl border-none shadow-xl">
              <DropdownMenuItem onClick={() => setLanguage("bn")} className="rounded-lg font-medium">বাংলা (Bengali)</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage("en")} className="rounded-lg font-medium">English</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex flex-col items-end px-3 py-1 bg-secondary/50 rounded-xl border border-border/50">
            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest leading-tight">
              {language === "bn" ? "ব্যালেন্স" : "Balance"}
            </span>
            <span className="text-sm font-bold text-primary">৳{user.balance.toLocaleString()}</span>
          </div>
          
          <Button variant="ghost" size="icon" onClick={logout} className="text-muted-foreground hover:text-destructive h-9 w-9 rounded-xl hover:bg-destructive/10">
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 pb-32 overflow-y-auto">
        <div className="p-4 md:p-8 max-w-lg mx-auto md:max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-700">
          {children}
        </div>
      </main>

      {/* Modern Bottom Navigation */}
      <div className="fixed bottom-4 left-4 right-4 z-50 pointer-events-none">
        <nav className="max-w-md mx-auto h-20 bg-card/90 backdrop-blur-xl border border-white/20 rounded-[2.5rem] flex items-center justify-around px-4 shadow-[0_20px_50px_rgba(0,0,0,0.15)] pointer-events-auto">
          {navigation.map((item) => (
            <NavItem key={item.href} {...item} />
          ))}
        </nav>
      </div>
    </div>
  );
}
