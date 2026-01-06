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
  Briefcase,
  FileText,
  UserCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { UserAvatar } from "@/components/user-avatar";
import { Badge } from "@/components/ui/badge";

export default function Profile() {
  const { user, logout, language } = useAuth();

  const hasPackage = user?.hasPackage || false;

  const t = {
    title: language === "bn" ? "প্রোফাইল সেটিংস" : "Profile Settings",
    sub: language === "bn" ? "আপনার অ্যাকাউন্ট এবং ফিন্যান্স ম্যানেজ করুন" : "Manage your account and finances",
    wallet: language === "bn" ? "ওয়ালেট" : "Wallet",
    walletSub: language === "bn" ? "ব্যালেন্স ও লেনদেন" : "Balance & Trans",
    tasks: language === "bn" ? "টাস্ক" : "Tasks",
    tasksSub: language === "bn" ? "দৈনিক প্রগতি" : "Daily Progress",
    team: language === "bn" ? "টিম" : "Team",
    teamSub: language === "bn" ? "রেফারেল নেটওয়ার্ক" : "Referral Network",
    settings: language === "bn" ? "সেটিংস" : "Settings",
    settingsSub: language === "bn" ? "অ্যাকাউন্ট কনফিগারেশন" : "Account Config",
    tc: language === "bn" ? "শর্তাবলী" : "T&C",
    tcSub: language === "bn" ? "আইনি তথ্য" : "Legal Info",
    logout: language === "bn" ? "লগ আউট" : "Logout",
    verify: language === "bn" ? "ভেরিফাইড" : "Verified",
    role: language === "bn" ? "ভূমিকা" : "Role",
    memberId: language === "bn" ? "মেম্বার আইডি" : "Member ID",
    quickActions: language === "bn" ? "দ্রুত অ্যাকশন" : "Quick Actions",
    support: language === "bn" ? "সাপোর্ট" : "Support",
    joined: language === "bn" ? "যোগদান" : "Joined"
  };

  const quickLinks = [
    { href: "/wallet", icon: Wallet, label: t.wallet, sub: t.walletSub, color: "bg-blue-500" },
    { href: "/tasks", icon: CheckSquare, label: t.tasks, sub: t.tasksSub, color: "bg-orange-500" },
    { href: "/team", icon: Users, label: t.team, sub: t.teamSub, color: "bg-purple-500" },
    { href: "/settings", icon: Settings, label: t.settings, sub: t.settingsSub, color: "bg-slate-600" },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-24">
      {/* Professional Header */}
      <div className="bg-slate-900 pt-8 pb-16 px-6 rounded-b-[2.5rem] relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl -ml-16 -mb-16" />
        
        <div className="relative z-10 flex flex-col items-center">
          <UserAvatar user={{ ...user, hasPackage } as any} size="xl" className="shadow-2xl ring-4 ring-white/10" />
          
          <h1 className="text-2xl font-bold font-heading text-white mt-4 tracking-tight">
            {user?.name || user?.username}
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-slate-400 text-sm font-medium">@{user?.username}</p>
            <Badge variant="secondary" className="h-5 px-2 text-[10px] font-bold bg-white/10 text-white hover:bg-white/20 border-none">
              {hasPackage ? "PRO" : "FREE"}
            </Badge>
          </div>

          <div className="flex gap-4 mt-6 w-full max-w-sm justify-center">
             <div className="bg-white/5 backdrop-blur-md rounded-2xl p-3 flex-1 text-center border border-white/10">
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">{t.joined}</p>
                <p className="text-white font-heading font-bold text-sm mt-1">
                  {new Date(user?.createdAt || Date.now()).getFullYear()}
                </p>
             </div>
             <div className="bg-white/5 backdrop-blur-md rounded-2xl p-3 flex-1 text-center border border-white/10">
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">{t.verify}</p>
                <div className="flex justify-center mt-1">
                  <ShieldCheck className="h-5 w-5 text-green-400" />
                </div>
             </div>
          </div>
        </div>
      </div>

      <div className="px-6 -mt-8 relative z-20 space-y-6 animate-in slide-in-from-bottom-4 duration-700">
        
        {/* Quick Grid */}
        <div className="grid grid-cols-2 gap-4">
          {quickLinks.map((item, idx) => (
            <Link key={idx} href={item.href}>
              <motion.div 
                whileTap={{ scale: 0.98 }}
                className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center gap-3 hover:shadow-md transition-all"
              >
                <div className={`h-10 w-10 ${item.color} rounded-xl flex items-center justify-center text-white shadow-lg shadow-${item.color}/20`}>
                  <item.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-sm">{item.label}</p>
                  <p className="text-[10px] text-slate-400 font-medium">{item.sub}</p>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>

        {/* Menu List */}
        <Card className="border-none shadow-sm overflow-hidden">
          <CardContent className="p-0 divide-y divide-slate-100">
            <Link href="/terms">
              <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 bg-cyan-50 text-cyan-600 rounded-xl flex items-center justify-center group-hover:bg-cyan-100 transition-colors">
                    <FileText className="h-5 w-5" />
                  </div>
                  <span className="font-bold text-slate-700 text-sm">{t.tc}</span>
                </div>
                <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-slate-600" />
              </div>
            </Link>
            <Link href="/support">
              <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                    <UserCheck className="h-5 w-5" />
                  </div>
                  <span className="font-bold text-slate-700 text-sm">{t.support}</span>
                </div>
                <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-slate-600" />
              </div>
            </Link>
          </CardContent>
        </Card>

        <Button 
          variant="destructive" 
          className="w-full h-14 rounded-2xl font-heading text-lg shadow-lg shadow-destructive/20"
          onClick={logout}
        >
          <LogOut className="h-5 w-5 mr-2" />
          {t.logout}
        </Button>

        <p className="text-center text-[10px] text-slate-400 uppercase tracking-widest font-bold">
          MAERSK.Line BD v1.2.0
        </p>
      </div>
    </div>
  );
}
