import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { User } from "@shared/schema";

interface UserAvatarProps {
  user: User & { hasPackage?: boolean };
  className?: string;
  showStatus?: boolean; // If true, shows the dot. If false, parent handles it or hidden.
  size?: "sm" | "md" | "lg" | "xl";
}

export function UserAvatar({ user, className, showStatus = true, size = "md" }: UserAvatarProps) {
  const hasPackage = user?.hasPackage;
  
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
    xl: "h-24 w-24"
  };

  const statusSize = {
    sm: "h-2.5 w-2.5",
    md: "h-3.5 w-3.5",
    lg: "h-4 w-4",
    xl: "h-6 w-6"
  };

  // Deterministic avatar based on user ID
  const avatarIndex = user?.id 
    ? (user.id.charCodeAt(0) % 4) + 1 
    : 1;
  const avatarSrc = `/avater/avater${avatarIndex}.webp`;

  return (
    <div className={cn("relative inline-flex", className)}>
      <Avatar className={cn(
          "bg-slate-100 ring-2 ring-white dark:ring-slate-800", 
          sizeClasses[size],
          hasPackage ? "ring-green-500/30" : "ring-slate-200"
      )}>
        <AvatarImage 
          src={avatarSrc} 
          alt={user?.name || "User"} 
          className="object-cover h-full w-full"
        />
        <AvatarFallback className="bg-slate-200 text-slate-500 font-bold">
          {user?.name?.charAt(0).toUpperCase() || user?.username?.charAt(0).toUpperCase() || "U"}
        </AvatarFallback>
      </Avatar>
      
      {showStatus && (
        <span className={cn(
          "absolute bottom-0 right-0 rounded-full border-2 border-white dark:border-slate-900",
          hasPackage ? "bg-green-500" : "bg-slate-400",
          statusSize[size]
        )} />
      )}
    </div>
  );
}