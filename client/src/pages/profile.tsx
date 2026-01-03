import { useAuth } from "@/lib/auth";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Wallet, 
  CheckSquare, 
  Settings, 
  Users, 
  ChevronRight, 
  LogOut, 
  ShieldCheck,
  User as UserIcon,
  Briefcase,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function Profile() {
  const { user, logout, language } = useAuth();

  const t = {
    title: language === "bn" ? "প্রোফাইল সেটিংস" : "Profile Settings",
    sub: language === "bn" ? "আপনার অ্যাকাউন্ট এবং ফিন্যান্স ম্যানেজ করুন" : "Manage your account and finances",
    wallet: language === "bn" ? "ওয়ালেট তথ্য" : "Wallet Information",
    walletSub: language === "bn" ? "ব্যালেন্স এবং লেনদেন" : "Balance and transactions",
    tasks: language === "bn" ? "দৈনিক টাস্ক" : "Daily Tasks",
    tasksSub: language === "bn" ? "আপনার প্রগতি দেখুন" : "View your progress",
    team: language === "bn" ? "আমার নেটওয়ার্ক" : "My Network",
    teamSub: language === "bn" ? "রেফারেল এবং ইনকাম" : "Referrals and earnings",
    settings: language === "bn" ? "অ্যাকাউন্ট সেটিংস" : "Account Settings",
    settingsSub: language === "bn" ? "প্রোফাইল আপডেট করুন" : "Update your profile",
    tc: language === "bn" ? "শর্তাবলী" : "Terms and Conditions",
    tcSub: language === "bn" ? "প্ল্যাটফর্মের নিয়মাবলী দেখুন" : "View platform guidelines",
    logout: language === "bn" ? "লগ আউট" : "Logout",
    verify: language === "bn" ? "ভেরিফাইড অ্যাকাউন্ট" : "Verified Account"
  };

  const menuItems = [
    { href: "/wallet", icon: Wallet, color: "text-blue-600", bg: "bg-blue-100", title: t.wallet, desc: t.walletSub },
    { href: "/tasks", icon: CheckSquare, color: "text-orange-600", bg: "bg-orange-100", title: t.tasks, desc: t.tasksSub },
    { href: "/team", icon: Users, color: "text-purple-600", bg: "bg-purple-100", title: t.team, desc: t.teamSub },
    { href: "/settings", icon: Settings, color: "text-gray-600", bg: "bg-gray-100", title: t.settings, desc: t.settingsSub },
    { href: "/terms", icon: FileText, color: "text-cyan-600", bg: "bg-cyan-100", title: t.tc, desc: t.tcSub },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <header className="text-center pb-4">
        <div className="relative inline-block mb-4">
          <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center border-4 border-background shadow-xl">
            <UserIcon className="h-12 w-12 text-primary" />
          </div>
          <div className="absolute -bottom-1 -right-1 bg-green-500 p-1.5 rounded-full border-4 border-background">
            <ShieldCheck className="h-4 w-4 text-white" />
          </div>
        </div>
        <h1 className="text-2xl font-bold font-heading">{user?.name || user?.username}</h1>
        <p className="text-muted-foreground text-sm">{user?.username}</p>
        <div className="mt-2 inline-flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-bold border border-green-100">
          <Briefcase className="h-3 w-3" />
          {t.verify}
        </div>
      </header>

      <div className="grid gap-3">
        {menuItems.map((item, index) => (
          <Link key={item.href} href={item.href}>
            <motion.div 
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              className="group flex items-center justify-between p-4 bg-card rounded-[2rem] border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className={`h-12 w-12 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-6`}>
                  <item.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-bold tracking-tight">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </motion.div>
          </Link>
        ))}
      </div>

      <Button 
        variant="destructive" 
        className="w-full h-14 rounded-[2rem] font-heading text-lg mt-4 shadow-lg shadow-destructive/10"
        onClick={logout}
      >
        <LogOut className="h-5 w-5 mr-2" />
        {t.logout}
      </Button>

      <p className="text-center text-[10px] text-muted-foreground pt-4 uppercase tracking-[0.2em] font-bold">
        MAERSK.Line Bangladesh v1.2.0
      </p>
    </div>
  );
}
