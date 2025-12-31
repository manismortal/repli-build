import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, Info, Home, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function BkashPayment() {
  const [location, setLocation] = useLocation();
  const { updateBalance } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState(1); // 1: Amount, 2: Number, 3: PIN, 4: Success
  const [amount, setAmount] = useState("");
  const [bkashNumber, setBkashNumber] = useState("");
  const [pin, setPin] = useState("");

  const handleConfirmAmount = () => {
    if (!amount || parseFloat(amount) < 10) {
      toast({ title: "Invalid Amount", description: "Minimum deposit is ৳10", variant: "destructive" });
      return;
    }
    setStep(2);
  };

  const handleConfirmNumber = () => {
    if (bkashNumber.length < 11) {
      toast({ title: "Invalid Number", description: "Enter a valid Bkash number", variant: "destructive" });
      return;
    }
    setStep(3);
  };

  const handleConfirmPayment = () => {
    if (pin.length < 5) {
      toast({ title: "Invalid PIN", description: "Enter your 5-digit Bkash PIN", variant: "destructive" });
      return;
    }
    
    // Simulate payment
    setTimeout(() => {
      updateBalance(parseFloat(amount));
      setStep(4);
      toast({ title: "Payment Successful", description: `৳${amount} deposited via Bkash` });
    }, 2000);
  };

  if (step === 4) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-[#e2136e] rounded-full flex items-center justify-center mb-6 shadow-lg shadow-[#e2136e]/20">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful</h1>
        <p className="text-gray-500 mb-8">Your deposit of ৳{amount} has been processed.</p>
        <Button 
          onClick={() => setLocation("/dashboard")} 
          className="bg-[#e2136e] hover:bg-[#c0105d] text-white w-full max-w-xs h-12 rounded-full font-bold"
        >
          BACK TO HOME
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f1f1f1] flex flex-col font-sans">
      {/* Bkash Header */}
      <header className="bg-[#e2136e] text-white p-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <button onClick={() => step > 1 ? setStep(step - 1) : setLocation("/wallet")} className="p-1">
            <ChevronLeft className="h-6 w-6" />
          </button>
          <div className="flex flex-col">
            <span className="font-bold text-lg leading-none">bKash</span>
            <span className="text-[10px] opacity-80 uppercase tracking-tighter">Merchant Payment</span>
          </div>
        </div>
        <div className="bg-white/20 p-2 rounded-full">
          <Home className="h-5 w-5" />
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex flex-col max-w-md mx-auto w-full bg-white shadow-sm overflow-hidden">
        {/* Merchant Info */}
        <div className="p-5 flex items-center gap-4 border-b">
          <div className="h-12 w-12 bg-[#e2136e]/10 rounded-lg flex items-center justify-center overflow-hidden border border-[#e2136e]/20 p-2">
            <img src="https://upload.wikimedia.org/wikipedia/commons/8/88/BKash_Logo.svg" alt="Bkash" className="w-full h-full object-contain" />
          </div>
          <div>
            <p className="font-bold text-gray-800 text-sm">MAERSK.Line BD</p>
            <p className="text-xs text-gray-500">Merchant: 01844556677</p>
          </div>
        </div>

        {/* Steps */}
        <div className="flex-1 p-6 space-y-8 animate-in slide-in-from-right-4 duration-300">
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-2">Enter Amount</p>
                <div className="relative inline-block">
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 text-2xl font-bold text-[#e2136e]">৳</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0"
                    className="text-5xl font-bold text-center w-full focus:outline-none placeholder:text-gray-200 pl-6"
                    autoFocus
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                {[500, 1000, 2000, 5000, 10000, 20000].map((val) => (
                  <button 
                    key={val} 
                    onClick={() => setAmount(val.toString())}
                    className="py-3 border rounded-lg text-sm font-bold text-gray-600 hover:border-[#e2136e] hover:text-[#e2136e] transition-colors"
                  >
                    ৳{val}
                  </button>
                ))}
              </div>

              <div className="bg-blue-50 p-4 rounded-xl flex gap-3 items-start">
                <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                <p className="text-xs text-blue-600 leading-relaxed">
                  The amount will be instantly credited to your MAERSK wallet. Minimum deposit is ৳10.
                </p>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Enter Your bKash Account Number</label>
                <div className="relative">
                  <Input
                    value={bkashNumber}
                    onChange={(e) => setBkashNumber(e.target.value)}
                    placeholder="e.g. 017XXXXXXXX"
                    className="h-14 text-lg border-2 focus-visible:ring-[#e2136e] rounded-xl"
                    maxLength={11}
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <CreditCard className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-gray-400">
                By clicking confirm, you agree to bKash's Terms & Conditions for merchant payment.
              </p>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="bg-[#f8f8f8] p-4 rounded-xl flex justify-between items-center mb-6">
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Amount to Pay</p>
                  <p className="text-2xl font-bold text-gray-800">৳{amount}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">To</p>
                  <p className="text-sm font-bold text-[#e2136e]">MAERSK.Line BD</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Enter Your bKash PIN</label>
                <Input
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="• • • • •"
                  className="h-14 text-2xl tracking-[0.5em] text-center border-2 focus-visible:ring-[#e2136e] rounded-xl"
                  maxLength={5}
                />
              </div>

              <div className="flex gap-2 items-center justify-center text-[#e2136e]">
                <div className="w-2 h-2 rounded-full bg-[#e2136e] animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-[#e2136e] animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 rounded-full bg-[#e2136e] animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}
        </div>

        {/* Footer Action */}
        <div className="p-4 bg-white border-t space-y-3">
          <Button 
            className="w-full bg-[#e2136e] hover:bg-[#c0105d] text-white h-14 rounded-xl font-bold text-lg shadow-lg shadow-[#e2136e]/20"
            onClick={step === 1 ? handleConfirmAmount : step === 2 ? handleConfirmNumber : handleConfirmPayment}
          >
            {step === 3 ? "CONFIRM PAYMENT" : "NEXT"}
          </Button>
          <Button 
            variant="ghost" 
            className="w-full text-gray-400 font-bold h-10 hover:text-[#e2136e]"
            onClick={() => setLocation("/wallet")}
          >
            CANCEL
          </Button>
        </div>
      </div>

      {/* bKash Banner Bottom */}
      <div className="p-4 text-center">
        <img src="https://upload.wikimedia.org/wikipedia/commons/8/88/BKash_Logo.svg" alt="Bkash" className="h-6 mx-auto opacity-30 grayscale" />
      </div>
    </div>
  );
}
