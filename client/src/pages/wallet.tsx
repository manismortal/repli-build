import { useAuth } from "@/lib/auth";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, ArrowDownLeft, ArrowUpRight, History, CreditCard, Banknote } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

export default function WalletPage() {
  const { user, language } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const balance = Number(user?.balance || 0);
  const bonusBalance = Number(user?.bonusBalance || 0);
  const lockedBalance = Number(user?.lockedBalance || 0);
  const referralBalance = Number(user?.referralBalance || 0);
  
  const totalLocked = bonusBalance + lockedBalance;

  // Fetch Deposits
  const { data: deposits = [] } = useQuery<any[]>({
    queryKey: ["/api/deposits"],
  });

  // Fetch Withdrawals
  const { data: withdrawals = [] } = useQuery<any[]>({
    queryKey: ["/api/withdrawals"],
    queryFn: async () => {
        const res = await fetch("/api/withdrawals");
        if (!res.ok) return [];
        return res.json();
    }
  });

  // Combine and Sort Transactions
  const transactions = [
    ...deposits.map(d => ({
        id: d.id,
        type: 'deposit',
        amount: d.amount,
        status: d.status,
        date: d.createdAt,
        method: d.method
    })),
    ...withdrawals.map(w => ({
        id: w.id,
        type: 'withdrawal',
        amount: w.amount,
        status: w.status,
        date: w.requestedAt,
        method: w.method
    }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleClaim = async () => {
      try {
          const res = await fetch("/api/wallet/claim-locked", {
              method: "POST"
          });
          const data = await res.json();
          
          if (res.ok) {
              toast({
                  title: "Success",
                  description: data.message,
              });
              queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
          } else {
              toast({
                  title: "Claim Failed",
                  description: data.message,
                  variant: "destructive"
              });
          }
      } catch (e) {
          toast({
              title: "Error",
              description: "Network error",
              variant: "destructive"
          });
      }
  };

  const t = {
    finance: language === "bn" ? "ফাইন্যান্স" : "Finance",
    manage: language === "bn" ? "আপনার সম্পদ এবং উত্তোলন পরিচালনা করুন" : "Manage your assets and withdrawals",
    availBal: language === "bn" ? "উপলব্ধ ব্যালেন্স" : "Available Balance",
    deposit: language === "bn" ? "ডিপোজিট" : "DEPOSIT",
    withdraw: language === "bn" ? "উত্তোলন" : "WITHDRAW",
    referral: language === "bn" ? "রেফারেল আয়" : "Referral Income",
    referralSub: language === "bn" ? "আলাদাভাবে উত্তোলনযোগ্য" : "Separately Withdrawable",
    locked: language === "bn" ? "লক করা ফান্ড" : "Locked Funds",
    lockedSub: language === "bn" ? "৩০ দিন পর আনলক হবে" : "Unlocks after 30 Days",
    claim: language === "bn" ? "দাবি করুন" : "CLAIM FUNDS",
    cycle: language === "bn" ? "সাইকেলে আছে" : "IN CYCLE",
    recent: language === "bn" ? "সাম্প্রতিক লেনদেন" : "Recent Transactions",
    taskReward: language === "bn" ? "দৈনিক টাস্ক রিওয়ার্ড" : "Daily Task Reward",
    today: language === "bn" ? "আজ" : "Today",
    noTransactions: language === "bn" ? "কোন লেনদেন পাওয়া যায়নি" : "No transactions found",
    depositType: language === "bn" ? "ডিপোজিট" : "Deposit",
    withdrawType: language === "bn" ? "উত্তোলন" : "Withdrawal",
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div>
        <h1 className="text-4xl font-heading font-bold mb-2">{t.finance}</h1>
        <p className="text-muted-foreground text-lg">{t.manage}</p>
      </div>

      {/* Main Balance Card */}
      <Card className="bg-sidebar text-sidebar-foreground border-none overflow-hidden relative shadow-2xl">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full -mr-16 -mt-16 blur-3xl" />
        <CardContent className="pt-8 pb-8 relative z-10">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-2">{t.availBal}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-bold font-heading">৳{balance.toLocaleString()}</span>
            <span className="text-xs font-semibold text-sidebar-foreground/50">BDT</span>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-8">
            <Link href="/payment/methods" className="w-full">
              <Button className="w-full h-14 text-base rounded-2xl font-heading shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all duration-300 bg-primary hover:bg-primary/90">
                <div className="flex flex-col items-center justify-center sm:flex-row sm:gap-2">
                  <ArrowDownLeft className="h-5 w-5 mb-1 sm:mb-0" />
                  <span>{t.deposit}</span>
                </div>
              </Button>
            </Link>
            <Link href="/withdraw" className="w-full">
              <Button className="w-full h-14 text-base rounded-2xl font-heading shadow-xl shadow-black/5 hover:scale-[1.02] active:scale-95 transition-all duration-300 bg-card text-foreground border-2 border-primary/10 hover:border-primary/50 hover:bg-accent/50">
                <div className="flex flex-col items-center justify-center sm:flex-row sm:gap-2">
                  <ArrowUpRight className="h-5 w-5 mb-1 sm:mb-0" />
                  <span>{t.withdraw}</span>
                </div>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Referral Balance Card */}
        <Card className="hover-elevate border-l-4 border-l-purple-500">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
                <div>
                    <div className="h-8 w-8 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center mb-3">
                      <CreditCard className="h-4 w-4" />
                    </div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">{t.referral}</p>
                    <p className="text-2xl font-bold font-heading">৳{referralBalance.toLocaleString()}</p>
                    <p className="text-[10px] text-purple-600 font-medium mt-1">{t.referralSub}</p>
                </div>
            </div>
          </CardContent>
        </Card>

        {/* Locked Funds Card */}
        <Card className="hover-elevate border-l-4 border-l-amber-500">
          <CardContent className="pt-6">
             <div className="flex justify-between items-start">
                <div>
                    <div className="h-8 w-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center mb-3">
                      <Banknote className="h-4 w-4" />
                    </div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">{t.locked}</p>
                    <p className="text-2xl font-bold font-heading">৳{totalLocked.toLocaleString()}</p>
                    <p className="text-[10px] text-amber-600 font-medium mt-1">{t.lockedSub}</p>
                </div>
                {totalLocked > 0 && (
                    <Button size="sm" variant="outline" className="h-8 text-[10px] uppercase font-bold" onClick={handleClaim}>
                        {t.claim}
                    </Button>
                )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-none bg-transparent">
        <CardHeader className="px-0">
          <CardTitle className="font-heading text-xl flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            {t.recent}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0 space-y-3">
          {transactions.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground italic">
                {t.noTransactions}
            </div>
          ) : (
            transactions.slice(0, 10).map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-4 bg-card rounded-2xl border border-border/50">
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${tx.type === 'deposit' ? 'bg-green-50' : 'bg-red-50'}`}>
                    {tx.type === 'deposit' ? (
                        <ArrowDownLeft className="h-5 w-5 text-green-600" />
                    ) : (
                        <ArrowUpRight className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-bold">
                        {tx.type === 'deposit' ? t.depositType : t.withdrawType} 
                        <span className="text-[10px] text-muted-foreground ml-2 font-normal uppercase">({tx.method})</span>
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                        {format(new Date(tx.date), "MMM dd, yyyy • hh:mm a")}
                        <Badge variant="outline" className="ml-2 text-[8px] h-4 uppercase border-primary/20 text-primary">
                            {tx.status}
                        </Badge>
                    </p>
                  </div>
                </div>
                <p className={`font-bold ${tx.type === 'deposit' ? 'text-green-600' : 'text-red-600'}`}>
                    {tx.type === 'deposit' ? '+' : '-'}৳{parseFloat(tx.amount).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
