import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
    MessageCircle, 
    Send, 
    ChevronLeft, 
    HeadphonesIcon, 
    Globe, 
    Mail 
} from "lucide-react";
import { useAuth } from "@/lib/auth";

export default function Support() {
  const { language } = useAuth();
  const { data: settings, isLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const res = await fetch("/api/settings");
      if (!res.ok) throw new Error("Failed to fetch settings");
      return res.json();
    },
  });

  const t = {
    title: language === "bn" ? "সাপোর্ট সেন্টার" : "Support Center",
    heroTitle: language === "bn" ? "আমরা কিভাবে সাহায্য করতে পারি?" : "How can we help?",
    heroSub: language === "bn" ? "আমাদের সাপোর্ট টিম ২৪/৭ আপনার যেকোনো সমস্যায় পাশে আছে।" : "Our support team is available 24/7 to assist you with any issues.",
    telegram: language === "bn" ? "টেলিগ্রাম চ্যানেল" : "Telegram Channel",
    telegramSub: language === "bn" ? "অফিসিয়াল আপডেট এবং খবরের জন্য জয়েন করুন" : "Join for official updates & news",
    whatsapp: language === "bn" ? "হোয়াটসঅ্যাপ সাপোর্ট" : "WhatsApp Support",
    whatsappSub: language === "bn" ? "আমাদের সাপোর্ট এজেন্টের সাথে চ্যাট করুন" : "Chat with our support agent",
    email: language === "bn" ? "ইমেইল সাপোর্ট" : "Email Support",
    global: language === "bn" ? "গ্লোবাল কমিউনিটি" : "Global Community",
    globalSub: language === "bn" ? "সারা বিশ্বের হাজার হাজার বিনিয়োগকারীর সাথে যুক্ত হোন। কৌশল শেয়ার করুন এবং একসাথে এগিয়ে যান।" : "Connect with thousands of investors worldwide. Share strategies and grow together.",
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-24 animate-in fade-in duration-500">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b px-4 py-4 flex items-center gap-4">
        <Link href="/dashboard">
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100">
            <ChevronLeft className="h-6 w-6 text-slate-700" />
          </Button>
        </Link>
        <h1 className="text-xl font-bold font-heading text-slate-800">{t.title}</h1>
      </div>

      <div className="p-6 max-w-md mx-auto space-y-8">
        
        {/* Hero Section */}
        <div className="text-center space-y-2 py-4">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <HeadphonesIcon className="h-10 w-10 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">{t.heroTitle}</h2>
            <p className="text-slate-500 text-sm px-4">
                {t.heroSub}
            </p>
        </div>

        {/* Contact Options */}
        <div className="grid gap-4">
            {/* Telegram */}
            <a 
                href={settings?.telegramLink || "#"} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block group"
            >
                <Card className="border-none shadow-sm hover:shadow-md transition-all duration-300 bg-white overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-blue-500/5 group-hover:to-blue-500/10 transition-all" />
                    <CardContent className="p-0 flex items-center h-20">
                        <div className="h-20 w-20 bg-[#229ED9]/10 flex items-center justify-center shrink-0">
                            <Send className="h-8 w-8 text-[#229ED9]" />
                        </div>
                        <div className="px-5 flex-1">
                            <h3 className="font-bold text-slate-800">{t.telegram}</h3>
                            <p className="text-xs text-slate-500 mt-1">{t.telegramSub}</p>
                        </div>
                    </CardContent>
                </Card>
            </a>

            {/* WhatsApp */}
            <a 
                href={settings?.whatsappLink || "#"} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block group"
            >
                <Card className="border-none shadow-sm hover:shadow-md transition-all duration-300 bg-white overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 to-green-500/5 group-hover:to-green-500/10 transition-all" />
                    <CardContent className="p-0 flex items-center h-20">
                        <div className="h-20 w-20 bg-[#25D366]/10 flex items-center justify-center shrink-0">
                            <MessageCircle className="h-8 w-8 text-[#25D366]" />
                        </div>
                        <div className="px-5 flex-1">
                            <h3 className="font-bold text-slate-800">{t.whatsapp}</h3>
                            <p className="text-xs text-slate-500 mt-1">{t.whatsappSub}</p>
                        </div>
                    </CardContent>
                </Card>
            </a>
            
            {/* Email (Placeholder/Static) */}
            <div className="block group opacity-70">
                <Card className="border-none shadow-sm bg-white overflow-hidden relative">
                    <CardContent className="p-0 flex items-center h-20">
                        <div className="h-20 w-20 bg-slate-100 flex items-center justify-center shrink-0">
                            <Mail className="h-8 w-8 text-slate-400" />
                        </div>
                        <div className="px-5 flex-1">
                            <h3 className="font-bold text-slate-800">{t.email}</h3>
                            <p className="text-xs text-slate-500 mt-1">support@maerskline.bd</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>

        {/* Global Community */}
        <div className="mt-8 bg-slate-900 rounded-3xl p-6 text-white text-center relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl" />
             <Globe className="h-8 w-8 mx-auto mb-3 text-blue-400" />
             <h3 className="font-bold text-lg">{t.global}</h3>
             <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                {t.globalSub}
             </p>
        </div>

      </div>
    </div>
  );
}
