import { useAuth } from "@/lib/auth";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, ArrowDownLeft, ArrowUpRight, History, CreditCard, Banknote } from "lucide-react";

export default function WalletPage() {
  const { user, language } = useAuth();
  
  const balance = Number(user?.balance || 0);
  const lockedBalance = Number((user as any)?.bonusBalance || 0);

  const t = {
    finance: language === "bn" ? "ফাইন্যান্স" : "Finance",
    manage: language === "bn" ? "আপনার সম্পদ এবং উত্তোলন পরিচালনা করুন" : "Manage your assets and withdrawals",
    availBal: language === "bn" ? "উপলব্ধ ব্যালেন্স" : "Available Balance",
    deposit: language === "bn" ? "ডিপোজিট" : "DEPOSIT",
    withdraw: language === "bn" ? "উত্তোলন" : "WITHDRAW",
    welcome: language === "bn" ? "ওয়েলকাম বোনাস" : "Welcome Bonus",
    locked: language === "bn" ? "লক করা ফান্ড" : "Locked Funds",
    lockedSub: language === "bn" ? "লক করা (৬০ দিন)" : "LOCKED (60 Days)",
    cycle: language === "bn" ? "সাইকেলে আছে" : "IN CYCLE",
    recent: language === "bn" ? "সাম্প্রতিক লেনদেন" : "Recent Transactions",
    taskReward: language === "bn" ? "দৈনিক টাস্ক রিওয়ার্ড" : "Daily Task Reward",
    today: language === "bn" ? "আজ, ২:৪৫ PM" : "Today, 2:45 PM",
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div>
        <h1 className="text-4xl font-heading font-bold mb-2">{t.finance}</h1>
        <p className="text-muted-foreground text-lg">{t.manage}</p>
      </div>

      <Card className="bg-sidebar text-sidebar-foreground border-none overflow-hidden relative shadow-2xl">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full -mr-16 -mt-16 blur-3xl" />
        <CardContent className="pt-8 pb-8 relative z-10">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-2">{t.availBal}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-bold font-heading">৳{balance.toLocaleString()}</span>
            <span className="text-xs font-semibold text-sidebar-foreground/50">BDT</span>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-8">
            <Link href="/payment/bkash" className="w-full">
              <Button className="w-full h-12 rounded-xl font-heading shadow-lg shadow-primary/20">
                <ArrowDownLeft className="h-4 w-4 mr-2" />
                {t.deposit}
              </Button>
            </Link>
            <Link href="/withdraw" className="w-full">
              <Button variant="secondary" className="w-full h-12 rounded-xl font-heading bg-sidebar-accent/50 hover:bg-sidebar-accent border border-white/10">
                <ArrowUpRight className="h-4 w-4 mr-2" />
                {t.withdraw}
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card className="hover-elevate">
          <CardContent className="pt-6">
            <div className="h-8 w-8 rounded-lg bg-accent/10 text-accent flex items-center justify-center mb-3">
              <Banknote className="h-4 w-4" />
            </div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">{t.welcome}</p>
            <p className="text-2xl font-bold font-heading">৳{(user as any)?.bonusBalance || "0"}</p>
            <p className="text-[10px] text-accent font-medium mt-1">{t.lockedSub}</p>
          </CardContent>
        </Card>
        <Card className="hover-elevate">
          <CardContent className="pt-6">
            <div className="h-8 w-8 rounded-lg bg-green-600/10 text-green-600 flex items-center justify-center mb-3">
              <History className="h-4 w-4" />
            </div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">{t.locked}</p>
            <p className="text-2xl font-bold font-heading">৳{lockedBalance.toLocaleString()}</p>
            <p className="text-[10px] text-green-600 font-medium mt-1">{t.cycle}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-none bg-transparent">
        <CardHeader className="px-0">
          <CardTitle className="font-heading text-xl flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            {t.recent}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0 space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-card rounded-2xl border border-border/50">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center">
                  <ArrowDownLeft className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-bold">{t.taskReward}</p>
                  <p className="text-[10px] text-muted-foreground">{t.today}</p>
                </div>
              </div>
              <p className="font-bold text-green-600">+৳50</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
