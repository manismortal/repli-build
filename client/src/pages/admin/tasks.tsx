import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminTable } from "@/components/admin/ui/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Edit, Trash2, Plus, ExternalLink, Video, Link as LinkIcon } from "lucide-react";

export default function AdminTasks() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);

  const { data: tasks, isLoading } = useQuery({
    queryKey: ["admin-tasks"],
    queryFn: async () => {
      const res = await fetch("/api/admin/tasks");
      if (!res.ok) throw new Error("Failed to fetch tasks");
      return res.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("POST", "/api/admin/tasks", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-tasks"] });
      setIsCreateOpen(false);
      toast({ title: "Success", description: "Task created successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create task", variant: "destructive" });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      await apiRequest("PUT", `/api/admin/tasks/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-tasks"] });
      setEditingTask(null);
      toast({ title: "Success", description: "Task updated successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update task", variant: "destructive" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/admin/tasks/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-tasks"] });
      toast({ title: "Success", description: "Task deleted" });
    },
  });

  const handleToggleActive = (task: any) => {
    updateMutation.mutate({
      id: task.id,
      data: { active: !task.active }
    });
  };

  const columns = [
    {
      header: "Task Title",
      accessor: (task: any) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-800">{task.title}</span>
          <span className="text-xs text-muted-foreground truncate w-48">{task.description}</span>
        </div>
      )
    },
    {
      header: "Link",
      accessor: (task: any) => (
        <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs capitalize">
                    {task.linkType}
                </Badge>
                {task.link && (
                    <a href={task.link} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline flex items-center gap-1 text-xs">
                        Open <ExternalLink className="h-3 w-3" />
                    </a>
                )}
            </div>
        </div>
      )
    },
    {
      header: "Status",
      accessor: (task: any) => (
        <Badge variant={task.active ? "default" : "secondary"}>
            {task.active ? "Active" : "Inactive"}
        </Badge>
      )
    },
    {
      header: "Controls",
      accessor: (task: any) => (
        <div className="flex gap-2 justify-end">
          <Switch 
            checked={task.active}
            onCheckedChange={() => handleToggleActive(task)}
          />
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-8 w-8 text-blue-600 bg-blue-50 hover:bg-blue-100"
            onClick={() => setEditingTask(task)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-8 w-8 text-red-600 bg-red-50 hover:bg-red-100"
            onClick={() => {
              if (confirm("Are you sure?")) deleteMutation.mutate(task.id);
            }}
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
          <h1 className="text-3xl font-heading font-bold">Task Management</h1>
          <p className="text-muted-foreground">Manage daily tasks, links, and subscriptions.</p>
        </div>
        
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 rounded-xl shadow-lg shadow-primary/20">
              <Plus className="h-4 w-4" />
              Create Task
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] rounded-2xl">
            <DialogHeader>
              <DialogTitle className="font-heading text-xl">Create New Task</DialogTitle>
              <DialogDescription>
                Add a new task for users to complete.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              createMutation.mutate({
                title: formData.get('title'),
                description: formData.get('description'),
                link: formData.get('link'),
                linkType: formData.get('linkType'),
                visitDuration: parseInt(formData.get('visitDuration') as string) || 60,
                active: true
              });
            }} className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Task Title</Label>
                <Input id="title" name="title" className="rounded-xl" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="visitDuration">Visit Duration (seconds)</Label>
                <Input id="visitDuration" name="visitDuration" type="number" defaultValue="60" className="rounded-xl" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="linkType">Link Type</Label>
                <Select name="linkType" defaultValue="video">
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="video">Video Ad</SelectItem>
                    <SelectItem value="subscription">Subscription Link</SelectItem>
                    <SelectItem value="external">External Website</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="link">URL (Optional)</Label>
                <Input id="link" name="link" placeholder="https://..." className="rounded-xl" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" className="rounded-xl" />
              </div>
              <DialogFooter>
                <Button type="submit" className="w-full rounded-xl" disabled={createMutation.isPending}>
                  {createMutation.isPending ? "Creating..." : "Create Task"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <AdminTable 
        title="Active Tasks" 
        columns={columns} 
        data={tasks || []} 
        isLoading={isLoading}
        searchPlaceholder="Search tasks..."
      />

      {/* Edit Dialog */}
      <Dialog open={!!editingTask} onOpenChange={(open) => !open && setEditingTask(null)}>
        <DialogContent className="sm:max-w-[425px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl">Edit Task</DialogTitle>
          </DialogHeader>
          {editingTask && (
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              updateMutation.mutate({
                id: editingTask.id,
                data: {
                  title: formData.get('title'),
                  description: formData.get('description'),
                  link: formData.get('link'),
                  linkType: formData.get('linkType'),
                  visitDuration: parseInt(formData.get('visitDuration') as string) || 60,
                }
              });
            }} className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-title">Task Title</Label>
                <Input id="edit-title" name="title" defaultValue={editingTask.title} className="rounded-xl" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-visitDuration">Visit Duration (seconds)</Label>
                <Input id="edit-visitDuration" name="visitDuration" type="number" defaultValue={editingTask.visitDuration} className="rounded-xl" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-linkType">Link Type</Label>
                <Select name="linkType" defaultValue={editingTask.linkType}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="video">Video Ad</SelectItem>
                    <SelectItem value="subscription">Subscription Link</SelectItem>
                    <SelectItem value="external">External Website</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-link">URL (Optional)</Label>
                <Input id="edit-link" name="link" defaultValue={editingTask.link} placeholder="https://..." className="rounded-xl" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea id="edit-description" name="description" defaultValue={editingTask.description} className="rounded-xl" />
              </div>
              <DialogFooter>
                <Button type="submit" className="w-full rounded-xl" disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
