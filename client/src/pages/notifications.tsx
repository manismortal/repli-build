import { useAuth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Shield, Info, ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import type { Notification } from "@shared/schema";

export default function Notifications() {
  const { language } = useAuth();

  const { data: notifications, isLoading } = useQuery<Notification[]>({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await fetch("/api/notifications");
      if (!res.ok) throw new Error("Failed to fetch notifications");
      return res.json();
    },
  });

  const t = {
    title: language === "bn" ? "বিজ্ঞপ্তি" : "Notifications",
    empty: language === "bn" ? "কোনো নতুন বিজ্ঞপ্তি নেই" : "No new notifications",
    sub: language === "bn" ? "আপনার অ্যাকাউন্টের আপডেট এখানে দেখুন" : "View your account updates here"
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-32">
      <header>
        <h1 className="text-4xl font-heading font-bold mb-2">{t.title}</h1>
        <p className="text-muted-foreground text-lg">{t.sub}</p>
      </header>

      <div className="space-y-3">
        {isLoading ? (
          <p className="text-center text-muted-foreground">Loading...</p>
        ) : notifications?.length === 0 ? (
          <div className="text-center py-10">
            <Bell className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">{t.empty}</p>
          </div>
        ) : (
          notifications?.map((notif) => (
            <Card key={notif.id} className="hover-elevate border-none shadow-sm overflow-hidden bg-card/50 backdrop-blur-sm">
              <CardContent className="p-4 flex items-center gap-4">
                <div className={`h-12 w-12 rounded-2xl bg-secondary flex items-center justify-center text-blue-600`}>
                  <Bell className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-bold tracking-tight">Notification</p>
                    <span className="text-[10px] text-muted-foreground uppercase font-bold">
                      {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{notif.message}</p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <div className="bg-primary/5 p-6 rounded-[2.5rem] border border-primary/10 text-center space-y-2 mt-8">
        <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
          <Info className="h-6 w-6" />
        </div>
        <p className="text-sm font-bold text-primary">{language === "bn" ? "সব আপডেট দেখুন" : "View all updates"}</p>
        <p className="text-xs text-muted-foreground">{language === "bn" ? "আপনার অ্যাকাউন্টের নিরাপত্তা নিশ্চিত করুন" : "Ensure your account security"}</p>
      </div>
    </div>
  );
}
