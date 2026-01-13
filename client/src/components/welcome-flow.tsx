import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, ArrowRight, Wallet, CheckCircle2, X } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

export function WelcomeFlow() {
  const { user } = useAuth();
  const [showWelcome, setShowWelcome] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    // Logic: If user exists, is not an admin (optional, maybe admins don't need it), 
    // and hasn't seen welcome, show it.
    if (user && !user.hasSeenWelcome) {
      // Small delay for better UX on load
      const timer = setTimeout(() => setShowWelcome(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [user]);

  const handleClaim = async () => {
    setShowWelcome(false);
    setShowTutorial(true);
    
    // Mark as seen in backend
    try {
        await fetch("/api/user/welcome-seen", { method: "POST" });
        // Invalidate user query to update local state if needed (though we rely on local state for the flow now)
        queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
    } catch (e) {
        console.error("Failed to mark welcome as seen", e);
    }
  };

  const handleJoinTelegram = () => {
      window.open("https://t.me/maersk_bd", "_blank");
  };

  const handleTutorialClose = () => {
      setShowTutorial(false);
  };

  return (
    <>
      {/* 1. Welcome Bonus Popup */}
      <Dialog open={showWelcome} onOpenChange={setShowWelcome}>
        <DialogContent className="sm:max-w-md border-0 bg-transparent p-0 shadow-none overflow-hidden" hideCloseButton>
            <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-950 text-white rounded-3xl p-1 shadow-2xl border border-white/10"
            >
                <div className="bg-black/20 backdrop-blur-sm rounded-[20px] p-6 text-center relative overflow-hidden">
                    {/* Confetti / Background FX */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <motion.div 
                             animate={{ y: [0, -100, 0], rotate: [0, 360], opacity: [0.5, 0.8, 0.5] }}
                             transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                             className="absolute top-10 right-10 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl"
                        />
                         <motion.div 
                             animate={{ y: [0, 100, 0], rotate: [0, -360], opacity: [0.5, 0.8, 0.5] }}
                             transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                             className="absolute bottom-10 left-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl"
                        />
                    </div>

                    <div className="relative z-10 flex flex-col items-center">
                        <motion.div 
                            animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="bg-gradient-to-br from-yellow-300 to-amber-600 p-4 rounded-full shadow-lg shadow-amber-500/30 mb-4"
                        >
                            <Gift className="h-10 w-10 text-white" />
                        </motion.div>
                        
                        <h2 className="text-2xl font-bold font-heading mb-1 bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">Congratulations!</h2>
                        <p className="text-indigo-200 text-sm mb-6">Account Created Successfully</p>
                        
                        <div className="bg-white/10 border border-white/10 rounded-xl p-4 w-full mb-6">
                            <p className="text-xs text-indigo-300 uppercase tracking-widest font-bold mb-1">Welcome Bonus</p>
                            <p className="text-4xl font-black text-yellow-400 drop-shadow-sm">৳250</p>
                            <p className="text-[10px] text-indigo-300 mt-1">Has been credited to your wallet</p>
                        </div>

                        <div className="space-y-3 w-full">
                            <Button 
                                onClick={handleClaim}
                                className="w-full bg-gradient-to-r from-yellow-400 to-amber-600 hover:from-yellow-500 hover:to-amber-700 text-white font-bold py-6 text-lg shadow-lg shadow-amber-500/20 rounded-xl transition-all active:scale-95"
                            >
                                Claim Bonus
                            </Button>
                            
                            <Button 
                                variant="outline" 
                                onClick={handleJoinTelegram}
                                className="w-full border-white/20 text-white hover:bg-white/10 bg-transparent rounded-xl"
                            >
                                Join Telegram Group
                            </Button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </DialogContent>
      </Dialog>

      {/* 2. Tutorial Popup */}
      <Dialog open={showTutorial} onOpenChange={setShowTutorial}>
        <DialogContent className="sm:max-w-lg rounded-2xl overflow-hidden p-0 gap-0">
             <div className="bg-indigo-600 p-6 text-white text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                <h2 className="text-xl font-bold font-heading relative z-10">Quick Start Guide</h2>
                <p className="text-indigo-100 text-sm relative z-10">Follow these simple steps to start earning</p>
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-2 right-2 text-white/70 hover:text-white hover:bg-white/10"
                    onClick={handleTutorialClose}
                >
                    <X className="h-4 w-4" />
                </Button>
             </div>

             <div className="p-6 space-y-6 bg-white">
                {/* User Snapshot */}
                <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold">
                            {user?.username?.[0]?.toUpperCase()}
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 font-bold uppercase">Account</p>
                            <p className="text-sm font-bold text-slate-800">{user?.username}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-slate-500 font-bold uppercase">Balance</p>
                        <p className="text-sm font-bold text-green-600">৳250.00</p>
                    </div>
                </div>

                {/* Steps */}
                <div className="space-y-4">
                    <div className="flex gap-4">
                        <div className="flex-none">
                            <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">1</div>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-800">Deposit Funds</h4>
                            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                Go to <span className="font-bold text-slate-700">Wallet</span> page, click "Deposit", select your method (Bkash/Nagad/Binance), and follow the instructions to add funds.
                            </p>
                        </div>
                    </div>
                    
                    <div className="relative pl-4">
                         <div className="absolute left-[19px] -top-6 bottom-4 w-0.5 bg-slate-100"></div>
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-none">
                            <div className="h-8 w-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm">2</div>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-800">Complete Tasks</h4>
                            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                Go to <span className="font-bold text-slate-700">Tasks</span> page. Click "Start Task" on any available task. Watch the video for 60 seconds, then claim your reward!
                            </p>
                        </div>
                    </div>
                </div>

                <div className="pt-2">
                    <Button 
                        onClick={handleTutorialClose} 
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-5 rounded-xl shadow-lg shadow-indigo-200"
                    >
                        Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
             </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
