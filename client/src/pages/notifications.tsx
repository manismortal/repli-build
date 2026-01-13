import { useAuth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, Shield, Info, ArrowRight, CheckCheck } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import type { Notification } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Notifications() {
  const { language } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: notifications, isLoading } = useQuery<Notification[]>({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await fetch("/api/notifications");
      if (!res.ok) throw new Error("Failed to fetch notifications");
      return res.json();
    },
  });

  const readMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/notifications/read");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast({ title: "Success", description: "All notifications marked as read" });
    }
  });

  const t = {
    title: language === "bn" ? "বিজ্ঞপ্তি" : "Notifications",
    empty: language === "bn" ? "কোনো নতুন বিজ্ঞপ্তি নেই" : "No new notifications",
    sub: language === "bn" ? "আপনার অ্যাকাউন্টের আপডেট এখানে দেখুন" : "View your account updates here",
    loading: language === "bn" ? "লোড হচ্ছে..." : "Loading...",
    notif: language === "bn" ? "বিজ্ঞপ্তি" : "Notification",
    viewAll: language === "bn" ? "সব আপডেট দেখুন" : "View all updates",
    ensure: language === "bn" ? "আপনার অ্যাকাউন্টের নিরাপত্তা নিশ্চিত করুন" : "Ensure your account security",
    markRead: language === "bn" ? "সবগুলো পঠিত হিসেবে চিহ্নিত করুন" : "Mark all as read",
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-32">
      <header className="flex justify-between items-start">
        <div>
            <h1 className="text-4xl font-heading font-bold mb-2">{t.title}</h1>
            <p className="text-muted-foreground text-lg">{t.sub}</p>
        </div>
        {notifications && notifications.some(n => !n.isRead) && (
            <Button variant="outline" size="sm" onClick={() => readMutation.mutate()} disabled={readMutation.isPending}>
                <CheckCheck className="h-4 w-4 mr-2" />
                {t.markRead}
            </Button>
        )}
      </header>

      <div className="space-y-3">
        {isLoading ? (
          <p className="text-center text-muted-foreground">{t.loading}</p>
        ) : notifications?.length === 0 ? (
          <div className="text-center py-10">
            <Bell className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">{t.empty}</p>
          </div>
        ) : (
          notifications?.map((notif) => (
            <Card key={notif.id} className={`hover-elevate border-none shadow-sm overflow-hidden ${!notif.isRead ? 'bg-primary/5 border-l-4 border-l-primary' : 'bg-card/50 backdrop-blur-sm'}`}>
              <CardContent className="p-4 flex items-center gap-4">
                <div className={`h-12 w-12 rounded-2xl ${!notif.isRead ? 'bg-primary text-white' : 'bg-secondary text-blue-600'} flex items-center justify-center`}>
                  <Bell className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className={`font-bold tracking-tight ${!notif.isRead ? 'text-primary' : ''}`}>{t.notif}</p>
                    <span className="text-[10px] text-muted-foreground uppercase font-bold">
                      {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <p className={`text-xs leading-relaxed ${!notif.isRead ? 'text-slate-800 font-medium' : 'text-muted-foreground'}`}>{notif.message}</p>
                </div>
                {!notif.isRead && <div className="h-2 w-2 bg-primary rounded-full" />}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <div className="bg-primary/5 p-6 rounded-[2.5rem] border border-primary/10 text-center space-y-2 mt-8">
        <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
          <Info className="h-6 w-6" />
        </div>
        <p className="text-sm font-bold text-primary">{t.viewAll}</p>
        <p className="text-xs text-muted-foreground">{t.ensure}</p>
      </div>
    </div>
  );
}
