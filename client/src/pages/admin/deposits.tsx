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

export default function AdminDeposits() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: deposits, isLoading } = useQuery({
    queryKey: ["admin", "deposits"],
    queryFn: async () => {
      const res = await fetch("/api/admin/deposits");
      if (!res.ok) throw new Error("Failed to fetch deposits");
      return res.json();
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await fetch(`/api/admin/deposits/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "deposits"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
      toast({ title: "Status Updated" });
    },
    onError: () => {
      toast({ title: "Update Failed", variant: "destructive" });
    },
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-heading font-bold">Deposit Requests</h1>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Transaction ID</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Requested</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {deposits?.map((d: any) => (
              <TableRow key={d.id}>
                <TableCell className="font-medium">{d.username}</TableCell>
                <TableCell>৳{Number(d.amount).toLocaleString()}</TableCell>
                <TableCell className="font-mono text-xs">{d.transactionId}</TableCell>
                <TableCell>
                  <Badge variant={d.status === 'approved' ? 'default' : d.status === 'rejected' ? 'destructive' : 'secondary'}>
                    {d.status.toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(d.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  {d.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => updateStatusMutation.mutate({ id: d.id, status: 'approved' })}>
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => updateStatusMutation.mutate({ id: d.id, status: 'rejected' })}>
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
