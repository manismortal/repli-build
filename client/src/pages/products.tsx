import { useAuth } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, DollarSign, Clock, Users, Zap, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PACKAGES = [
  {
    id: 1,
    name: "Standard Package",
    price: 250,
    dailyBonus: 50,
    maturity: 15,
    totalDays: 60,
    maxProfitX: 12,
    seatsTotal: 2000,
    seatsFilled: 1450,
    type: "normal"
  },
  {
    id: 2,
    name: "Classic Package",
    price: 500,
    dailyBonus: 100,
    maturity: 15,
    totalDays: 60,
    maxProfitX: 12,
    seatsTotal: 2000,
    seatsFilled: 890,
    type: "normal"
  },
  {
    id: 3,
    name: "Silver Package",
    price: 1500,
    dailyBonus: 300,
    maturity: 15,
    totalDays: 60,
    maxProfitX: 12,
    seatsTotal: 2000,
    seatsFilled: 320,
    type: "normal"
  },
  {
    id: 4,
    name: "Gold Package",
    price: 2000,
    dailyBonus: 400,
    maturity: 15,
    totalDays: 60,
    maxProfitX: 12,
    seatsTotal: 2000,
    seatsFilled: 150,
    type: "normal"
  },
  {
    id: 5,
    name: "Platinum Maersk",
    price: 5000,
    dailyBonus: 1000,
    maturity: 15,
    totalDays: 60,
    maxProfitX: 12,
    seatsTotal: 500,
    seatsFilled: 45,
    type: "premium"
  },
];

export default function Products() {
  const { user, updateBalance } = useAuth();
  const { toast } = useToast();
  const availableSeats = (pkg: any) => pkg.seatsTotal - pkg.seatsFilled;

  const handleInvest = (pkg: any) => {
    if (!user) return;
    if (user.balance < pkg.price) {
      toast({ 
        title: "Insufficient Balance", 
        description: `You need ৳${pkg.price} to invest in this package.`,
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, this would be a server call
    updateBalance(-pkg.price);
    toast({ 
      title: "Investment Successful", 
      description: `You have successfully invested in ${pkg.name}.` 
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div>
        <h1 className="text-4xl font-heading font-bold mb-2">Investment Hub</h1>
        <p className="text-muted-foreground text-lg">Select a package to start your 60-day profit journey</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {PACKAGES.map((pkg) => (
          <Card key={pkg.id} className={`hover-elevate flex flex-col relative overflow-hidden group ${pkg.type === 'premium' ? 'border-primary shadow-lg shadow-primary/10' : ''}`}>
            {pkg.type === 'premium' && (
              <div className="absolute top-0 right-0 p-3">
                <Badge className="bg-primary animate-pulse">PREMIUM</Badge>
              </div>
            )}
            
            <CardHeader>
              <div className="flex items-start justify-between mb-2">
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${pkg.type === 'premium' ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'}`}>
                  {pkg.type === 'premium' ? <Zap className="h-7 w-7" /> : <Package className="h-7 w-7" />}
                </div>
              </div>
              <CardTitle className="font-heading text-2xl tracking-tight">{pkg.name}</CardTitle>
              <CardDescription className="text-base font-semibold text-primary">৳{pkg.price.toLocaleString()}</CardDescription>
            </CardHeader>

            <CardContent className="flex-1 space-y-5">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-secondary/50 p-3 rounded-xl border border-border/50">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Daily Bonus</p>
                  <p className="text-lg font-bold font-heading">৳{pkg.dailyBonus}</p>
                </div>
                <div className="bg-secondary/50 p-3 rounded-xl border border-border/50">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Maturity</p>
                  <p className="text-lg font-bold font-heading">{pkg.maturity} Days</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    Total Duration
                  </span>
                  <span className="font-bold">{pkg.totalDays} Days</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <TrendingUpIcon className="h-4 w-4 text-green-600" />
                    Max Profit
                  </span>
                  <span className="font-bold text-green-600">x{pkg.maxProfitX} (৳{pkg.price * pkg.maxProfitX})</span>
                </div>
              </div>

              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold uppercase tracking-tighter flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5" />
                    Seats Remaining
                  </p>
                  <span className="text-xs font-bold">{availableSeats(pkg)} / {pkg.seatsTotal}</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-1.5 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${pkg.type === 'premium' ? 'bg-primary' : 'bg-primary/60'}`} 
                    style={{ width: `${(pkg.seatsFilled / pkg.seatsTotal) * 100}%` }}
                  />
                </div>
              </div>

              {/* Running Counter Mockup (for active packages) */}
              <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary animate-spin-slow" />
                  <span className="text-xs font-medium uppercase">Active Cycle</span>
                </div>
                <span className="text-xs font-bold font-mono">00d : 00h : 00m</span>
              </div>

              <Button 
                onClick={() => handleInvest(pkg)}
                className={`w-full font-heading h-12 text-lg mt-2 ${pkg.type === 'premium' ? 'shadow-lg shadow-primary/20' : ''}`}
                disabled={availableSeats(pkg) <= 0 || !user}
              >
                INVEST NOW
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function TrendingUpIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  );
}
