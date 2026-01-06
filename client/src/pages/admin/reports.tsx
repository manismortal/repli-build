import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";

export default function AdminReports() {
  
  const handleDownload = (provider: string) => {
    window.open(`/api/admin/reports/${provider}`, '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Transaction Reports</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* bKash Report */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-[#e2136e]" />
              bKash Reports
            </CardTitle>
            <CardDescription>
              Export all bKash deposit logs, including sender numbers and agent used.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
                onClick={() => handleDownload('bkash')} 
                className="w-full bg-[#e2136e] hover:bg-[#c0105d] text-white"
            >
              <Download className="mr-2 h-4 w-4" /> Download CSV
            </Button>
          </CardContent>
        </Card>

        {/* Nagad Report */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-[#ec1c24]" />
              Nagad Reports
            </CardTitle>
            <CardDescription>
              Export all Nagad deposit logs, including sender numbers and agent used.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
                onClick={() => handleDownload('nagad')}
                className="w-full bg-[#ec1c24] hover:bg-[#c0101b] text-white"
            >
              <Download className="mr-2 h-4 w-4" /> Download CSV
            </Button>
          </CardContent>
        </Card>

        {/* Binance Report */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-[#FCD535]" />
              Binance Reports
            </CardTitle>
            <CardDescription>
              Export all Crypto/Binance logs with TxID and Wallet Addresses.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
                onClick={() => handleDownload('binance')}
                className="w-full bg-[#FCD535] hover:bg-[#e0bd2f] text-slate-900"
            >
              <Download className="mr-2 h-4 w-4" /> Download CSV
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
