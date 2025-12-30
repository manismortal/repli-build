import { useAuth } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Lock, Wallet, Users } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const chartData = [
  { date: "Day 1", balance: 1200 },
  { date: "Day 2", balance: 1350 },
  { date: "Day 3", balance: 1500 },
  { date: "Day 4", balance: 1480 },
  { date: "Day 5", balance: 1650 },
  { date: "Day 6", balance: 1750 },
];

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Welcome Section */}
      <div>
        <h1 className="text-4xl font-heading font-bold mb-2">Welcome back, {user?.name}</h1>
        <p className="text-muted-foreground text-lg">Your investment dashboard</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover-elevate">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground text-sm font-medium">Balance</span>
              <Wallet className="h-4 w-4 text-primary" />
            </div>
            <p className="text-3xl font-bold font-heading">৳{user?.balance.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground mt-1">Available to invest</p>
          </CardContent>
        </Card>

        <Card className="hover-elevate">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground text-sm font-medium">Locked Balance</span>
              <Lock className="h-4 w-4 text-accent" />
            </div>
            <p className="text-3xl font-bold font-heading">৳{user?.lockedBalance.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground mt-1">In active investments</p>
          </CardContent>
        </Card>

        <Card className="hover-elevate">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground text-sm font-medium">Total Growth</span>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </div>
            <p className="text-3xl font-bold font-heading">৳{(user?.balance! + user?.lockedBalance!).toFixed(2)}</p>
            <p className="text-xs text-green-600 mt-1">+12.5% this month</p>
          </CardContent>
        </Card>

        <Card className="hover-elevate">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground text-sm font-medium">Referral Bonus</span>
              <Users className="h-4 w-4 text-purple-600" />
            </div>
            <p className="text-3xl font-bold font-heading">৳2,450</p>
            <p className="text-xs text-muted-foreground mt-1">From 5 active referrals</p>
          </CardContent>
        </Card>
      </div>

      {/* Account Status */}
      <Card className="hover-elevate">
        <CardHeader>
          <CardTitle className="font-heading text-2xl">Account Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg border">
            <div>
              <p className="font-semibold text-sm">Account Status</p>
              <p className="text-xs text-muted-foreground">Your account is active and verified</p>
            </div>
            <Badge className="bg-green-600 text-white">Active</Badge>
          </div>
          <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg border">
            <div>
              <p className="font-semibold text-sm">Member Since</p>
              <p className="text-xs text-muted-foreground">45 days ago</p>
            </div>
            <Badge variant="outline">VERIFIED</Badge>
          </div>
          <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg border">
            <div>
              <p className="font-semibold text-sm">Referral Code</p>
              <p className="text-xs text-muted-foreground font-mono text-primary">{user?.referralCode}</p>
            </div>
            <Badge variant="secondary">COPY CODE</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Balance Chart */}
      <Card className="hover-elevate">
        <CardHeader>
          <CardTitle className="font-heading text-2xl">Balance Trend</CardTitle>
          <CardDescription>Your account balance over the last 6 days</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
              <Line type="monotone" dataKey="balance" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: "hsl(var(--primary))", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
