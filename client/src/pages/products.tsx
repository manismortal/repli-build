import { useAuth } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, DollarSign, Clock, Users } from "lucide-react";

const PRODUCTS = [
  {
    id: 1,
    name: "Premium Container Investment",
    description: "Invest in containerized logistics with guaranteed 15-day returns",
    roi: 45,
    maturity: "15 Days",
    minInvestment: 5000,
    maxInvestment: 100000,
    seatsTotal: 50,
    seatsFilled: 42,
    status: "active"
  },
  {
    id: 2,
    name: "Port Authority Growth Fund",
    description: "Port infrastructure investment with steady returns",
    roi: 38,
    maturity: "15 Days",
    minInvestment: 10000,
    maxInvestment: 250000,
    seatsTotal: 100,
    seatsFilled: 95,
    status: "active"
  },
  {
    id: 3,
    name: "Shipping Fleet Partnership",
    description: "Share vessel operating costs and earn from freight revenues",
    roi: 52,
    maturity: "15 Days",
    minInvestment: 50000,
    maxInvestment: 500000,
    seatsTotal: 30,
    seatsFilled: 15,
    status: "active"
  },
  {
    id: 4,
    name: "Maritime Terminal Lease",
    description: "Terminal operation rights and docking fees",
    roi: 42,
    maturity: "15 Days",
    minInvestment: 20000,
    maxInvestment: 300000,
    seatsTotal: 40,
    seatsFilled: 40,
    status: "closed"
  },
];

export default function Products() {
  const { user } = useAuth();
  const availableSeats = (product: any) => product.seatsTotal - product.seatsFilled;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-4xl font-heading font-bold mb-2">Investment Plans</h1>
        <p className="text-muted-foreground text-lg">Explore our premium shipping and logistics investment opportunities</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {PRODUCTS.map((product) => (
          <Card key={product.id} className={`hover-elevate flex flex-col ${product.status === "closed" ? "opacity-60" : ""}`}>
            <CardHeader>
              <div className="flex items-start justify-between mb-2">
                <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                  <Package className="h-6 w-6" />
                </div>
                <Badge variant={product.status === "active" ? "default" : "secondary"}>
                  {product.status === "active" ? "ACTIVE" : "CLOSED"}
                </Badge>
              </div>
              <CardTitle className="font-heading text-xl">{product.name}</CardTitle>
              <CardDescription>{product.description}</CardDescription>
            </CardHeader>

            <CardContent className="flex-1 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-secondary/50 p-3 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Expected ROI</p>
                  <p className="text-2xl font-bold font-heading text-primary">{product.roi}%</p>
                </div>
                <div className="bg-secondary/50 p-3 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Maturity
                  </p>
                  <p className="text-lg font-bold font-heading">{product.maturity}</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-2">Investment Range</p>
                <p className="text-sm font-mono">
                  ৳{product.minInvestment.toLocaleString()} - ৳{product.maxInvestment.toLocaleString()}
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    Available Seats
                  </p>
                  <span className="text-sm font-semibold">{availableSeats(product)}/{product.seatsTotal}</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all" 
                    style={{ width: `${(product.seatsFilled / product.seatsTotal) * 100}%` }}
                  />
                </div>
              </div>

              <Button 
                className="w-full font-heading h-11 text-base mt-4"
                disabled={product.status === "closed" || !user || user.balance < product.minInvestment}
              >
                {product.status === "closed" ? "SOLD OUT" : "INVEST NOW"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
