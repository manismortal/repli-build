import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminTable } from "@/components/admin/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X, Wallet } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function AdminWithdrawals() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: withdrawals, isLoading } = useQuery({
    queryKey: ["admin-withdrawals"],
    queryFn: async () => {
      const res = await fetch("/api/admin/withdrawals");
      if (!res.ok) throw new Error("Failed to fetch withdrawals");
      return res.json();
    },
  });

  const mutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      await apiRequest("POST", `/api/admin/withdrawals/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-withdrawals"] });
      toast({ title: "Success", description: "Withdrawal status updated" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
    }
  });

  const columns = [
    {
      header: "User",
      accessor: "username",
      className: "font-bold text-slate-700"
    },
    {
      header: "Amount",
      accessor: (w: any) => <span className="font-mono font-bold text-red-600">৳{Number(w.amount).toLocaleString()}</span>
    },
    {
      header: "Wallet ID",
      accessor: (w: any) => (
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Wallet className="h-3 w-3" />
          <span className="font-mono truncate w-24">{w.walletId}</span>
        </div>
      ),
      className: "hidden md:table-cell"
    },
    {
      header: "Status",
      accessor: (w: any) => {
        const colors = {
          pending: "bg-orange-100 text-orange-700",
          approved: "bg-green-100 text-green-700",
          rejected: "bg-red-100 text-red-700"
        };
        return (
          <Badge className={`border-none ${colors[w.status as keyof typeof colors]}`}>
            {w.status.toUpperCase()}
          </Badge>
        );
      }
    },
    {
      header: "Requested",
      accessor: (w: any) => <span className="text-xs text-muted-foreground">{format(new Date(w.requestedAt), "MMM d, HH:mm")}</span>,
      className: "hidden md:table-cell"
    },
    {
      header: "Actions",
      accessor: (w: any) => (
        w.status === 'pending' ? (
          <div className="flex gap-2 justify-end">
            <Button 
              size="icon" 
              className="h-8 w-8 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-md shadow-green-200"
              onClick={() => mutation.mutate({ id: w.id, status: 'approved' })}
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button 
              size="icon" 
              variant="destructive"
              className="h-8 w-8 rounded-full shadow-md shadow-red-200"
              onClick={() => mutation.mutate({ id: w.id, status: 'rejected' })}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : null
      ),
      className: "text-right"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold">Withdrawal Requests</h1>
        <p className="text-muted-foreground">Manage payout approvals and rejections.</p>
      </div>

      <AdminTable 
        title="Pending Payouts" 
        columns={columns} 
        data={withdrawals || []} 
        isLoading={isLoading}
        searchPlaceholder="Search User..."
      />
    </div>
  );
}
