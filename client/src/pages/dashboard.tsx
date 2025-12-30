import { useAuth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Wallet, 
  TrendingUp, 
  Users, 
  CheckSquare 
} from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, Tooltip, ResponsiveContainer } from "recharts";

const chartData = [
  { day: "Mon", income: 120 },
  { day: "Tue", income: 150 },
  { day: "Wed", income: 180 },
  { day: "Thu", income: 140 },
  { day: "Fri", income: 200 },
  { day: "Sat", income: 250 },
  { day: "Sun", income: 300 },
];

export default function Dashboard() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user.name}</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Link href="/wallet" className="flex-1 md:flex-none">
            <Button className="w-full md:w-auto gap-2">
              <ArrowUpRight className="h-4 w-4" /> Deposit
            </Button>
          </Link>
          <Link href="/wallet" className="flex-1 md:flex-none">
            <Button variant="outline" className="w-full md:w-auto gap-2">
              <ArrowDownLeft className="h-4 w-4" /> Withdraw
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground border-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-80 uppercase tracking-wider">Total Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-heading">৳ {user.balance.toFixed(2)}</div>
            <div className="text-xs opacity-70 mt-1">Available for withdrawal</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Locked Assets</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-heading">৳ {user.lockedBalance.toFixed(2)}</div>
            <div className="text-xs text-muted-foreground mt-1">Investment maturity in 12 days</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Daily Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-heading">৳ 450.00</div>
            <div className="text-xs text-green-600 mt-1 font-medium">+12% from yesterday</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Team Income</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-heading">৳ 1,250.00</div>
            <div className="text-xs text-muted-foreground mt-1">From 12 active members</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid md:grid-cols-3 gap-8">
        
        {/* Chart Section */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Income Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="day" 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      borderColor: 'hsl(var(--border))',
                      borderRadius: 'var(--radius)' 
                    }}
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="income" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorIncome)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Daily Tasks Shortcut */}
        <Card className="bg-sidebar text-sidebar-foreground relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <CheckSquare className="h-32 w-32" />
          </div>
          <CardHeader>
            <CardTitle className="text-xl">Daily Tasks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 relative z-10">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Progress</span>
                <span>2/5 Completed</span>
              </div>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-accent w-[40%]" />
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm opacity-80">Complete all tasks to unlock today's bonus of ৳50.00</p>
              <Link href="/tasks">
                <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90 border-none font-bold">
                  Continue Tasks
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
