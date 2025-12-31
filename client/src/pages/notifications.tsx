import { useAuth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Shield, Info, ArrowRight } from "lucide-react";

export default function Notifications() {
  const { language } = useAuth();

  const t = {
    title: language === "bn" ? "বিজ্ঞপ্তি" : "Notifications",
    empty: language === "bn" ? "কোনো নতুন বিজ্ঞপ্তি নেই" : "No new notifications",
    sub: language === "bn" ? "আপনার অ্যাকাউন্টের আপডেট এখানে দেখুন" : "View your account updates here"
  };

  const MOCK_NOTIFS = [
    { id: 1, title: language === "bn" ? "স্বাগতম বোনাস" : "Welcome Bonus", desc: language === "bn" ? "৳২৫০ আপনার ওয়ালেটে যোগ করা হয়েছে" : "৳250 has been added to your wallet", time: "2h ago", icon: Shield, color: "text-green-600" },
    { id: 2, title: language === "bn" ? "নতুন প্যাকেজ উপলব্ধ" : "New Package Available", desc: language === "bn" ? "প্লাটিনাম মেয়ার্স্ক এখন ইনভেস্ট করার জন্য তৈরি" : "Platinum Maersk is now ready for investment", time: "5h ago", icon: Bell, color: "text-blue-600" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header>
        <h1 className="text-4xl font-heading font-bold mb-2">{t.title}</h1>
        <p className="text-muted-foreground text-lg">{t.sub}</p>
      </header>

      <div className="space-y-3">
        {MOCK_NOTIFS.map((notif) => (
          <Card key={notif.id} className="hover-elevate border-none shadow-sm overflow-hidden bg-card/50 backdrop-blur-sm">
            <CardContent className="p-4 flex items-center gap-4">
              <div className={`h-12 w-12 rounded-2xl bg-secondary flex items-center justify-center ${notif.color}`}>
                <notif.icon className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-bold tracking-tight">{notif.title}</p>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">{notif.time}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{notif.desc}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-primary/5 p-6 rounded-[2.5rem] border border-primary/10 text-center space-y-2 mt-8">
        <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
          <Info className="h-6 w-6" />
        </div>
        <p className="text-sm font-bold text-primary">{language === "bn" ? "সব আপডেট দেখুন" : "View all updates"}</p>
        <p className="text-xs text-muted-foreground">{language === "bn" ? "আপনার অ্যাকাউন্টের নিরাপত্তা নিশ্চিত করুন" : "Ensure your account security"}</p>
      </div>
    </div>
  );
}
