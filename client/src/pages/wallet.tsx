import { useAuth } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ArrowDownLeft, Plus, Minus } from "lucide-react";

const TRANSACTIONS = [
  { id: 1, type: "credit", amount: 5000, description: "Investment Return", date: "2025-01-28", status: "completed" },
  { id: 2, type: "debit", amount: 2000, description: "Investment Purchase", date: "2025-01-27", status: "completed" },
  { id: 3, type: "credit", amount: 100, description: "Daily Task Bonus", date: "2025-01-27", status: "completed" },
  { id: 4, type: "credit", amount: 450, description: "Referral Commission", date: "2025-01-26", status: "completed" },
  { id: 5, type: "debit", amount: 1500, description: "Withdrawal Request", date: "2025-01-25", status: "pending" },
  { id: 6, type: "credit", amount: 300, description: "Lottery Prize", date: "2025-01-24", status: "completed" },
];

export default function Wallet() {
  const { user } = useAuth();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-4xl font-heading font-bold mb-2">Wallet</h1>
        <p className="text-muted-foreground text-lg">Manage your funds and view transaction history</p>
      </div>

      {/* Balance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover-elevate bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-2">Available Balance</p>
            <p className="text-4xl font-bold font-heading text-primary mb-4">৳{user?.balance.toFixed(2)}</p>
            <Button className="w-full font-heading">
              <Plus className="h-4 w-4 mr-2" />
              Deposit
            </Button>
          </CardContent>
        </Card>

        <Card className="hover-elevate bg-gradient-to-br from-accent/5 to-transparent border-accent/20">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-2">Locked in Investments</p>
            <p className="text-4xl font-bold font-heading text-accent mb-4">৳{user?.lockedBalance.toFixed(2)}</p>
            <Button variant="outline" className="w-full font-heading" disabled>
              <Minus className="h-4 w-4 mr-2" />
              Locked
            </Button>
          </CardContent>
        </Card>

        <Card className="hover-elevate">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-2">Total Worth</p>
            <p className="text-4xl font-bold font-heading mb-4">৳{(user?.balance! + user?.lockedBalance!).toFixed(2)}</p>
            <Button variant="secondary" className="w-full font-heading">
              <ArrowDownLeft className="h-4 w-4 mr-2" />
              Withdraw
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="hover-elevate">
        <CardHeader>
          <CardTitle className="font-heading">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Button variant="outline" className="h-12 flex flex-col items-center gap-1">
            <Plus className="h-5 w-5" />
            <span className="text-xs">Deposit</span>
          </Button>
          <Button variant="outline" className="h-12 flex flex-col items-center gap-1">
            <Minus className="h-5 w-5" />
            <span className="text-xs">Withdraw</span>
          </Button>
          <Button variant="outline" className="h-12 flex flex-col items-center gap-1">
            <ArrowUpRight className="h-5 w-5" />
            <span className="text-xs">Transfer</span>
          </Button>
          <Button variant="outline" className="h-12 flex flex-col items-center gap-1">
            <ArrowDownLeft className="h-5 w-5" />
            <span className="text-xs">Request</span>
          </Button>
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card className="hover-elevate">
        <CardHeader>
          <CardTitle className="font-heading text-2xl">Transaction History</CardTitle>
          <CardDescription>Your recent wallet transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {TRANSACTIONS.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg border hover:bg-secondary/70 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    tx.type === "credit" ? "bg-green-600/10 text-green-600" : "bg-red-600/10 text-red-600"
                  }`}>
                    {tx.type === "credit" ? (
                      <ArrowDownLeft className="h-5 w-5" />
                    ) : (
                      <ArrowUpRight className="h-5 w-5" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{tx.description}</p>
                    <p className="text-xs text-muted-foreground">{tx.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold text-sm ${tx.type === "credit" ? "text-green-600" : "text-red-600"}`}>
                    {tx.type === "credit" ? "+" : "-"}৳{tx.amount.toLocaleString()}
                  </p>
                  <Badge variant={tx.status === "completed" ? "default" : "secondary"} className="text-xs">
                    {tx.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
