import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  Shield, 
  Wallet, 
  Trash2, 
  FileText, 
  ChevronRight, 
  Info,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";

export default function Settings() {
  const { user, logout, language } = useAuth();
  const { toast } = useToast();
  const [username, setUsername] = useState(user?.name || "");
  const [mobile, setMobile] = useState(user?.username || "");
  const [walletNum, setWalletNum] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const t = {
    title: language === "bn" ? "অ্যাকাউন্ট সেটিংস" : "Account Settings",
    sub: language === "bn" ? "আপনার লজিস্টিক অভিজ্ঞতা এবং নিরাপত্তা ব্যক্তিগতকৃত করুন।" : "Personalize your logistics experience and security.",
    tabProfile: language === "bn" ? "প্রোফাইল" : "Profile",
    tabSecurity: language === "bn" ? "নিরাপত্তা" : "Security",
    tabLegal: language === "bn" ? "আইনি" : "Legal",
    identity: language === "bn" ? "পরিচয় তথ্য" : "Identity Information",
    identityDesc: language === "bn" ? "মেয়ার্স্ক লজিস্টিক নেটওয়ার্কে আপনি যেভাবে প্রদর্শিত হবেন।" : "How you appear in the Maersk logistics network.",
    username: language === "bn" ? "ইউজারনেম" : "Username",
    unique: language === "bn" ? "অনন্য" : "UNIQUE",
    userHelp: language === "bn" ? "কমপক্ষে ৩ অক্ষরের এবং অনন্য হতে হবে।" : "Must be at least 3 characters and unique.",
    phone: language === "bn" ? "সংযুক্ত ফোন" : "Connected Phone",
    verify: language === "bn" ? "যাচাই করুন" : "VERIFY",
    updating: language === "bn" ? "আপডেট হচ্ছে..." : "UPDATING...",
    commit: language === "bn" ? "পরিবর্তন সেভ করুন" : "COMMIT CHANGES",
    payout: language === "bn" ? "পেমেন্ট পদ্ধতি" : "Payout Methods",
    payoutDesc: language === "bn" ? "যেখানে আপনার মুনাফা পাঠানো হবে।" : "Where your profits are delivered.",
    bkash: language === "bn" ? "বিকাশ অ্যাকাউন্ট" : "bKash Account",
    verifiedWith: language === "bn" ? "উত্তোলনের জন্য যাচাইকৃত" : "Verified for Withdrawals",
    newWallet: language === "bn" ? "নতুন ওয়ালেট নম্বর" : "New Wallet Number",
    walletPlace: language === "bn" ? "১১-ডিজিটের বিকাশ নম্বর লিখুন" : "Enter 11-digit bKash number",
    updateWallet: language === "bn" ? "ওয়ালেট আপডেট করুন" : "UPDATE WALLET",
    twoFactor: language === "bn" ? "টু-ফ্যাক্টর অথেনটিকেশন" : "Two-Factor Authentication",
    twoFactorDesc: language === "bn" ? "উত্তোলনের জন্য উন্নত নিরাপত্তা" : "Enhanced security for withdrawals",
    loginAlert: language === "bn" ? "লগইন সতর্কতা" : "Login Alerts",
    loginAlertDesc: language === "bn" ? "নতুন ডিভাইসের জন্য বিজ্ঞপ্তি" : "Notifications for new devices",
    terminate: language === "bn" ? "অ্যাকাউন্ট স্থায়ীভাবে বন্ধ করুন" : "Permanent Account Termination",
    delete: language === "bn" ? "আমার অ্যাকাউন্ট মুছুন" : "DELETE MY ACCOUNT",
    irreversible: language === "bn" ? "অপরিবর্তনযোগ্য পদক্ষেপ" : "Irreversible Action",
    deleteConfirm: language === "bn" ? "দয়া করে আপনার অ্যাকাউন্ট স্থায়ীভাবে মুছে ফেলার ইচ্ছা নিশ্চিত করুন। বিনিয়োগ এবং ব্যালেন্স সহ সমস্ত ডেটা আমাদের সার্ভার থেকে মুছে ফেলা হবে।" : "Please confirm your intent to permanently delete your account. All data, including investments and balances, will be wiped from our secure servers.",
    warning: language === "bn" ? `এই প্রক্রিয়া সম্পন্ন হলে MAERSK.Line BD কোনো ফান্ড (৳${Number(user?.balance || 0).toLocaleString()}) পুনরুদ্ধার করতে পারবে না।` : `MAERSK.Line BD will not be able to recover any funds (৳${Number(user?.balance || 0).toLocaleString()}) once this process is complete.`,
    cancel: language === "bn" ? "বাতিল" : "CANCEL",
    confirmDel: language === "bn" ? "মুছে ফেলা নিশ্চিত করুন" : "CONFIRM DELETION",
    policies: language === "bn" ? "প্ল্যাটফর্ম পলিসি" : "Platform Policies",
    tos: language === "bn" ? "পরিষেবার শর্তাবলী" : "Terms of Service",
    tosDesc: language === "bn" ? "সর্বশেষ আপডেট ডিসেম্বর ২০২৫" : "Last updated Dec 2025",
    privacy: language === "bn" ? "গোপনীয়তা নীতি" : "Privacy Policy",
    privacyDesc: language === "bn" ? "ডেটা সুরক্ষা এবং কুকিজ" : "Data protection & cookies",
    agreement: language === "bn" ? "বিনিয়োগ চুক্তি" : "Investment Agreement",
    agreementDesc: language === "bn" ? "স্ট্যান্ডার্ড ৬০ দিনের শর্তাবলী" : "Standard 60-day terms",
    updateSuccess: language === "bn" ? "প্রোফাইল সফলভাবে আপডেট হয়েছে" : "Profile Updated Successfully",
    updateMsg: language === "bn" ? "আপনার পরিবর্তনগুলি এখন প্ল্যাটফর্ম জুড়ে লাইভ।" : "Your changes are now live across the platform.",
    otpTitle: language === "bn" ? "ওটিপি পাঠানো হয়েছে" : "OTP Dispatch",
    otpMsg: language === "bn" ? `${mobile}-এ একটি কোড পাঠানো হয়েছে` : "A code has been sent to " + mobile,
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setTimeout(() => {
      setIsUpdating(false);
      toast({ 
        title: t.updateSuccess, 
        description: t.updateMsg,
        variant: "default"
      });
    }, 1000);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <header>
        <h1 className="text-4xl font-heading font-bold tracking-tight mb-2">{t.title}</h1>
        <p className="text-muted-foreground text-lg">{t.sub}</p>
      </header>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8 bg-secondary/50 p-1 h-14 rounded-2xl">
          <TabsTrigger value="profile" className="rounded-xl data-[state=active]:bg-card data-[state=active]:shadow-sm">
            <User className="h-4 w-4 mr-2 hidden sm:inline" />
            {t.tabProfile}
          </TabsTrigger>
          <TabsTrigger value="security" className="rounded-xl data-[state=active]:bg-card data-[state=active]:shadow-sm">
            <Shield className="h-4 w-4 mr-2 hidden sm:inline" />
            {t.tabSecurity}
          </TabsTrigger>
          <TabsTrigger value="legal" className="rounded-xl data-[state=active]:bg-card data-[state=active]:shadow-sm">
            <FileText className="h-4 w-4 mr-2 hidden sm:inline" />
            {t.tabLegal}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">
          <Card className="border-none shadow-md overflow-hidden bg-card/50 backdrop-blur-sm">
            <CardHeader className="bg-primary/5 border-b border-primary/10">
              <CardTitle className="font-heading text-xl">{t.identity}</CardTitle>
              <CardDescription>{t.identityDesc}</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="username" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">{t.username}</Label>
                    <div className="flex items-center gap-1 text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded-full font-bold">
                      <CheckCircle2 className="h-3 w-3" /> {t.unique}
                    </div>
                  </div>
                  <div className="relative group">
                    <Input 
                      id="username" 
                      value={username} 
                      onChange={(e) => setUsername(e.target.value)}
                      className="h-12 rounded-xl bg-secondary/30 border-transparent focus:border-primary/50 transition-all pl-11"
                    />
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary" />
                  </div>
                  <p className="text-[11px] text-muted-foreground ml-1">{t.userHelp}</p>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="phone" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">{t.phone}</Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1 group">
                      <Input 
                        id="phone" 
                        value={mobile} 
                        onChange={(e) => setMobile(e.target.value)}
                        className="h-12 rounded-xl bg-secondary/30 border-transparent focus:border-primary/50 transition-all pl-11"
                      />
                      <Shield className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary" />
                    </div>
                    <Button 
                      variant="secondary" 
                      type="button" 
                      className="h-12 rounded-xl px-6 font-bold"
                      onClick={() => toast({ title: t.otpTitle, description: t.otpMsg })}
                    >
                      {t.verify}
                    </Button>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 rounded-xl font-heading text-lg shadow-lg shadow-primary/20"
                  disabled={isUpdating}
                >
                  {isUpdating ? t.updating : t.commit}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md overflow-hidden bg-card/50 backdrop-blur-sm">
            <CardHeader className="bg-accent/5 border-b border-accent/10">
              <CardTitle className="font-heading text-xl">{t.payout}</CardTitle>
              <CardDescription>{t.payoutDesc}</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-[#e2136e]/5 border border-[#e2136e]/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-[#e2136e] rounded-xl flex items-center justify-center text-white font-bold text-lg">b</div>
                    <div>
                      <p className="text-sm font-bold tracking-tight">{t.bkash}</p>
                      <p className="text-[11px] text-[#e2136e] font-semibold">{t.verifiedWith}</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
                
                <div className="relative group">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground ml-1 mb-1 block">{t.newWallet}</Label>
                  <Input 
                    value={walletNum} 
                    onChange={(e) => setWalletNum(e.target.value)}
                    placeholder={t.walletPlace}
                    className="h-12 rounded-xl bg-secondary/30 border-transparent focus:border-[#e2136e]/50 transition-all pl-11"
                  />
                  <Wallet className="absolute left-4 top-9 h-4 w-4 text-muted-foreground group-focus-within:text-[#e2136e]" />
                </div>
                <Button variant="outline" className="w-full h-12 rounded-xl font-heading hover:bg-[#e2136e]/5 hover:text-[#e2136e] hover:border-[#e2136e]">
                  {t.updateWallet}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
          <Card className="border-none shadow-md overflow-hidden">
            <CardContent className="p-0 divide-y">
              <div className="p-4 flex items-center justify-between hover:bg-secondary/20 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                    <Shield className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">{t.twoFactor}</p>
                    <p className="text-xs text-muted-foreground">{t.twoFactorDesc}</p>
                  </div>
                </div>
                <div className="h-6 w-10 bg-green-500 rounded-full flex items-center px-1">
                  <div className="h-4 w-4 bg-white rounded-full ml-auto" />
                </div>
              </div>
              
              <div className="p-4 flex items-center justify-between hover:bg-secondary/20 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center">
                    <AlertCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">{t.loginAlert}</p>
                    <p className="text-xs text-muted-foreground">{t.loginAlertDesc}</p>
                  </div>
                </div>
                <div className="h-6 w-10 bg-muted rounded-full flex items-center px-1">
                  <div className="h-4 w-4 bg-white rounded-full" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md bg-destructive/5 border border-destructive/10">
            <CardHeader>
              <CardTitle className="font-heading text-destructive text-lg flex items-center gap-2">
                <Trash2 className="h-5 w-5" />
                {t.terminate}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="destructive" className="w-full h-12 rounded-xl font-heading">
                    {t.delete}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md rounded-3xl">
                  <DialogHeader>
                    <DialogTitle className="font-heading text-2xl text-destructive text-center">{t.irreversible}</DialogTitle>
                    <DialogDescription className="text-center pt-2">
                      {t.deleteConfirm}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="bg-destructive/10 p-4 rounded-2xl border border-destructive/20 my-4 space-y-2">
                    <div className="flex gap-3 text-destructive">
                      <Info className="h-5 w-5 shrink-0" />
                      <p className="text-xs font-bold leading-relaxed">
                        {t.warning}
                      </p>
                    </div>
                  </div>
                  <DialogFooter className="flex flex-col sm:flex-row gap-3">
                    <Button variant="outline" className="h-12 rounded-xl flex-1 font-bold">{t.cancel}</Button>
                    <Button variant="destructive" className="h-12 rounded-xl flex-1 font-heading" onClick={logout}>{t.confirmDel}</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="legal" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Card className="border-none shadow-md overflow-hidden bg-card/50 backdrop-blur-sm">
            <CardHeader className="bg-secondary/50 border-b">
              <CardTitle className="font-heading text-xl flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                {t.policies}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border/50">
                {[
                  { title: t.tos, icon: Shield, desc: t.tosDesc, href: "/terms" },
                  { title: t.privacy, icon: User, desc: t.privacyDesc, href: "/terms" },
                  { title: t.agreement, icon: Wallet, desc: t.agreementDesc, href: "/terms" }
                ].map((item, i) => (
                  <Link href={item.href} key={i}>
                    <div className="p-5 flex items-center justify-between hover:bg-secondary/30 transition-colors cursor-pointer group">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-secondary rounded-xl flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                          <item.icon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold tracking-tight">{item.title}</p>
                          <p className="text-xs text-muted-foreground">{item.desc}</p>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
