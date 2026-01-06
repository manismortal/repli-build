import { useQuery } from "@tanstack/react-query";
import { StatsCard } from "@/components/admin/ui/stats-card";
import { Users, ArrowDownLeft, ArrowUpRight, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

export default function AdminDashboard() {
  const { data: stats, isLoading, refetch } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const res = await fetch("/api/admin/stats");
      if (!res.ok) throw new Error("Failed to fetch stats");
      return res.json();
    },
  });

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
        <StatsCard 
          title="Active Packages" 
          value={stats?.activePackages || 0} 
          icon={Package} 
          color="purple"
        />
      </div>

      {/* TODO: Add Charts Section Here */}
    </div>
  );
}
