import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, UserPlus, Copy, Share2, Wallet, ArrowRight, Zap, Trophy, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { motion } from "framer-motion";

export default function Team() {
  const { user, language } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

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
  const referralBalance = parseFloat(user?.referralBalance || "0");
  const activeReferrals = referralData?.activeReferrals || 0;
  const totalReferrals = referralData?.totalReferrals || 0;
  
  const copyCode = async () => {
    if (!referralCode || referralCode === "...") return;
    
    // Fallback for non-secure contexts
    const fallbackCopy = (text: string) => {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-9999px";
      textArea.style.top = "0";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        toast({ title: language === "bn" ? "কোড কপি করা হয়েছে" : "Code Copied" });
      } catch (err) {
        toast({ title: "Failed to copy code", variant: "destructive" });
      }
      document.body.removeChild(textArea);
    };

    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(referralCode);
        toast({ title: language === "bn" ? "কোড কপি করা হয়েছে" : "Code Copied" });
      } catch (e) {
        fallbackCopy(referralCode);
      }
    } else {
      fallbackCopy(referralCode);
    }
  };

  const t = {
    title: language === "bn" ? "রেফারেল হাব" : "Referral Hub",
    sub: language === "bn" ? "বন্ধুদের আমন্ত্রণ জানান এবং ৪০% কমিশন উপার্জন করুন!" : "Invite & Earn 40% Commission Instantly!",
    balance: language === "bn" ? "রেফারেল ব্যালেন্স" : "Available Earnings",
    withdraw: language === "bn" ? "উত্তোলন" : "Withdraw",
    code: language === "bn" ? "আপনার রেফারেল কোড" : "Your Referral Code",
    stats: language === "bn" ? "পরিসংখ্যান" : "Stats",
    members: language === "bn" ? "টিম মেম্বার" : "Team Members",
  };

  if (isLoading) return <div className="p-10 text-center animate-pulse">Loading referral data...</div>;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-24">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-heading font-bold mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{t.title}</h1>
        <p className="text-muted-foreground">{t.sub}</p>
      </div>

      {/* Hero Wallet Card */}
      <motion.div whileHover={{ scale: 1.01 }} transition={{ duration: 0.2 }}>
        <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 rounded-[2rem] p-8 text-white shadow-2xl overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-black/10 rounded-full blur-3xl -ml-10 -mb-10"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-2 text-indigo-100">
                        <Wallet className="h-5 w-5" />
                        <span className="text-sm font-bold uppercase tracking-wider">{t.balance}</span>
                    </div>
                    <h2 className="text-5xl font-black font-heading tracking-tight mb-2">
                        ৳{referralBalance.toLocaleString()}
                    </h2>
                    <p className="text-xs text-indigo-200">Withdraw anytime • No limits</p>
                </div>
            </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3 md:gap-6">
          <Card className="border-none shadow-sm bg-blue-50/50">
              <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-2">
                      <Users className="h-4 w-4" />
                  </div>
                  <span className="text-2xl font-bold text-slate-800">{totalReferrals}</span>
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Total Joined</span>
              </CardContent>
          </Card>
          <Card className="border-none shadow-sm bg-green-50/50">
              <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-2">
                      <UserPlus className="h-4 w-4" />
                  </div>
                  <span className="text-2xl font-bold text-slate-800">{activeReferrals}</span>
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Active Users</span>
              </CardContent>
          </Card>
          <Card className="border-none shadow-sm bg-yellow-50/50">
              <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                  <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 mb-2">
                      <Trophy className="h-4 w-4" />
                  </div>
                  <span className="text-2xl font-bold text-slate-800">40%</span>
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Commission</span>
              </CardContent>
          </Card>
      </div>

      {/* Referral Code Section */}
      <Card className="border-2 border-dashed border-indigo-200 bg-indigo-50/30 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <Zap className="h-24 w-24 text-indigo-600" />
          </div>
          <CardContent className="p-8 flex flex-col items-center text-center gap-4">
              <p className="text-sm font-bold text-indigo-900 uppercase tracking-widest">{t.code}</p>
              <div 
                className="bg-white px-10 py-5 rounded-2xl border-2 border-indigo-100 shadow-xl w-full max-w-sm relative group cursor-pointer active:scale-95 transition-transform" 
                onClick={copyCode}
              >
                  <span className="text-5xl font-mono font-black text-indigo-600 tracking-[0.2em]">{referralCode}</span>
                  <div className="absolute inset-0 bg-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center">
                      <Copy className="h-8 w-8 text-indigo-600 animate-pulse" />
                  </div>
              </div>
              <p className="text-xs text-slate-500 font-medium">Click the code above to copy</p>
              <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-10 rounded-full shadow-lg mt-2" onClick={copyCode}>
                  <Copy className="h-4 w-4 mr-2" /> Copy Referral Code
              </Button>
          </CardContent>
      </Card>

      {/* Members List */}
      <div>
          <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-bold text-lg flex items-center gap-2">
                  <History className="h-5 w-5 text-slate-400" />
                  {t.members}
              </h3>
              <Badge variant="outline" className="text-slate-500">{referralData?.referrals?.length || 0} Members</Badge>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              {referralData?.referrals && referralData.referrals.length > 0 ? (
                  <div className="divide-y divide-slate-50">
                      {referralData.referrals.map((ref: any, i: number) => (
                          <div key={i} className="flex items-center justify-between p-4 hover:bg-slate-50/50 transition-colors">
                              <div className="flex items-center gap-3">
                                  <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm ${ref.isActive ? 'bg-gradient-to-br from-green-400 to-green-600 text-white shadow-green-200 shadow-md' : 'bg-slate-100 text-slate-400'}`}>
                                      {ref.username.substring(0, 1).toUpperCase()}
                                  </div>
                                  <div>
                                      <p className="font-bold text-sm text-slate-800">{ref.username}</p>
                                      <p className="text-[10px] text-slate-400">Joined {format(new Date(ref.joinedAt), "MMM d, yyyy")}</p>
                                  </div>
                              </div>
                              <div className="flex flex-col items-end">
                                  <Badge className={`${ref.isActive ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'} border-none px-3`}>
                                      {ref.isActive ? "ACTIVE" : "PENDING"}
                                  </Badge>
                                  {ref.isActive && (
                                      <span className="text-[10px] text-green-600 font-medium mt-1">+40% Earned</span>
                                  )}
                              </div>
                          </div>
                      ))}
                  </div>
              ) : (
                  <div className="py-12 flex flex-col items-center justify-center text-center">
                      <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                          <Users className="h-8 w-8 text-slate-300" />
                      </div>
                      <p className="text-slate-500 font-medium">No team members yet</p>
                      <p className="text-xs text-slate-400 max-w-[200px] mt-1">Share your link to start earning 40% commission per active referral.</p>
                  </div>
              )}
          </div>
      </div>
    </div>
  );
}