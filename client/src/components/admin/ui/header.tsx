import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/user-avatar";
import { useAuth } from "@/lib/auth";
import { Bell, Search, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";

interface AdminHeaderProps {
  onMenuClick: () => void;
}

export function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const { user } = useAuth();

  return (
    <header className="h-16 border-b bg-card/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenuClick}>
          <Menu className="h-5 w-5" />
        </Button>
        <div className="relative hidden md:block w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search..." 
            className="pl-9 h-9 bg-secondary/50 border-none focus-visible:ring-1"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-primary">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border-2 border-card" />
        </Button>
        
        <div className="flex items-center gap-3 pl-4 border-l border-border/50">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold leading-none">{user?.name || "Admin"}</p>
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">{user?.role || "Administrator"}</p>
          </div>
          <UserAvatar user={user as any} size="sm" showStatus={true} />
        </div>
      </div>
    </header>
  );
}
