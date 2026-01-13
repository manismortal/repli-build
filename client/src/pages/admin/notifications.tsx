import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Send, Users, User, Zap, Save } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminNotifications() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch settings for Offer Modal
  const { data: settings } = useQuery({
    queryKey: ["admin-settings"],
    queryFn: async () => {
      const res = await fetch("/api/settings");
      if (!res.ok) throw new Error("Failed to fetch settings");
      return res.json();
    },
  });

  const notifyMutation = useMutation({
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

  const settingsMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("PUT", "/api/admin/settings", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-settings"] });
      toast({ title: "Success", description: "Offer settings saved" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to save settings", variant: "destructive" });
    }
  });

  const handleNotifySubmit = (e: React.FormEvent, type: 'all' | 'single') => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());
    
    if (type === 'single' && !data.userId) {
        toast({ title: "Error", description: "User ID is required", variant: "destructive" });
        return;
    }

    notifyMutation.mutate(data);
    (e.target as HTMLFormElement).reset();
  };

  const handleOfferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());
    
    // Explicitly handle switch
    const offerModalActive = (e.target as HTMLFormElement).querySelector('[name="offerModalActive"]') as HTMLInputElement;
    
    settingsMutation.mutate({
        ...data,
        offerModalActive: offerModalActive.checked
    });
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
          <TabsTrigger value="offer" className="rounded-lg gap-2"><Zap className="h-4 w-4" /> Offer Modal</TabsTrigger>
        </TabsList>

        <TabsContent value="broadcast">
          <Card>
            <CardHeader>
              <CardTitle>Broadcast Message</CardTitle>
              <CardDescription>Send a notification to ALL registered users.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => handleNotifySubmit(e, 'all')} className="space-y-4">
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
                  <Button type="submit" className="gap-2 rounded-xl shadow-lg" disabled={notifyMutation.isPending}>
                    <Send className="h-4 w-4" />
                    {notifyMutation.isPending ? "Sending..." : "Send Broadcast"}
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
              <form onSubmit={(e) => handleNotifySubmit(e, 'single')} className="space-y-4">
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
                  <Button type="submit" className="gap-2 rounded-xl shadow-lg" disabled={notifyMutation.isPending}>
                    <Send className="h-4 w-4" />
                    {notifyMutation.isPending ? "Sending..." : "Send Message"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="offer">
          <Card>
            <CardHeader>
              <CardTitle>Offer Modal Configuration</CardTitle>
              <CardDescription>Configure the popup shown to users without active subscriptions.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleOfferSubmit} className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-secondary/20 rounded-xl border">
                  <div className="space-y-0.5">
                    <Label className="text-base">Activate Offer Modal</Label>
                    <p className="text-xs text-muted-foreground">Show to non-subscribed users on session start</p>
                  </div>
                  <Switch 
                    id="offerModalActive" 
                    name="offerModalActive" 
                    defaultChecked={settings?.offerModalActive} 
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="offerModalTitle">Title</Label>
                  <Input 
                    id="offerModalTitle" 
                    name="offerModalTitle" 
                    defaultValue={settings?.offerModalTitle} 
                    className="rounded-xl" 
                    placeholder="Exclusive Offer!"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="offerModalBenefits">Benefits / Content</Label>
                  <Textarea 
                    id="offerModalBenefits" 
                    name="offerModalBenefits" 
                    defaultValue={settings?.offerModalBenefits} 
                    className="rounded-xl min-h-[100px]"
                    placeholder="List the key benefits here..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="offerModalCtaText">CTA Text</Label>
                        <Input 
                            id="offerModalCtaText" 
                            name="offerModalCtaText" 
                            defaultValue={settings?.offerModalCtaText} 
                            className="rounded-xl" 
                            placeholder="Subscribe Now"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="offerModalLink">Action Link</Label>
                        <Input 
                            id="offerModalLink" 
                            name="offerModalLink" 
                            defaultValue={settings?.offerModalLink} 
                            className="rounded-xl" 
                            placeholder="/products"
                        />
                    </div>
                </div>

                <div className="flex justify-end">
                  <Button type="submit" className="gap-2 rounded-xl shadow-lg" disabled={settingsMutation.isPending}>
                    <Save className="h-4 w-4" />
                    {settingsMutation.isPending ? "Saving..." : "Save Configuration"}
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