import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { 
  LayoutDashboard, 
  Package, 
  CheckSquare, 
  Wallet, 
  Users, 
  Ticket, 
  Shield, 
  LogOut, 
  Menu,
  Ship,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const [location] = useLocation();
  const [open, setOpen] = useState(false);

  if (!user) return <div className="min-h-screen bg-secondary/30">{children}</div>;

  const NavItem = ({ href, icon: Icon, label }: { href: string; icon: any; label: string }) => {
    const isActive = location === href;
    return (
      <Link href={href}>
        <Button
          variant={isActive ? "default" : "ghost"}
          className={`w-full justify-start gap-3 ${isActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-primary'}`}
          onClick={() => setOpen(false)}
        >
          <Icon className="h-5 w-5" />
          <span className="font-medium">{label}</span>
        </Button>
      </Link>
    );
  };

  const navigation = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/products", icon: Package, label: "Investments" },
    { href: "/tasks", icon: CheckSquare, label: "Daily Tasks" },
    { href: "/wallet", icon: Wallet, label: "Wallet" },
    { href: "/team", icon: Users, label: "My Team" },
    { href: "/lottery", icon: Ticket, label: "Lottery" },
  ];

  if (user.role === "admin") {
    navigation.push({ href: "/admin", icon: Shield, label: "Admin Panel" });
  }

  return (
    <div className="min-h-screen bg-secondary/30 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col bg-card border-r fixed h-full z-10">
        <div className="p-6 border-b flex items-center gap-3">
          <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
            <Ship className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-heading font-bold text-xl tracking-tight">MAERSK.Line</h1>
            <p className="text-xs text-muted-foreground tracking-wider">BANGLADESH</p>
          </div>
        </div>
        
        <div className="flex-1 py-6 px-4 space-y-1">
          {navigation.map((item) => (
            <NavItem key={item.href} {...item} />
          ))}
        </div>

        <div className="p-4 border-t bg-secondary/10">
          <div className="flex items-center gap-3 mb-4">
            <Avatar className="h-9 w-9 border-2 border-primary/20">
              <AvatarFallback className="bg-primary/10 text-primary font-bold">
                {user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user.mobile}</p>
            </div>
          </div>
          <Button variant="outline" className="w-full text-destructive hover:text-destructive hover:bg-destructive/10" onClick={logout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Mobile Nav & Main Content */}
      <main className="flex-1 md:ml-64 flex flex-col min-h-screen">
        <header className="md:hidden h-16 border-b bg-card flex items-center justify-between px-4 sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <Ship className="h-6 w-6 text-primary" />
            <span className="font-heading font-bold text-lg">MAERSK.Line</span>
          </div>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-72">
              <div className="p-6 border-b flex items-center gap-3 bg-secondary/30">
                <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                  <Ship className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="font-heading font-bold text-xl tracking-tight">MAERSK.Line</h1>
                  <p className="text-xs text-muted-foreground tracking-wider">BANGLADESH</p>
                </div>
              </div>
              <div className="py-6 px-4 space-y-1">
                {navigation.map((item) => (
                  <NavItem key={item.href} {...item} />
                ))}
              </div>
              <div className="absolute bottom-0 w-full p-4 border-t bg-secondary/10">
                <Button variant="destructive" className="w-full" onClick={logout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </header>

        <div className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
