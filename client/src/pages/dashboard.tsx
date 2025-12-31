import { useAuth } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Lock, Wallet, Users, Package } from "lucide-react";
import Products from "./products";

export default function Dashboard() {
  const { user, language } = useAuth();

  const t = {
    welcome: language === "bn" ? `আবার স্বাগতম, ${user?.name}` : `Welcome back, ${user?.name}`,
    sub: language === "bn" ? "আপনার বিনিয়োগ এবং কার্যক্রম" : "Your investments and activities",
    packagesTitle: language === "bn" ? "বিনিয়োগ প্যাকেজ" : "Investment Packages",
    balance: language === "bn" ? "ব্যালেন্স" : "Balance",
    locked: language === "bn" ? "লক করা ব্যালেন্স" : "Locked Balance",
    growth: language === "bn" ? "মোট বৃদ্ধি" : "Total Growth",
    referral: language === "bn" ? "রেফারেল বোনাস" : "Referral Bonus",
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      {/* Welcome Section */}
      <header>
        <h1 className="text-4xl font-heading font-bold mb-2">{t.welcome}</h1>
        <p className="text-muted-foreground text-lg">{t.sub}</p>
      </header>

      {/* Prominent Package Tiles First */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 border-l-4 border-primary pl-4">
          <Package className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-heading font-bold uppercase tracking-tight">{t.packagesTitle}</h2>
        </div>
        <Products hideHeader />
      </section>

      {/* Quick Stats Summary */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="hover-elevate bg-card/50 backdrop-blur-sm border-none shadow-sm">
          <CardContent className="pt-6">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">{t.balance}</p>
            <p className="text-2xl font-bold font-heading">৳{user?.balance.toFixed(0)}</p>
          </CardContent>
        </Card>

        <Card className="hover-elevate bg-card/50 backdrop-blur-sm border-none shadow-sm">
          <CardContent className="pt-6">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">{t.locked}</p>
            <p className="text-2xl font-bold font-heading">৳{user?.lockedBalance.toFixed(0)}</p>
          </CardContent>
        </Card>

        <Card className="hover-elevate bg-card/50 backdrop-blur-sm border-none shadow-sm">
          <CardContent className="pt-6">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">{t.growth}</p>
            <p className="text-2xl font-bold font-heading text-green-600">+12%</p>
          </CardContent>
        </Card>

        <Card className="hover-elevate bg-card/50 backdrop-blur-sm border-none shadow-sm">
          <CardContent className="pt-6">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">{t.referral}</p>
            <p className="text-2xl font-bold font-heading text-purple-600">৳২.৫k</p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
