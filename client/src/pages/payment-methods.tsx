import { useAuth } from "@/lib/auth";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, Home, Wallet, Bitcoin, CreditCard } from "lucide-react";

export default function PaymentMethods() {
  const { language } = useAuth();
  const [, setLocation] = useLocation();

  const t = {
    title: language === "bn" ? "পেমেন্ট মেথড" : "Payment Method",
    subtitle: language === "bn" ? "কিভাবে ডিপোজিট করতে চান?" : "How would you like to deposit?",
    bkash: language === "bn" ? "বিকাশ" : "bKash",
    nagad: language === "bn" ? "নগদ" : "Nagad",
    binance: language === "bn" ? "বাইনান্স" : "Binance",
    back: language === "bn" ? "ফিরে যান" : "Back",
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white text-slate-800 p-4 flex items-center justify-between sticky top-0 z-50 shadow-sm border-b">
        <div className="flex items-center gap-3">
          <button onClick={() => setLocation("/wallet")} className="p-1 hover:bg-slate-100 rounded-full transition-colors">
            <ChevronLeft className="h-6 w-6" />
          </button>
          <div className="flex flex-col">
            <span className="font-bold text-lg leading-none">{t.title}</span>
            <span className="text-[10px] text-slate-500 opacity-80 uppercase tracking-tighter">{t.subtitle}</span>
          </div>
        </div>
        <div className="bg-slate-100 p-2 rounded-full text-slate-600">
          <Link href="/dashboard">
            <Home className="h-5 w-5" />
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col max-w-md mx-auto w-full p-6 space-y-4 animate-in slide-in-from-bottom-4 duration-500">
        
        {/* bKash */}
        <Link href="/payment/bkash">
          <Card className="hover:shadow-md transition-shadow border-none shadow-sm bg-[#e2136e] text-white overflow-hidden relative cursor-pointer group">
            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/20 rounded-full blur-2xl group-hover:bg-white/30 transition-colors" />
            <CardContent className="flex items-center gap-4 p-6 relative z-10">
              <div className="h-12 w-12 bg-white rounded-xl flex items-center justify-center shadow-lg overflow-hidden">
                <img src="/bkash.svg" alt="bKash" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-xl tracking-tight">{t.bkash}</h3>
                <p className="text-white/80 text-xs">Personal / Agent</p>
              </div>
              <ChevronLeft className="h-6 w-6 rotate-180 text-white/50" />
            </CardContent>
          </Card>
        </Link>

        {/* Nagad */}
        <Link href="/payment/nagad">
          <Card className="hover:shadow-md transition-shadow border-none shadow-sm bg-[#ec1c24] text-white overflow-hidden relative cursor-pointer group">
            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/20 rounded-full blur-2xl group-hover:bg-white/30 transition-colors" />
            <CardContent className="flex items-center gap-4 p-6 relative z-10">
              <div className="h-12 w-12 bg-white rounded-xl flex items-center justify-center shadow-lg overflow-hidden">
                 <img src="/nagad.svg" alt="Nagad" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-xl tracking-tight">{t.nagad}</h3>
                <p className="text-white/80 text-xs">Personal / Agent</p>
              </div>
              <ChevronLeft className="h-6 w-6 rotate-180 text-white/50" />
            </CardContent>
          </Card>
        </Link>

        {/* Binance */}
        <Link href="/payment/binance">
          <Card className="hover:shadow-md transition-shadow border-none shadow-sm bg-[#FCD535] text-slate-900 overflow-hidden relative cursor-pointer group">
            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/40 rounded-full blur-2xl group-hover:bg-white/50 transition-colors" />
            <CardContent className="flex items-center gap-4 p-6 relative z-10">
              <div className="h-12 w-12 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg text-[#FCD535] overflow-hidden">
                <img src="/binance.svg" alt="Binance" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-xl tracking-tight">{t.binance}</h3>
                <p className="text-slate-700 text-xs">USDT (TRC20)</p>
              </div>
              <ChevronLeft className="h-6 w-6 rotate-180 text-slate-500" />
            </CardContent>
          </Card>
        </Link>

      </div>
    </div>
  );
}
