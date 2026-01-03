import { useAuth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, UserPlus, Trophy, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function Team() {
  const { user, language } = useAuth();
  const { toast } = useToast();
  
  const referralCode = (user as any)?.referralCode || "REF123";
  
  const copyReferral = () => {
    navigator.clipboard.writeText(`https://maerskline.bd/register?ref=${referralCode}`);
    toast({
      title: language === "bn" ? "কপি করা হয়েছে" : "Copied",
      description: language === "bn" ? "রেফারেল লিংক ক্লিপবোর্ডে কপি করা হয়েছে" : "Referral link copied to clipboard"
    });
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
    yesterday: language === "bn" ? "গতকাল" : "Yesterday"
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div>
        <h1 className="text-4xl font-heading font-bold mb-2">{t.title}</h1>
        <p className="text-muted-foreground text-lg">{t.sub}</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-blue-500 text-white border-none shadow-lg shadow-blue-500/20">
          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
            <Users className="h-6 w-6 mb-2 opacity-80" />
            <p className="text-2xl font-bold font-heading">12</p>
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">{t.totalRef}</p>
          </CardContent>
        </Card>
        <Card className="bg-green-500 text-white border-none shadow-lg shadow-green-500/20">
          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
            <UserPlus className="h-6 w-6 mb-2 opacity-80" />
            <p className="text-2xl font-bold font-heading">5</p>
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">{t.activeRef}</p>
          </CardContent>
        </Card>
        <Card className="bg-purple-500 text-white border-none shadow-lg shadow-purple-500/20">
          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
            <Trophy className="h-6 w-6 mb-2 opacity-80" />
            <p className="text-xl font-bold font-heading">৳2.4k</p>
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
            <code className="flex-1 flex items-center justify-center text-xs font-mono text-muted-foreground bg-secondary/50 rounded-lg">
              maerskline.bd/register?ref={referralCode}
            </code>
            <Button size="sm" onClick={copyReferral}>
              {t.copy}
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
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center font-bold text-muted-foreground">
                    U{i}
                  </div>
                  <div>
                    <p className="font-bold text-sm">{t.user} {9000 + i}</p>
                    <p className="text-[10px] text-muted-foreground">{i % 2 === 0 ? t.today : t.yesterday}</p>
                  </div>
                </div>
                <Badge variant={i % 2 === 0 ? "default" : "secondary"}>
                  {i % 2 === 0 ? t.active : t.inactive}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
