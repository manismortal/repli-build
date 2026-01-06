import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminTable } from "@/components/admin/ui/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Edit, Trash2, Plus, Lock, EyeOff, TrendingUp } from "lucide-react";

export default function AdminPackages() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const { data: packages, isLoading } = useQuery({
    queryKey: ["admin-packages"],
    queryFn: async () => {
      const res = await fetch("/api/admin/packages");
      if (!res.ok) throw new Error("Failed to fetch packages");
      return res.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("POST", "/api/admin/packages", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-packages"] });
      setIsCreateOpen(false);
      toast({ title: "Success", description: "Package created successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create package", variant: "destructive" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/admin/packages/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-packages"] });
      toast({ title: "Success", description: "Package deleted" });
    },
  });

  const columns = [
    {
      header: "Package Name",
      accessor: (pkg: any) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-800">{pkg.name}</span>
          <span className="text-xs text-muted-foreground truncate w-48">{pkg.description}</span>
        </div>
      )
    },
    {
      header: "Price",
      accessor: (pkg: any) => <span className="font-mono font-bold text-primary">৳{Number(pkg.price).toLocaleString()}</span>
    },
    {
      header: "Controls",
      accessor: (pkg: any) => (
        <div className="flex gap-2">
          <Button size="icon" variant="ghost" className="h-8 w-8 text-blue-600 bg-blue-50 hover:bg-blue-100">
            <Edit className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" className="h-8 w-8 text-orange-600 bg-orange-50 hover:bg-orange-100" title="Adjust Profit">
            <TrendingUp className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-600 bg-slate-50 hover:bg-slate-100" title="Lock/Hide">
            <EyeOff className="h-4 w-4" />
          </Button>
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-8 w-8 text-red-600 bg-red-50 hover:bg-red-100"
            onClick={() => deleteMutation.mutate(pkg.id)}
          >
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
          <h1 className="text-3xl font-heading font-bold">Package Management</h1>
          <p className="text-muted-foreground">Create, modify, and control investment packages.</p>
        </div>
        
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 rounded-xl shadow-lg shadow-primary/20">
              <Plus className="h-4 w-4" />
              Create Package
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] rounded-2xl">
            <DialogHeader>
              <DialogTitle className="font-heading text-xl">Create New Package</DialogTitle>
              <DialogDescription>
                Add a new investment tier to the platform.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              createMutation.mutate({
                name: formData.get('name'),
                price: formData.get('price'),
                description: formData.get('description'),
              });
            }} className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Package Name</Label>
                <Input id="name" name="name" className="rounded-xl" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price">Price (BDT)</Label>
                <Input id="price" name="price" type="number" className="rounded-xl" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" className="rounded-xl" />
              </div>
              <DialogFooter>
                <Button type="submit" className="w-full rounded-xl" disabled={createMutation.isPending}>
                  {createMutation.isPending ? "Creating..." : "Create Package"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <AdminTable 
        title="Active Packages" 
        columns={columns} 
        data={packages || []} 
        isLoading={isLoading}
        searchPlaceholder="Search packages..."
      />
    </div>
  );
}
