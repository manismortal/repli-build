import { useAuth } from "@/lib/auth";
import { Link, useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Wallet, 
  CheckSquare, 
  Settings, 
  Users, 
  ChevronRight, 
  LogOut, 
  ShieldCheck,
  FileText,
  UserCheck,
  CreditCard,
  Bell,
  ArrowLeft,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { UserAvatar } from "@/components/user-avatar";
import { Badge } from "@/components/ui/badge";
import { Footer } from "@/components/footer";

export default function Profile() {
  const { user, logout, language } = useAuth();
  const [, setLocation] = useLocation();

  const hasPackage = user?.hasPackage || false;

  const t = {
    title: language === "bn" ? "প্রোফাইল" : "Profile",
    wallet: language === "bn" ? "ওয়ালেট" : "Wallet",
    tasks: language === "bn" ? "টাস্ক" : "Tasks",
    team: language === "bn" ? "রেফারেল" : "Team",
    settings: language === "bn" ? "সেটিংস" : "Settings",
    tc: language === "bn" ? "শর্তাবলী" : "Terms",
    about: language === "bn" ? "আমাদের সম্পর্কে" : "About Us",
    logout: language === "bn" ? "লগ আউট" : "Logout",
    verify: language === "bn" ? "ভেরিফাইড" : "Verified",
    joined: language === "bn" ? "যোগদান" : "Joined",
    support: language === "bn" ? "সাপোর্ট" : "Support",
    balance: language === "bn" ? "ব্যালেন্স" : "Balance",
    ref_earning: language === "bn" ? "রেফার আয়" : "Ref. Earning",
    role: language === "bn" ? "রোল" : "Role",
  };

  // Using theme variables for consistency: Primary (Blue), Accent (Orange), Purple (Referral)
  const quickLinks = [
    { href: "/wallet", icon: Wallet, label: t.wallet, color: "text-primary", bg: "bg-primary/10" },
    { href: "/tasks", icon: CheckSquare, label: t.tasks, color: "text-accent", bg: "bg-accent/10" },
    { href: "/team", icon: Users, label: t.team, color: "text-purple-600", bg: "bg-purple-100" }, // Keeping purple for team as distinct
    { href: "/settings", icon: Settings, label: t.settings, color: "text-slate-600", bg: "bg-slate-100" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-24 font-sans">
      {/* Consistent Header matching Dashboard */}
      <div className="relative h-48 bg-slate-900 rounded-b-[2.5rem] shadow-lg overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('/maersk_shipping_container_vessel_at_sea.webp')] bg-cover bg-center opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
        
        {/* Header Actions */}
        <div className="absolute top-0 w-full p-6 flex justify-between items-center text-white z-10">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white hover:bg-white/10 rounded-full"
            onClick={() => setLocation("/dashboard")}
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div className="flex gap-2">
             <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-full">
                <Bell className="h-5 w-5" />
             </Button>
          </div>
        </div>
      </div>

      {/* Profile Content - Floating Up */}
      <div className="px-6 -mt-20 relative z-20">
        <div className="flex flex-col items-center">
          {/* Avatar with Ring */}
          <div className="relative">
            <UserAvatar 
              user={{ ...user, hasPackage } as any} 
              size="xl" 
              className="h-28 w-28 border-4 border-white shadow-xl bg-slate-100" 
              showStatus={false}
            />
            {hasPackage && (
               <div className="absolute bottom-1 right-1 bg-primary rounded-full p-1.5 border-4 border-white shadow-sm">
                 <ShieldCheck className="h-4 w-4 text-white" />
               </div>
            )}
          </div>

          <div className="text-center mt-3">
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center justify-center gap-2">
              {user?.name || user?.username}
              {hasPackage && <Badge className="bg-primary hover:bg-primary/90 text-[10px] px-2 h-5">PRO</Badge>}
            </h1>
            <p className="text-slate-500 font-medium text-sm">@{user?.username}</p>
          </div>

          {/* Key Stats Card */}
          <Card className="w-full mt-6 shadow-md border-slate-100/50 rounded-2xl overflow-hidden">
            <CardContent className="p-0 flex divide-x divide-slate-100">
              <div className="flex-1 p-4 text-center">
                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">{t.balance}</p>
                <p className="font-bold text-slate-800 text-lg">৳{user?.balance || "0"}</p>
              </div>
              <div className="flex-1 p-4 text-center">
                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">{t.ref_earning}</p>
                <p className="font-bold text-slate-800 text-lg">৳{user?.referralBalance || "0"}</p>
              </div>
              <div className="flex-1 p-4 text-center">
                 <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">{t.role}</p>
                 <p className="font-bold text-slate-800 text-lg capitalize truncate px-1">
                   {user?.role === 'user' ? 'Member' : user?.role?.replace('_', ' ')}
                 </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          {quickLinks.map((item, idx) => (
            <Link key={idx} href={item.href}>
              <motion.div 
                whileTap={{ scale: 0.98 }}
                className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className={`h-12 w-12 ${item.bg} ${item.color} rounded-xl flex items-center justify-center`}>
                  <item.icon className="h-6 w-6" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-slate-700">{item.label}</span>
                  <span className="text-xs text-slate-400">View Details</span>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>

        {/* Menu List */}
        <div className="mt-6 space-y-3">
           <h3 className="text-sm font-bold text-slate-900 px-1">General</h3>
           <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white">
             <CardContent className="p-0 divide-y divide-slate-50">
               <Link href="/about">
                 <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer group">
                   <div className="flex items-center gap-3">
                     <div className="h-8 w-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                       <Info className="h-4 w-4" />
                     </div>
                     <span className="font-semibold text-slate-600">{t.about}</span>
                   </div>
                   <ChevronRight className="h-4 w-4 text-slate-300" />
                 </div>
               </Link>
               <Link href="/terms">
                 <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer group">
                   <div className="flex items-center gap-3">
                     <div className="h-8 w-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                       <FileText className="h-4 w-4" />
                     </div>
                     <span className="font-semibold text-slate-600">{t.tc}</span>
                   </div>
                   <ChevronRight className="h-4 w-4 text-slate-300" />
                 </div>
               </Link>
               <Link href="/support">
                 <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer group">
                   <div className="flex items-center gap-3">
                     <div className="h-8 w-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                       <UserCheck className="h-4 w-4" />
                     </div>
                     <span className="font-semibold text-slate-600">{t.support}</span>
                   </div>
                   <ChevronRight className="h-4 w-4 text-slate-300" />
                 </div>
               </Link>
             </CardContent>
           </Card>
        </div>

        <div className="mt-8 mb-6">
          <Button 
            variant="outline" 
            className="w-full h-12 rounded-xl border-red-100 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-200 font-bold transition-all"
            onClick={() => logout()}
          >
            <LogOut className="h-4 w-4 mr-2" />
            {t.logout}
          </Button>
          <p className="text-center text-[10px] text-slate-300 font-medium mt-4 uppercase tracking-widest">
            Maersk BD • v1.2.0
          </p>
        </div>

        <Footer />

      </div>
    </div>
  );
}