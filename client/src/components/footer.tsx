import { useState, useEffect, memo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, TrendingUp, Users, ArrowUpRight, Activity, ShieldCheck, Zap } from "lucide-react";
import { motion, useSpring, useTransform, AnimatePresence } from "framer-motion";

// --- Sub-Components for Optimization ---

// 1. Live User Counter (Isolated State)
// This prevents the entire footer from re-rendering every time the number updates.
const LiveUserCounter = memo(() => {
  const initialUsers = 245321;
  const [userCount, setUserCount] = useState(initialUsers);
  const [dailyGrowth, setDailyGrowth] = useState(0);
  const MAX_DAILY_GROWTH = 500;

  useEffect(() => {
    // Optimized: Using a recursive timeout loop instead of setInterval for better drift control
    let timeoutId: NodeJS.Timeout;

    const scheduleNextUpdate = () => {
      if (dailyGrowth >= MAX_DAILY_GROWTH) return;

      // Realistic random delay: 3s to 15s (faster than reality for UI demo purposes, but feels "live")
      const delay = Math.floor(Math.random() * (15000 - 3000 + 1) + 3000);

      timeoutId = setTimeout(() => {
        const increment = Math.random() > 0.8 ? 2 : 1; 
        setUserCount((prev) => prev + increment);
        setDailyGrowth((prev) => prev + increment);
        scheduleNextUpdate();
      }, delay);
    };

    scheduleNextUpdate();
    return () => clearTimeout(timeoutId);
  }, [dailyGrowth]);

  // Smooth number transition
  const springCount = useSpring(initialUsers, { stiffness: 60, damping: 20 });
  
  useEffect(() => {
    springCount.set(userCount);
  }, [userCount, springCount]);

  const displayCount = useTransform(springCount, (current) => Math.round(current).toLocaleString());

  return (
    <motion.h3 className="text-4xl font-extrabold font-heading tracking-tight tabular-nums relative z-10 text-white drop-shadow-md">
      {displayCount}
    </motion.h3>
  );
});

LiveUserCounter.displayName = "LiveUserCounter";

// 2. Reusable Animated Card Wrapper
const OverviewCard = ({ children, className, delay = 0 }: { children: React.ReactNode, className?: string, delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.6, delay, type: "spring", bounce: 0.4 }}
    whileHover={{ y: -5, scale: 1.02 }}
    className="h-full"
  >
    <Card className={`h-full border-0 overflow-hidden relative group cursor-default transition-shadow duration-300 hover:shadow-2xl ${className}`}>
      {children}
    </Card>
  </motion.div>
);

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-16 pb-10 space-y-8 container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
      
      {/* Section Header */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="flex items-center justify-center gap-4 mb-10"
      >
        <div className="h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent flex-1 max-w-[100px] sm:max-w-xs"></div>
        <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-[0.2em] px-2 text-center">
          Building Trust Since 1996
        </span>
        <div className="h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent flex-1 max-w-[100px] sm:max-w-xs"></div>
      </motion.div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        
        {/* Card 1: Establishment (Authority) */}
        <OverviewCard delay={0} className="bg-slate-900 text-white shadow-xl shadow-slate-900/20">
          <CardContent className="p-8 flex flex-col items-center justify-center text-center h-full min-h-[220px] relative z-10">
            {/* Background Texture */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none"></div>
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl group-hover:bg-blue-500/30 transition-all duration-700"></div>

            <motion.div 
              whileHover={{ rotate: 5 }}
              className="h-14 w-14 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center mb-5 text-blue-400 ring-1 ring-white/10 shadow-inner"
            >
               <Building2 className="h-7 w-7" />
            </motion.div>
            
            <Badge variant="secondary" className="mb-3 bg-slate-800 text-slate-300 hover:bg-slate-700 border-slate-700">
              <ShieldCheck className="w-3 h-3 mr-1" /> Verified
            </Badge>

            <h3 className="text-4xl md:text-5xl font-black font-heading tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">
              EST. 1996
            </h3>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-widest mt-2">
              Legacy of Excellence
            </p>
          </CardContent>
        </OverviewCard>

        {/* Card 2: Revenue (Growth) */}
        <OverviewCard delay={0.1} className="bg-white shadow-xl shadow-slate-200/50 border border-slate-100">
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity duration-500 transform group-hover:scale-110 origin-top-right">
            <TrendingUp className="h-32 w-32 text-emerald-600" />
          </div>
          
          <CardContent className="p-8 flex flex-col h-full min-h-[220px] justify-between relative z-10">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">Total Revenue</p>
                <div className="flex items-center gap-2">
                   <h3 className="text-3xl font-extrabold font-heading text-slate-800">৳100 Cr+</h3>
                </div>
              </div>
              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 px-2 py-1 shadow-sm">
                <ArrowUpRight className="h-3 w-3 mr-1" /> 12.5% YoY
              </Badge>
            </div>
            
            <div className="mt-6">
               <div className="flex items-center justify-between text-[10px] text-slate-400 mb-2 font-medium">
                  <span>Q1</span>
                  <span>Q2</span>
                  <span>Q3</span>
                  <span>Q4</span>
               </div>
               {/* Animated CSS Bars */}
               <div className="flex items-end gap-1.5 h-16 w-full">
                {[35, 45, 40, 60, 55, 75, 70, 95, 85, 100].map((height, i) => (
                  <motion.div 
                    key={i}
                    initial={{ height: 0 }}
                    whileInView={{ height: `${height}%` }}
                    transition={{ duration: 0.8, delay: 0.2 + (i * 0.05), ease: "easeOut" }}
                    className={`flex-1 rounded-t-sm transition-colors duration-300 ${i > 7 ? 'bg-emerald-500 group-hover:bg-emerald-600' : 'bg-slate-100 group-hover:bg-slate-200'}`}
                  ></motion.div>
                ))}
              </div>
            </div>
          </CardContent>
        </OverviewCard>

        {/* Card 3: Active Users (Social Proof) */}
        <OverviewCard delay={0.2} className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-xl shadow-blue-900/20">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
             <div className="absolute -top-[50%] -right-[50%] w-[100%] h-[100%] bg-white/10 rounded-full blur-[80px] animate-pulse"></div>
             <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>

          <CardContent className="p-8 flex flex-col items-center justify-center text-center h-full min-h-[220px] relative z-10">
             <div className="flex items-center gap-2 mb-4 bg-white/10 px-3 py-1 rounded-full backdrop-blur-md border border-white/10 shadow-sm">
                <div className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-50">Live Subscribers</span>
             </div>
             
             <LiveUserCounter />
             
             <div className="mt-5 flex items-center justify-center gap-3">
                <div className="flex -space-x-2">
                   {[1,2,3,4].map((i) => (
                     <div key={i} className={`h-6 w-6 rounded-full border-2 border-indigo-600 bg-white/20 flex items-center justify-center overflow-hidden`}>
                        <Users className="h-3 w-3 text-white/80" />
                     </div>
                   ))}
                </div>
                <div className="text-xs text-blue-200 font-medium flex items-center gap-1">
                   <Zap className="h-3 w-3 text-yellow-300 fill-yellow-300" />
                   <span>Growing fast</span>
                </div>
             </div>
          </CardContent>
        </OverviewCard>
      </div>

      <div className="text-center pt-12 border-t border-slate-100/50 mt-12">
        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold hover:text-slate-600 transition-colors">
           © 1996-{currentYear} Maersk Line BD. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
