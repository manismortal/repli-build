import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { User } from "@shared/schema";

interface UserAvatarProps {
  user: User & { hasPackage?: boolean };
  className?: string;
  showStatus?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
}

export function UserAvatar({ user, className, showStatus = true, size = "md" }: UserAvatarProps) {
  const hasPackage = user.hasPackage;
  
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
    xl: "h-24 w-24"
  };

  return (
    <div className={cn("relative inline-block", className)}>
      <Avatar className={cn("border-2 border-primary/50 p-0.5 bg-white", sizeClasses[size])}>
        {hasPackage ? (
          <AvatarImage 
            src="/attached_assets/maersk_shipping_container_vessel_at_sea.png" 
            alt="Ship" 
            className="object-cover" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
            {size === "xl" ? "😢" : "👤"}
          </div>
        )}
      </Avatar>
      
      {showStatus && (
        <div className={cn(
          "absolute rounded-full border-2 border-slate-900 shadow-lg",
          hasPackage ? "bg-green-500" : "bg-red-500",
          size === "xl" ? "bottom-1 right-1 h-6 w-6" : "bottom-0 right-0 h-3 w-3"
        )} />
      )}
    </div>
  );
}
