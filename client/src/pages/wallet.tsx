import { useAuth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, ArrowDownLeft, ArrowUpRight, History, CreditCard, Banknote } from "lucide-react";

export default function WalletPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div>
        <h1 className="text-4xl font-heading font-bold mb-2">Finance</h1>
        <p className="text-muted-foreground text-lg">Manage your assets and withdrawals</p>
      </div>

      <Card className="bg-sidebar text-sidebar-foreground border-none overflow-hidden relative shadow-2xl">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full -mr-16 -mt-16 blur-3xl" />
        <CardContent className="pt-8 pb-8 relative z-10">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-2">Available Balance</p>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-bold font-heading">৳{user?.balance.toLocaleString()}</span>
            <span className="text-xs font-semibold text-sidebar-foreground/50">BDT</span>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-8">
            <Button className="w-full h-12 rounded-xl font-heading shadow-lg shadow-primary/20">
              <ArrowDownLeft className="h-4 w-4 mr-2" />
              DEPOSIT
            </Button>
            <Button variant="secondary" className="w-full h-12 rounded-xl font-heading bg-sidebar-accent/50 hover:bg-sidebar-accent border border-white/10">
              <ArrowUpRight className="h-4 w-4 mr-2" />
              WITHDRAW
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card className="hover-elevate">
          <CardContent className="pt-6">
            <div className="h-8 w-8 rounded-lg bg-accent/10 text-accent flex items-center justify-center mb-3">
              <Banknote className="h-4 w-4" />
            </div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Welcome Bonus</p>
            <p className="text-2xl font-bold font-heading">৳250</p>
            <p className="text-[10px] text-accent font-medium mt-1">LOCKED</p>
          </CardContent>
        </Card>
        <Card className="hover-elevate">
          <CardContent className="pt-6">
            <div className="h-8 w-8 rounded-lg bg-green-600/10 text-green-600 flex items-center justify-center mb-3">
              <History className="h-4 w-4" />
            </div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Locked Funds</p>
            <p className="text-2xl font-bold font-heading">৳{user?.lockedBalance.toLocaleString()}</p>
            <p className="text-[10px] text-green-600 font-medium mt-1">IN CYCLE</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-none bg-transparent">
        <CardHeader className="px-0">
          <CardTitle className="font-heading text-xl flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            Recent Transactions
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
                  <p className="text-sm font-bold">Daily Task Reward</p>
                  <p className="text-[10px] text-muted-foreground">Today, 2:45 PM</p>
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
