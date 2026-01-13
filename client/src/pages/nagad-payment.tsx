import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, Home, CheckCircle, Smartphone, Hash, AlertCircle, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AgentNumberDisplay } from "@/components/agent-number-display";
import { usePaymentSession } from "@/hooks/use-payment-session";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function NagadPayment() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { language } = useAuth();
  const queryClient = useQueryClient();
  const { timeLeft, formatTime } = usePaymentSession(50);
  
  // Single Step Flow
  const [amount, setAmount] = useState("");
  const [trxId, setTrxId] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isBankingHours, setIsBankingHours] = useState(false);

  // Fetch Active Agent
  const { data: agentData, isLoading: agentLoading, error: agentError } = useQuery<any>({
    queryKey: ["/api/agents/nagad"],
  });

  const isClosed = agentError && (agentError as any).status === 503;

  useEffect(() => {
    const checkTime = () => {
      const now = new Date();
      // BD Time is UTC+6
      const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
      const bdTime = new Date(utc + (3600000 * 6));
      const hours = bdTime.getHours();
      setIsBankingHours(hours >= 9 && hours < 17);
    };
    
    checkTime();
    const interval = setInterval(checkTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleRefreshAgent = async () => {
      try {
          await apiRequest("POST", "/api/agents/nagad/rotate");
          queryClient.invalidateQueries({ queryKey: ["/api/agents/nagad"] });
      } catch (e) {
          console.error("Rotation failed", e);
      }
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
    
    if (!trxId || trxId.length < 5) {
        toast({ 
            title: language === "bn" ? "অবৈধ ট্রানজেকশন আইডি" : "Invalid TrxID", 
            description: language === "bn" ? "অনুগ্রহ করে একটি সঠিক ট্রানজেকশন আইডি দিন" : "Please enter a valid Transaction ID", 
            variant: "destructive" 
        });
        return;
    }

    if (!userPhone || userPhone.length !== 11) {
        toast({ 
            title: language === "bn" ? "অবৈধ ফোন নম্বর" : "Invalid Phone Number", 
            description: language === "bn" ? "অনুগ্রহ করে আপনার নগদ নম্বরটি দিন (১১ ডিজিট)" : "Please enter your Nagad number (11 digits)", 
            variant: "destructive" 
        });
        return;
    }
    
    setIsSubmitting(true);
    try {
      await apiRequest("POST", "/api/deposits", {
        amount: amount,
        transactionId: trxId,
        userPhoneNumber: userPhone,
        agentNumber: agentData?.number,
        method: "nagad" 
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
    title: language === "bn" ? "ডিপোজিট" : "Deposit",
    subtitle: language === "bn" ? "নগদ এজেন্ট" : "Nagad Agent",
    successTitle: language === "bn" ? "অনুরোধ জমা দেওয়া হয়েছে" : "Request Submitted",
    successMsg: language === "bn" ? "আপনার ব্যালেন্স শীঘ্রই যুক্ত হবে। আমাদের সাথে থাকার জন্য ধন্যবাদ।" : "Your balance will be credited soon. Please stay with us and trust us.",
    verifyMsg: language === "bn" ? "আমরা নিরাপত্তার জন্য প্রতিটি লেনদেন ম্যানুয়ালি যাচাই করি।" : "We verify every transaction manually to ensure security.",
    backHome: language === "bn" ? "হোমে ফিরে যান" : "BACK TO HOME",
    viewTerms: language === "bn" ? "শর্তাবলী দেখুন" : "View Terms & Conditions",
    sendMoney: language === "bn" ? "এজেন্টকে টাকা পাঠান" : "Send Money to Agent",
    cashOut: language === "bn" ? "এই নম্বরে ক্যাশ আউট করুন" : "Cash Out to this number",
    viewNumber: language === "bn" ? "এজেন্ট নম্বর দেখতে ক্লিক করুন" : "Click to view Agent Number",
    hidesIn: language === "bn" ? "লুকাবে" : "Hides in",
    selectAmount: language === "bn" ? "পরিমাণ নির্বাচন করুন" : "Select Amount",
    custom: language === "bn" ? "অন্যান্য" : "Custom",
    trxIdLabel: language === "bn" ? "ট্রানজেকশন আইডি (TrxID)" : "Transaction ID (TrxID)",
    trxIdHelp: language === "bn" ? "নগদে টাকা পাঠানোর পর যে অনন্য ট্রানজেকশন আইডি পেয়েছেন তা দিন।" : "Enter the unique Transaction ID you received from Nagad after sending money.",
    userPhoneLabel: language === "bn" ? "আপনার নগদ নম্বর" : "Your Nagad Number",
    userPhoneHelp: language === "bn" ? "যে নম্বর থেকে টাকা পাঠিয়েছেন" : "Number used to send money",
    proceed: language === "bn" ? "এগিয়ে যান" : "PROCEED",
    processing: language === "bn" ? "প্রক্রিয়াধীন..." : "PROCESSING...",
    closed: language === "bn" ? "বর্তমানে ব্যাংকিং আওয়ার শেষ। সকাল ৯টা থেকে বিকাল ৫টা পর্যন্ত চেষ্টা করুন।" : "Banking hours are over. Please try between 9 AM and 5 PM.",
    unavailable: language === "bn" ? "বর্তমানে কোনো এজেন্ট উপলব্ধ নেই" : "No agents available right now",
    active: language === "bn" ? "সক্রিয়" : "Active",
    closedStatus: language === "bn" ? "বন্ধ" : "Closed",
    waitMsg: language === "bn" ? "অনুগ্রহ করে ব্যাংকিং আওয়ার (সকাল ৯টা - বিকাল ৫টা) পর্যন্ত অপেক্ষা করুন।" : "Please wait for banking hours (9 AM - 5 PM).",
    guideTitle: language === "bn" ? "কিভাবে টাকা পাঠাবেন?" : "How to send money?",
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
                className="bg-[#ec1c24] hover:bg-[#c0101b] text-white w-full h-12 rounded-full font-bold shadow-md"
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

  // Handle Closed State
  if (isClosed) {
    return (
        <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans">
                <header className="bg-[#ec1c24] text-white p-4 flex items-center justify-between sticky top-0 z-50 shadow-md">
                <div className="flex items-center gap-3">
                <button onClick={() => setLocation("/payment/methods")} className="p-1 hover:bg-white/10 rounded-full transition-colors">
                    <ChevronLeft className="h-6 w-6" />
                </button>
                <div className="flex flex-col">
                    <span className="font-bold text-lg leading-none">{t.title}</span>
                    <span className="text-[10px] opacity-80 uppercase tracking-tighter">{t.subtitle}</span>
                </div>
                </div>
            </header>
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                <AlertCircle className="h-16 w-16 text-[#ec1c24]/50 mb-4" />
                <h3 className="text-xl font-bold text-slate-800 mb-2">Service Unavailable</h3>
                <p className="text-slate-500">{t.closed}</p>
            </div>
        </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans">
      {/* Header */}
      <header className="bg-[#ec1c24] text-white p-4 flex items-center justify-between sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-3">
          <button onClick={() => setLocation("/payment/methods")} className="p-1 hover:bg-white/10 rounded-full transition-colors">
            <ChevronLeft className="h-6 w-6" />
          </button>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
                <span className="font-bold text-lg leading-none">{t.title}</span>
            </div>
            <span className="text-[10px] opacity-80 uppercase tracking-tighter">{t.subtitle}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
            <div className={`text-xs font-mono font-bold px-2 py-1 rounded bg-white/20 ${timeLeft < 30 ? 'text-red-300 animate-pulse' : 'text-white'}`}>
                {formatTime(timeLeft)}
            </div>
            <div className="bg-white/20 p-2 rounded-full">
            <Link href="/dashboard">
                <Home className="h-5 w-5" />
            </Link>
            </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col max-w-md mx-auto w-full p-4 space-y-6">
        
        {/* Banking Hour Warning */}
        {!isBankingHours && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                <div className="flex flex-col">
                    <h4 className="text-sm font-bold text-red-700">{t.closedStatus}</h4>
                    <p className="text-xs text-red-600/80 leading-relaxed">
                        {t.waitMsg}
                    </p>
                </div>
            </div>
        )}

        {/* Agent Number Section with Masking */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-[#ec1c24]/10 rounded-full flex items-center justify-center text-[#ec1c24]">
                    <Smartphone className="h-5 w-5" />
                </div>
                <div>
                    <h3 className="font-bold text-slate-800 text-sm">{t.sendMoney}</h3>
                    <p className="text-xs text-slate-500">{t.cashOut}</p>
                </div>
            </div>
            
            {agentLoading ? (
                <div className="h-14 w-full bg-slate-100 rounded-xl animate-pulse"></div>
            ) : agentData ? (
                <AgentNumberDisplay 
                    number={agentData.number} 
                    onRefresh={handleRefreshAgent}
                    label={language === "bn" ? "এজেন্ট নম্বর (ক্যাশ আউট)" : "Agent Number (Cash Out)"}
                    autoRefreshInterval={5000}
                />
            ) : (
                <span className="text-sm font-bold text-red-500 w-full text-left">{t.unavailable}</span>
            )}
        </div>

        {/* Guidelines Accordion */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <Accordion type="single" collapsible>
                <AccordionItem value="item-1" className="border-b-0">
                    <AccordionTrigger className="px-4 py-3 hover:bg-slate-50 hover:no-underline">
                        <div className="flex items-center gap-2 text-[#ec1c24]">
                            <Info className="h-4 w-4" />
                            <span className="text-sm font-bold">{t.guideTitle}</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4 bg-slate-50/50">
                        <ul className="space-y-2 text-xs text-slate-600 list-disc pl-4">
                            <li><strong>ক্যাশ আউট:</strong> আপনার নগদ অ্যাপ থেকে 'ক্যাশ আউট' (Cash Out) অপশন সিলেক্ট করুন।</li>
                            <li><strong>এজেন্ট নম্বর:</strong> উপরে প্রদর্শিত এজেন্ট নম্বরটি ব্যবহার করুন। নিরাপত্তার স্বার্থে নম্বরটি প্রথমে লুকানো থাকে, দেখার জন্য চোখের আইকনে ক্লিক করুন।</li>
                            <li><strong>সময়সীমা:</strong> নম্বরটি ১৫ সেকেন্ডের জন্য দৃশ্যমান থাকবে, তারপর আবার লুকিয়ে যাবে এবং পরিবর্তন হতে পারে।</li>
                            <li><strong>পরিমাণ:</strong> নিচে তালিকা থেকে পরিমাণ নির্বাচন করুন অথবা টাইপ করুন।</li>
                            <li><strong>TrxID:</strong> লেনদেন সফল হলে নগদ থেকে পাওয়া TrxID টি নিচের বক্সে নির্ভুলভাবে লিখুন।</li>
                        </ul>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>

        {/* Amount Selection */}
        <div className={`space-y-3 ${!isBankingHours ? 'opacity-50 pointer-events-none' : ''}`}>
            <label className="text-sm font-bold text-slate-700 ml-1">{t.selectAmount}</label>
            <div className="grid grid-cols-3 gap-3">
                {[250, 500, 1500, 2000, 5000].map((val) => (
                    <button
                        key={val}
                        onClick={() => setAmount(val.toString())}
                        className={`py-3 rounded-xl text-sm font-bold border transition-all duration-200 ${
                            amount === val.toString() 
                            ? 'bg-[#ec1c24] text-white border-[#ec1c24] shadow-md shadow-[#ec1c24]/20' 
                            : 'bg-white text-slate-600 border-slate-200 hover:border-[#ec1c24]/50'
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
                            ? 'border-[#ec1c24] bg-[#ec1c24]/5 text-[#ec1c24]'
                            : 'border-slate-200 bg-white'
                        }`}
                    />
                 </div>
            </div>
        </div>

        {/* User Phone Number Input */}
         <div className={`space-y-3 ${!isBankingHours ? 'opacity-50 pointer-events-none' : ''}`}>
             <label className="text-sm font-bold text-slate-700 ml-1">{t.userPhoneLabel}</label>
             <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <Smartphone className="h-4 w-4" />
                </div>
                <Input 
                    value={userPhone}
                    onChange={(e) => setUserPhone(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    className="h-14 pl-10 text-lg border-slate-200 focus-visible:ring-[#ec1c24] rounded-xl bg-white font-mono"
                />
             </div>
             <p className="text-[11px] text-slate-400 px-1">
                {t.userPhoneHelp}
             </p>
        </div>


        {/* Transaction ID Input */}
        <div className={`space-y-3 ${!isBankingHours ? 'opacity-50 pointer-events-none' : ''}`}>
             <label className="text-sm font-bold text-slate-700 ml-1">{t.trxIdLabel}</label>
             <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <Hash className="h-4 w-4" />
                </div>
                <Input 
                    value={trxId}
                    onChange={(e) => setTrxId(e.target.value)}
                    placeholder="e.g. 7G6F5D4S"
                    className="h-14 pl-10 text-lg border-slate-200 focus-visible:ring-[#ec1c24] rounded-xl bg-white uppercase font-mono placeholder:normal-case"
                />
             </div>
             <p className="text-[11px] text-slate-400 px-1">
                {t.trxIdHelp}
             </p>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
            <Button 
                onClick={handleProceed}
                disabled={isSubmitting || !agentData || !isBankingHours}
                className="w-full h-14 bg-[#ec1c24] hover:bg-[#c0101b] text-white rounded-xl font-bold text-lg shadow-lg shadow-[#ec1c24]/20 transition-all active:scale-[0.98] disabled:opacity-50"
            >
                {isSubmitting ? t.processing : !isBankingHours ? t.closedStatus : t.proceed}
            </Button>
        </div>

      </div>
    </div>
  );
}