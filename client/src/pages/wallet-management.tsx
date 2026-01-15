import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, Wallet, Shield, AlertTriangle, CheckCircle2, History } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function WalletManagement() {
  const { user, language } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const [provider, setProvider] = useState(user?.savedWalletProvider || "bkash");
  const [walletNum, setWalletNum] = useState(user?.savedWalletNumber || "");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const walletMutation = useMutation({
    mutationFn: async (data: { number: string; provider: string }) => {
      await apiRequest("POST", "/api/user/wallet", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      toast({
        title: language === "bn" ? "সফল" : "Success",
        description: language === "bn" ? "ওয়ালেট নম্বর সফলভাবে আপডেট করা হয়েছে।" : "Wallet number updated successfully.",
      });
      setIsConfirmOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: language === "bn" ? "ব্যর্থ" : "Update Failed",
        description: error.message || (language === "bn" ? "ওয়ালেট আপডেট করা যায়নি।" : "Could not update wallet."),
        variant: "destructive",
      });
      setIsConfirmOpen(false);
    },
  });

  const handleSubmit = () => {
    // Validation
    const regex = /^01[3-9]\d{8}$/;
    if (!regex.test(walletNum)) {
      toast({
        title: language === "bn" ? "ভুল নম্বর" : "Invalid Number",
        description: language === "bn" ? "অনুগ্রহ করে একটি সঠিক ১১-ডিজিটের মোবাইল নম্বর দিন।" : "Please enter a valid 11-digit mobile number starting with 01.",
        variant: "destructive",
      });
      return;
    }
    
    setIsConfirmOpen(true);
  };

  const confirmUpdate = () => {
    walletMutation.mutate({ number: walletNum, provider });
  };

  const t = {
    title: language === "bn" ? "ওয়ালেট ম্যানেজমেন্ট" : "Wallet Management",
    sub: language === "bn" ? "আপনার উত্তোলনের জন্য ওয়ালেট সেটআপ করুন" : "Setup your wallet for withdrawals",
    back: language === "bn" ? "সেটিংস-এ ফিরে যান" : "Back to Settings",
    currentWallet: language === "bn" ? "বর্তমান ওয়ালেট" : "Current Wallet",
    notSet: language === "bn" ? "সেট করা নেই" : "Not Set",
    updateWallet: language === "bn" ? "ওয়ালেট আপডেট করুন" : "Update Wallet",
    provider: language === "bn" ? "প্রোভাইডার" : "Provider",
    number: language === "bn" ? "ওয়ালেট নম্বর" : "Wallet Number",
    placeholder: language === "bn" ? "১১-ডিজিটের নম্বর (উদাঃ ০১৭১...)" : "11-digit number (e.g. 0171...)",
    saveBtn: language === "bn" ? "সংরক্ষণ করুন" : "Save Wallet",
    saving: language === "bn" ? "সংরক্ষণ হচ্ছে..." : "Saving...",
    guideTitle: language === "bn" ? "গুরুত্বপূর্ণ তথ্য" : "Important Information",
    guide1: language === "bn" ? "নিরাপত্তার জন্য, ওয়ালেট নম্বর পরিবর্তন করার পর ১৫ দিনের জন্য লক করা থাকবে।" : "For security, wallet number is locked for 15 days after any change.",
    guide2: language === "bn" ? "শুধুমাত্র আপনার নিজস্ব ব্যক্তিগত বিকাশ বা নগদ নম্বর ব্যবহার করুন।" : "Use only your own personal bKash or Nagad number.",
    guide3: language === "bn" ? "ভুল নম্বরে টাকা পাঠানো হলে আমরা দায়ী নই।" : "We are not responsible for funds sent to incorrect numbers.",
    lastUpdated: language === "bn" ? "সর্বশেষ আপডেট:" : "Last Updated:",
    confirmTitle: language === "bn" ? "আপনি কি নিশ্চিত?" : "Are you sure?",
    confirmDesc: language === "bn" ? `আপনি আপনার ওয়ালেট নম্বর ${walletNum}-এ পরিবর্তন করতে যাচ্ছেন। এটি পরবর্তী ১৫ দিনের জন্য পরিবর্তন করা যাবে না।` : `You are about to update your wallet number to ${walletNum}. This cannot be changed for the next 15 days.`,
    cancel: language === "bn" ? "বাতিল" : "Cancel",
    confirm: language === "bn" ? "নিশ্চিত করুন" : "Confirm",
    verified: language === "bn" ? "যাচাইকৃত" : "Verified",
    locked: language === "bn" ? "লক করা হয়েছে" : "Locked",
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setLocation("/settings")}>
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <div>
            <h1 className="text-lg font-bold text-gray-900 leading-none">{t.title}</h1>
            <p className="text-xs text-muted-foreground mt-1">{t.sub}</p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6 max-w-lg">
        {/* Current Wallet Info Card */}
        <Card className="border-none shadow-md bg-gradient-to-br from-primary/5 to-primary/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-primary flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              {t.currentWallet}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {user?.savedWalletNumber ? (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900 tracking-tight">
                    {user.savedWalletNumber}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white text-gray-600 uppercase border border-gray-200 shadow-sm">
                      {user.savedWalletProvider === 'nagad' ? 'Nagad' : 'bKash'}
                    </span>
                    <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> {t.verified}
                    </span>
                  </div>
                </div>
                {user.walletLastUpdatedAt && (
                  <div className="text-right">
                     <div className="text-[10px] text-muted-foreground flex items-center gap-1 justify-end">
                        <History className="w-3 h-3" /> {t.lastUpdated}
                     </div>
                     <p className="text-xs font-medium text-gray-700">
                        {new Date(user.walletLastUpdatedAt).toLocaleDateString()}
                     </p>
                     {/* Calculate days remaining if needed, but backend handles lock logic */}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                <AlertTriangle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>{t.notSet}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Update Form */}
        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle>{t.updateWallet}</CardTitle>
            <CardDescription>{t.sub}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>{t.provider}</Label>
              <Select value={provider} onValueChange={setProvider}>
                <SelectTrigger className="h-12 rounded-xl bg-gray-50 border-gray-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bkash">bKash</SelectItem>
                  <SelectItem value="nagad">Nagad</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>{t.number}</Label>
              <div className="relative">
                <Input
                  value={walletNum}
                  onChange={(e) => setWalletNum(e.target.value.replace(/\D/g, '').slice(0, 11))}
                  className="h-12 rounded-xl bg-gray-50 border-gray-200 pl-11 text-lg font-mono tracking-widest"
                  placeholder="01XXXXXXXXX"
                  type="tel"
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">
                  +88
                </div>
              </div>
              <p className="text-[11px] text-muted-foreground">{t.placeholder}</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full h-12 rounded-xl font-bold text-lg" 
              onClick={handleSubmit}
              disabled={walletMutation.isPending || !walletNum}
            >
              {walletMutation.isPending ? t.saving : t.saveBtn}
            </Button>
          </CardFooter>
        </Card>

        {/* Guide / Info */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-blue-700 font-bold text-sm">
            <Shield className="h-4 w-4" />
            {t.guideTitle}
          </div>
          <ul className="space-y-2 text-xs text-blue-600/80 leading-relaxed list-disc pl-4">
            <li>{t.guide1}</li>
            <li>{t.guide2}</li>
            <li>{t.guide3}</li>
          </ul>
        </div>
      </main>

      {/* Confirmation Modal */}
      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>{t.confirmTitle}</AlertDialogTitle>
            <AlertDialogDescription>
              {t.confirmDesc}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmUpdate}>{t.confirm}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
