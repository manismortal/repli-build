import { useAuth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, UserPlus, Trophy, Share2, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useReferralValidation } from "@/hooks/use-referral-validation";

export default function Team() {
  const { user, language } = useAuth();
  const { toast } = useToast();
  useReferralValidation();

  const { data: referralData, isLoading } = useQuery({
    queryKey: ["user", "referrals"],
    queryFn: async () => {
        const res = await fetch("/api/user/referrals");
        if (!res.ok) throw new Error("Failed to fetch referral data");
        return res.json();
    },
    enabled: !!user
  });
  
  const referralCode = referralData?.referralCode || (user as any)?.referralCode || "...";
  
  const copyReferral = async () => {
    if (!referralCode || referralCode === "...") return;
    const textToCopy = `https://maerskline.bd/register?ref=${referralCode}`;
    
    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(textToCopy);
            toast({
                title: language === "bn" ? "কপি করা হয়েছে" : "Copied",
                description: language === "bn" ? "রেফারেল লিংক ক্লিপবোর্ডে কপি করা হয়েছে" : "Referral link copied to clipboard"
            });
        } else {
            throw new Error("Clipboard API unavailable");
        }
    } catch (e) {
        try {
            // Fallback for non-secure contexts (e.g. HTTP dev)
            const textArea = document.createElement("textarea");
            textArea.value = textToCopy;
            textArea.style.position = "fixed";
            textArea.style.left = "-9999px";
            textArea.style.top = "0";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            const successful = document.execCommand('copy');
            document.body.removeChild(textArea);
            
            if (successful) {
                 toast({
                    title: language === "bn" ? "কপি করা হয়েছে" : "Copied",
                    description: language === "bn" ? "রেফারেল লিংক ক্লিপবোর্ডে কপি করা হয়েছে" : "Referral link copied to clipboard"
                });
            } else {
                throw new Error("Fallback failed");
            }
        } catch (err) {
            toast({
                title: "Failed to copy",
                description: "Please copy manually",
                variant: "destructive"
            });
        }
    }
  };

  const t = {
    title: language === "bn" ? "আমার টিম" : "My Team",
    sub: language === "bn" ? "আপনার নেটওয়ার্ক তৈরি করুন এবং একসাথে উপার্জন করুন" : "Build your network and earn together",
    refStats: language === "bn" ? "রেফারেল পরিসংখ্যান" : "Referral Stats",
    totalRef: language === "bn" ? "মোট রেফারেল" : "Total Referrals",
    activeRef: language === "bn" ? "সক্রিয় সদস্য" : "Active Members",
    earned: language === "bn" ? "মোট আয়" : "Total Earned",
    invite: language === "bn" ? "বন্ধুদের আমন্ত্রণ জানান" : "Invite Friends",
    share: language === "bn" ? "আপনার অনন্য রেফারেল লিংক শেয়ার করুন এবং বোনাস উপার্জন করুন!" : "Share your unique referral link and earn bonuses!",
    copy: language === "bn" ? "লিংক কপি করুন" : "Copy Link",
    recent: language === "bn" ? "সাম্প্রতিক যোগদান" : "Recent Joins",
    user: language === "bn" ? "ব্যবহারকারী" : "User",
    joined: language === "bn" ? "যোগদান করেছেন" : "Joined",
    status: language === "bn" ? "অবস্থা" : "Status",
    active: language === "bn" ? "সক্রিয়" : "Active",
    inactive: language === "bn" ? "নিষ্ক্রিয়" : "Inactive",
    today: language === "bn" ? "আজ" : "Today",
    yesterday: language === "bn" ? "গতকাল" : "Yesterday",
    role: language === "bn" ? "আপনার পদ" : "Your Role",
    noRefs: language === "bn" ? "এখনও কোন রেফারেল নেই। আপনার কোড শেয়ার করে আয় শুরু করুন!" : "No referrals yet. Share your code to start earning!"
  };

  if (isLoading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div>
        <h1 className="text-4xl font-heading font-bold mb-2">{t.title}</h1>
        <p className="text-muted-foreground text-lg">{t.sub}</p>
        <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-bold">
            <Trophy className="h-4 w-4" />
            {t.role}: {referralData?.role?.replace('_', ' ').toUpperCase()}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-blue-500 text-white border-none shadow-lg shadow-blue-500/20">
          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
            <Users className="h-6 w-6 mb-2 opacity-80" />
            <p className="text-2xl font-bold font-heading">{referralData?.totalReferrals || 0}</p>
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">{t.totalRef}</p>
          </CardContent>
        </Card>
        <Card className="bg-green-500 text-white border-none shadow-lg shadow-green-500/20">
          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
            <UserPlus className="h-6 w-6 mb-2 opacity-80" />
            <p className="text-2xl font-bold font-heading">{referralData?.activeReferrals || 0}</p>
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">{t.activeRef}</p>
          </CardContent>
        </Card>
        <Card className="bg-purple-500 text-white border-none shadow-lg shadow-purple-500/20">
          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
            <Trophy className="h-6 w-6 mb-2 opacity-80" />
            <p className="text-xl font-bold font-heading">৳{referralData?.totalEarned || "0.00"}</p>
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">{t.earned}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="hover-elevate border-dashed border-2 border-primary/20 bg-primary/5">
        <CardContent className="p-6 text-center space-y-4">
          <div className="h-12 w-12 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm">
            <Share2 className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-bold text-lg">{t.invite}</h3>
            <p className="text-sm text-muted-foreground">{t.share}</p>
          </div>
          <div className="flex gap-2 p-2 bg-white rounded-xl border">
            <code className="flex-1 flex items-center justify-center text-xs font-mono text-muted-foreground bg-secondary/50 rounded-lg select-all">
              maerskline.bd/register?ref={referralCode}
            </code>
            <Button size="sm" onClick={copyReferral}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-lg">{t.recent}</CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <div className="divide-y">
            {referralData?.referrals && referralData.referrals.length > 0 ? (
                referralData.referrals.map((ref: any, i: number) => (
              <div key={i} className="flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center font-bold text-muted-foreground">
                    {ref.username.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-sm">{ref.username}</p>
                    <p className="text-[10px] text-muted-foreground">
                        {format(new Date(ref.joinedAt), "MMM d, yyyy")}
                    </p>
                  </div>
                </div>
                <Badge variant={ref.isActive ? "default" : "secondary"}>
                  {ref.isActive ? t.active : t.inactive}
                </Badge>
              </div>
            ))
            ) : (
                <div className="p-8 text-center text-muted-foreground">
                    {t.noRefs}
                </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}