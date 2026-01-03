import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Check, X } from "lucide-react";

export default function AdminWithdrawals() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: withdrawals, isLoading } = useQuery({
    queryKey: ["admin", "withdrawals"],
    queryFn: async () => {
      const res = await fetch("/api/admin/withdrawals");
      if (!res.ok) throw new Error("Failed to fetch withdrawals");
      return res.json();
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await fetch(`/api/admin/withdrawals/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "withdrawals"] });
      toast({ title: "Status Updated" });
    },
    onError: () => {
      toast({ title: "Update Failed", variant: "destructive" });
    },
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-heading font-bold">Withdrawal Requests</h1>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Requested</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {withdrawals?.map((w: any) => (
              <TableRow key={w.id}>
                <TableCell className="font-medium">{w.username}</TableCell>
                <TableCell>৳{Number(w.amount).toLocaleString()}</TableCell>
                <TableCell>
                  <Badge variant={w.status === 'approved' ? 'default' : w.status === 'rejected' ? 'destructive' : 'secondary'}>
                    {w.status.toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(w.requestedAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  {w.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => updateStatusMutation.mutate({ id: w.id, status: 'approved' })}>
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => updateStatusMutation.mutate({ id: w.id, status: 'rejected' })}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
