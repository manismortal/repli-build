import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Save, Bell, Globe, MessageSquare, DollarSign } from "lucide-react";

export default function AdminSettings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ["admin-settings"],
    queryFn: async () => {
      const res = await fetch("/api/settings");
      if (!res.ok) throw new Error("Failed to fetch settings");
      return res.json();
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("PUT", "/api/admin/settings", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-settings"] });
      toast({ title: "Success", description: "Settings updated successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update settings", variant: "destructive" });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Handle checkboxes manually
    const payload = {
        ...data,
        popupActive: (form.elements.namedItem("popupActive") as HTMLInputElement)?.checked,
        isDepositEnabled: (form.elements.namedItem("isDepositEnabled") as HTMLInputElement)?.checked,
        isWithdrawalEnabled: (form.elements.namedItem("isWithdrawalEnabled") as HTMLInputElement)?.checked,
    };

    mutation.mutate(payload);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold">Site Configuration</h1>
        <p className="text-muted-foreground">Manage global settings, contacts, and popups.</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="bg-card p-1 rounded-xl w-full sm:w-auto overflow-x-auto flex-nowrap">
          <TabsTrigger value="general" className="rounded-lg gap-2"><Globe className="h-4 w-4" /> General</TabsTrigger>
          <TabsTrigger value="finance" className="rounded-lg gap-2"><DollarSign className="h-4 w-4" /> Finance</TabsTrigger>
          <TabsTrigger value="popup" className="rounded-lg gap-2"><Bell className="h-4 w-4" /> Popup Notice</TabsTrigger>
          <TabsTrigger value="social" className="rounded-lg gap-2"><MessageSquare className="h-4 w-4" /> Social Links</TabsTrigger>
        </TabsList>

        <form onSubmit={handleSubmit}>
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Platform-wide configurations.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="noticeText">Site Notice (Marquee)</Label>
                  <Textarea 
                    id="noticeText" 
                    name="noticeText" 
                    defaultValue={settings?.noticeText} 
                    className="rounded-xl"
                    placeholder="Enter scrolling notice text..."
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="finance">
            <Card>
              <CardHeader>
                <CardTitle>Financial Settings</CardTitle>
                <CardDescription>Control banking hours and transaction availability.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                
                <div className="space-y-4 border p-4 rounded-xl">
                  <h3 className="font-semibold text-lg">Banking Hours</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="bankingStartTime">Start Time (HH:MM)</Label>
                      <Input 
                        id="bankingStartTime" 
                        name="bankingStartTime" 
                        defaultValue={settings?.bankingStartTime || "09:00"} 
                        className="rounded-xl" 
                        placeholder="09:00"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="bankingEndTime">End Time (HH:MM)</Label>
                      <Input 
                        id="bankingEndTime" 
                        name="bankingEndTime" 
                        defaultValue={settings?.bankingEndTime || "17:00"} 
                        className="rounded-xl" 
                        placeholder="17:00"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">Times are in Bangladesh Standard Time (BST). Mobile banking channels will be closed outside these hours.</p>
                </div>

                <div className="space-y-4 border p-4 rounded-xl">
                  <h3 className="font-semibold text-lg">Transaction Controls</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Enable Deposits</Label>
                      <p className="text-xs text-muted-foreground">Allow users to create new deposit requests.</p>
                    </div>
                    <Switch id="isDepositEnabled" name="isDepositEnabled" defaultChecked={settings?.isDepositEnabled ?? true} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Enable Withdrawals</Label>
                      <p className="text-xs text-muted-foreground">Allow users to request withdrawals.</p>
                    </div>
                    <Switch id="isWithdrawalEnabled" name="isWithdrawalEnabled" defaultChecked={settings?.isWithdrawalEnabled ?? true} />
                  </div>
                </div>

              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="popup">
            <Card>
              <CardHeader>
                <CardTitle>Home Popup</CardTitle>
                <CardDescription>Configure the promotional popup on the dashboard.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-secondary/20 rounded-xl border">
                  <div className="space-y-0.5">
                    <Label className="text-base">Activate Popup</Label>
                    <p className="text-xs text-muted-foreground">Show this popup to users on login</p>
                  </div>
                  <Switch id="popupActive" name="popupActive" defaultChecked={settings?.popupActive} />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="popupTitle">Title</Label>
                  <Input id="popupTitle" name="popupTitle" defaultValue={settings?.popupTitle} className="rounded-xl" />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="popupBody">Body Text</Label>
                  <Textarea id="popupBody" name="popupBody" defaultValue={settings?.popupBody} className="rounded-xl" />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="popupImageUrl">Image URL</Label>
                  <Input id="popupImageUrl" name="popupImageUrl" defaultValue={settings?.popupImageUrl} className="rounded-xl" placeholder="https://..." />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="popupLink">Action Link (Optional)</Label>
                  <Input id="popupLink" name="popupLink" defaultValue={settings?.popupLink} className="rounded-xl" placeholder="/products" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="social">
            <Card>
              <CardHeader>
                <CardTitle>Social Connections</CardTitle>
                <CardDescription>Update support and community links.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="telegramLink">Telegram Group</Label>
                  <Input id="telegramLink" name="telegramLink" defaultValue={settings?.telegramLink} className="rounded-xl" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="whatsappLink">WhatsApp Support</Label>
                  <Input id="whatsappLink" name="whatsappLink" defaultValue={settings?.whatsappLink} className="rounded-xl" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <div className="mt-6 flex justify-end">
            <Button type="submit" className="gap-2 rounded-xl shadow-lg" disabled={mutation.isPending}>
              <Save className="h-4 w-4" />
              {mutation.isPending ? "Saving..." : "Save Configuration"}
            </Button>
          </div>
        </form>
      </Tabs>
    </div>
  );
}
