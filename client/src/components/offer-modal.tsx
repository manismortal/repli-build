import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { X, ExternalLink, Zap } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Link } from "wouter";

export function OfferModal() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  
  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const res = await fetch("/api/settings");
      if (!res.ok) throw new Error("Failed to fetch settings");
      return res.json();
    },
  });

  useEffect(() => {
    // Logic:
    // 1. Settings loaded & Offer Active
    // 2. User logged in
    // 3. User HAS NO active subscription (!user.hasPackage)
    // 4. Not seen in this session yet
    
    if (settings?.offerModalActive && user && !user.hasPackage) {
        const hasSeen = sessionStorage.getItem(`offer-modal-${settings.updatedAt}`);
        
        if (!hasSeen) {
            // Track Impression
            console.log("Offer Modal Impression", { userId: user.id });
            // In a real app: send analytic event here
            
            setOpen(true);
            sessionStorage.setItem(`offer-modal-${settings.updatedAt}`, 'true');
        }
    }
  }, [settings, user]);

  if (!settings?.offerModalActive || !user || user.hasPackage) return null;

  const handleCtaClick = () => {
      console.log("Offer Modal CTA Click", { userId: user.id });
      setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-xs sm:max-w-md rounded-2xl p-0 overflow-hidden bg-white border-none shadow-2xl">
        <div className="relative">
             {/* Close Button */}
             <button 
                onClick={() => setOpen(false)}
                className="absolute top-3 right-3 z-20 bg-black/10 text-slate-500 rounded-full p-1 hover:bg-black/20 transition-colors"
             >
                <X className="h-5 w-5" />
             </button>

            {/* Header / Banner */}
            <div className="bg-gradient-to-br from-[#e2136e] to-[#c90d5e] p-6 text-white text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-white/10 skew-y-6 transform origin-bottom-left" />
                <div className="relative z-10 flex flex-col items-center gap-3">
                    <div className="h-12 w-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <Zap className="h-6 w-6 text-yellow-300 fill-yellow-300 animate-pulse" />
                    </div>
                    <DialogTitle className="text-2xl font-bold font-heading tracking-tight leading-none">
                        {settings.offerModalTitle}
                    </DialogTitle>
                </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4 text-center max-h-[60vh] overflow-y-auto">
                <div className="space-y-2">
                    <p className="text-slate-600 font-medium leading-relaxed whitespace-pre-wrap">
                        {settings.offerModalBenefits}
                    </p>
                </div>

                <div className="pt-2">
                    <Link href={settings.offerModalLink}>
                        <Button 
                            className="w-full h-12 text-lg font-bold rounded-xl bg-[#e2136e] hover:bg-[#c90d5e] shadow-lg shadow-pink-500/30 transition-all active:scale-95"
                            onClick={handleCtaClick}
                        >
                            {settings.offerModalCtaText} <ExternalLink className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                    <button 
                        onClick={() => setOpen(false)}
                        className="mt-3 text-xs text-slate-400 font-medium hover:text-slate-600 hover:underline"
                    >
                        No Thanks
                    </button>
                </div>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
