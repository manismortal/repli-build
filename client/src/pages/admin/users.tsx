import { useQuery } from "@tanstack/react-query";
import { AdminTable } from "@/components/admin/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Shield } from "lucide-react";
import { format } from "date-fns";

export default function AdminUsers() {
  const { data: users, isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const res = await fetch("/api/admin/users");
      if (!res.ok) throw new Error("Failed to fetch users");
      return res.json();
    },
  });

  const columns = [
    {
      header: "User",
      accessor: (user: any) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-800">{user.username}</span>
          <span className="text-xs text-muted-foreground">{user.name || "No Name"}</span>
        </div>
      )
    },
    {
      header: "Role",
      accessor: (user: any) => {
        const colors = {
          admin: "bg-purple-100 text-purple-700 hover:bg-purple-200",
          area_manager: "bg-blue-100 text-blue-700 hover:bg-blue-200",
          regional_manager: "bg-indigo-100 text-indigo-700 hover:bg-indigo-200",
          user: "bg-slate-100 text-slate-700 hover:bg-slate-200"
        };
        return (
          <Badge className={`border-none ${colors[user.role as keyof typeof colors] || colors.user}`}>
            {user.role.replace('_', ' ').toUpperCase()}
          </Badge>
        );
      }
    },
    {
      header: "Wallet",
      accessor: (user: any) => (
        <div className="font-mono font-bold text-slate-700">
          ৳{Number(user.balance || 0).toLocaleString()}
        </div>
      )
    },
    {
      header: "Joined",
      accessor: (user: any) => (
        <span className="text-xs text-muted-foreground font-medium">
          {format(new Date(user.createdAt), "MMM d, yyyy")}
        </span>
      ),
      className: "hidden md:table-cell"
    },
    {
      header: "Actions",
      accessor: (user: any) => (
        <div className="flex gap-2">
          <Button size="icon" variant="ghost" className="h-8 w-8 text-blue-600 hover:bg-blue-50">
            <Edit className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" className="h-8 w-8 text-red-600 hover:bg-red-50">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
      className: "text-right"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-heading font-bold">User Management</h1>
          <p className="text-muted-foreground">Manage user roles, balances, and permissions.</p>
        </div>
        <Button className="gap-2 rounded-xl shadow-lg shadow-primary/20">
          <Shield className="h-4 w-4" />
          Create Admin/Manager
        </Button>
      </div>

      <AdminTable 
        title="All Users" 
        columns={columns} 
        data={users || []} 
        isLoading={isLoading}
        searchPlaceholder="Search by username or phone..."
      />
    </div>
  );
}
