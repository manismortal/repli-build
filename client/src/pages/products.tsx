import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package as PackageIcon, DollarSign, Clock, Users, Zap, Calendar, TrendingUp, AlertCircle, CheckCircle, Activity, LayoutGrid } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { PackageDetailDrawer } from "@/components/package-detail-drawer";
import { format, addDays, differenceInDays } from "date-fns";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function Products({ hideHeader = false }: { hideHeader?: boolean }) {
  const { user, language } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  
  const [selectedPkg, setSelectedPkg] = useState<any>(null); // For Purchase Confirmation
  const [detailsPkg, setDetailsPkg] = useState<any>(null); // For Details Drawer
  const [isProcessing, setIsProcessing] = useState(false);
  const [viewMode, setViewMode] = useState<'all' | 'my-plans'>('all');

  // Fetch packages from API
  const { data: packages, isLoading: isLoadingPackages } = useQuery({
    queryKey: ["packages"],
    queryFn: async () => {
      const res = await fetch("/api/packages");
      if (!res.ok) throw new Error("Failed to fetch packages");
      return res.json();
    },
  });

  // Fetch User Subscriptions
  const { data: myPackages, isLoading: isLoadingSubs } = useQuery({
    queryKey: ["my-subscriptions"],
    queryFn: async () => {
        const res = await fetch("/api/user/subscriptions"); 
        if (!res.ok) return [];
        return res.json();
    },
    enabled: !!user
  });

  // Helper to map DB package to UI format with gamification
  const mapPackage = (pkg: any) => {
    const price = Number(pkg.price);
    const dailyReward = Number(pkg.dailyReward || 0);
    const totalDays = 30;
    const totalReturn = dailyReward * totalDays;
    const maxProfitX = price > 0 ? (totalReturn / price).toFixed(1) : "0";
    
    // Deterministic pseudo-random for seats based on ID
    const idNum = parseInt(pkg.id.slice(-4), 16) || 1234;
    const seatsTotal = 2000;
    const seatsFilled = (idNum % 1000) + 500; // Between 500 and 1500

    return {
      ...pkg,
      price,
      dailyBonus: dailyReward,
      maturity: 15,
      totalDays,
      maxProfitX,
      seatsTotal,
      seatsFilled,
      type: price >= 5000 ? 'premium' : 'normal',
      nameBn: pkg.name
    };
  };

  const displayPackages = packages ? packages.map(mapPackage) : [];
  const availableSeats = (pkg: any) => pkg.seatsTotal - pkg.seatsFilled;

  const handleInvest = (pkg: any) => {
    if (!user) return;
    const balance = parseFloat(user.balance || "0");
    if (balance < pkg.price) {
        toast({
            title: language === "bn" ? "অপর্যাপ্ত ব্যালেন্স" : "Insufficient Balance",
            description: language === "bn" ? "অনুগ্রহ করে প্রথমে ডিপোজিট করুন।" : "Please deposit funds first.",
            variant: "destructive"
        });
        setTimeout(() => setLocation("/payment/methods"), 1000);
        return;
    }
    setSelectedPkg(pkg);
  };

  const confirmPurchase = async () => {
      if (!selectedPkg || !user) return;
      setIsProcessing(true);
      try {
          const res = await fetch("/api/packages/purchase", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ packageId: selectedPkg.id })
          });
          const data = await res.json();
          if (res.ok) {
              toast({
                  title: "Success!",
                  description: language === "bn" ? "প্যাকেজ সাবস্ক্রিপশন সফল হয়েছে।" : "Package subscription successful.",
              });
              queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
              queryClient.invalidateQueries({ queryKey: ["packages"] });
              queryClient.invalidateQueries({ queryKey: ["my-subscriptions"] });
              setSelectedPkg(null);
              setViewMode('my-plans'); // Switch to active plans view
          } else {
              toast({
                  title: "Failed",
                  description: data.message || "Purchase failed.",
                  variant: "destructive"
              });
          }
      } catch (e) {
          toast({ title: "Error", description: "Network error", variant: "destructive" });
      } finally {
          setIsProcessing(false);
      }
  };

  const t = {
    title: language === "bn" ? "বিনিয়োগ হাব" : "Investment Hub",
    sub: language === "bn" ? "আপনার ৩০ দিনের প্রফিট জার্নি শুরু করতে একটি প্যাকেজ নির্বাচন করুন" : "Select a package to start your 30-day profit journey",
    dailyBonus: language === "bn" ? "দৈনিক বোনাস" : "Daily Bonus",
    maturity: language === "bn" ? "ম্যাচুরিটি" : "Maturity",
    days: language === "bn" ? "দিন" : "Days",
    duration: language === "bn" ? "মোট সময়কাল" : "Total Duration",
    maxProfit: language === "bn" ? "সর্বোচ্চ মুনাফা" : "Max Profit",
    seats: language === "bn" ? "বাকি আসন" : "Seats Remaining",
    activeCycle: language === "bn" ? "সক্রিয় সাইকেল" : "Active Cycle",
    investNow: language === "bn" ? "এখনই বিনিয়োগ করুন" : "INVEST NOW",
    soldOut: language === "bn" ? "সব আসন পূর্ণ" : "SOLD OUT",
    confirmTitle: language === "bn" ? "সাবস্ক্রিপশন নিশ্চিত করুন" : "Confirm Subscription",
    confirmBody: language === "bn" ? "আপনি কি নিশ্চিত যে আপনি এই প্যাকেজটি কিনতে চান?" : "Are you sure you want to purchase this package?",
    cancel: language === "bn" ? "বাতিল" : "Cancel",
    confirm: language === "bn" ? "নিশ্চিত করুন" : "Confirm Purchase",
    
    // Dashboard translations
    myPlans: language === "bn" ? "আমার প্ল্যান" : "My Active Plans",
    allPackages: language === "bn" ? "সব প্যাকেজ" : "All Packages",
    totalInvest: language === "bn" ? "মোট বিনিয়োগ" : "Total Invested",
    dailyProfit: language === "bn" ? "দৈনিক মুনাফা" : "Daily Profit",
    netProfit: language === "bn" ? "নিট লাভ (পূর্বাভাস)" : "Net Profit (Forecast)",
    activePlans: language === "bn" ? "সক্রিয় প্ল্যান" : "Active Plans",
    noPlan: language === "bn" ? "কোন সক্রিয় প্ল্যান নেই" : "No Active Plans",
  };

  // Calculations for Dashboard
  const totalInvested = myPackages?.reduce((acc: number, curr: any) => acc + Number(curr.price), 0) || 0;
  const totalDailyProfit = myPackages?.reduce((acc: number, curr: any) => acc + Number(curr.dailyReward), 0) || 0;
  const totalProjected = myPackages?.reduce((acc: number, curr: any) => acc + (Number(curr.dailyReward) * 30), 0) || 0;

  const chartData = Array.from({ length: 30 }, (_, i) => ({
      day: `Day ${i + 1}`,
      profit: totalDailyProfit * (i + 1)
  })).filter((_, i) => i % 5 === 4);

  if (isLoadingPackages) {
    return <div className="p-10 text-center animate-pulse">Loading...</div>;
  }

  return (
    <div className={`space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ${!hideHeader ? 'pb-32' : ''}`}>
      {!hideHeader && (
        <header className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-4xl font-heading font-bold mb-2">{t.title}</h1>
                <p className="text-muted-foreground text-lg">{t.sub}</p>
              </div>
              
              {/* Toggle Switch */}
              {user && (
                  <div className="flex p-1 bg-secondary/50 rounded-xl self-start md:self-auto">
                      <button
                          onClick={() => setViewMode('all')}
                          className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'all' ? 'bg-white shadow-sm text-primary' : 'text-muted-foreground hover:text-primary'}`}
                      >
                          {t.allPackages}
                      </button>
                      <button
                          onClick={() => setViewMode('my-plans')}
                          className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${viewMode === 'my-plans' ? 'bg-white shadow-sm text-primary' : 'text-muted-foreground hover:text-primary'}`}
                      >
                          {t.myPlans}
                          {myPackages && myPackages.length > 0 && (
                              <Badge className="h-5 px-1.5 bg-green-500 hover:bg-green-600 text-white text-[10px]">{myPackages.length}</Badge>
                          )}
                      </button>
                  </div>
              )}
          </div>
        </header>
      )}

      {viewMode === 'all' ? (
          // Product Grid
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayPackages.map((pkg: any) => (
              <Card 
                key={pkg.id} 
                onClick={() => setDetailsPkg(pkg)}
                className={`hover-elevate flex flex-col relative border-none overflow-hidden group shadow-xl bg-card/50 backdrop-blur-sm cursor-pointer active:scale-[0.98] transition-all duration-200 ${pkg.type === 'premium' ? 'ring-2 ring-primary' : ''}`}
              >
                {pkg.type === 'premium' && (
                  <div className="absolute top-0 right-0 p-3 z-10">
                    <Badge className="bg-primary animate-pulse text-[10px] font-bold tracking-widest px-3">PREMIUM</Badge>
                  </div>
                )}
                
                <CardHeader className="relative pb-2">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`h-14 w-14 rounded-2xl flex items-center justify-center shadow-inner transition-transform group-hover:scale-110 ${pkg.type === 'premium' ? 'bg-primary text-primary-foreground shadow-primary/20' : 'bg-primary/10 text-primary shadow-primary/5'}`}>
                      {pkg.type === 'premium' ? <Zap className="h-8 w-8" /> : <PackageIcon className="h-8 w-8" />}
                    </div>
                  </div>
                  <CardTitle className="font-heading text-2xl tracking-tight leading-none mb-1">
                    {language === "bn" ? pkg.nameBn : pkg.name}
                  </CardTitle>
                  <CardDescription className="text-xl font-bold text-primary font-heading">৳{pkg.price.toLocaleString()}</CardDescription>
                </CardHeader>

                <CardContent className="flex-1 space-y-6 pt-0">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-secondary/40 p-3 rounded-2xl border border-border/30">
                      <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-1">{t.dailyBonus}</p>
                      <p className="text-lg font-bold font-heading leading-none">৳{pkg.dailyBonus}</p>
                    </div>
                    <div className="bg-secondary/40 p-3 rounded-2xl border border-border/30">
                      <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-1">{t.maturity}</p>
                      <p className="text-lg font-bold font-heading leading-none">{pkg.maturity} {t.days}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground font-medium flex items-center gap-2">
                        <Calendar className="h-4 w-4 opacity-70" />
                        {t.duration}
                      </span>
                      <span className="font-bold">{pkg.totalDays} {t.days}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground font-medium flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-600 opacity-70" />
                        {t.maxProfit}
                      </span>
                      <span className="font-bold text-green-600">x{pkg.maxProfitX} (৳{(pkg.price * parseFloat(pkg.maxProfitX)).toLocaleString()})</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <div className="flex items-center justify-between mb-2 text-xs font-bold">
                      <p className="uppercase tracking-widest flex items-center gap-1.5 text-muted-foreground">
                        <Users className="h-3.5 w-3.5" />
                        {t.seats}
                      </p>
                      <span>{availableSeats(pkg)} / {pkg.seatsTotal}</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2 overflow-hidden shadow-inner">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(pkg.seatsFilled / pkg.seatsTotal) * 100}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className={`h-full rounded-full ${pkg.type === 'premium' ? 'bg-primary' : 'bg-primary/60'}`} 
                      />
                    </div>
                  </div>

                  <Button 
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent opening drawer twice
                        setDetailsPkg(pkg); // Also open details first for consistent UX? Or direct buy? 
                        // Prompt says "make each product clickable... make package details...".
                        // So clicking button should ALSO probably open details OR just buy.
                        // Let's make button open Details to ensure they read the rules.
                    }}
                    className={`w-full font-heading h-14 text-lg rounded-2xl transition-all hover:scale-[1.02] active:scale-95 ${pkg.type === 'premium' ? 'shadow-xl shadow-primary/30' : 'shadow-lg shadow-primary/10'}`}
                    disabled={availableSeats(pkg) <= 0 || !user}
                  >
                    {availableSeats(pkg) <= 0 ? t.soldOut : "Details & Buy"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
      ) : (
          // Subscriber Dashboard View
          <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-8">
              {!myPackages || myPackages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                      <div className="bg-white p-6 rounded-full shadow-sm mb-4">
                          <PackageIcon className="h-12 w-12 text-slate-300" />
                      </div>
                      <h2 className="text-xl font-bold text-slate-700">{t.noPlan}</h2>
                      <p className="text-slate-500 text-sm mt-2 max-w-xs mx-auto">Start your investment journey to see your active plans and profit analysis here.</p>
                      <Button onClick={() => setViewMode('all')} className="mt-6">
                          {t.investNow}
                      </Button>
                  </div>
              ) : (
                  <>
                      {/* Financial Overview Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <Card className="bg-gradient-to-br from-slate-800 to-slate-900 text-white border-none shadow-lg">
                              <CardContent className="p-6">
                                  <div className="flex items-center gap-4">
                                      <div className="bg-white/10 p-3 rounded-xl">
                                          <DollarSign className="h-6 w-6 text-emerald-400" />
                                      </div>
                                      <div>
                                          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">{t.totalInvest}</p>
                                          <h3 className="text-3xl font-bold font-heading">৳{totalInvested.toLocaleString()}</h3>
                                      </div>
                                  </div>
                              </CardContent>
                          </Card>
                          
                          <Card className="bg-white border-slate-100 shadow-md">
                              <CardContent className="p-6">
                                  <div className="flex items-center gap-4">
                                      <div className="bg-blue-50 p-3 rounded-xl">
                                          <Activity className="h-6 w-6 text-blue-600" />
                                      </div>
                                      <div>
                                          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{t.dailyProfit}</p>
                                          <h3 className="text-3xl font-bold font-heading text-slate-800">৳{totalDailyProfit.toLocaleString()}</h3>
                                      </div>
                                  </div>
                              </CardContent>
                          </Card>

                          <Card className="bg-white border-slate-100 shadow-md">
                              <CardContent className="p-6">
                                  <div className="flex items-center gap-4">
                                      <div className="bg-purple-50 p-3 rounded-xl">
                                          <TrendingUp className="h-6 w-6 text-purple-600" />
                                      </div>
                                      <div>
                                          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{t.netProfit}</p>
                                          <h3 className="text-3xl font-bold font-heading text-slate-800">৳{totalProjected.toLocaleString()}</h3>
                                      </div>
                                  </div>
                              </CardContent>
                          </Card>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                          {/* Active Plans List */}
                          <div className="lg:col-span-2 space-y-6">
                              <h3 className="font-heading font-bold text-xl flex items-center gap-2">
                                  <LayoutGrid className="h-5 w-5 text-blue-600" />
                                  {t.activePlans}
                              </h3>
                              
                              <div className="space-y-4">
                                  {myPackages.map((pkg: any, idx: number) => {
                                      const startDate = new Date(pkg.purchaseDate);
                                      const endDate = addDays(startDate, 30);
                                      const today = new Date();
                                      const daysElapsed = Math.min(30, Math.max(0, differenceInDays(today, startDate)));
                                      const progress = (daysElapsed / 30) * 100;
                                      const daysLeft = 30 - daysElapsed;

                                      return (
                                          <Card key={idx} className="overflow-hidden border-l-4 border-l-blue-600 shadow-sm hover:shadow-md transition-shadow">
                                              <CardContent className="p-6">
                                                  <div className="flex justify-between items-start mb-4">
                                                      <div>
                                                          <h4 className="font-bold text-lg">{language === 'bn' && pkg.nameBn ? pkg.nameBn : pkg.name}</h4>
                                                          <p className="text-xs text-slate-500">Activated on {format(startDate, "MMM d, yyyy")}</p>
                                                      </div>
                                                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                                          Active
                                                      </Badge>
                                                  </div>
                                                  
                                                  <div className="grid grid-cols-3 gap-4 mb-4 bg-slate-50 p-3 rounded-lg">
                                                      <div>
                                                          <p className="text-[10px] text-slate-400 uppercase font-bold">Invested</p>
                                                          <p className="font-bold text-slate-700">৳{pkg.price}</p>
                                                      </div>
                                                      <div>
                                                          <p className="text-[10px] text-slate-400 uppercase font-bold">Daily</p>
                                                          <p className="font-bold text-green-600">+৳{pkg.dailyReward}</p>
                                                      </div>
                                                      <div>
                                                          <p className="text-[10px] text-slate-400 uppercase font-bold">Total Return</p>
                                                          <p className="font-bold text-blue-600">৳{Number(pkg.dailyReward) * 30}</p>
                                                      </div>
                                                  </div>

                                                  <div className="space-y-2">
                                                      <div className="flex justify-between text-xs font-medium text-slate-500">
                                                          <span>Progress ({daysElapsed}/30 Days)</span>
                                                          <span className="text-blue-600 font-bold">{daysLeft} days left</span>
                                                      </div>
                                                      <Progress value={progress} className="h-2" />
                                                  </div>
                                              </CardContent>
                                          </Card>
                                      );
                                  })}
                              </div>
                          </div>

                          {/* Analysis Chart */}
                          <div className="space-y-6">
                              <h3 className="font-heading font-bold text-xl flex items-center gap-2">
                                  <TrendingUp className="h-5 w-5 text-purple-600" />
                                  Growth Analysis
                              </h3>
                              <Card>
                                  <CardContent className="p-6">
                                      <div className="h-[300px] w-full">
                                          <ResponsiveContainer width="100%" height="100%">
                                              <BarChart data={chartData}>
                                                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                                  <XAxis dataKey="day" fontSize={10} axisLine={false} tickLine={false} />
                                                  <YAxis fontSize={10} axisLine={false} tickLine={false} tickFormatter={(value) => `৳${value}`} />
                                                  <Tooltip 
                                                    formatter={(value: number) => [`৳${value}`, 'Profit']}
                                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                                  />
                                                  <Bar dataKey="profit" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                                              </BarChart>
                                          </ResponsiveContainer>
                                      </div>
                                      <p className="text-center text-xs text-slate-400 mt-4">
                                          Projected cumulative profit accumulation over the 30-day cycle.
                                      </p>
                                  </CardContent>
                              </Card>
                              
                              <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4 flex gap-3">
                                  <AlertCircle className="h-5 w-5 text-yellow-600 shrink-0" />
                                  <p className="text-xs text-yellow-800 leading-relaxed">
                                      <strong>Note:</strong> Profits are locked daily and can be withdrawn after the 30-day maturity period or claimed via daily tasks.
                                  </p>
                              </div>
                          </div>
                      </div>
                  </>
              )}
          </div>
      )}

      {/* Package Details Drawer */}
      <PackageDetailDrawer 
        open={!!detailsPkg} 
        onOpenChange={(open) => !open && setDetailsPkg(null)}
        pkg={detailsPkg}
        onPurchase={(pkg) => handleInvest(pkg)}
      />

      {/* Confirmation Dialog */}
      <Dialog open={!!selectedPkg} onOpenChange={(open) => !open && setSelectedPkg(null)}>
        <DialogContent className="sm:max-w-md rounded-2xl">
            <DialogHeader>
                <DialogTitle className="text-xl font-heading">{t.confirmTitle}</DialogTitle>
                <DialogDescription>
                    {t.confirmBody}
                </DialogDescription>
            </DialogHeader>
            
            {selectedPkg && (
                <div className="py-4 space-y-4">
                    <div className="flex items-center justify-between bg-secondary/30 p-4 rounded-xl">
                        <span className="text-sm font-medium text-muted-foreground">Package</span>
                        <span className="font-bold">{language === "bn" ? selectedPkg.nameBn : selectedPkg.name}</span>
                    </div>
                    <div className="flex items-center justify-between bg-primary/10 p-4 rounded-xl border border-primary/20">
                        <span className="text-sm font-bold text-primary">Total Price</span>
                        <span className="text-2xl font-black font-heading text-primary">৳{selectedPkg.price.toLocaleString()}</span>
                    </div>
                    <div className="text-[10px] text-center text-muted-foreground">
                        * Funds will be deducted from your available balance.
                    </div>
                </div>
            )}

            <DialogFooter className="flex-row gap-2 sm:justify-end">
                <Button variant="ghost" className="flex-1 sm:flex-none" onClick={() => setSelectedPkg(null)}>
                    {t.cancel}
                </Button>
                <Button className="flex-1 sm:flex-none" onClick={confirmPurchase} disabled={isProcessing}>
                    {isProcessing ? "Processing..." : t.confirm}
                </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}