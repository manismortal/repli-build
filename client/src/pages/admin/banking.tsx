import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Clock, 
  Calendar, 
  History, 
  Save, 
  Plus, 
  Trash2, 
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  RefreshCw
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Textarea } from "@/components/ui/textarea";

export default function AdminBanking() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("schedule");

  // Fetch Schedules
  const { data: schedules, isLoading: scheduleLoading } = useQuery<any[]>({
    queryKey: ["/api/admin/banking/schedules"],
  });

  // Fetch Exceptions
  const { data: exceptions, isLoading: exceptionLoading } = useQuery<any[]>({
    queryKey: ["/api/admin/banking/exceptions"],
  });

  // Fetch Logs
  const { data: logs, isLoading: logsLoading } = useQuery<any[]>({
    queryKey: ["/api/admin/banking/logs"],
  });

  // Fetch Status (for testing)
  const { data: status } = useQuery<any>({
    queryKey: ["/api/status/banking"],
  });

  // Update Schedule Mutation
  const updateScheduleMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string, data: any }) => {
      const res = await apiRequest("PUT", `/api/admin/banking/schedules/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/banking/schedules"] });
      toast({ title: "Success", description: "Schedule updated successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update schedule", variant: "destructive" });
    }
  });

  // Add Exception Mutation
  const addExceptionMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/admin/banking/exceptions", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/banking/exceptions"] });
      toast({ title: "Success", description: "Exception added successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to add exception", variant: "destructive" });
    }
  });

  // Remove Exception Mutation
  const deleteExceptionMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/admin/banking/exceptions/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/banking/exceptions"] });
      toast({ title: "Success", description: "Exception removed successfully" });
    }
  });

  // Exception Form State
  const [newException, setNewException] = useState({
    date: "",
    startTime: "",
    endTime: "",
    isClosed: true,
    reason: ""
  });

  const handleScheduleUpdate = (id: string, field: string, value: any) => {
    updateScheduleMutation.mutate({ id, data: { [field]: value } });
  };

  const dayOrder = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
  const sortedSchedules = schedules?.sort((a, b) => dayOrder.indexOf(a.dayOfWeek) - dayOrder.indexOf(b.dayOfWeek));

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Banking Management</h1>
          <p className="text-muted-foreground mt-1">Control banking hours, exceptions, and availability.</p>
        </div>
        
        {/* Status Badge */}
        <Card className="bg-card/50 border-primary/20">
            <CardContent className="p-3 flex items-center gap-4">
                <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground uppercase font-bold">Current Status</span>
                    <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${status?.isOpen ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                        <span className={`font-bold ${status?.isOpen ? 'text-green-500' : 'text-red-500'}`}>
                            {status?.isOpen ? "OPEN" : "CLOSED"}
                        </span>
                    </div>
                </div>
                {!status?.isOpen && status?.reason && (
                    <div className="text-xs text-muted-foreground border-l pl-3 max-w-[200px]">
                        {status.reason}
                    </div>
                )}
            </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-card p-1 rounded-xl w-full sm:w-auto overflow-x-auto flex-nowrap">
          <TabsTrigger value="schedule" className="rounded-lg gap-2"><Clock className="h-4 w-4" /> Weekly Schedule</TabsTrigger>
          <TabsTrigger value="exceptions" className="rounded-lg gap-2"><Calendar className="h-4 w-4" /> Exceptions & Holidays</TabsTrigger>
          <TabsTrigger value="logs" className="rounded-lg gap-2"><History className="h-4 w-4" /> Audit Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="schedule">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Banking Hours</CardTitle>
              <CardDescription>Define standard operating hours for each day of the week (BST).</CardDescription>
            </CardHeader>
            <CardContent>
              {scheduleLoading ? (
                <div className="flex justify-center p-8"><RefreshCw className="animate-spin h-8 w-8 text-muted-foreground" /></div>
              ) : (
                <div className="rounded-xl border overflow-hidden">
                  <Table>
                    <TableHeader className="bg-secondary/50">
                      <TableRow>
                        <TableHead>Day</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Open Time</TableHead>
                        <TableHead>Close Time</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedSchedules?.map((schedule) => (
                        <TableRow key={schedule.id}>
                          <TableCell className="font-bold capitalize">{schedule.dayOfWeek}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                                <Switch 
                                    checked={!schedule.isClosed} 
                                    onCheckedChange={(checked) => handleScheduleUpdate(schedule.id, 'isClosed', !checked)}
                                />
                                <span className={`text-xs font-medium ${schedule.isClosed ? 'text-red-500' : 'text-green-500'}`}>
                                    {schedule.isClosed ? 'CLOSED' : 'OPEN'}
                                </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Input 
                                type="time" 
                                className="w-32" 
                                value={schedule.startTime} 
                                disabled={schedule.isClosed}
                                onChange={(e) => handleScheduleUpdate(schedule.id, 'startTime', e.target.value)}
                            />
                          </TableCell>
                          <TableCell>
                            <Input 
                                type="time" 
                                className="w-32" 
                                value={schedule.endTime} 
                                disabled={schedule.isClosed}
                                onChange={(e) => handleScheduleUpdate(schedule.id, 'endTime', e.target.value)}
                            />
                          </TableCell>
                          <TableCell className="text-right text-muted-foreground text-xs">
                            Auto-saved
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="exceptions">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Exceptions & Holidays</CardTitle>
                <CardDescription>Override regular schedule for specific dates.</CardDescription>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="gap-2"><Plus className="h-4 w-4" /> Add Exception</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Exception</DialogTitle>
                    <DialogDescription>Set custom hours or close entirely for a specific date.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>Date</Label>
                        <Input 
                            type="date" 
                            value={newException.date}
                            onChange={(e) => setNewException({...newException, date: e.target.value})}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <Label>Full Day Closure?</Label>
                        <Switch 
                            checked={newException.isClosed}
                            onCheckedChange={(c) => setNewException({...newException, isClosed: c})}
                        />
                    </div>
                    {!newException.isClosed && (
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Open Time</Label>
                                <Input 
                                    type="time" 
                                    value={newException.startTime}
                                    onChange={(e) => setNewException({...newException, startTime: e.target.value})}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Close Time</Label>
                                <Input 
                                    type="time" 
                                    value={newException.endTime}
                                    onChange={(e) => setNewException({...newException, endTime: e.target.value})}
                                />
                            </div>
                        </div>
                    )}
                    <div className="space-y-2">
                        <Label>Reason (Optional)</Label>
                        <Input 
                            placeholder="e.g. Eid Holiday" 
                            value={newException.reason}
                            onChange={(e) => setNewException({...newException, reason: e.target.value})}
                        />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={() => addExceptionMutation.mutate(newException)}>Save Exception</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
                {exceptionLoading ? (
                    <div>Loading...</div>
                ) : (
                    <div className="space-y-4">
                        {exceptions?.length === 0 && <div className="text-center text-muted-foreground py-8">No exceptions found.</div>}
                        {exceptions?.map((ex) => (
                            <div key={ex.id} className="flex items-center justify-between p-4 border rounded-xl bg-card/50">
                                <div className="flex items-center gap-4">
                                    <div className={`w-1 h-12 rounded-full ${ex.isClosed ? 'bg-red-500' : 'bg-yellow-500'}`} />
                                    <div>
                                        <h4 className="font-bold">{new Date(ex.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h4>
                                        <p className="text-sm text-muted-foreground">
                                            {ex.isClosed 
                                                ? <span className="text-red-500 font-medium">Closed All Day</span> 
                                                : `Open: ${ex.startTime} - ${ex.endTime}`
                                            }
                                            {ex.reason && <span className="ml-2 text-slate-400">• {ex.reason}</span>}
                                        </p>
                                    </div>
                                </div>
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                                    onClick={() => deleteExceptionMutation.mutate(ex.id)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>Audit Logs</CardTitle>
              <CardDescription>History of changes to banking hours.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="rounded-xl border overflow-hidden max-h-[500px] overflow-y-auto">
                  <Table>
                    <TableHeader className="bg-secondary/50 sticky top-0">
                      <TableRow>
                        <TableHead>Time</TableHead>
                        <TableHead>Admin</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>Details</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                        {logs?.map((log) => (
                            <TableRow key={log.id}>
                                <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                                    {new Date(log.createdAt).toLocaleString()}
                                </TableCell>
                                <TableCell className="font-mono text-xs">{log.adminId.substring(0, 8)}...</TableCell>
                                <TableCell>
                                    <Badge variant="outline">{log.action}</Badge>
                                </TableCell>
                                <TableCell className="text-sm">{log.details}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
