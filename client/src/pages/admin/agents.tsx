import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Plus, Smartphone, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminAgents() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isAddOpen, setIsAddOpen] = useState(false);
  
  // Form State
  const [newNumber, setNewNumber] = useState("");
  const [newProvider, setNewProvider] = useState("bkash");

  const { data: agents, isLoading } = useQuery({
    queryKey: ["/api/admin/agents"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/admin/agents", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/agents"] });
      setIsAddOpen(false);
      setNewNumber("");
      toast({ title: "Agent Added", description: "New agent number has been added successfully." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to add agent.", variant: "destructive" });
    }
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string, isActive: boolean }) => {
      const res = await apiRequest("PATCH", `/api/admin/agents/${id}`, { isActive });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/agents"] });
      toast({ title: "Updated", description: "Agent status updated." });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      number: newNumber,
      provider: newProvider,
      isActive: true
    });
  };

  if (isLoading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin h-8 w-8" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Agent Management</h1>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground">
              <Plus className="mr-2 h-4 w-4" /> Add Agent
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Agent Number</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Provider</label>
                <Select value={newProvider} onValueChange={setNewProvider}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bkash">bKash</SelectItem>
                    <SelectItem value="nagad">Nagad</SelectItem>
                    <SelectItem value="binance">Binance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Number / Wallet Address</label>
                <Input 
                  value={newNumber} 
                  onChange={(e) => setNewNumber(e.target.value)} 
                  placeholder={newProvider === 'binance' ? "Wallet Address" : "01XXXXXXXXX"}
                />
              </div>
              <Button type="submit" className="w-full" disabled={createMutation.isPending}>
                {createMutation.isPending ? "Adding..." : "Add Agent"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {['bkash', 'nagad', 'binance'].map(provider => (
           <Card key={provider}>
             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
               <CardTitle className="text-sm font-medium capitalize">{provider} Agents</CardTitle>
               <Smartphone className="h-4 w-4 text-muted-foreground" />
             </CardHeader>
             <CardContent>
               <div className="text-2xl font-bold">
                 {(agents as any[])?.filter((a: any) => a.provider === provider && a.isActive).length || 0}
                 <span className="text-sm text-muted-foreground font-normal ml-2">Active</span>
               </div>
             </CardContent>
           </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Agents</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Provider</TableHead>
                <TableHead>Number / Address</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(agents as any[])?.map((agent: any) => (
                <TableRow key={agent.id}>
                  <TableCell className="capitalize font-medium">{agent.provider}</TableCell>
                  <TableCell className="font-mono">{agent.number}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${agent.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {agent.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </TableCell>
                  <TableCell>{new Date(agent.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Switch 
                      checked={agent.isActive}
                      onCheckedChange={(checked) => toggleMutation.mutate({ id: agent.id, isActive: checked })}
                    />
                  </TableCell>
                </TableRow>
              ))}
              {(!agents || agents.length === 0) && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                    No agents found. Add one to get started.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
