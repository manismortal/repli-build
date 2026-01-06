import { useAuth } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Lock, Wallet, Users, ArrowUpRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { NotificationPopup } from "@/components/notification-popup";
import { useReferralValidation } from "@/hooks/use-referral-validation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { UserAvatar } from "@/components/user-avatar";
import { SuccessStories } from "@/components/success-stories";

export default function Dashboard() {
  const { user, language } = useAuth();
  useReferralValidation(); // Trigger validation
  const { toast } = useToast();
  
  const balance = Number(user?.balance || 0);
  const lockedBalance = Number(user?.bonusBalance || 0);
  const hasPackage = user?.hasPackage || false;
  const name = user?.name || user?.username || "User";

  const referralCode = user?.referralCode || "Generating...";
  const daysAgoStr = user?.createdAt ? formatDistanceToNow(new Date(user.createdAt), { addSuffix: true }) : "recently";

  // Fetch Referral Stats
  const { data: referralStats } = useQuery({
    queryKey: ["referral-stats"],
    queryFn: async () => {
      const res = await fetch("/api/user/referrals");
      if (!res.ok) throw new Error("Failed to fetch referral stats");
      return res.json();
    }
  });

  const totalEarned = Number(referralStats?.totalEarned || 0);
  const activeReferrals = Number(referralStats?.activeReferrals || 0);

  const copyReferral = async () => {
      if (!referralCode || referralCode === "Generating...") return;
      try {
        await navigator.clipboard.writeText(referralCode);
        toast({
            title: language === "bn" ? "কপি করা হয়েছে" : "Copied",
            description: language === "bn" ? "রেফারেল কোড ক্লিপবোর্ডে কপি করা হয়েছে" : "Referral code copied to clipboard",
        });
      } catch (err) {
         toast({
            title: "Failed to copy",
            variant: "destructive"
        });
      }
  };

  // Status Logic
  let statusLabel = "Member";
  let statusColor = "bg-red-500 text-white"; // Default Red for normal members

  if (user?.role === 'admin') {
    statusLabel = "Admin";
    statusColor = "bg-purple-600 text-white";
  } else if (user?.role === 'area_manager') {
    statusLabel = "Area Manager";
    statusColor = "bg-blue-600 text-white";
  } else if (user?.role === 'regional_manager') {
    statusLabel = "Regional Manager";
    statusColor = "bg-indigo-600 text-white";
  } else if (hasPackage) {
    statusLabel = "Premium Member";
    statusColor = "bg-yellow-500 text-black";
  }

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
    status: language === "bn" ? "অ্যাকাউন্টের অবস্থা" : "Account Status",
    active: language === "bn" ? "সক্রিয়" : "Active",
    verified: language === "bn" ? "আপনার অ্যাকাউন্ট সক্রিয় এবং ভেরিফাইড" : "Your account is active and verified",
    memberSince: language === "bn" ? "সদস্য হয়েছেন" : "Member Since",
    daysAgo: language === "bn" ? daysAgoStr : daysAgoStr,
    refCode: language === "bn" ? "রেফারেল কোড" : "Referral Code",
    copy: language === "bn" ? "কোড কপি করুন" : "COPY CODE",
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <NotificationPopup />
      {/* Premium Welcome Section */}
      <div className="relative overflow-hidden bg-slate-900 rounded-[2.5rem] p-6 text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl -ml-12 -mb-12" />
        
        <div className="relative flex items-center gap-4">
          <div className="relative">
            <UserAvatar user={{ ...user, hasPackage } as any} size="lg" showStatus={false} />
            <div className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-slate-900 shadow-lg ${hasPackage ? 'bg-green-500' : 'bg-gray-400'}`} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-slate-400 text-sm font-medium">{t.welcome}</span>
              <Badge variant="outline" className={`border-none text-[10px] h-5 px-2 font-bold ${statusColor}`}>
                {statusLabel.toUpperCase()}
              </Badge>
            </div>
            <h1 className="text-2xl font-bold font-heading tracking-tight">{name}</h1>
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
            <p className="text-3xl font-bold font-heading">৳{balance.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground mt-1">{t.available}</p>
          </CardContent>
        </Card>

        <Card className="hover-elevate">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground text-sm font-medium">{t.locked}</span>
              <Lock className="h-4 w-4 text-accent" />
            </div>
            <p className="text-3xl font-bold font-heading">৳{lockedBalance.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground mt-1">{t.activeInv}</p>
          </CardContent>
        </Card>

        <Card className="hover-elevate">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground text-sm font-medium">{t.growth}</span>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </div>
            <p className="text-3xl font-bold font-heading">৳{(balance + lockedBalance).toFixed(2)}</p>
            <p className="text-xs text-green-600 mt-1">{t.thisMonth}</p>
          </CardContent>
        </Card>

        <Card className="hover-elevate">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground text-sm font-medium">{t.referral}</span>
              <Users className="h-4 w-4 text-purple-600" />
            </div>
            <p className="text-3xl font-bold font-heading">৳{totalEarned.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {language === "bn" 
                ? `${activeReferrals} জন সক্রিয় রেফারেল থেকে` 
                : `From ${activeReferrals} active referrals`}
            </p>
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
        </CardContent>
      </Card>

      {/* Success Stories (Replacing Balance Chart) */}
      <SuccessStories />
    </div>
  );
}
