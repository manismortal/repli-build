import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { X, Share2, ExternalLink } from "lucide-react";
import { useAuth } from "@/lib/auth";

export function NotificationPopup() {
  const [open, setOpen] = useState(false);
  const { language } = useAuth();
  
  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const res = await fetch("/api/settings");
      if (!res.ok) throw new Error("Failed to fetch settings");
      return res.json();
    },
  });

  useEffect(() => {
    // Show popup if active and loaded
    if (settings?.popupActive) {
        // Simple logic: Show every time (as requested "when login or return to home page")
        // To be less annoying in real world, we might use sessionStorage
        // But per request "return to home page", we show it on mount of this component (which is in Dashboard)
        const hasSeen = sessionStorage.getItem(`popup-${settings.updatedAt}`);
        if (!hasSeen) {
            setOpen(true);
            sessionStorage.setItem(`popup-${settings.updatedAt}`, 'true');
        }
    }
  }, [settings]);

  if (!settings?.popupActive) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-xs sm:max-w-sm rounded-2xl p-0 overflow-hidden bg-white">
        <div className="relative">
             {/* Close Button Top Right */}
             <button 
                onClick={() => setOpen(false)}
                className="absolute top-2 right-2 z-10 bg-black/50 text-white rounded-full p-1 hover:bg-black/70 transition-colors"
             >
                <X className="h-4 w-4" />
             </button>

            {/* Banner Image */}
            {settings.popupImageUrl && (
                <div className="w-full aspect-video bg-gray-100">
                    <img 
                        src={settings.popupImageUrl} 
                        alt="Notification" 
                        className="w-full h-full object-cover"
                    />
                </div>
            )}

            <div className="p-5 space-y-3 text-center">
                <DialogTitle className="text-xl font-bold font-heading text-slate-900">
                    {settings.popupTitle || (language === 'bn' ? 'বিশেষ বিজ্ঞপ্তি' : 'Special Notice')}
                </DialogTitle>
                
                <div className="text-sm text-slate-600 leading-relaxed max-h-40 overflow-y-auto">
                    {settings.popupBody || (language === 'bn' ? 'আমাদের সাথে থাকার জন্য ধন্যবাদ।' : 'Thanks for being with us.')}
                </div>

                <div className="flex gap-2 pt-2">
                    {settings.popupLink && (
                        <Button className="w-full bg-primary hover:bg-primary/90 rounded-xl" asChild>
                            <a href={settings.popupLink} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="w-4 h-4 mr-2" />
                                {language === 'bn' ? 'ভিজিট করুন' : 'Visit Now'}
                            </a>
                        </Button>
                    )}
                    
                    {/* Share Button (Mock) */}
                    <Button variant="outline" className="rounded-xl px-3" onClick={() => {
                         if (navigator.share) {
                             navigator.share({
                                 title: settings.popupTitle,
                                 text: settings.popupBody,
                                 url: settings.popupLink || window.location.href,
                             });
                         } else {
                             // Fallback
                             navigator.clipboard.writeText(settings.popupLink || window.location.href);
                             alert("Link copied to clipboard!");
                         }
                    }}>
                        <Share2 className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
