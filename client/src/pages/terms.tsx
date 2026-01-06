import { useAuth } from "@/lib/auth";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, Shield, Scale, FileText, AlertCircle } from "lucide-react";

export default function TermsAndConditions() {
  const { language } = useAuth();

  const content = language === "bn" ? {
    title: "শর্তাবলী ও নিয়মাবলী",
    intro: "MAERSK.Line বাংলাদেশ প্ল্যাটফর্মে আপনাকে স্বাগতম। আমাদের সেবা ব্যবহারের পূর্বে দয়া করে নিচের শর্তাবলী মনোযোগ সহকারে পড়ুন।",
    sections: [
      {
        title: "১. ব্যবহারকারীর দায়িত্ব",
        icon: Shield,
        items: [
          "ব্যবহারকারীকে অবশ্যই ১৮ বছর বা তার বেশি বয়সী হতে হবে।",
          "একটি মোবাইল নম্বর দিয়ে শুধুমাত্র একটি অ্যাকাউন্ট খোলা যাবে।",
          "অ্যাকাউন্টের নিরাপত্তা এবং পাসওয়ার্ড গোপনীয় রাখার দায়িত্ব ব্যবহারকারীর।"
        ]
      },
      {
        title: "২. বিনিয়োগ নির্দেশিকা",
        icon: Scale,
        items: [
          "সকল বিনিয়োগ প্যাকেজ নির্দিষ্ট মেয়াদের জন্য প্রযোজ্য।",
          "বিনিয়োগকৃত মূলধন মেয়াদের আগে উত্তোলন করা সম্ভব নয়।",
          "দৈনিক মুনাফা প্যাকেজের ধরন অনুযায়ী পরিবর্তিত হতে পারে।"
        ]
      },
      {
        title: "৩. উত্তোলন পলিসি",
        icon: FileText,
        items: [
          "ন্যূনতম উত্তোলনের পরিমাণ ৫০০ টাকা।",
          "উত্তোলনের সময় ৫% থেকে ১০% সার্ভিস চার্জ প্রযোজ্য হতে পারে।",
          "উত্তোলনের অনুরোধ ২৪ থেকে ৭২ ঘণ্টার মধ্যে প্রসেস করা হবে।",
          "ব্যবহারকারীরা ২৫০ টাকা ওয়েলকাম বোনাস পাবেন। এই বোনাস ৬০ দিনের জন্য লক করা থাকবে।",
          "গুরুত্বপূর্ণ: যদি ৬০ দিনের আগে কোনো টাকা উত্তোলন করা হয়, তবে ওয়েলকাম বোনাস বাতিল হয়ে যাবে।",
          "বোনাস দাবি করতে হলে, প্রথম ৬০ দিন কোনো টাকা উত্তোলন করা যাবে না।"
        ]
      },
      {
        title: "৪. গোপনীয়তা ও নিরাপত্তা",
        icon: AlertCircle,
        items: [
          "আমরা আপনার ব্যক্তিগত তথ্য সুরক্ষায় প্রতিশ্রুতিবদ্ধ।",
          "যেকোনো সন্দেহজনক কার্যকলাপের জন্য অ্যাকাউন্ট সাময়িকভাবে স্থগিত করা হতে পারে।",
          "প্ল্যাটফর্মের নিয়ম ভঙ্গের কারণে অ্যাকাউন্ট পার্মানেন্টলি ডিলিট হতে পারে।"
        ]
      }
    ]
  } : {
    title: "Terms and Conditions",
    intro: "Welcome to MAERSK.Line Bangladesh. Please read these terms and conditions carefully before using our services.",
    sections: [
      {
        title: "1. User Responsibilities",
        icon: Shield,
        items: [
          "Users must be at least 18 years of age.",
          "Only one account per mobile number is permitted.",
          "Users are responsible for maintaining account security and password confidentiality."
        ]
      },
      {
        title: "2. Investment Guidelines",
        icon: Scale,
        items: [
          "All investment packages are for a fixed duration.",
          "Invested capital cannot be withdrawn before the term expires.",
          "Daily profits may vary based on the specific package type."
        ]
      },
      {
        title: "3. Withdrawal Policy",
        icon: FileText,
        items: [
          "Minimum withdrawal amount is 500 BDT.",
          "A service charge of 5% to 10% may apply to withdrawals.",
          "Withdrawal requests will be processed within 24 to 72 hours.",
          "Users receive a 250 BDT Welcome Bonus. This bonus is locked for 60 days.",
          "IMPORTANT: If any withdrawal is made before 60 days, the Welcome Bonus will be FORFEITED.",
          "To claim the bonus, you must not withdraw any funds for the first 60 days."
        ]
      },
      {
        title: "4. Privacy and Security",
        icon: AlertCircle,
        items: [
          "We are committed to protecting your personal data.",
          "Accounts may be suspended temporarily for suspicious activity.",
          "Violation of platform rules may lead to permanent account termination."
        ]
      }
    ]
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-24 animate-in fade-in duration-500">
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b px-4 py-4 flex items-center gap-4">
        <Link href="/profile">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ChevronLeft className="h-6 w-6" />
          </Button>
        </Link>
        <h1 className="text-xl font-bold font-heading">{content.title}</h1>
      </div>

      <div className="p-4 space-y-6 max-w-2xl mx-auto">
        <p className="text-muted-foreground text-sm leading-relaxed px-2 italic">
          {content.intro}
        </p>

        {content.sections.map((section, idx) => (
          <Card key={idx} className="border-none shadow-sm overflow-hidden rounded-3xl">
            <CardHeader className="bg-primary/5 flex flex-row items-center gap-3 py-4">
              <div className="p-2 bg-white rounded-xl shadow-sm">
                <section.icon className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-lg font-bold font-heading">{section.title}</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <ul className="space-y-3">
                {section.items.map((item, i) => (
                  <li key={i} className="flex gap-3 text-sm text-slate-600 leading-relaxed">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}

        <div className="p-6 bg-slate-900 text-white rounded-3xl shadow-xl mt-8">
          <p className="text-xs text-slate-400 text-center uppercase tracking-widest font-bold">
            Last Updated: December 2025
          </p>
        </div>
      </div>
    </div>
  );
}
