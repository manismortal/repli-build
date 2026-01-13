import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, FileText, Smartphone } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";

export default function AdminReports() {
  
  const { data: agents, isLoading } = useQuery({
    queryKey: ["admin-agents-report"],
    queryFn: async () => {
      const res = await fetch("/api/admin/agents");
      if (!res.ok) throw new Error("Failed to fetch agents");
      return res.json();
    },
  });

  const handleDownload = (provider: string, agentNumber?: string) => {
    let url = `/api/admin/reports/${provider}`;
    if (agentNumber) {
        url += `?number=${encodeURIComponent(agentNumber)}`;
    }
    window.open(url, '_blank');
  };

  // Group agents by provider? Or just list them?
  // Let's just list them in a table for clarity.

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Transaction Reports</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Overall Provider Reports */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-[#e2136e]" />
              All bKash
            </CardTitle>
            <CardDescription>
              Consolidated report for all bKash agents.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
                onClick={() => handleDownload('bkash')} 
                className="w-full bg-[#e2136e] hover:bg-[#c0105d] text-white"
            >
              <Download className="mr-2 h-4 w-4" /> Download All
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-[#ec1c24]" />
              All Nagad
            </CardTitle>
            <CardDescription>
              Consolidated report for all Nagad agents.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
                onClick={() => handleDownload('nagad')}
                className="w-full bg-[#ec1c24] hover:bg-[#c0101b] text-white"
            >
              <Download className="mr-2 h-4 w-4" /> Download All
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-[#FCD535]" />
              All Binance
            </CardTitle>
            <CardDescription>
              Consolidated report for all Crypto wallets.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
                onClick={() => handleDownload('binance')}
                className="w-full bg-[#FCD535] hover:bg-[#e0bd2f] text-slate-900"
            >
              <Download className="mr-2 h-4 w-4" /> Download All
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Agent Specific Reports */}
      <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                Agent Specific Reports
            </CardTitle>
            <CardDescription>Download transaction history for specific agent numbers.</CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Provider</TableHead>
                        <TableHead>Number / Wallet</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? (
                        <TableRow>
                            <TableCell colSpan={4} className="text-center">Loading agents...</TableCell>
                        </TableRow>
                    ) : (agents || []).map((agent: any) => (
                        <TableRow key={agent.id}>
                            <TableCell className="capitalize font-bold">{agent.provider}</TableCell>
                            <TableCell className="font-mono text-xs md:text-sm">{agent.number}</TableCell>
                            <TableCell>
                                <Badge variant={agent.isActive ? "default" : "secondary"}>
                                    {agent.isActive ? "Active" : "Inactive"}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => handleDownload(agent.provider, agent.number)}
                                >
                                    <Download className="h-4 w-4 mr-2" />
                                    CSV
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                    {agents && agents.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={4} className="text-center">No agents found.</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  );
}