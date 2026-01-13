import { useQuery } from "@tanstack/react-query";
import { StatsCard } from "@/components/admin/ui/stats-card";
import { Users, ArrowDownLeft, ArrowUpRight, Activity, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { 
  Bar, 
  BarChart, 
  CartesianGrid, 
  XAxis, 
  Area, 
  AreaChart 
} from "recharts";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent,
  type ChartConfig
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function AdminDashboard() {
  const { data: stats, isLoading, refetch } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const res = await fetch("/api/admin/stats");
      if (!res.ok) throw new Error("Failed to fetch stats");
      return res.json();
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const chartData = stats?.chartData || [];

  const financialConfig = {
    deposits: {
      label: "Deposits",
      color: "#22c55e", // green-500
    },
    withdrawals: {
      label: "Withdrawals",
      color: "#f97316", // orange-500
    },
  } satisfies ChartConfig;

  const userConfig = {
    newUsers: {
      label: "New Users",
      color: "#3b82f6", // blue-500
    },
  } satisfies ChartConfig;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold">Dashboard Overview</h1>
          <p className="text-muted-foreground">Real-time platform insights and analytics.</p>
        </div>
        <Button onClick={() => refetch()} variant="outline" size="sm" className="gap-2">
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Total Users" 
          value={stats?.totalUsers || 0} 
          icon={Users} 
          color="blue"
          trend="+5% this week"
        />
        <StatsCard 
          title="Online Users" 
          value={stats?.activeUsers || 0} 
          icon={Activity} 
          color="green"
          trend="Live now"
        />
        <StatsCard 
          title="Total Deposits" 
          value={`৳${stats?.totalDeposits || "0.00"}`} 
          icon={ArrowDownLeft} 
          color="green"
          trend="+12% today"
        />
        <StatsCard 
          title="Total Payouts" 
          value={`৳${stats?.totalPayouts || "0.00"}`} 
          icon={ArrowUpRight} 
          color="orange"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Financial Overview Chart */}
        <Card className="border-none shadow-md">
            <CardHeader>
                <CardTitle className="font-heading text-lg">Financial Overview</CardTitle>
                <CardDescription>Deposits vs Withdrawals (Last 7 Days)</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={financialConfig} className="h-[300px] w-full">
                    <BarChart data={chartData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis 
                            dataKey="date" 
                            tickLine={false} 
                            tickMargin={10} 
                            axisLine={false} 
                            tickFormatter={(value) => value.slice(5)} // Show MM-DD
                            className="text-xs text-muted-foreground"
                        />
                        <ChartTooltip content={<ChartTooltipContent indicator="dashed" />} />
                        <Bar dataKey="deposits" fill="var(--color-deposits)" radius={[4, 4, 0, 0]} barSize={30} />
                        <Bar dataKey="withdrawals" fill="var(--color-withdrawals)" radius={[4, 4, 0, 0]} barSize={30} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>

        {/* User Growth Chart */}
        <Card className="border-none shadow-md">
            <CardHeader>
                <CardTitle className="font-heading text-lg">User Growth</CardTitle>
                <CardDescription>New user registrations (Last 7 Days)</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={userConfig} className="h-[300px] w-full">
                    <AreaChart data={chartData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="fillUsers" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--color-newUsers)" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="var(--color-newUsers)" stopOpacity={0.1}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis 
                            dataKey="date" 
                            tickLine={false} 
                            tickMargin={10} 
                            axisLine={false} 
                            tickFormatter={(value) => value.slice(5)}
                            className="text-xs text-muted-foreground"
                        />
                        <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
                        <Area 
                            type="monotone" 
                            dataKey="newUsers" 
                            stroke="var(--color-newUsers)" 
                            fillOpacity={1} 
                            fill="url(#fillUsers)" 
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
