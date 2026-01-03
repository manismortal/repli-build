import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Ship } from "lucide-react";

import shipImage from "@assets/generated_images/maersk_shipping_container_vessel_at_sea.png";

export default function AuthPage() {
  const { login, register, user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  if (user) {
    setLocation("/dashboard");
    return null;
  }

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const mobile = formData.get("mobile") as string;
    const password = formData.get("password") as string;
    login(mobile, password);
  };

  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const mobile = formData.get("mobile") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;
    
    register(mobile, password, name);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Side - Hero */}
      <div className="hidden lg:flex flex-col relative bg-sidebar text-sidebar-foreground">
        <div className="absolute inset-0 bg-primary/20 mix-blend-overlay z-10" />
        <img 
          src={shipImage} 
          alt="Maersk Ship" 
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="relative z-20 flex-1 flex flex-col justify-between p-12">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
              <Ship className="h-8 w-8" />
            </div>
            <div>
              <h1 className="font-heading text-3xl font-bold tracking-tight">MAERSK.Line</h1>
              <p className="text-primary-foreground/80 tracking-widest text-sm">BANGLADESH</p>
            </div>
          </div>
          
          <div className="space-y-6 max-w-lg">
            <h2 className="font-heading text-5xl font-bold leading-tight">
              Global Logistics <br/>
              <span className="text-primary">Investment Future</span>
            </h2>
            <p className="text-lg text-sidebar-foreground/80 leading-relaxed">
              Join the world's largest container shipping company's regional investment program. Secure high returns with our trusted logistics network.
            </p>
            <div className="flex gap-4 pt-4">
              <div className="bg-sidebar-accent/50 backdrop-blur-sm p-4 rounded-lg border border-white/10">
                <p className="text-2xl font-bold font-heading">15 Days</p>
                <p className="text-sm text-muted-foreground">Short Term Cycles</p>
              </div>
              <div className="bg-sidebar-accent/50 backdrop-blur-sm p-4 rounded-lg border border-white/10">
                <p className="text-2xl font-bold font-heading">180%</p>
                <p className="text-sm text-muted-foreground">Potential ROI</p>
              </div>
            </div>
          </div>
          
          <div className="text-sm text-sidebar-foreground/50">
            © 2025 Maersk Line Bangladesh. All rights reserved.
          </div>
        </div>
      </div>

      {/* Right Side - Forms */}
      <div className="flex items-center justify-center p-6 bg-background">
        <div className="w-full max-w-md space-y-8">
          <div className="lg:hidden flex flex-col items-center mb-8">
            <div className="h-12 w-12 bg-primary rounded-lg flex items-center justify-center text-primary-foreground mb-4">
              <Ship className="h-8 w-8" />
            </div>
            <h1 className="font-heading text-2xl font-bold">MAERSK.Line BD</h1>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <Card className="border-none shadow-none">
                <CardHeader className="px-0">
                  <CardTitle className="text-2xl font-heading">Welcome back</CardTitle>
                  <CardDescription>Enter your mobile number to access your dashboard</CardDescription>
                </CardHeader>
                <CardContent className="px-0">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="mobile">Mobile Number</Label>
                      <Input id="mobile" name="mobile" placeholder="017xxxxxxxx" required type="tel" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input id="password" name="password" type="password" required />
                    </div>
                    <Button type="submit" className="w-full h-12 text-lg font-heading" disabled={isLoading}>
                      {isLoading ? "Authenticating..." : "Login to Dashboard"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="register">
              <Card className="border-none shadow-none">
                <CardHeader className="px-0">
                  <CardTitle className="text-2xl font-heading">Create Account</CardTitle>
                  <CardDescription>Join the Maersk investment community today</CardDescription>
                </CardHeader>
                <CardContent className="px-0">
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" name="name" placeholder="Rahim Ahmed" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-mobile">Mobile Number</Label>
                      <Input id="reg-mobile" name="mobile" placeholder="017xxxxxxxx" required type="tel" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-pass">Password</Label>
                      <Input id="reg-pass" name="password" type="password" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="referral">Referral Code (Optional)</Label>
                      <Input id="referral" name="referral" placeholder="Enter code" />
                    </div>
                    <Button type="submit" className="w-full h-12 text-lg font-heading" disabled={isLoading}>
                      {isLoading ? "Creating Account..." : "Register Account"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              By continuing, you agree to our Terms of Service and Privacy Policy.
              <br/>
              This is a mockup demonstration platform.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
