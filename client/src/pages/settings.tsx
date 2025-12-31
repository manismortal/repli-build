import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  User, 
  Phone, 
  Wallet, 
  Trash2, 
  FileText, 
  ChevronRight, 
  ShieldCheck, 
  AlertTriangle 
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

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Profile Updated", description: "Your changes have been saved successfully." });
  };

  const handleUpdateWallet = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Wallet Updated", description: "Payment method has been updated." });
  };

  const handleDeleteAccount = () => {
    toast({ title: "Account Deletion Requested", description: "Your request is being processed. You will be logged out.", variant: "destructive" });
    setTimeout(logout, 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div>
        <h1 className="text-4xl font-heading font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground text-lg">Manage your account and preferences</p>
      </div>

      {/* Account Info */}
      <Card className="hover-elevate">
        <CardHeader>
          <CardTitle className="font-heading text-xl flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Profile Settings
          </CardTitle>
          <CardDescription>Update your personal information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input 
                id="username" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter new username" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="flex gap-2">
                <Input 
                  id="phone" 
                  value={mobile} 
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="017XXXXXXXX" 
                />
                <Button variant="outline" type="button" onClick={() => toast({ title: "OTP Sent", description: "Verification code sent to your new number." })}>
                  Verify
                </Button>
              </div>
            </div>
            <Button type="submit" className="w-full font-heading">Save Changes</Button>
          </form>
        </CardContent>
      </Card>

      {/* Wallet Management */}
      <Card className="hover-elevate">
        <CardHeader>
          <CardTitle className="font-heading text-xl flex items-center gap-2">
            <Wallet className="h-5 w-5 text-primary" />
            Wallet Management
          </CardTitle>
          <CardDescription>Manage your withdrawal bKash numbers</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateWallet} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="wallet">bKash Number</Label>
              <Input 
                id="wallet" 
                value={walletNum} 
                onChange={(e) => setWalletNum(e.target.value)}
                placeholder="Enter bKash number" 
              />
            </div>
            <Button type="submit" variant="secondary" className="w-full font-heading">Update Wallet</Button>
          </form>
        </CardContent>
      </Card>

      {/* Legal & Safety */}
      <div className="space-y-4">
        <Card className="hover-elevate cursor-pointer overflow-hidden border-none shadow-sm">
          <CardContent className="p-0">
            <Dialog>
              <DialogTrigger asChild>
                <div className="flex items-center justify-between p-4 hover:bg-secondary/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">Terms and Conditions</p>
                      <p className="text-xs text-muted-foreground">Read our platform guidelines</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="font-heading">Terms and Conditions</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 text-sm text-muted-foreground">
                  <p className="font-bold text-foreground">1. Investment Risk</p>
                  <p>Investments in MAERSK.Line BD involve risk. Users must be aware of market fluctuations.</p>
                  <p className="font-bold text-foreground">2. Referral Program</p>
                  <p>Bonuses are paid only for active users who complete daily tasks for 60 days.</p>
                  <p className="font-bold text-foreground">3. Withdrawals</p>
                  <p>Bkash withdrawals are processed within 24-48 hours. Minimum limits apply.</p>
                  <p>By using this platform, you agree to all terms stated in our full policy.</p>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        <Card className="hover-elevate border-destructive/20 bg-destructive/5">
          <CardHeader>
            <CardTitle className="text-destructive font-heading text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Danger Zone
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="destructive" className="w-full font-heading">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Account
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="font-heading text-destructive">Are you absolutely sure?</DialogTitle>
                  <DialogDescription className="pt-4 space-y-3">
                    <p>This action cannot be undone. This will permanently delete your account and remove your data from our servers.</p>
                    <div className="bg-destructive/10 p-3 rounded-lg border border-destructive/20">
                      <p className="text-xs font-bold text-destructive">IMPORTANT:</p>
                      <ul className="text-xs list-disc pl-4 mt-1 text-destructive/80">
                        <li>All remaining balance (৳{user?.balance}) will be lost.</li>
                        <li>Active investment cycles will be terminated.</li>
                        <li>Referral network connections will be severed.</li>
                      </ul>
                    </div>
                    <p className="text-xs">Please withdraw all available funds before proceeding with deletion.</p>
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2 sm:gap-0">
                  <Button variant="outline" className="sm:mr-2">Cancel</Button>
                  <Button variant="destructive" onClick={handleDeleteAccount}>Confirm Deletion</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
