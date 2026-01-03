import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, Info, Home, CreditCard, Copy, Lock, Clock, CheckCircle, Smartphone, Hash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function BkashPayment() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  
  // Single Step Flow
  const [amount, setAmount] = useState("");
  const [trxId, setTrxId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Agent Number State
  const [showNumber, setShowNumber] = useState(false);
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showNumber && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setShowNumber(false);
      setCountdown(60); 
    }
    return () => clearInterval(timer);
  }, [showNumber, countdown]);

  const handleNumberClick = () => {
    setShowNumber(true);
    setCountdown(60);
    toast({
        description: "Agent number revealed.",
        duration: 1000,
    });
  };

  const handleCopy = () => {
      navigator.clipboard.writeText("01844556677");
      toast({ description: "Number copied to clipboard!" });
  };

  const handleProceed = async () => {
    if (!amount || parseFloat(amount) < 10) {
      toast({ title: "Invalid Amount", description: "Select or enter a valid amount (Min 10)", variant: "destructive" });
      return;
    }
    
    if (!trxId || trxId.length < 5) {
        toast({ title: "Invalid TrxID", description: "Please enter a valid Transaction ID", variant: "destructive" });
        return;
    }
    
    setIsSubmitting(true);
    try {
      await apiRequest("POST", "/api/deposits", {
        amount: amount,
        transactionId: trxId
      });

      setShowSuccess(true);
    } catch (error) {
      toast({ title: "Failed", description: "Could not submit deposit request.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-green-500/20">
          <CheckCircle className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Request Submitted</h1>
        <p className="text-gray-500 mb-6 text-sm leading-relaxed px-4">
          Your balance will be credited soon. Please stay with us and trust us.
          <br />
          We verify every transaction manually to ensure security.
        </p>
        <div className="flex flex-col gap-3 w-full max-w-xs">
            <Link href="/dashboard">
                <Button 
                className="bg-[#e2136e] hover:bg-[#c0105d] text-white w-full h-12 rounded-full font-bold shadow-md"
                >
                BACK TO HOME
                </Button>
            </Link>
            <Link href="/terms">
                <Button variant="link" className="text-gray-400 text-xs">
                    View Terms & Conditions
                </Button>
            </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans">
      {/* Header */}
      <header className="bg-[#e2136e] text-white p-4 flex items-center justify-between sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-3">
          <button onClick={() => setLocation("/wallet")} className="p-1 hover:bg-white/10 rounded-full transition-colors">
            <ChevronLeft className="h-6 w-6" />
          </button>
          <div className="flex flex-col">
            <span className="font-bold text-lg leading-none">Deposit</span>
            <span className="text-[10px] opacity-80 uppercase tracking-tighter">bKash Agent</span>
          </div>
        </div>
        <div className="bg-white/20 p-2 rounded-full">
          <Home className="h-5 w-5" />
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col max-w-md mx-auto w-full p-4 space-y-6">
        
        {/* Agent Number Section */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-[#e2136e]/10 rounded-full flex items-center justify-center text-[#e2136e]">
                    <Smartphone className="h-5 w-5" />
                </div>
                <div>
                    <h3 className="font-bold text-slate-800 text-sm">Send Money to Agent</h3>
                    <p className="text-[10px] text-slate-500">Cash Out to this number</p>
                </div>
            </div>
            
            <div className="bg-slate-50 border border-dashed border-slate-300 rounded-xl p-3 flex items-center justify-between">
                {!showNumber ? (
                    <button 
                        onClick={handleNumberClick}
                        className="text-sm font-bold text-[#e2136e] w-full text-left"
                    >
                        Click to view Agent Number
                    </button>
                ) : (
                    <div className="flex flex-col">
                        <span className="text-lg font-mono font-bold text-slate-800 tracking-wider">01844556677</span>
                        <span className="text-[10px] text-orange-500 font-bold">Hides in {countdown}s</span>
                    </div>
                )}
                
                {showNumber && (
                    <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={handleCopy}
                        className="text-[#e2136e] hover:bg-[#e2136e]/10 h-8 w-8 p-0 rounded-full"
                    >
                        <Copy className="h-4 w-4" />
                    </Button>
                )}
            </div>
        </div>

        {/* Amount Selection */}
        <div className="space-y-3">
            <label className="text-sm font-bold text-slate-700 ml-1">Select Amount</label>
            <div className="grid grid-cols-3 gap-3">
                {[250, 500, 1500, 2000, 5000].map((val) => (
                    <button
                        key={val}
                        onClick={() => setAmount(val.toString())}
                        className={`py-3 rounded-xl text-sm font-bold border transition-all duration-200 ${
                            amount === val.toString() 
                            ? 'bg-[#e2136e] text-white border-[#e2136e] shadow-md shadow-[#e2136e]/20' 
                            : 'bg-white text-slate-600 border-slate-200 hover:border-[#e2136e]/50'
                        }`}
                    >
                        ৳{val}
                    </button>
                ))}
                 <div className="relative col-span-1">
                    <input
                        type="number"
                        placeholder="Custom"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className={`w-full h-full rounded-xl text-sm font-bold text-center border focus:outline-none transition-all ${
                            ![250, 500, 1500, 2000, 5000].includes(Number(amount)) && amount
                            ? 'border-[#e2136e] bg-[#e2136e]/5 text-[#e2136e]'
                            : 'border-slate-200 bg-white'
                        }`}
                    />
                 </div>
            </div>
        </div>

        {/* Transaction ID Input */}
        <div className="space-y-3">
             <label className="text-sm font-bold text-slate-700 ml-1">Transaction ID (TrxID)</label>
             <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <Hash className="h-4 w-4" />
                </div>
                <Input 
                    value={trxId}
                    onChange={(e) => setTrxId(e.target.value)}
                    placeholder="e.g. 9H7G6F5D"
                    className="h-14 pl-10 text-lg border-slate-200 focus-visible:ring-[#e2136e] rounded-xl bg-white uppercase font-mono placeholder:normal-case"
                />
             </div>
             <p className="text-[11px] text-slate-400 px-1">
                Enter the unique Transaction ID you received from bKash after sending money.
             </p>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
            <Button 
                onClick={handleProceed}
                disabled={isSubmitting}
                className="w-full h-14 bg-[#e2136e] hover:bg-[#c0105d] text-white rounded-xl font-bold text-lg shadow-lg shadow-[#e2136e]/20 transition-all active:scale-[0.98]"
            >
                {isSubmitting ? "PROCESSING..." : "PROCEED"}
            </Button>
        </div>

      </div>
    </div>
  );
}
