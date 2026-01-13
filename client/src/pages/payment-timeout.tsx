import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Clock, RefreshCw } from "lucide-react";

export default function PaymentTimeout() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-500">
      <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-orange-500/20">
        <Clock className="w-10 h-10 text-orange-500" />
      </div>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Session Expired</h1>
      <p className="text-gray-500 mb-8 text-sm leading-relaxed max-w-xs mx-auto">
        For your security, the payment session has timed out. This ensures you always have the latest agent details.
      </p>
      
      <Link href="/payment-methods">
        <Button className="bg-primary hover:bg-primary/90 text-white w-full max-w-xs h-12 rounded-full font-bold shadow-md flex items-center justify-center gap-2">
          <RefreshCw className="w-4 h-4" />
          Try Again
        </Button>
      </Link>
    </div>
  );
}
