import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Send, Users, User } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminNotifications() {
  const { toast } = useToast();
  
  const mutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("POST", "/api/admin/notifications", data);
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Notification sent successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to send notification", variant: "destructive" });
    }
  });

  const handleSubmit = (e: React.FormEvent, type: 'all' | 'single') => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());
    
    // If single, ensure userId is present
    if (type === 'single' && !data.userId) {
        toast({ title: "Error", description: "User ID is required", variant: "destructive" });
        return;
    }

    mutation.mutate(data);
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold">Push Notifications</h1>
        <p className="text-muted-foreground">Send messages to users or broadcast to everyone.</p>
      </div>

      <Tabs defaultValue="broadcast" className="space-y-6">
        <TabsList className="bg-card p-1 rounded-xl">
          <TabsTrigger value="broadcast" className="rounded-lg gap-2"><Users className="h-4 w-4" /> Broadcast</TabsTrigger>
          <TabsTrigger value="single" className="rounded-lg gap-2"><User className="h-4 w-4" /> Single User</TabsTrigger>
        </TabsList>

        <TabsContent value="broadcast">
          <Card>
            <CardHeader>
              <CardTitle>Broadcast Message</CardTitle>
              <CardDescription>Send a notification to ALL registered users.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => handleSubmit(e, 'all')} className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="message">Message Content</Label>
                  <Textarea 
                    id="message" 
                    name="message" 
                    placeholder="Enter your announcement here..." 
                    className="rounded-xl min-h-[150px]"
                    required
                  />
                </div>
                <div className="flex justify-end">
                  <Button type="submit" className="gap-2 rounded-xl shadow-lg" disabled={mutation.isPending}>
                    <Send className="h-4 w-4" />
                    {mutation.isPending ? "Sending..." : "Send Broadcast"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="single">
          <Card>
            <CardHeader>
              <CardTitle>Direct Message</CardTitle>
              <CardDescription>Send a notification to a specific user.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => handleSubmit(e, 'single')} className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="userId">User ID (UUID)</Label>
                  <Input 
                    id="userId" 
                    name="userId" 
                    placeholder="e.g. 550e8400-e29b-41d4-a716-446655440000" 
                    className="rounded-xl"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="message">Message Content</Label>
                  <Textarea 
                    id="message" 
                    name="message" 
                    placeholder="Enter private message..." 
                    className="rounded-xl min-h-[150px]"
                    required
                  />
                </div>
                <div className="flex justify-end">
                  <Button type="submit" className="gap-2 rounded-xl shadow-lg" disabled={mutation.isPending}>
                    <Send className="h-4 w-4" />
                    {mutation.isPending ? "Sending..." : "Send Message"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
