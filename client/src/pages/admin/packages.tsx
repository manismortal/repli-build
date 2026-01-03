import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Trash2 } from "lucide-react";

export default function AdminPackages() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newPackage, setNewPackage] = useState({ name: "", price: "", description: "" });

  const { data: packages, isLoading } = useQuery({
    queryKey: ["admin", "packages"],
    queryFn: async () => {
      const res = await fetch("/api/admin/packages");
      if (!res.ok) throw new Error("Failed to fetch packages");
      return res.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (pkg: any) => {
      const res = await fetch("/api/admin/packages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pkg),
      });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "packages"] });
      toast({ title: "Package Created" });
      setNewPackage({ name: "", price: "", description: "" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/packages/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "packages"] });
      toast({ title: "Package Deleted" });
    },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-heading font-bold">Package Management</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Create New Package</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input 
              placeholder="Name" 
              value={newPackage.name} 
              onChange={e => setNewPackage({...newPackage, name: e.target.value})} 
            />
            <Input 
              placeholder="Price" 
              type="number"
              value={newPackage.price} 
              onChange={e => setNewPackage({...newPackage, price: e.target.value})} 
            />
            <Input 
              placeholder="Description" 
              value={newPackage.description} 
              onChange={e => setNewPackage({...newPackage, description: e.target.value})} 
            />
            <Button onClick={() => createMutation.mutate(newPackage)}>Create</Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {packages?.map((pkg: any) => (
          <Card key={pkg.id} className="flex justify-between items-center p-4">
            <div>
              <h3 className="font-bold">{pkg.name}</h3>
              <p className="text-sm text-muted-foreground">৳{pkg.price}</p>
              <p className="text-xs">{pkg.description}</p>
            </div>
            <Button variant="destructive" size="icon" onClick={() => deleteMutation.mutate(pkg.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
