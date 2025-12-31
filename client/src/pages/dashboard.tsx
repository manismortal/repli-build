import { useAuth } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TrendingUp, Lock, Wallet, Users, ArrowUpRight } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const chartData = [
  { date: "Day 1", balance: 1200 },
  { date: "Day 2", balance: 1350 },
  { date: "Day 3", balance: 1500 },
  { date: "Day 4", balance: 1480 },
  { date: "Day 5", balance: 1650 },
  { date: "Day 6", balance: 1750 },
];

export default function Dashboard() {
  const { user, language } = useAuth();
  
  // Random avatar generator based on user ID or name
  const avatarId = user?.id || user?.name?.length || 1;
  const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarId}`;

  const t = {
    welcome: language === "bn" ? `আবার স্বাগতম,` : `Welcome back,`,
    sub: language === "bn" ? "আপনার অ্যাকাউন্ট এক নজরে" : "Your account at a glance",
    balance: language === "bn" ? "ব্যালেন্স" : "Balance",
    available: language === "bn" ? "বিনিয়োগের জন্য উপলব্ধ" : "Available to invest",
    locked: language === "bn" ? "লক করা ব্যালেন্স" : "Locked Balance",
    activeInv: language === "bn" ? "সক্রিয় বিনিয়োগে" : "In active investments",
    growth: language === "bn" ? "মোট বৃদ্ধি" : "Total Growth",
    thisMonth: language === "bn" ? "এই মাসে +১২.৫%" : "+12.5% this month",
    referral: language === "bn" ? "রেফারেল বোনাস" : "Referral Bonus",
    fromRef: language === "bn" ? "৫ জন সক্রিয় রেফারেল থেকে" : "From 5 active referrals",
    status: language === "bn" ? "অ্যাকাউন্টের অবস্থা" : "Account Status",
    active: language === "bn" ? "সক্রিয়" : "Active",
    verified: language === "bn" ? "আপনার অ্যাকাউন্ট সক্রিয় এবং ভেরিফাইড" : "Your account is active and verified",
    memberSince: language === "bn" ? "সদস্য হয়েছেন" : "Member Since",
    daysAgo: language === "bn" ? "৪৫ দিন আগে" : "45 days ago",
    refCode: language === "bn" ? "রেফারেল কোড" : "Referral Code",
    copy: language === "bn" ? "কোড কপি করুন" : "COPY CODE",
    trend: language === "bn" ? "ব্যালেন্স ট্রেন্ড" : "Balance Trend",
    trendSub: language === "bn" ? "গত ৬ দিনের আপনার অ্যাকাউন্ট ব্যালেন্স" : "Your account balance over the last 6 days",
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      {/* Premium Welcome Section */}
      <div className="relative overflow-hidden bg-slate-900 rounded-[2.5rem] p-6 text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl -ml-12 -mb-12" />
        
        <div className="relative flex items-center gap-4">
          <div className="relative">
            <Avatar className="h-16 w-16 border-2 border-primary/50 p-0.5">
              <AvatarImage src={avatarUrl} alt={user?.name} />
              <AvatarFallback className="bg-primary/20 text-primary font-bold">
                {user?.name?.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 bg-green-500 h-4 w-4 rounded-full border-2 border-slate-900 shadow-lg" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-sm font-medium">{t.welcome}</span>
              <Badge variant="outline" className="border-primary/30 text-primary text-[10px] h-5 bg-primary/5">PRO</Badge>
            </div>
            <h1 className="text-2xl font-bold font-heading tracking-tight">{user?.name}</h1>
          </div>
          <div className="h-10 w-10 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/10">
            <ArrowUpRight className="h-5 w-5 text-primary" />
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover-elevate">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground text-sm font-medium">{t.balance}</span>
              <Wallet className="h-4 w-4 text-primary" />
            </div>
            <p className="text-3xl font-bold font-heading">৳{user?.balance.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground mt-1">{t.available}</p>
          </CardContent>
        </Card>

        <Card className="hover-elevate">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground text-sm font-medium">{t.locked}</span>
              <Lock className="h-4 w-4 text-accent" />
            </div>
            <p className="text-3xl font-bold font-heading">৳{user?.lockedBalance.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground mt-1">{t.activeInv}</p>
          </CardContent>
        </Card>

        <Card className="hover-elevate">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground text-sm font-medium">{t.growth}</span>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </div>
            <p className="text-3xl font-bold font-heading">৳{(user?.balance! + user?.lockedBalance!).toFixed(2)}</p>
            <p className="text-xs text-green-600 mt-1">{t.thisMonth}</p>
          </CardContent>
        </Card>

        <Card className="hover-elevate">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground text-sm font-medium">{t.referral}</span>
              <Users className="h-4 w-4 text-purple-600" />
            </div>
            <p className="text-3xl font-bold font-heading">৳২,৪৫০</p>
            <p className="text-xs text-muted-foreground mt-1">{t.fromRef}</p>
          </CardContent>
        </Card>
      </div>

      {/* Account Status */}
      <Card className="hover-elevate">
        <CardHeader>
          <CardTitle className="font-heading text-2xl">{t.status}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg border">
            <div>
              <p className="font-semibold text-sm">{t.status}</p>
              <p className="text-xs text-muted-foreground">{t.verified}</p>
            </div>
            <Badge className="bg-green-600 text-white">{t.active}</Badge>
          </div>
          <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg border">
            <div>
              <p className="font-semibold text-sm">{t.memberSince}</p>
              <p className="text-xs text-muted-foreground">{t.daysAgo}</p>
            </div>
            <Badge variant="outline">VERIFIED</Badge>
          </div>
          <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg border">
            <div>
              <p className="font-semibold text-sm">{t.refCode}</p>
              <p className="text-xs text-muted-foreground font-mono text-primary">{user?.referralCode}</p>
            </div>
            <Badge variant="secondary">{t.copy}</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Balance Chart */}
      <Card className="hover-elevate">
        <CardHeader>
          <CardTitle className="font-heading text-2xl">{t.trend}</CardTitle>
          <CardDescription>{t.trendSub}</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
              <Line type="monotone" dataKey="balance" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: "hsl(var(--primary))", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
