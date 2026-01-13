import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Plus, Smartphone, Trash2, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminAgents() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState<any>(null);
  
  // Form State
  const [newNumber, setNewNumber] = useState("");
  const [selectedProviders, setSelectedProviders] = useState<string[]>(["bkash"]);

  const { data: agents = [], isLoading } = useQuery({
    queryKey: ["/api/admin/agents"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const providers = data.providers;
      const promises = providers.map((p: string) => 
         apiRequest("POST", "/api/admin/agents", {
             number: data.number,
             provider: p,
             isActive: true
         })
      );
      await Promise.all(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/agents"] });
      setIsAddOpen(false);
      setNewNumber("");
      setSelectedProviders(["bkash"]);
      toast({ title: "Agent(s) Added", description: "New agent numbers have been added successfully." });
    },
    onError: (err: any) => {
      // Try to parse error message if available
      const msg = err.message || "Failed to add agent.";
      toast({ title: "Error", description: msg, variant: "destructive" });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("PUT", `/api/admin/agents/${data.id}`, {
        number: data.number,
        provider: data.provider,
        isActive: data.isActive
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/agents"] });
      setEditingAgent(null);
      toast({ title: "Updated", description: "Agent details updated successfully." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update agent.", variant: "destructive" });
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

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/admin/agents/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/agents"] });
      toast({ title: "Deleted", description: "Agent removed." });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedProviders.length === 0) {
        toast({ title: "Error", description: "Select at least one provider", variant: "destructive" });
        return;
    }
    createMutation.mutate({
      number: newNumber,
      providers: selectedProviders,
    });
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAgent) {
        const formData = new FormData(e.currentTarget as HTMLFormElement);
        updateMutation.mutate({
            id: editingAgent.id,
            number: formData.get("number"),
            provider: formData.get("provider"),
            isActive: editingAgent.isActive
        });
    }
  };

  const toggleProvider = (provider: string) => {
      setSelectedProviders(prev => 
        prev.includes(provider) 
        ? prev.filter(p => p !== provider)
        : [...prev, provider]
      );
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
              <div className="space-y-3">
                <Label>Select Providers</Label>
                <div className="flex gap-4">
                    <div className="flex items-center space-x-2">
                        <Checkbox id="bkash" checked={selectedProviders.includes("bkash")} onCheckedChange={() => toggleProvider("bkash")} />
                        <label htmlFor="bkash" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">bKash</label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="nagad" checked={selectedProviders.includes("nagad")} onCheckedChange={() => toggleProvider("nagad")} />
                        <label htmlFor="nagad" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Nagad</label>
                    </div>
                     <div className="flex items-center space-x-2">
                        <Checkbox id="binance" checked={selectedProviders.includes("binance")} onCheckedChange={() => toggleProvider("binance")} />
                        <label htmlFor="binance" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Binance</label>
                    </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Number / Wallet Address</Label>
                <Input 
                  value={newNumber} 
                  onChange={(e) => setNewNumber(e.target.value)} 
                  placeholder="01XXXXXXXXX or Wallet Address"
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={createMutation.isPending}>
                {createMutation.isPending ? "Adding..." : "Add Agent"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={!!editingAgent} onOpenChange={(open) => !open && setEditingAgent(null)}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Agent</DialogTitle>
                </DialogHeader>
                {editingAgent && (
                    <form onSubmit={handleUpdate} className="space-y-4 pt-4">
                        <div className="space-y-2">
                            <Label>Provider</Label>
                            <Select name="provider" defaultValue={editingAgent.provider}>
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
                            <Label>Number / Wallet Address</Label>
                            <Input name="number" defaultValue={editingAgent.number} required />
                        </div>
                        <DialogFooter>
                            <Button type="submit" disabled={updateMutation.isPending}>
                                {updateMutation.isPending ? "Saving..." : "Save Changes"}
                            </Button>
                        </DialogFooter>
                    </form>
                )}
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
                  <TableCell className="flex items-center gap-2">
                    <Switch 
                      checked={agent.isActive}
                      onCheckedChange={(checked) => toggleMutation.mutate({ id: agent.id, isActive: checked })}
                    />
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-blue-600" onClick={() => setEditingAgent(agent)}>
                        <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => deleteMutation.mutate(agent.id)}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {(!agents || (agents as any[]).length === 0) && (
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
