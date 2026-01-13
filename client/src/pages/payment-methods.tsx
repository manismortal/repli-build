import { useAuth } from "@/lib/auth";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, Home } from "lucide-react";
import { useState, useEffect } from "react";

export default function PaymentMethods() {
  const { language } = useAuth();
  const [, setLocation] = useLocation();
  const [isBankingHours, setIsBankingHours] = useState(false);

  useEffect(() => {
    const checkTime = () => {
      const now = new Date();
      // BD Time is UTC+6
      const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
      const bdTime = new Date(utc + (3600000 * 6));
      const hours = bdTime.getHours();
      setIsBankingHours(hours >= 9 && hours < 17);
    };
    
    checkTime();
    const interval = setInterval(checkTime, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const t = {
    title: language === "bn" ? "পেমেন্ট মেথড" : "Payment Method",
    subtitle: language === "bn" ? "কিভাবে ডিপোজিট করতে চান?" : "How would you like to deposit?",
    bkash: language === "bn" ? "বিকাশ" : "bKash",
    nagad: language === "bn" ? "নগদ" : "Nagad",
    binance: language === "bn" ? "বাইনান্স" : "Binance",
    back: language === "bn" ? "ফিরে যান" : "Back",
    active: language === "bn" ? "সক্রিয়" : "Active",
    closed: language === "bn" ? "বন্ধ" : "Closed",
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white flex flex-col font-sans">
      {/* Header */}
      <header className="bg-[#242424] text-white p-4 flex items-center justify-between sticky top-0 z-50 shadow-md border-b border-white/5">
        <div className="flex items-center gap-3">
          <button onClick={() => setLocation("/wallet")} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <ChevronLeft className="h-6 w-6" />
          </button>
          <div className="flex flex-col">
            <span className="font-bold text-lg leading-none tracking-wide">{t.title}</span>
            <span className="text-[11px] text-gray-400 opacity-80 uppercase tracking-wider">{t.subtitle}</span>
          </div>
        </div>
        <div className="bg-white/10 p-2 rounded-full text-white hover:bg-white/20 transition-colors">
          <Link href="/dashboard">
            <Home className="h-5 w-5" />
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col max-w-md mx-auto w-full p-6 space-y-6 animate-in slide-in-from-bottom-4 duration-500">
        
        <div className="grid grid-cols-1 gap-5">
            {/* bKash */}
            <Link href="/payment/bkash" className="w-full">
            <Card className="hover:scale-[1.02] hover:shadow-2xl transition-all duration-300 border-none shadow-lg bg-[#2a2a2a] text-white overflow-hidden relative cursor-pointer group h-24 rounded-2xl ring-1 ring-white/5 hover:ring-[#e2136e]/50">
                <div className="absolute right-0 top-0 bottom-0 w-32 bg-[#e2136e]/10 skew-x-12 -mr-8 group-hover:bg-[#e2136e]/20 transition-colors" />
                <CardContent className="flex items-center justify-between p-0 h-full px-6 relative z-10">
                <div className="flex items-center gap-5">
                    <div className="h-14 w-14 bg-white rounded-xl flex items-center justify-center shadow-lg overflow-hidden ring-2 ring-[#e2136e]/20">
                        <img src="/payment/bkash.webp" alt="bKash" className="w-full h-full object-contain p-1" loading="lazy" />
                    </div>
                    <div className="flex flex-col">
                        <h3 className="font-bold text-xl tracking-tight group-hover:text-[#e2136e] transition-colors">{t.bkash}</h3>
                        <div className="flex items-center gap-2">
                            <p className="text-gray-400 text-xs font-medium">Personal / Agent</p>
                        </div>
                    </div>
                </div>
                <div className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#e2136e] group-hover:text-white transition-all">
                    <ChevronLeft className="h-5 w-5 rotate-180 text-gray-400 group-hover:text-white" />
                </div>
                </CardContent>
            </Card>
            </Link>

            {/* Nagad */}
            <Link href="/payment/nagad" className="w-full">
            <Card className="hover:scale-[1.02] hover:shadow-2xl transition-all duration-300 border-none shadow-lg bg-[#2a2a2a] text-white overflow-hidden relative cursor-pointer group h-24 rounded-2xl ring-1 ring-white/5 hover:ring-[#ec1c24]/50">
                <div className="absolute right-0 top-0 bottom-0 w-32 bg-[#ec1c24]/10 skew-x-12 -mr-8 group-hover:bg-[#ec1c24]/20 transition-colors" />
                <CardContent className="flex items-center justify-between p-0 h-full px-6 relative z-10">
                <div className="flex items-center gap-5">
                    <div className="h-14 w-14 bg-white rounded-xl flex items-center justify-center shadow-lg overflow-hidden ring-2 ring-[#ec1c24]/20">
                        <img src="/payment/nagad.webp" alt="Nagad" className="w-full h-full object-contain p-1" loading="lazy" />
                    </div>
                    <div className="flex flex-col">
                        <h3 className="font-bold text-xl tracking-tight group-hover:text-[#ec1c24] transition-colors">{t.nagad}</h3>
                        <div className="flex items-center gap-2">
                            <p className="text-gray-400 text-xs font-medium">Personal / Agent</p>
                        </div>
                    </div>
                </div>
                <div className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#ec1c24] group-hover:text-white transition-all">
                    <ChevronLeft className="h-5 w-5 rotate-180 text-gray-400 group-hover:text-white" />
                </div>
                </CardContent>
            </Card>
            </Link>

            {/* Binance */}
            <Link href="/payment/binance" className="w-full">
            <Card className="hover:scale-[1.02] hover:shadow-2xl transition-all duration-300 border-none shadow-lg bg-[#2a2a2a] text-white overflow-hidden relative cursor-pointer group h-24 rounded-2xl ring-1 ring-white/5 hover:ring-[#FCD535]/50">
                <div className="absolute right-0 top-0 bottom-0 w-32 bg-[#FCD535]/10 skew-x-12 -mr-8 group-hover:bg-[#FCD535]/20 transition-colors" />
                <CardContent className="flex items-center justify-between p-0 h-full px-6 relative z-10">
                <div className="flex items-center gap-5">
                    <div className="h-14 w-14 bg-[#1e2329] rounded-xl flex items-center justify-center shadow-lg overflow-hidden ring-2 ring-[#FCD535]/20 border border-white/10">
                        <img src="/payment/binance.webp" alt="Binance" className="w-full h-full object-contain p-2" loading="lazy" />
                    </div>
                    <div className="flex flex-col">
                        <h3 className="font-bold text-xl tracking-tight group-hover:text-[#FCD535] transition-colors">{t.binance}</h3>
                        <div className="flex items-center gap-2">
                            <p className="text-gray-400 text-xs font-bold">USDT (TRC20)</p>
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold bg-green-500/20 text-green-400">
                                24/7
                            </span>
                        </div>
                    </div>
                </div>
                <div className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#FCD535] group-hover:text-black transition-all">
                    <ChevronLeft className="h-5 w-5 rotate-180 text-gray-400 group-hover:text-black" />
                </div>
                </CardContent>
            </Card>
            </Link>
        </div>

      </div>
    </div>
  );
}
