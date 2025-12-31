import { useState } from "react";
import { useAuth } from "@/lib/auth";
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
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [username, setUsername] = useState(user?.name || "");
  const [mobile, setMobile] = useState(user?.mobile || "");
  const [walletNum, setWalletNum] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setTimeout(() => {
      setIsUpdating(false);
      toast({ 
        title: "Profile Updated Successfully", 
        description: "Your changes are now live across the platform.",
        variant: "default"
      });
    }, 1000);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <header>
        <h1 className="text-4xl font-heading font-bold tracking-tight mb-2">Account Settings</h1>
        <p className="text-muted-foreground text-lg">Personalize your logistics experience and security.</p>
      </header>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8 bg-secondary/50 p-1 h-14 rounded-2xl">
          <TabsTrigger value="profile" className="rounded-xl data-[state=active]:bg-card data-[state=active]:shadow-sm">
            <User className="h-4 w-4 mr-2 hidden sm:inline" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="security" className="rounded-xl data-[state=active]:bg-card data-[state=active]:shadow-sm">
            <Shield className="h-4 w-4 mr-2 hidden sm:inline" />
            Security
          </TabsTrigger>
          <TabsTrigger value="legal" className="rounded-xl data-[state=active]:bg-card data-[state=active]:shadow-sm">
            <FileText className="h-4 w-4 mr-2 hidden sm:inline" />
            Legal
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">
          <Card className="border-none shadow-md overflow-hidden bg-card/50 backdrop-blur-sm">
            <CardHeader className="bg-primary/5 border-b border-primary/10">
              <CardTitle className="font-heading text-xl">Identity Information</CardTitle>
              <CardDescription>How you appear in the Maersk logistics network.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="username" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Username</Label>
                    <div className="flex items-center gap-1 text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded-full font-bold">
                      <CheckCircle2 className="h-3 w-3" /> UNIQUE
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
                  <p className="text-[11px] text-muted-foreground ml-1">Must be at least 3 characters and unique.</p>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="phone" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Connected Phone</Label>
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
                      onClick={() => toast({ title: "OTP Dispatch", description: "A code has been sent to " + mobile })}
                    >
                      VERIFY
                    </Button>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 rounded-xl font-heading text-lg shadow-lg shadow-primary/20"
                  disabled={isUpdating}
                >
                  {isUpdating ? "UPDATING..." : "COMMIT CHANGES"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md overflow-hidden bg-card/50 backdrop-blur-sm">
            <CardHeader className="bg-accent/5 border-b border-accent/10">
              <CardTitle className="font-heading text-xl">Payout Methods</CardTitle>
              <CardDescription>Where your profits are delivered.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-[#e2136e]/5 border border-[#e2136e]/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-[#e2136e] rounded-xl flex items-center justify-center text-white font-bold text-lg">b</div>
                    <div>
                      <p className="text-sm font-bold tracking-tight">bKash Account</p>
                      <p className="text-[11px] text-[#e2136e] font-semibold">Verified for Withdrawals</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
                
                <div className="relative group">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground ml-1 mb-1 block">New Wallet Number</Label>
                  <Input 
                    value={walletNum} 
                    onChange={(e) => setWalletNum(e.target.value)}
                    placeholder="Enter 11-digit bKash number"
                    className="h-12 rounded-xl bg-secondary/30 border-transparent focus:border-[#e2136e]/50 transition-all pl-11"
                  />
                  <Wallet className="absolute left-4 top-9 h-4 w-4 text-muted-foreground group-focus-within:text-[#e2136e]" />
                </div>
                <Button variant="outline" className="w-full h-12 rounded-xl font-heading hover:bg-[#e2136e]/5 hover:text-[#e2136e] hover:border-[#e2136e]">
                  UPDATE WALLET
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
                    <p className="text-sm font-bold">Two-Factor Authentication</p>
                    <p className="text-xs text-muted-foreground">Enhanced security for withdrawals</p>
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
                    <p className="text-sm font-bold">Login Alerts</p>
                    <p className="text-xs text-muted-foreground">Notifications for new devices</p>
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
                Permanent Account Termination
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="destructive" className="w-full h-12 rounded-xl font-heading">
                    DELETE MY ACCOUNT
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md rounded-3xl">
                  <DialogHeader>
                    <DialogTitle className="font-heading text-2xl text-destructive text-center">Irreversible Action</DialogTitle>
                    <DialogDescription className="text-center pt-2">
                      Please confirm your intent to permanently delete your account. All data, including investments and balances, will be wiped from our secure servers.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="bg-destructive/10 p-4 rounded-2xl border border-destructive/20 my-4 space-y-2">
                    <div className="flex gap-3 text-destructive">
                      <Info className="h-5 w-5 shrink-0" />
                      <p className="text-xs font-bold leading-relaxed">
                        MAERSK.Line BD will not be able to recover any funds (৳{user?.balance}) once this process is complete.
                      </p>
                    </div>
                  </div>
                  <DialogFooter className="flex flex-col sm:flex-row gap-3">
                    <Button variant="outline" className="h-12 rounded-xl flex-1 font-bold">CANCEL</Button>
                    <Button variant="destructive" className="h-12 rounded-xl flex-1 font-heading" onClick={logout}>CONFIRM DELETION</Button>
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
                Platform Policies
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border/50">
                {[
                  { title: "Terms of Service", icon: Shield, desc: "Last updated Dec 2025" },
                  { title: "Privacy Policy", icon: User, desc: "Data protection & cookies" },
                  { title: "Investment Agreement", icon: Wallet, desc: "Standard 60-day terms" }
                ].map((item, i) => (
                  <div key={i} className="p-5 flex items-center justify-between hover:bg-secondary/30 transition-colors cursor-pointer group">
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
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
