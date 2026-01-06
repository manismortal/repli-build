import { useState } from "react";
import { useLocation, Link } from "wouter";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, Home, Copy, CheckCircle, Wallet, Hash, Bitcoin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";

export default function BinancePayment() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { language } = useAuth();
  
  // Binance Flow
  const [amount, setAmount] = useState("");
  const [trxId, setTrxId] = useState(""); // This will be the Hash
  const [userWallet, setUserWallet] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Fetch Active Agent (Wallet Address)
  const { data: agentData, isLoading: agentLoading } = useQuery({
    queryKey: ["/api/agents/binance"],
  });

  const handleCopy = () => {
      if (!agentData?.number) return;
      navigator.clipboard.writeText(agentData.number);
      toast({ description: language === "bn" ? "অ্যাড্রেস কপি করা হয়েছে" : "Address copied to clipboard!" });
  };

  const handleProceed = async () => {
    if (!amount || parseFloat(amount) < 10) {
      toast({ 
        title: language === "bn" ? "অবৈধ পরিমাণ" : "Invalid Amount", 
        description: language === "bn" ? "সঠিক পরিমাণ নির্বাচন করুন বা লিখুন (সর্বনিম্ন ১০)" : "Select or enter a valid amount (Min 10)", 
        variant: "destructive" 
      });
      return;
    }
    
    if (!trxId || trxId.length < 10) {
        toast({ 
            title: language === "bn" ? "অবৈধ TxID" : "Invalid Hash", 
            description: language === "bn" ? "অনুগ্রহ করে একটি সঠিক ট্রানজেকশন হ্যাশ দিন" : "Please enter a valid Transaction Hash / ID", 
            variant: "destructive" 
        });
        return;
    }

    if (!userWallet || userWallet.length < 10) {
        toast({ 
            title: language === "bn" ? "অবৈধ ওয়ালেট" : "Invalid Wallet", 
            description: language === "bn" ? "অনুগ্রহ করে আপনার ওয়ালেট অ্যাড্রেস দিন" : "Please enter your wallet address", 
            variant: "destructive" 
        });
        return;
    }
    
    setIsSubmitting(true);
    try {
      await apiRequest("POST", "/api/deposits", {
        amount: amount,
        transactionId: trxId,
        agentNumber: agentData?.number,
        userPhoneNumber: userWallet, // Storing user wallet in userPhoneNumber field for generic schema
        method: "binance"
      });

      setShowSuccess(true);
    } catch (error) {
      toast({ 
        title: language === "bn" ? "ব্যর্থ" : "Failed", 
        description: language === "bn" ? "ডিপোজিট অনুরোধ জমা দেওয়া যায়নি।" : "Could not submit deposit request.", 
        variant: "destructive" 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const t = {
    title: language === "bn" ? "ক্রিপ্টো ডিপোজিট" : "Crypto Deposit",
    subtitle: language === "bn" ? "বাইনান্স / ট্রাস্ট ওয়ালেট" : "Binance / Trust Wallet",
    successTitle: language === "bn" ? "অনুরোধ জমা দেওয়া হয়েছে" : "Request Submitted",
    successMsg: language === "bn" ? "আপনার ব্যালেন্স শীঘ্রই যুক্ত হবে। আমাদের সাথে থাকার জন্য ধন্যবাদ।" : "Your balance will be credited soon. Please stay with us and trust us.",
    verifyMsg: language === "bn" ? "আমরা নিরাপত্তার জন্য প্রতিটি লেনদেন ম্যানুয়ালি যাচাই করি।" : "We verify every transaction manually to ensure security.",
    backHome: language === "bn" ? "হোমে ফিরে যান" : "BACK TO HOME",
    viewTerms: language === "bn" ? "শর্তাবলী দেখুন" : "View Terms & Conditions",
    sendMoney: language === "bn" ? "এই ঠিকানায় USDT পাঠান (TRC20)" : "Send USDT to this Address (TRC20)",
    walletLabel: language === "bn" ? "ওয়ালেট অ্যাড্রেস" : "Wallet Address",
    userWalletLabel: language === "bn" ? "আপনার ওয়ালেট অ্যাড্রেস" : "Your Wallet Address",
    selectAmount: language === "bn" ? "পরিমাণ নির্বাচন করুন (BDT)" : "Select Amount (BDT)",
    custom: language === "bn" ? "অন্যান্য" : "Custom",
    trxIdLabel: language === "bn" ? "ট্রানজেকশন হ্যাশ (TxID)" : "Transaction Hash (TxID)",
    trxIdHelp: language === "bn" ? "টাকা পাঠানোর পর যে TxID/Hash পেয়েছেন তা দিন।" : "Enter the TxID/Hash you received after sending.",
    proceed: language === "bn" ? "এগিয়ে যান" : "PROCEED",
    processing: language === "bn" ? "প্রক্রিয়াধীন..." : "PROCESSING...",
    rate: language === "bn" ? "১ USDT = ১২০ টাকা" : "1 USDT = 120 BDT", 
    unavailable: language === "bn" ? "বর্তমানে কোনো ওয়ালেট অ্যাড্রেস উপলব্ধ নেই" : "No wallet address available"
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-green-500/20">
          <CheckCircle className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">{t.successTitle}</h1>
        <p className="text-gray-500 mb-6 text-sm leading-relaxed px-4">
          {t.successMsg}
          <br />
          {t.verifyMsg}
        </p>
        <div className="flex flex-col gap-3 w-full max-w-xs">
            <Link href="/dashboard">
                <Button 
                className="bg-[#FCD535] hover:bg-[#e0bd2f] text-slate-900 w-full h-12 rounded-full font-bold shadow-md"
                >
                {t.backHome}
                </Button>
            </Link>
            <Link href="/terms">
                <Button variant="link" className="text-gray-400 text-xs">
                    {t.viewTerms}
                </Button>
            </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1E2329] text-white flex flex-col font-sans">
      {/* Header */}
      <header className="bg-[#1E2329] border-b border-white/10 p-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <button onClick={() => setLocation("/payment/methods")} className="p-1 hover:bg-white/10 rounded-full transition-colors">
            <ChevronLeft className="h-6 w-6 text-[#FCD535]" />
          </button>
          <div className="flex flex-col">
            <span className="font-bold text-lg leading-none text-[#FCD535]">{t.title}</span>
            <span className="text-[10px] opacity-60 uppercase tracking-tighter">{t.subtitle}</span>
          </div>
        </div>
        <div className="bg-white/10 p-2 rounded-full text-[#FCD535]">
          <Link href="/dashboard">
            <Home className="h-5 w-5" />
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col max-w-md mx-auto w-full p-4 space-y-6">
        
        {/* Wallet Address Section */}
        <div className="bg-[#2B3139] p-4 rounded-2xl shadow-sm border border-white/5">
            <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-[#FCD535]/10 rounded-full flex items-center justify-center text-[#FCD535]">
                    <Bitcoin className="h-5 w-5" />
                </div>
                <div>
                    <h3 className="font-bold text-white text-sm">{t.sendMoney}</h3>
                    <p className="text-xs text-gray-400">{t.rate}</p>
                </div>
            </div>
            
            <div className="bg-[#1E2329] border border-dashed border-white/20 rounded-xl p-3 flex items-center justify-between">
                <div className="flex flex-col overflow-hidden mr-2">
                    <span className="text-[10px] text-gray-500 font-bold uppercase mb-1">{t.walletLabel}</span>
                    <span className="text-xs font-mono text-[#FCD535] truncate">
                        {agentLoading ? "Loading..." : agentData?.number || t.unavailable}
                    </span>
                </div>
                
                <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={handleCopy}
                    className="text-[#FCD535] hover:bg-[#FCD535]/10 h-8 w-8 p-0 rounded-full shrink-0"
                    disabled={!agentData}
                >
                    <Copy className="h-4 w-4" />
                </Button>
            </div>
        </div>

        {/* Amount Selection */}
        <div className="space-y-3">
            <label className="text-sm font-bold text-gray-400 ml-1">{t.selectAmount}</label>
            <div className="grid grid-cols-3 gap-3">
                {[250, 500, 1500, 2000, 5000].map((val) => (
                    <button
                        key={val}
                        onClick={() => setAmount(val.toString())}
                        className={`py-3 rounded-xl text-sm font-bold border transition-all duration-200 ${
                            amount === val.toString() 
                            ? 'bg-[#FCD535] text-slate-900 border-[#FCD535] shadow-md shadow-[#FCD535]/20' 
                            : 'bg-[#2B3139] text-gray-300 border-transparent hover:border-[#FCD535]/50'
                        }`}
                    >
                        ৳{val}
                    </button>
                ))}
                 <div className="relative col-span-1">
                    <input
                        type="number"
                        placeholder={t.custom}
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className={`w-full h-full rounded-xl text-sm font-bold text-center border focus:outline-none transition-all ${
                            ![250, 500, 1500, 2000, 5000].includes(Number(amount)) && amount
                            ? 'border-[#FCD535] bg-[#FCD535]/10 text-[#FCD535]'
                            : 'border-transparent bg-[#2B3139] text-white'
                        }`}
                    />
                 </div>
            </div>
        </div>

        {/* User Wallet Input */}
         <div className="space-y-3">
             <label className="text-sm font-bold text-gray-400 ml-1">{t.userWalletLabel}</label>
             <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                    <Wallet className="h-4 w-4" />
                </div>
                <Input 
                    value={userWallet}
                    onChange={(e) => setUserWallet(e.target.value)}
                    placeholder="T..."
                    className="h-14 pl-10 text-lg border-white/10 focus-visible:ring-[#FCD535] focus-visible:border-[#FCD535] rounded-xl bg-[#2B3139] text-white font-mono placeholder:text-gray-600"
                />
             </div>
        </div>

        {/* Transaction ID Input */}
        <div className="space-y-3">
             <label className="text-sm font-bold text-gray-400 ml-1">{t.trxIdLabel}</label>
             <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                    <Hash className="h-4 w-4" />
                </div>
                <Input 
                    value={trxId}
                    onChange={(e) => setTrxId(e.target.value)}
                    placeholder="e.g. 0x123abc..."
                    className="h-14 pl-10 text-lg border-white/10 focus-visible:ring-[#FCD535] focus-visible:border-[#FCD535] rounded-xl bg-[#2B3139] text-white font-mono placeholder:normal-case placeholder:text-gray-600"
                />
             </div>
             <p className="text-[11px] text-gray-500 px-1">
                {t.trxIdHelp}
             </p>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
            <Button 
                onClick={handleProceed}
                disabled={isSubmitting || !agentData}
                className="w-full h-14 bg-[#FCD535] hover:bg-[#e0bd2f] text-slate-900 rounded-xl font-bold text-lg shadow-lg shadow-[#FCD535]/10 transition-all active:scale-[0.98]"
            >
                {isSubmitting ? t.processing : t.proceed}
            </Button>
        </div>

      </div>
    </div>
  );
}