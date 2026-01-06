import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: any;
  trend?: string;
  color?: "blue" | "green" | "purple" | "orange";
}

export function StatsCard({ title, value, icon: Icon, trend, color = "blue" }: StatsCardProps) {
  const colors = {
    blue: "bg-blue-500 shadow-blue-500/20 text-blue-500",
    green: "bg-green-500 shadow-green-500/20 text-green-500",
    purple: "bg-purple-500 shadow-purple-500/20 text-purple-500",
    orange: "bg-orange-500 shadow-orange-500/20 text-orange-500",
  };

  const bgColors = {
    blue: "bg-blue-50 text-blue-700",
    green: "bg-green-50 text-green-700",
    purple: "bg-purple-50 text-purple-700",
    orange: "bg-orange-50 text-orange-700",
  }

  return (
    <Card className="border-none shadow-md hover:shadow-lg transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center", bgColors[color])}>
            <Icon className="h-6 w-6" />
          </div>
          {trend && (
            <span className="text-xs font-bold px-2 py-1 rounded-full bg-green-100 text-green-700">
              {trend}
            </span>
          )}
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
          <h3 className="text-3xl font-bold font-heading mt-1">{value}</h3>
        </div>
      </CardContent>
    </Card>
  );
}
