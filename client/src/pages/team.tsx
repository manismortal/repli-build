import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, TrendingUp } from "lucide-react";

const TEAM_MEMBERS = [
  { id: 1, name: "Fatima Khan", phone: "01712345678", role: "Regular User", joined: "45 days ago", earnings: 2450 },
  { id: 2, name: "Ahmed Hassan", phone: "01698765432", role: "Regular User", joined: "30 days ago", earnings: 1800 },
  { id: 3, name: "Nadia Islam", phone: "01887654321", role: "Regular User", joined: "15 days ago", earnings: 950 },
  { id: 4, name: "Hassan Ali", phone: "01756789012", role: "Regular User", joined: "8 days ago", earnings: 450 },
  { id: 5, name: "Sophia Rahman", phone: "01923456789", role: "Regular User", joined: "2 days ago", earnings: 100 },
];

const AREA_MANAGERS = [
  { id: 1, name: "Karim Uddin", region: "Dhaka Metropolitan", active: true, commission: "5%" },
  { id: 2, name: "Salma Begum", region: "Chattogram Division", active: true, commission: "5%" },
];

const REGIONAL_MANAGERS = [
  { id: 1, name: "Mohammad Salim", region: "Bangladesh North", active: true, commission: "8%" },
  { id: 2, name: "Rina Dey", region: "Bangladesh South", active: true, commission: "8%" },
];

export default function Team() {
  const totalTeamEarnings = TEAM_MEMBERS.reduce((sum, m) => sum + m.earnings, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-4xl font-heading font-bold mb-2">My Team</h1>
        <p className="text-muted-foreground text-lg">View your network and referral commissions</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover-elevate">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Direct Referrals</p>
                <p className="text-3xl font-bold font-heading">{TEAM_MEMBERS.length}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover-elevate">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Team Earnings</p>
                <p className="text-3xl font-bold font-heading">৳{totalTeamEarnings.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover-elevate">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Your Commission</p>
                <p className="text-3xl font-bold font-heading">৳{(totalTeamEarnings * 0.1).toFixed(0)}</p>
              </div>
              <Badge className="bg-green-600">10% Rate</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Direct Referrals */}
      <Card className="hover-elevate">
        <CardHeader>
          <CardTitle className="font-heading text-2xl">Your Direct Referrals</CardTitle>
          <CardDescription>5 active members in your network</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {TEAM_MEMBERS.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg border">
                <div>
                  <p className="font-semibold text-sm">{member.name}</p>
                  <p className="text-xs text-muted-foreground">{member.phone}</p>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className="mb-1 block">{member.role}</Badge>
                  <p className="text-xs text-muted-foreground">Joined {member.joined}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">৳{member.earnings}</p>
                  <p className="text-xs text-muted-foreground">Earnings</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Area Managers */}
      <Card className="hover-elevate">
        <CardHeader>
          <CardTitle className="font-heading text-2xl">Area Manager Status</CardTitle>
          <CardDescription>Promoted to manage regional teams</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {AREA_MANAGERS.map((manager) => (
              <div key={manager.id} className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold">{manager.name}</p>
                  <Badge className="bg-blue-600">AREA MANAGER</Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs">Region</p>
                    <p className="font-semibold">{manager.region}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Commission Rate</p>
                    <p className="font-semibold">{manager.commission}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Regional Managers */}
      <Card className="hover-elevate">
        <CardHeader>
          <CardTitle className="font-heading text-2xl">Regional Manager Status</CardTitle>
          <CardDescription>Top-level regional leadership</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {REGIONAL_MANAGERS.map((manager) => (
              <div key={manager.id} className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold">{manager.name}</p>
                  <Badge className="bg-purple-600">REGIONAL MANAGER</Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs">Region</p>
                    <p className="font-semibold">{manager.region}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Commission Rate</p>
                    <p className="font-semibold">{manager.commission}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
