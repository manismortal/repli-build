import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Crown, ArrowRight } from "lucide-react";
import { useLocation } from "wouter";

interface InspirationViewProps {
  mode: "free" | "done";
}

export function InspirationView({ mode }: InspirationViewProps) {
  const [, setLocation] = useLocation();

  if (mode === "free") {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-700">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full space-y-8"
        >
          <div className="relative mx-auto w-24 h-24 mb-6">
            <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping" />
            <div className="relative bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full w-24 h-24 flex items-center justify-center shadow-xl">
              <Sparkles className="h-12 w-12 text-white" />
            </div>
          </div>
          
          <div className="space-y-4">
            <h1 className="text-3xl font-heading font-bold text-slate-800">
              Unlock Your Potential
            </h1>
            <p className="text-slate-600 text-lg leading-relaxed">
              Every great journey begins with a single step. Upgrade to a premium package to unlock exclusive daily tasks and start earning rewards today.
            </p>
          </div>

          <Card className="border-none shadow-lg bg-gradient-to-r from-slate-900 to-slate-800 text-white overflow-hidden relative group cursor-pointer" onClick={() => setLocation("/products")}>
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
              <Crown className="w-24 h-24 rotate-12" />
            </div>
            <CardContent className="p-6 flex items-center justify-between relative z-10">
              <div className="text-left">
                <p className="font-bold text-lg mb-1">View Premium Packages</p>
                <p className="text-slate-300 text-sm">Start your earning journey</p>
              </div>
              <div className="h-10 w-10 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-white/20 transition-colors">
                <ArrowRight className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // "Done" Mode - Bengali Literature Style
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-1000">
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="max-w-lg w-full space-y-10"
      >
        <div className="relative mx-auto">
          <div className="w-32 h-32 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
             <span className="text-6xl">🌙</span>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-indigo-900 leading-tight">
            আজকের মতো বিশ্রাম নিন, <br/> 
            আগামীকাল আবার দেখা হবে নতুন উদ্যমে।
          </h2>
          
          <div className="relative py-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-indigo-100"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#f8fafc] px-4 text-indigo-300 tracking-widest">Suvechcha</span>
            </div>
          </div>

          <p className="text-slate-600 italic font-serif text-lg leading-loose">
            "সূর্য যেমন প্রতিদিন নতুন আলো নিয়ে আসে, <br/>
            আপনার সাফল্যও তেমনি প্রতিদিন নতুন করে ধরা দিক। <br/>
            আজকের কাজ শেষ, এখন শুধুই প্রশান্তি।"
          </p>
        </div>

        <Button 
          variant="outline" 
          className="mt-8 rounded-full border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:text-indigo-800 px-8"
          onClick={() => setLocation("/dashboard")}
        >
          ফিরে যান ড্যাশবোর্ডে
        </Button>
      </motion.div>
    </div>
  );
}
