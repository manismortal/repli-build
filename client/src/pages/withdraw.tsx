import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, Info, Home, Wallet, AlertTriangle, Lock, Unlock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function Withdraw() {
  const [, setLocation] = useLocation();
  const { user, language } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState("");
  const [walletNumber, setWalletNumber] = useState(user?.walletNumber || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForfeitWarning, setShowForfeitWarning] = useState(false);

  // Calculate days since registration
  const registrationDate = new Date(user?.createdAt || new Date());
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - registrationDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const daysLeft = Math.max(0, 60 - diffDays);
  const isBonusLocked = daysLeft > 0;

  const balance = parseFloat(user?.balance || "0");
  const bonusBalance = parseFloat(user?.bonusBalance || "0");
  
  // If user hasn't set wallet number yet, we force step 0
  const [isSettingWallet, setIsSettingWallet] = useState(!user?.walletNumber);

  const t = {
    title: language === "bn" ? "উত্তোলন" : "Withdraw",
    method: language === "bn" ? "বিকাশ পার্সোনাল" : "bKash Personal",
    setupTitle: language === "bn" ? "উত্তোলন ওয়ালেট সেটআপ" : "Setup Withdrawal Wallet",
    setupDesc: language === "bn" ? "টাকা পেতে আপনার ব্যক্তিগত বিকাশ নম্বর লিখুন।" : "Please enter your personal bKash number to receive funds.",
    walletLabel: language === "bn" ? "বিকাশ নম্বর" : "bKash Number",
    saveBtn: language === "bn" ? "সেভ এবং চালিয়ে যান" : "SAVE & CONTINUE",
    saving: language === "bn" ? "সেভ হচ্ছে..." : "SAVING...",
    mainBal: language === "bn" ? "মূল ব্যালেন্স" : "Main Balance",
    bonusBal: language === "bn" ? "বোনাস ব্যালেন্স" : "Bonus Balance",
    unlocksIn: language === "bn" ? "আনলক হবে" : "Unlocks in",
    days: language === "bn" ? "দিনে" : "days",
    enterAmount: language === "bn" ? "উত্তোলনের পরিমাণ লিখুন" : "Enter Withdrawal Amount",
    withdrawTo: language === "bn" ? "উত্তোলন করা হচ্ছে:" : "Withdrawing to:",
    minWithdraw: language === "bn" ? "সর্বনিম্ন উত্তোলন ৳৫০০" : "Minimum withdrawal ৳500",
    confirmBtn: language === "bn" ? "উত্তোলন নিশ্চিত করুন" : "CONFIRM WITHDRAWAL",
    processing: language === "bn" ? "প্রক্রিয়াধীন..." : "PROCESSING...",
    successTitle: language === "bn" ? "উত্তোলনের অনুরোধ গৃহীত হয়েছে" : "Withdrawal Requested",
    successMsg: language === "bn" ? `৳${amount} এর জন্য আপনার অনুরোধ সফলভাবে জমা দেওয়া হয়েছে।` : `Your request for ৳${amount} has been submitted successfully.`,
    backHome: language === "bn" ? "হোমে ফিরে যান" : "BACK TO HOME",
    warningTitle: language === "bn" ? "সতর্কতা: বোনাস বাতিল" : "Warning: Bonus Forfeiture",
    warningDesc1: language === "bn" ? "আপনি ৬০ দিনের লক পিরিয়ড শেষ হওয়ার আগেই উত্তোলন করতে চাইছেন।" : "You are attempting to withdraw before the 60-day lock period.",
    warningDesc2: language === "bn" ? `এগিয়ে গেলে আপনার ৳${bonusBalance} বোনাস ব্যালেন্স স্থায়ীভাবে মুছে ফেলা হবে।` : `Proceeding will permanently remove your ৳${bonusBalance} Bonus Balance.`,
    warningConfirm: language === "bn" ? "হ্যাঁ, বোনাস বাতিল করুন এবং উত্তোলন করুন" : "Yes, Forfeit Bonus & Withdraw",
    cancel: language === "bn" ? "বাতিল" : "Cancel",
  };

  const handleSaveWallet = async () => {
      if (walletNumber.length !== 11) {
          toast({ 
            title: language === "bn" ? "ভুল নম্বর" : "Invalid Number", 
            description: language === "bn" ? "অনুগ্রহ করে একটি সঠিক ১১-ডিজিটের বিকাশ নম্বর দিন।" : "Please enter a valid 11-digit bKash number.", 
            variant: "destructive" 
          });
          return;
      }
      try {
          setIsSubmitting(true);
          await apiRequest("PUT", "/api/users/wallet", { walletNumber });
          await queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
          setIsSettingWallet(false);
          toast({ title: language === "bn" ? "সফল" : "Success", description: language === "bn" ? "উত্তোলন ওয়ালেট সেভ হয়েছে।" : "Withdrawal wallet saved." });
      } catch (e) {
          toast({ title: language === "bn" ? "ত্রুটি" : "Error", description: language === "bn" ? "ওয়ালেট নম্বর সেভ করতে ব্যর্থ।" : "Failed to save wallet number.", variant: "destructive" });
      } finally {
          setIsSubmitting(false);
      }
  };

  const handleWithdrawClick = () => {
    if (!amount || parseFloat(amount) < 500) {
      toast({ 
        title: language === "bn" ? "অবৈধ পরিমাণ" : "Invalid Amount", 
        description: language === "bn" ? "সর্বনিম্ন উত্তোলন ৳৫০০" : "Minimum withdrawal is ৳500", 
        variant: "destructive" 
      });
      return;
    }
    
    // Check if bonus will be forfeited
    if (isBonusLocked && bonusBalance > 0) {
        setShowForfeitWarning(true);
    } else {
        submitWithdrawal();
    }
  };

  const submitWithdrawal = async () => {
    setIsSubmitting(true);
    try {
      await apiRequest("POST", "/api/withdrawals", { amount });
      await queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      setStep(2); // Success Screen
    } catch (e: any) {
      toast({ 
          title: language === "bn" ? "উত্তোলন ব্যর্থ" : "Withdrawal Failed", 
          description: e.message || "Insufficient funds or error.", 
          variant: "destructive" 
      });
    } finally {
      setIsSubmitting(false);
      setShowForfeitWarning(false);
    }
  };

  if (step === 2) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-green-500/20">
          <CheckIcon className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">{t.successTitle}</h1>
        <p className="text-gray-500 mb-8">{t.successMsg}</p>
        <Button 
          onClick={() => setLocation("/dashboard")} 
          className="bg-[#e2136e] hover:bg-[#c0105d] text-white w-full max-w-xs h-12 rounded-full font-bold"
        >
          {t.backHome}
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f1f1f1] flex flex-col font-sans">
      {/* Header */}
      <header className="bg-[#e2136e] text-white p-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <button onClick={() => setLocation("/wallet")} className="p-1">
            <ChevronLeft className="h-6 w-6" />
          </button>
          <div className="flex flex-col">
            <span className="font-bold text-lg leading-none">{t.title}</span>
            <span className="text-[10px] opacity-80 uppercase tracking-tighter">{t.method}</span>
          </div>
        </div>
        <div className="bg-white/20 p-2 rounded-full">
          <Home className="h-5 w-5" />
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col max-w-md mx-auto w-full bg-white shadow-sm overflow-hidden p-6 space-y-6">
        
        {isSettingWallet ? (
            <div className="space-y-6 animate-in slide-in-from-right">
                <div className="text-center space-y-2">
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Wallet className="h-8 w-8 text-blue-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">{t.setupTitle}</h2>
                    <p className="text-sm text-gray-500">{t.setupDesc}</p>
                </div>
                
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">{t.walletLabel}</label>
                    <Input 
                        value={walletNumber}
                        onChange={(e) => setWalletNumber(e.target.value)}
                        placeholder="017XXXXXXXX"
                        className="h-14 text-lg border-2 focus-visible:ring-[#e2136e] rounded-xl"
                        maxLength={11}
                    />
                </div>
                
                <Button 
                    className="w-full bg-[#e2136e] hover:bg-[#c0105d] text-white h-14 rounded-xl font-bold"
                    onClick={handleSaveWallet}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? t.saving : t.saveBtn}
                </Button>
            </div>
        ) : (
            <div className="space-y-8 animate-in slide-in-from-right">
                {/* Balance Cards */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <p className="text-[10px] text-gray-500 uppercase font-bold">{t.mainBal}</p>
                        <p className="text-2xl font-bold text-gray-800">৳{balance.toLocaleString()}</p>
                    </div>
                    <div className={`p-4 rounded-xl border ${isBonusLocked ? 'bg-yellow-50 border-yellow-100' : 'bg-green-50 border-green-100'}`}>
                        <div className="flex justify-between items-start">
                             <div>
                                <p className={`text-[10px] uppercase font-bold ${isBonusLocked ? 'text-yellow-600' : 'text-green-600'}`}>
                                    {t.bonusBal}
                                </p>
                                <p className={`text-2xl font-bold ${isBonusLocked ? 'text-yellow-700' : 'text-green-700'}`}>
                                    ৳{bonusBalance.toLocaleString()}
                                </p>
                             </div>
                             {isBonusLocked ? <Lock className="h-4 w-4 text-yellow-500" /> : <Unlock className="h-4 w-4 text-green-500" />}
                        </div>
                        {isBonusLocked && (
                            <p className="text-[10px] text-yellow-600 mt-1 font-medium">
                                {t.unlocksIn} {daysLeft} {t.days}
                            </p>
                        )}
                    </div>
                </div>

                {/* Amount Input */}
                <div className="space-y-4">
                    <div className="text-center">
                        <p className="text-sm text-gray-500 mb-2">{t.enterAmount}</p>
                        <div className="relative inline-block">
                            <span className="absolute left-0 top-1/2 -translate-y-1/2 text-2xl font-bold text-[#e2136e]">৳</span>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0"
                                className="text-5xl font-bold text-center w-full focus:outline-none placeholder:text-gray-200 pl-6"
                            />
                        </div>
                    </div>
                    
                     <div className="bg-blue-50 p-4 rounded-xl flex gap-3 items-start">
                        <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                        <p className="text-xs text-blue-600 leading-relaxed">
                            {t.withdrawTo} <span className="font-bold">{walletNumber}</span>. {t.minWithdraw}
                        </p>
                    </div>
                </div>

                <Button 
                    className="w-full bg-[#e2136e] hover:bg-[#c0105d] text-white h-14 rounded-xl font-bold text-lg shadow-lg shadow-[#e2136e]/20"
                    onClick={handleWithdrawClick}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? t.processing : t.confirmBtn}
                </Button>
            </div>
        )}
      </div>

      {/* Warning Modal */}
      <AlertDialog open={showForfeitWarning} onOpenChange={setShowForfeitWarning}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-2">
                <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <AlertDialogTitle className="text-center text-red-600">{t.warningTitle}</AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              {t.warningDesc1}
              <br /><br />
              <strong>{t.warningDesc2}</strong>
              <br /><br />
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:justify-center gap-2">
            <AlertDialogCancel className="w-full rounded-xl h-12">{t.cancel}</AlertDialogCancel>
            <AlertDialogAction 
                onClick={submitWithdrawal}
                className="w-full bg-red-600 hover:bg-red-700 rounded-xl h-12"
            >
                {t.warningConfirm}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function CheckIcon(props: any) {
    return (
        <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
    )
}
