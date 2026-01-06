import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminTable } from "@/components/admin/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function AdminDeposits() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: deposits, isLoading } = useQuery({
    queryKey: ["admin-deposits"],
    queryFn: async () => {
      const res = await fetch("/api/admin/deposits");
      if (!res.ok) throw new Error("Failed to fetch deposits");
      return res.json();
    },
  });

  const mutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      await apiRequest("POST", `/api/admin/deposits/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-deposits"] });
      toast({ title: "Success", description: "Deposit status updated" });
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
      accessor: (d: any) => <span className="font-mono font-bold text-green-600">৳{Number(d.amount).toLocaleString()}</span>
    },
    {
      header: "TrxID",
      accessor: (d: any) => <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded">{d.transactionId}</span>
    },
    {
      header: "Status",
      accessor: (d: any) => {
        const colors = {
          pending: "bg-yellow-100 text-yellow-700",
          approved: "bg-green-100 text-green-700",
          rejected: "bg-red-100 text-red-700"
        };
        return (
          <Badge className={`border-none ${colors[d.status as keyof typeof colors]}`}>
            {d.status.toUpperCase()}
          </Badge>
        );
      }
    },
    {
      header: "Date",
      accessor: (d: any) => <span className="text-xs text-muted-foreground">{format(new Date(d.createdAt), "MMM d, HH:mm")}</span>,
      className: "hidden md:table-cell"
    },
    {
      header: "Actions",
      accessor: (d: any) => (
        d.status === 'pending' ? (
          <div className="flex gap-2 justify-end">
            <Button 
              size="icon" 
              className="h-8 w-8 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-md shadow-green-200"
              onClick={() => mutation.mutate({ id: d.id, status: 'approved' })}
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button 
              size="icon" 
              variant="destructive"
              className="h-8 w-8 rounded-full shadow-md shadow-red-200"
              onClick={() => mutation.mutate({ id: d.id, status: 'rejected' })}
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
        <h1 className="text-3xl font-heading font-bold">Deposit Requests</h1>
        <p className="text-muted-foreground">Review and process user deposit transactions.</p>
      </div>

      <AdminTable 
        title="Recent Deposits" 
        columns={columns} 
        data={deposits || []} 
        isLoading={isLoading}
        searchPlaceholder="Search TrxID..."
      />
    </div>
  );
}

