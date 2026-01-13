import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminTable } from "@/components/admin/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit, Trash2, Shield, Plus, KeyRound } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function AdminUsers() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [resetPasswordUser, setResetPasswordUser] = useState<any>(null);
  const [page, setPage] = useState(1);
  const LIMIT = 50;

  const { data, isLoading } = useQuery({
    queryKey: ["admin-users", page],
    queryFn: async () => {
      const res = await fetch(`/api/admin/users?page=${page}&limit=${LIMIT}`);
      if (!res.ok) throw new Error("Failed to fetch users");
      return res.json();
    },
  });

  const users = data?.users || [];
  const totalUsers = data?.total || 0;

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("POST", "/api/admin/users", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      setIsCreateOpen(false);
      toast({ title: "Success", description: "User created successfully" });
    },
    onError: (err: any) => {
      toast({ 
        title: "Error", 
        description: err.message || "Failed to create user", 
        variant: "destructive" 
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (userId: string) => {
      const res = await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast({ title: "User deleted" });
    },
    onError: () => toast({ title: "Failed to delete user", variant: "destructive" })
  });

  const roleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string, role: string }) => {
      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role })
      });
      if (!res.ok) throw new Error("Failed to update role");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast({ title: "Role updated" });
    },
    onError: () => toast({ title: "Failed to update role", variant: "destructive" })
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async ({ userId, password }: { userId: string, password: string }) => {
      const res = await fetch(`/api/admin/users/${userId}/password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
      });
      if (!res.ok) throw new Error("Failed to reset password");
    },
    onSuccess: () => {
      setResetPasswordUser(null);
      toast({ title: "Success", description: "Password reset successfully" });
    },
    onError: () => toast({ title: "Error", description: "Failed to reset password", variant: "destructive" })
  });

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to permanently delete this user?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleRole = (id: string, currentRole: string) => {
    const role = window.prompt("Enter new role (user, admin, area_manager, regional_manager):", currentRole);
    if (role && role !== currentRole) {
      if (['user', 'admin', 'area_manager', 'regional_manager'].includes(role)) {
        roleMutation.mutate({ userId: id, role });
      } else {
        toast({ title: "Invalid role", description: "Must be user, admin, area_manager, or regional_manager", variant: "destructive" });
      }
    }
  };

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
        const colors: Record<string, string> = {
          admin: "bg-purple-100 text-purple-700 hover:bg-purple-200",
          area_manager: "bg-blue-100 text-blue-700 hover:bg-blue-200",
          regional_manager: "bg-indigo-100 text-indigo-700 hover:bg-indigo-200",
          user: "bg-slate-100 text-slate-700 hover:bg-slate-200"
        };
        return (
          <Badge className={`border-none ${colors[user.role] || colors.user}`}>
            {user.role.replace('_', ' ').toUpperCase()}
          </Badge>
        );
      }
    },
    {
      header: "Status",
      accessor: (user: any) => {
        if (user.isBanned) {
            return <Badge variant="destructive">BANNED ({user.banReason || 'Lazy'})</Badge>;
        }
        const isOnline = user.status === 'online';
        // Check if "online" but actually idle/stale (e.g. > 5 mins ago)
        // Ideally backend handles this, but visual cue is nice.
        return (
            <Badge className={isOnline ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}>
                {isOnline ? "ONLINE" : "OFFLINE"}
            </Badge>
        );
      }
    },
    {
      header: "Last Active",
      accessor: (user: any) => {
          if (!user.lastActiveAt) return <span className="text-xs text-muted-foreground">Never</span>;
          try {
            return <span className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(user.lastActiveAt), { addSuffix: true })}</span>;
          } catch (e) {
            return <span className="text-xs text-muted-foreground">Unknown</span>;
          }
      },
      className: "hidden md:table-cell"
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
        <div className="flex gap-2 justify-end">
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-8 w-8 text-orange-600 hover:bg-orange-50"
            onClick={() => setResetPasswordUser(user)}
            title="Reset Password"
          >
            <KeyRound className="h-4 w-4" />
          </Button>
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-8 w-8 text-blue-600 hover:bg-blue-50"
            onClick={() => handleRole(user.id, user.role)}
            title="Edit Role"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-8 w-8 text-red-600 hover:bg-red-50"
            onClick={() => handleDelete(user.id)}
            title="Delete User"
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
          <h1 className="text-3xl font-heading font-bold">User Management</h1>
          <p className="text-muted-foreground">Manage user roles, balances, and permissions.</p>
        </div>
        
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 rounded-xl shadow-lg shadow-primary/20">
              <Plus className="h-4 w-4" />
              Create Admin/Manager
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] rounded-2xl">
            <DialogHeader>
              <DialogTitle className="font-heading text-xl">Create New User</DialogTitle>
              <DialogDescription>
                Manually register a new user or administrator.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              createMutation.mutate({
                username: formData.get('username'),
                password: formData.get('password'),
                name: formData.get('name'),
                role: formData.get('role'),
                email: formData.get('email') || undefined,
                phoneNumber: formData.get('phoneNumber') || undefined,
              });
            }} className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="username">Username (Phone/ID)</Label>
                <Input id="username" name="username" className="rounded-xl" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" className="rounded-xl" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" className="rounded-xl" required />
              </div>
               <div className="grid gap-2">
                <Label htmlFor="role">Role</Label>
                <Select name="role" defaultValue="user">
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="area_manager">Area Manager</SelectItem>
                    <SelectItem value="regional_manager">Regional Manager</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button type="submit" className="w-full rounded-xl" disabled={createMutation.isPending}>
                  {createMutation.isPending ? "Creating..." : "Create User"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Password Reset Dialog */}
        <Dialog open={!!resetPasswordUser} onOpenChange={(open) => !open && setResetPasswordUser(null)}>
          <DialogContent className="sm:max-w-[425px] rounded-2xl">
            <DialogHeader>
              <DialogTitle className="font-heading text-xl">Reset Password</DialogTitle>
              <DialogDescription>
                Set a new password for <strong>{resetPasswordUser?.username}</strong>.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              if (resetPasswordUser) {
                  resetPasswordMutation.mutate({
                    userId: resetPasswordUser.id,
                    password: formData.get('password') as string,
                  });
              }
            }} className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="reset-password">New Password</Label>
                <Input id="reset-password" name="password" type="text" className="rounded-xl" placeholder="Enter new password" required minLength={6} />
              </div>
              <DialogFooter>
                <Button type="submit" className="w-full rounded-xl" disabled={resetPasswordMutation.isPending}>
                  {resetPasswordMutation.isPending ? "Resetting..." : "Reset Password"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <AdminTable 
        title="All Users" 
        columns={columns} 
        data={users} 
        isLoading={isLoading}
        searchPlaceholder="Search by username or phone..."
        manualPagination={true}
        totalItems={totalUsers}
        itemsPerPage={LIMIT}
        currentPage={page}
        onPageChange={setPage}
      />
    </div>
  );
}
