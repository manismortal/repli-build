import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, DollarSign, Clock, Users, Zap, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PACKAGES = [
  {
    id: 1,
    name: "Standard Package",
    nameBn: "স্ট্যান্ডার্ড প্যাকেজ",
    price: 250,
    dailyBonus: 50,
    maturity: 15,
    totalDays: 60,
    maxProfitX: 12,
    seatsTotal: 2000,
    seatsFilled: 1450,
    type: "normal"
  },
  {
    id: 2,
    name: "Classic Package",
    nameBn: "ক্লাসিক প্যাকেজ",
    price: 500,
    dailyBonus: 100,
    maturity: 15,
    totalDays: 60,
    maxProfitX: 12,
    seatsTotal: 2000,
    seatsFilled: 890,
    type: "normal"
  },
  {
    id: 3,
    name: "Silver Package",
    nameBn: "সিলভার প্যাকেজ",
    price: 1500,
    dailyBonus: 300,
    maturity: 15,
    totalDays: 60,
    maxProfitX: 12,
    seatsTotal: 2000,
    seatsFilled: 320,
    type: "normal"
  },
  {
    id: 4,
    name: "Gold Package",
    nameBn: "গোল্ড প্যাকেজ",
    price: 2000,
    dailyBonus: 400,
    maturity: 15,
    totalDays: 60,
    maxProfitX: 12,
    seatsTotal: 2000,
    seatsFilled: 150,
    type: "normal"
  },
  {
    id: 5,
    name: "Platinum Maersk",
    nameBn: "প্লাটিনাম মেয়ার্স্ক",
    price: 5000,
    dailyBonus: 1000,
    maturity: 15,
    totalDays: 60,
    maxProfitX: 12,
    seatsTotal: 500,
    seatsFilled: 45,
    type: "premium"
  },
];

export default function Products() {
  const { user, updateBalance, language } = useAuth();
  const { toast } = useToast();
  const availableSeats = (pkg: any) => pkg.seatsTotal - pkg.seatsFilled;

  const handleInvest = (pkg: any) => {
    if (!user) return;
    if (user.balance < pkg.price) {
      toast({ 
        title: language === "bn" ? "পর্যাপ্ত ব্যালেন্স নেই" : "Insufficient Balance", 
        description: language === "bn" ? `আপনার এই প্যাকেজে বিনিয়োগ করতে ৳${pkg.price} প্রয়োজন।` : `You need ৳${pkg.price} to invest in this package.`,
        variant: "destructive"
      });
      return;
    }
    
    updateBalance(-pkg.price);
    toast({ 
      title: language === "bn" ? "বিনিয়োগ সফল হয়েছে" : "Investment Successful", 
      description: language === "bn" ? `আপনি সফলভাবে ${pkg.nameBn} এ বিনিয়োগ করেছেন।` : `You have successfully invested in ${pkg.name}.` 
    });
  };

  const t = {
    title: language === "bn" ? "বিনিয়োগ হাব" : "Investment Hub",
    sub: language === "bn" ? "আপনার ৬০ দিনের প্রফিট জার্নি শুরু করতে একটি প্যাকেজ নির্বাচন করুন" : "Select a package to start your 60-day profit journey",
    dailyBonus: language === "bn" ? "দৈনিক বোনাস" : "Daily Bonus",
    maturity: language === "bn" ? "ম্যাচুরিটি" : "Maturity",
    days: language === "bn" ? "দিন" : "Days",
    duration: language === "bn" ? "মোট সময়কাল" : "Total Duration",
    maxProfit: language === "bn" ? "সর্বোচ্চ মুনাফা" : "Max Profit",
    seats: language === "bn" ? "বাকি আসন" : "Seats Remaining",
    activeCycle: language === "bn" ? "সক্রিয় সাইকেল" : "Active Cycle",
    investNow: language === "bn" ? "এখনই বিনিয়োগ করুন" : "INVEST NOW",
    soldOut: language === "bn" ? "সব আসন পূর্ণ" : "SOLD OUT",
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <header>
        <h1 className="text-4xl font-heading font-bold mb-2">{t.title}</h1>
        <p className="text-muted-foreground text-lg">{t.sub}</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {PACKAGES.map((pkg) => (
          <Card key={pkg.id} className={`hover-elevate flex flex-col relative border-none overflow-hidden group shadow-xl bg-card/50 backdrop-blur-sm ${pkg.type === 'premium' ? 'ring-2 ring-primary' : ''}`}>
            {pkg.type === 'premium' && (
              <div className="absolute top-0 right-0 p-3 z-10">
                <Badge className="bg-primary animate-pulse text-[10px] font-bold tracking-widest px-3">PREMIUM</Badge>
              </div>
            )}
            
            <CardHeader className="relative">
              <div className="flex items-start justify-between mb-4">
                <div className={`h-14 w-14 rounded-2xl flex items-center justify-center shadow-inner ${pkg.type === 'premium' ? 'bg-primary text-primary-foreground shadow-primary/20' : 'bg-primary/10 text-primary shadow-primary/5'}`}>
                  {pkg.type === 'premium' ? <Zap className="h-8 w-8" /> : <Package className="h-8 w-8" />}
                </div>
              </div>
              <CardTitle className="font-heading text-2xl tracking-tight leading-none mb-1">
                {language === "bn" ? pkg.nameBn : pkg.name}
              </CardTitle>
              <CardDescription className="text-xl font-bold text-primary font-heading">৳{pkg.price.toLocaleString()}</CardDescription>
            </CardHeader>

            <CardContent className="flex-1 space-y-6 pt-0">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-secondary/40 p-3 rounded-2xl border border-border/30">
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-1">{t.dailyBonus}</p>
                  <p className="text-lg font-bold font-heading leading-none">৳{pkg.dailyBonus}</p>
                </div>
                <div className="bg-secondary/40 p-3 rounded-2xl border border-border/30">
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-1">{t.maturity}</p>
                  <p className="text-lg font-bold font-heading leading-none">{pkg.maturity} {t.days}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4 opacity-70" />
                    {t.duration}
                  </span>
                  <span className="font-bold">{pkg.totalDays} {t.days}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground font-medium flex items-center gap-2">
                    <TrendingUpIcon className="h-4 w-4 text-green-600 opacity-70" />
                    {t.maxProfit}
                  </span>
                  <span className="font-bold text-green-600">x{pkg.maxProfitX} (৳{pkg.price * pkg.maxProfitX})</span>
                </div>
              </div>

              <div className="pt-2">
                <div className="flex items-center justify-between mb-2 text-xs font-bold">
                  <p className="uppercase tracking-widest flex items-center gap-1.5 text-muted-foreground">
                    <Users className="h-3.5 w-3.5" />
                    {t.seats}
                  </p>
                  <span>{availableSeats(pkg)} / {pkg.seatsTotal}</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2 overflow-hidden shadow-inner">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(pkg.seatsFilled / pkg.seatsTotal) * 100}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-full rounded-full ${pkg.type === 'premium' ? 'bg-primary' : 'bg-primary/60'}`} 
                  />
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-secondary/30 border border-border/30 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="relative h-2 w-2">
                    <div className="absolute inset-0 bg-primary rounded-full animate-ping" />
                    <div className="relative h-2 w-2 bg-primary rounded-full" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest">{t.activeCycle}</span>
                </div>
                <span className="text-xs font-bold font-mono text-primary">00d : 00h : 00m</span>
              </div>

              <Button 
                onClick={() => handleInvest(pkg)}
                className={`w-full font-heading h-14 text-lg rounded-2xl transition-all active:scale-95 ${pkg.type === 'premium' ? 'shadow-xl shadow-primary/30' : 'shadow-lg shadow-primary/10'}`}
                disabled={availableSeats(pkg) <= 0 || !user}
              >
                {availableSeats(pkg) <= 0 ? t.soldOut : t.investNow}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function TrendingUpIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  );
}
