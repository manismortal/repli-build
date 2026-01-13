import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Anchor, 
  Target, 
  Globe, 
  Users, 
  ChevronRight, 
  ShieldCheck,
  Zap,
  History
} from "lucide-react";
import { Link } from "wouter";

export default function About() {
  // Completely localized to Bengali as per requirement
  const t = {
    title: "আমাদের সম্পর্কে",
    subtitle: "ভবিষ্যতের নেতৃত্বে, ঐতিহ্য গড়ে তোলায়",
    mission: "আমাদের লক্ষ্য",
    missionText: "বাংলাদেশের লজিস্টিক খাতকে আধুনিকায়নের মাধ্যমে বিশ্বমানের সেবার মান নিশ্চিত করা।",
    vision: "আমাদের ভিশন",
    visionText: "স্মার্ট ও টেকসই বন্দর ব্যবস্থাপনার মাধ্যমে দেশের অর্থনীতির চাকা সচল রাখা।",
    history: "আমাদের ইতিহাস",
    historyText: "মেয়ার্স্ক বিডি (Maersk BD) দীর্ঘ সময় ধরে বাংলাদেশের মেরিটাইম সেক্টরে এক বিশ্বস্ত নাম। আমাদের যাত্রার শুরু থেকেই আমরা শিপিং ল্যান্ডস্কেপ পরিবর্তনের ক্ষেত্রে অগ্রণী ভূমিকা পালন করে আসছি। চট্টগ্রাম বন্দরের সাথে আমাদের যাত্রা শুরু হয়েছিল কার্গো হ্যান্ডলিং প্রক্রিয়াকে সহজতর করার লক্ষ্যে, এবং আজ আমরা প্রযুক্তির ও দক্ষতার মাধ্যমে দেশের আমদানি-রপ্তানি ইকোসিস্টেমের একটি মূল চালিকাশক্তি হিসেবে দাঁড়িয়েছি।",
    modernization: "আধুনিকায়ন ও চট্টগ্রাম বন্দর",
    contact: "যোগাযোগ করুন",
    values: "আমাদের মূল্যবোধ",
    cta: "আমাদের সাথে ভবিষ্যৎ গড়তে প্রস্তুত?",
    partnershipText1: "আমরা গর্বের সাথে **Maersk Line BD** এর সাথে যুক্ত, যারা সরাসরি **চট্টগ্রাম বন্দরে** অপারেশনাল উৎকর্ষের এক নতুন যুগের সূচনা করতে কাজ করে যাচ্ছে।",
    partnershipText2: "আমাদের মূল লক্ষ্য হলো অত্যাধুনিক লজিস্টিক প্রযুক্তি, স্বয়ংক্রিয় কন্টেইনার হ্যান্ডলিং এবং টেকসই শিপিং প্র্যাকটিস প্রবর্তনের মাধ্যমে **বন্দর কার্যক্রমের আধুনিকায়ন** করা। এই অংশীদারিত্বের উদ্দেশ্য হলো টার্নঅ্যারাউন্ড সময় কমানো এবং বাংলাদেশের প্রধান মেরিটাইম গেটওয়ের সক্ষমতা বৃদ্ধি করা।"
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl -ml-12 -mb-12" />
        
        <div className="relative z-10 text-center space-y-4">
          <Badge className="bg-primary/20 text-primary-foreground hover:bg-primary/30 border-none px-4 py-1.5 font-bold">
            EST. 1996
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold font-heading tracking-tight">
            {t.title}
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto font-light">
            {t.subtitle}
          </p>
        </div>
      </div>

      {/* Maersk & Chittagong Port Partnership */}
      <Card className="border-none shadow-lg bg-gradient-to-br from-white to-slate-50 overflow-hidden">
        <CardContent className="p-0">
          <div className="grid md:grid-cols-2 gap-0">
            <div className="p-8 space-y-6 flex flex-col justify-center">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700">
                  <Anchor className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">{t.modernization}</h2>
              </div>
              
              <div className="space-y-4 text-slate-600 leading-relaxed text-justify">
                <p>
                  আমরা গর্বের সাথে <strong>Maersk Line BD</strong> এর সাথে যুক্ত হয়ে সরাসরি <strong>চট্টগ্রাম বন্দরে</strong> অপারেশনাল উৎকর্ষের এক নতুন যুগের সূচনা করতে কাজ করছি।
                </p>
                <p>
                  আমাদের মূল লক্ষ্য হলো অত্যাধুনিক লজিস্টিক প্রযুক্তি, স্বয়ংক্রিয় কন্টেইনার হ্যান্ডলিং এবং টেকসই শিপিং প্র্যাকটিস প্রবর্তনের মাধ্যমে <strong>বন্দর কার্যক্রমের আধুনিকায়ন</strong> করা। এই অংশীদারিত্বের উদ্দেশ্য হলো কাজের গতি বৃদ্ধি করা এবং বাংলাদেশের প্রধান মেরিটাইম গেটওয়ের সক্ষমতা সর্বোচ্চ পর্যায়ে নিয়ে যাওয়া।
                </p>
              </div>
            </div>
            <div className="bg-slate-200 min-h-[300px] relative overflow-hidden">
               <img 
                 src="/about us.webp" 
                 alt="Maersk Operations" 
                 className="absolute inset-0 w-full h-full object-cover"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent flex items-end justify-center p-6">
                 {/* Optional: Add caption or overlay text if needed */}
               </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mission & Vision Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="hover:shadow-md transition-shadow border-slate-100">
          <CardHeader className="pb-3">
             <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-2">
                <Target className="h-6 w-6 text-red-600" />
             </div>
             <CardTitle className="text-xl font-bold">{t.mission}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 leading-relaxed">{t.missionText}</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow border-slate-100">
          <CardHeader className="pb-3">
             <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                <Globe className="h-6 w-6 text-blue-600" />
             </div>
             <CardTitle className="text-xl font-bold">{t.vision}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 leading-relaxed">{t.visionText}</p>
          </CardContent>
        </Card>
      </div>

      {/* Our Values */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 px-2">{t.values}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: ShieldCheck, title: "সততা (Integrity)", text: "প্রতিটি পদক্ষেপে সর্বোচ্চ বিশ্বাসযোগ্যতা ও স্বচ্ছতা বজায় রাখা।", color: "text-green-600", bg: "bg-green-50" },
            { icon: Zap, title: "উদ্ভাবন (Innovation)", text: "জটিল লজিস্টিক চ্যালেঞ্জ মোকাবেলায় স্মার্ট সমাধান তৈরি করা।", color: "text-amber-600", bg: "bg-amber-50" },
            { icon: Users, title: "সহযোগিতা (Collaboration)", text: "পারস্পরিক প্রবৃদ্ধির জন্য স্থানীয় অংশীদারদের সাথে একযোগে কাজ করা।", color: "text-purple-600", bg: "bg-purple-50" },
          ].map((item, idx) => (
            <Card key={idx} className="border-none shadow-sm">
              <CardContent className="p-6 flex flex-col items-start gap-4">
                <div className={`h-10 w-10 rounded-lg ${item.bg} ${item.color} flex items-center justify-center`}>
                  <item.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">{item.title}</h3>
                  <p className="text-sm text-slate-600 leading-snug">{item.text}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* History Section */}
      <Card className="bg-slate-50 border-slate-200">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="bg-white p-3 rounded-2xl shadow-sm shrink-0">
               <History className="h-8 w-8 text-slate-700" />
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-slate-900">{t.history}</h3>
              <p className="text-slate-600 leading-relaxed text-justify">
                {t.historyText}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CTA Section */}
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">{t.cta}</h2>
        <Link href="/support">
          <Button size="lg" className="rounded-full px-8 font-bold shadow-lg shadow-primary/25">
            {t.contact} <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>

    </div>
  );
}