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

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout, language, setLanguage } = useAuth();
  const [location] = useLocation();

  if (!user) return <div className="min-h-screen bg-secondary/30">{children}</div>;

  const NavItem = ({ href, icon: Icon, label, labelBn }: { href: string; icon: any; label: string; labelBn: string }) => {
    const isActive = location === href;
    const displayLabel = language === "bn" ? labelBn : label;
    return (
      <Link href={href}>
        <div className="flex flex-col items-center justify-center flex-1 cursor-pointer min-w-[50px]">
          <div className={`p-1 rounded-lg transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
            <Icon className={`h-6 w-6 ${isActive ? 'fill-primary/20' : ''}`} />
          </div>
          <span className={`text-[9px] font-medium mt-1 ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
            {displayLabel}
          </span>
          {isActive && <div className="absolute bottom-0 h-1 w-8 bg-primary rounded-t-full" />}
        </div>
      </Link>
    );
  };

  const navigation = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Home", labelBn: "মূলপাতা" },
    { href: "/products", icon: Package, label: "Invest", labelBn: "বিনিয়োগ" },
    { href: "/tasks", icon: CheckSquare, label: "Tasks", labelBn: "কাজ" },
    { href: "/wallet", icon: Wallet, label: "Wallet", labelBn: "ওয়ালেট" },
    { href: "/team", icon: Users, label: "Team", labelBn: "টিম" },
    { href: "/settings", icon: Settings, label: "Settings", labelBn: "সেটিংস" },
  ];

  return (
    <div className="min-h-screen bg-secondary/20 flex flex-col">
      {/* Top Header - Global */}
      <header className="h-16 border-b bg-card flex items-center justify-between px-6 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Ship className="h-6 w-6 text-primary" />
          <span className="font-heading font-bold text-lg tracking-tight">MAERSK.LINE</span>
        </div>
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-muted-foreground">
                <Languages className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setLanguage("bn")}>বাংলা</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage("en")}>English</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              {language === "bn" ? "ব্যালেন্স" : "Balance"}
            </span>
            <span className="text-sm font-bold text-primary">৳{user.balance.toLocaleString()}</span>
          </div>
          <Button variant="ghost" size="icon" onClick={logout} className="text-muted-foreground hover:text-destructive">
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 pb-24 overflow-y-auto">
        <div className="p-4 md:p-8 max-w-lg mx-auto md:max-w-4xl animate-in fade-in duration-500">
          {children}
        </div>
      </main>

      {/* Bottom Navigation - Mobile First */}
      <nav className="fixed bottom-0 left-0 right-0 h-20 bg-card border-t flex items-center justify-around px-2 pb-safe z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        {navigation.map((item) => (
          <NavItem key={item.href} {...item} />
        ))}
      </nav>
    </div>
  );
}
