import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, Home, CreditCard, Banknote, Smartphone } from "lucide-react";
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
  // Initialize from saved wallet if available
  const [method, setMethod] = useState<'bkash' | 'nagad' | 'binance'>((user?.savedWalletProvider as any) || 'bkash');
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState("");
  const [destinationNumber, setDestinationNumber] = useState(user?.savedWalletNumber || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  
  const isUsingSaved = user?.savedWalletNumber === destinationNumber && user?.savedWalletProvider === method;

  // Read query params
  const searchParams = new URLSearchParams(window.location.search);
  const defaultSource = searchParams.get("source") === "referral" ? "referral" : "main";
  const [source, setSource] = useState<'main' | 'referral'>(defaultSource as 'main' | 'referral');

  const mainBalance = parseFloat(user?.balance || "0");
  const referralBalance = parseFloat(user?.referralBalance || "0");
  
  const currentBalance = source === 'main' ? mainBalance : referralBalance;
  
  // Fee Calculation
  const feePercent = method === 'binance' ? 0.02 : 0.05;
  const numericAmount = parseFloat(amount || "0");
  const fee = numericAmount * feePercent;
  const finalAmount = numericAmount - fee;

  const t = {
    title: language === "bn" ? "উত্তোলন" : "Withdraw",
    subtitle: language === "bn" ? "আপনার পছন্দের মাধ্যম নির্বাচন করুন" : "Select your preferred method",
    mainBal: language === "bn" ? "মূল ব্যালেন্স" : "Main Balance",
    referralBal: language === "bn" ? "রেফারেল ব্যালেন্স" : "Referral Balance",
    enterAmount: language === "bn" ? "উত্তোলনের পরিমাণ লিখুন" : "Enter Withdrawal Amount",
    destLabel: method === 'binance' ? (language === "bn" ? "বাইনান্স পে আইডি / টিআরসি২০" : "Binance Pay ID / TRC20") : (language === "bn" ? `${method === 'bkash' ? 'বিকাশ' : 'নগদ'} নম্বর` : `${method === 'bkash' ? 'bKash' : 'Nagad'} Number`),
    destPlaceholder: method === 'binance' ? "Pay ID or Address" : "01XXXXXXXXX",
    confirmBtn: language === "bn" ? "উত্তোলন নিশ্চিত করুন" : "CONFIRM WITHDRAWAL",
    processing: language === "bn" ? "প্রক্রিয়াধীন..." : "PROCESSING...",
    successTitle: language === "bn" ? "উত্তোলনের অনুরোধ গৃহীত হয়েছে" : "Withdrawal Requested",
    successMsg: language === "bn" ? `৳${amount} এর জন্য আপনার অনুরোধ সফলভাবে জমা দেওয়া হয়েছে।` : `Your request for ৳${amount} has been submitted successfully.`,
    backHome: language === "bn" ? "হোমে ফিরে যান" : "BACK TO HOME",
    fee: language === "bn" ? "ফি" : "Fee",
    final: language === "bn" ? "আপনি পাবেন" : "You Receive",
    verified: language === "bn" ? "যাচাইকৃত" : "Verified",
  };

  const handleWithdrawClick = () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({ 
        title: language === "bn" ? "অবৈধ পরিমাণ" : "Invalid Amount", 
        description: language === "bn" ? "অনুগ্রহ করে একটি সঠিক পরিমাণ লিখুন।" : "Please enter a valid amount.", 
        variant: "destructive" 
      });
      return;
    }
    
    if (source === 'referral' && parseFloat(amount) < 150) {
        toast({ 
            title: language === "bn" ? "সর্বনিম্ন সীমা" : "Minimum Limit", 
            description: language === "bn" ? "রেফারেল উত্তোলনের জন্য সর্বনিম্ন ১৫০ টাকা।" : "Minimum referral withdrawal is 150 BDT.", 
            variant: "destructive" 
        });
        return;
    }
    
    if (parseFloat(amount) > currentBalance) {
         toast({ 
            title: language === "bn" ? "অপর্যাপ্ত ব্যালেন্স" : "Insufficient Balance", 
            description: language === "bn" ? "আপনার পর্যাপ্ত ব্যালেন্স নেই।" : "You do not have enough funds.", 
            variant: "destructive" 
        });
        return;
    }

    if (!destinationNumber || destinationNumber.length < (method === 'binance' ? 5 : 11)) {
        toast({
            title: language === "bn" ? "ভুল নম্বর/আইডি" : "Invalid Number/ID",
            description: language === "bn" ? "অনুগ্রহ করে সঠিক তথ্য দিন।" : "Please enter valid details.",
            variant: "destructive"
        });
        return;
    }

    setIsConfirmOpen(true);
  };

  const submitWithdrawal = async () => {
    setIsSubmitting(true);
    try {
      await apiRequest("POST", "/api/withdrawals", { amount, source, destinationNumber, method });
      await queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      setIsConfirmOpen(false);
      setStep(2); // Success Screen
    } catch (e: any) {
      setIsConfirmOpen(false);
      toast({ 
          title: language === "bn" ? "উত্তোলন ব্যর্থ" : "Withdrawal Failed", 
          description: e.message || "Insufficient funds or error.", 
          variant: "destructive" 
      });
    } finally {
      setIsSubmitting(false);
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
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col font-sans">
      {/* Header */}
      <header className="bg-primary text-primary-foreground p-4 flex items-center justify-between sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-3">
          <button onClick={() => setLocation("/wallet")} className="p-1 hover:bg-white/10 rounded-full transition-colors">
            <ChevronLeft className="h-6 w-6" />
          </button>
          <div className="flex flex-col">
            <span className="font-bold text-lg leading-none">{t.title}</span>
            <span className="text-[10px] opacity-80">{t.subtitle}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col max-w-md mx-auto w-full bg-white shadow-xl overflow-hidden p-6 space-y-6">
        
        <div className="space-y-6 animate-in slide-in-from-right duration-500">
            
            <Tabs defaultValue="main" value={source} onValueChange={(v) => setSource(v as any)} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4 p-1 bg-muted rounded-xl">
                    <TabsTrigger value="main" className="rounded-lg">{t.mainBal}</TabsTrigger>
                    <TabsTrigger value="referral" className="rounded-lg">{t.referralBal}</TabsTrigger>
                </TabsList>
                
                <div className="p-6 rounded-2xl border bg-gradient-to-br from-white to-gray-50 shadow-sm">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">
                                {source === 'main' ? t.mainBal : t.referralBal}
                            </p>
                            <p className="text-3xl font-heading font-bold text-gray-900">৳{currentBalance.toLocaleString()}</p>
                        </div>
                        <div className={`p-3 rounded-xl ${source === 'main' ? 'bg-primary/10 text-primary' : 'bg-purple-100 text-purple-600'}`}>
                            {source === 'main' ? <Banknote className="h-6 w-6" /> : <CreditCard className="h-6 w-6" />}
                        </div>
                    </div>
                </div>
            </Tabs>

            {/* Method Selection */}
            <div className="grid grid-cols-3 gap-3">
                {[
                    { id: 'bkash', name: 'bKash', img: '/payment/bkash.webp', color: 'border-pink-500 bg-pink-50' },
                    { id: 'nagad', name: 'Nagad', img: '/payment/nagad.webp', color: 'border-orange-500 bg-orange-50' },
                    { id: 'binance', name: 'Binance', img: '/payment/binance.webp', color: 'border-yellow-500 bg-yellow-50' }
                ].map((m) => (
                    <button
                        key={m.id}
                        onClick={() => setMethod(m.id as any)}
                        className={`relative flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all duration-200 ${
                            method === m.id 
                            ? `${m.color} shadow-sm` 
                            : 'border-transparent bg-gray-50 hover:bg-gray-100'
                        }`}
                    >
                        {method === m.id && (
                            <div className="absolute top-1 right-1">
                                <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                                    <CheckIcon className="w-3 h-3 text-white" />
                                </div>
                            </div>
                        )}
                        <img 
                            src={m.img} 
                            alt={m.name} 
                            className="w-10 h-10 object-contain mb-2 drop-shadow-sm" 
                            onError={(e) => e.currentTarget.style.display = 'none'} 
                            loading="lazy"
                        />
                        <span className={`text-xs font-bold ${method === m.id ? 'text-gray-900' : 'text-gray-500'}`}>{m.name}</span>
                        {/* Fallback Icon if Image Fails */}
                         <div className="hidden">
                             <CreditCard className="w-6 h-6 mb-1"/>
                         </div>
                    </button>
                ))}
            </div>

            {/* Destination Number */}
            <div className="space-y-2">
                <div className="flex justify-between">
                    <label className="text-sm font-bold text-gray-700">{t.destLabel}</label>
                    {isUsingSaved && (
                        <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                            <CheckIcon className="w-3 h-3" /> {t.verified}
                        </span>
                    )}
                </div>
                <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                        <Smartphone className="h-4 w-4" />
                    </div>
                    <Input 
                        value={destinationNumber}
                        onChange={(e) => setDestinationNumber(e.target.value)}
                        placeholder={t.destPlaceholder}
                        className={`h-14 pl-10 text-lg border-2 focus-visible:ring-primary rounded-xl bg-gray-50 ${isUsingSaved ? 'border-green-500/30 bg-green-50/10' : ''}`}
                    />
                </div>
            </div>

            {/* Amount Input */}
            <div className="space-y-4">
                <div className="text-center bg-gray-50 rounded-2xl p-6 border-2 border-dashed border-gray-200">
                    <p className="text-sm text-muted-foreground mb-2 font-medium">{t.enterAmount}</p>
                    <div className="relative inline-block max-w-[200px]">
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 text-2xl font-bold text-gray-400">৳</span>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0"
                            className="text-4xl font-bold text-center w-full focus:outline-none bg-transparent placeholder:text-gray-300 pl-6"
                        />
                    </div>
                    {/* Fee Calculation Display */}
                    {numericAmount > 0 && (
                        <div className="mt-4 pt-4 border-t flex justify-between text-sm">
                            <span className="text-muted-foreground">{t.fee} ({(feePercent * 100)}%):</span>
                            <span className="font-medium text-red-500">-৳{fee.toFixed(2)}</span>
                        </div>
                    )}
                    {numericAmount > 0 && (
                        <div className="mt-1 flex justify-between text-sm font-bold">
                            <span className="text-gray-700">{t.final}:</span>
                            <span className="text-green-600">৳{finalAmount.toFixed(2)}</span>
                        </div>
                    )}
                </div>
            </div>

            <Button 
                className="w-full h-14 rounded-xl font-bold text-lg shadow-lg shadow-primary/25 transition-all hover:scale-[1.02] active:scale-95"
                onClick={handleWithdrawClick}
                disabled={isSubmitting}
            >
                {isSubmitting ? t.processing : t.confirmBtn}
            </Button>
        </div>

        <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
            <AlertDialogContent className="rounded-2xl">
                <AlertDialogHeader>
                    <AlertDialogTitle>{t.confirmBtn}?</AlertDialogTitle>
                    <AlertDialogDescription>
                        You are about to withdraw <span className="font-bold text-gray-900">৳{amount}</span> from your <span className="font-bold text-gray-900">{source === 'main' ? 'Main' : 'Referral'} Balance</span>.
                        <br /><br />
                        Method: <span className="font-bold text-gray-900 capitalize">{method}</span>
                        <br />
                        Number: <span className="font-bold text-gray-900">{destinationNumber}</span>
                        <br />
                        Fee: <span className="text-red-500 font-bold">৳{fee.toFixed(2)}</span>
                        <br />
                        You Receive: <span className="text-green-600 font-bold">৳{finalAmount.toFixed(2)}</span>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={submitWithdrawal} className="bg-primary text-primary-foreground font-bold">
                        {isSubmitting ? "Processing..." : "Confirm"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
      </div>
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