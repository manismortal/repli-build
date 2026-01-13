import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, X, Wallet, Trophy, Users, Star } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

type NotificationType = "welcome" | "deposit_approved" | "withdrawal_approved" | "referral_bonus" | "general";

interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export function EventPopups() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activePopup, setActivePopup] = useState<Notification | null>(null);

  // Poll for notifications frequently (every 10s) to catch real-time events
  const { data: notifications } = useQuery<Notification[]>({
    queryKey: ["notifications", user?.id],
    queryFn: async () => {
      const res = await fetch("/api/notifications");
      if (!res.ok) return [];
      return res.json();
    },
    refetchInterval: 10000,
    enabled: !!user
  });

  useEffect(() => {
    if (!notifications) return;

    // Filter for unread special events
    const unreadSpecialEvents = notifications.filter(n => 
        !n.isRead && ["deposit_approved", "withdrawal_approved", "referral_bonus"].includes(n.type)
    );

    // If we found one, and we aren't already showing one, show it
    if (unreadSpecialEvents.length > 0 && !activePopup) {
        setActivePopup(unreadSpecialEvents[0]);
    }
  }, [notifications, activePopup]);

  const handleClose = async () => {
      if (!activePopup) return;
      
      // Mark as read immediately
      try {
          await fetch(`/api/notifications/${activePopup.id}/read`, { method: "POST" });
          // Invalidate to update list
          queryClient.invalidateQueries({ queryKey: ["notifications"] });
      } catch (e) {
          console.error("Failed to mark as read", e);
      }
      
      setActivePopup(null);
  };

  if (!activePopup) return null;

  // Configuration based on type
  const config = {
      deposit_approved: {
          icon: Wallet,
          color: "text-green-500",
          bgColor: "bg-green-100",
          borderColor: "border-green-200",
          title: "Deposit Successful!",
          gradient: "from-green-600 to-emerald-600",
          animation: { scale: [1, 1.2, 1] }
      },
      withdrawal_approved: {
          icon: CheckCircle2,
          color: "text-blue-500",
          bgColor: "bg-blue-100",
          borderColor: "border-blue-200",
          title: "Withdrawal Approved!",
          gradient: "from-blue-600 to-indigo-600",
          animation: { rotate: [0, 10, -10, 0] }
      },
      referral_bonus: {
          icon: Users,
          color: "text-purple-500",
          bgColor: "bg-purple-100",
          borderColor: "border-purple-200",
          title: "Referral Bonus!",
          gradient: "from-purple-600 to-pink-600",
          animation: { y: [0, -10, 0] }
      }
  };

  const currentConfig = config[activePopup.type as keyof typeof config] || config.deposit_approved;
  const Icon = currentConfig.icon;

  return (
    <Dialog open={!!activePopup} onOpenChange={(open) => !open && handleClose()}>
        <DialogContent className="sm:max-w-md border-0 bg-transparent p-0 shadow-none overflow-hidden" hideCloseButton>
            <motion.div 
                initial={{ scale: 0.8, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 50 }}
                className="bg-white rounded-[2rem] p-1 shadow-2xl overflow-hidden"
            >
                <div className={`bg-gradient-to-br ${currentConfig.gradient} p-8 text-center relative overflow-hidden rounded-t-[1.8rem]`}>
                    {/* Background FX */}
                    <div className="absolute inset-0 opacity-20">
                         <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-3xl -mr-10 -mt-10"></div>
                         <div className="absolute bottom-0 left-0 w-24 h-24 bg-black rounded-full blur-2xl -ml-10 -mb-10"></div>
                    </div>

                    <div className="relative z-10 flex flex-col items-center">
                        <motion.div 
                            animate={currentConfig.animation}
                            transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
                            className="bg-white p-4 rounded-full shadow-lg mb-4"
                        >
                            <Icon className={`h-10 w-10 ${currentConfig.color}`} />
                        </motion.div>
                        <h2 className="text-2xl font-black font-heading text-white tracking-tight">{currentConfig.title}</h2>
                    </div>
                </div>

                <div className="p-8 text-center bg-white rounded-b-[1.8rem]">
                    <p className="text-slate-600 font-medium leading-relaxed mb-6">
                        {activePopup.message}
                    </p>
                    
                    <Button 
                        onClick={handleClose}
                        className={`w-full py-6 text-lg font-bold shadow-lg rounded-xl bg-gradient-to-r ${currentConfig.gradient} hover:opacity-90 transition-opacity`}
                    >
                        Awesome!
                    </Button>
                </div>
            </motion.div>
        </DialogContent>
    </Dialog>
  );
}
