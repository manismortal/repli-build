import { useAuth } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, TrendingUp, Trophy, Award, Landmark } from "lucide-react";

const TEAM_MEMBERS = [
  { id: 1, name: "Fatima Khan", phone: "01712345678", role: "Regular User", joined: "45 days ago", earnings: 2450 },
  { id: 2, name: "Ahmed Hassan", phone: "01698765432", role: "Regular User", joined: "30 days ago", earnings: 1800 },
  { id: 3, name: "Nadia Islam", phone: "01887654321", role: "Regular User", joined: "15 days ago", earnings: 950 },
  { id: 4, name: "Hassan Ali", phone: "01756789012", role: "Regular User", joined: "8 days ago", earnings: 450 },
  { id: 5, name: "Sophia Rahman", phone: "01923456789", role: "Regular User", joined: "2 days ago", earnings: 100 },
];

export default function Team() {
  const referralCount = 12; // Mocking the requirement of 12 people
  const totalTeamEarnings = TEAM_MEMBERS.reduce((sum, m) => sum + m.earnings, 0);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div>
        <h1 className="text-4xl font-heading font-bold mb-2">Network</h1>
        <p className="text-muted-foreground text-lg">Manage your referrals and grow your career</p>
      </div>

      {/* Referral Requirements */}
      <Card className="border-primary bg-primary/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-heading flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Withdrawal Eligibility
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-3 bg-card rounded-lg border mb-4">
            <span className="text-sm font-medium">Referrals Required (5 Levels)</span>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold">{referralCount}/12</span>
              {referralCount >= 12 ? <Badge className="bg-green-600">QUALIFIED</Badge> : <Badge variant="outline">PENDING</Badge>}
            </div>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            * Refer 12 people across 5 levels to unlock x12 Profit and ৳250 Welcome Bonus.
          </p>
        </CardContent>
      </Card>

      {/* Career Milestones */}
      <div className="grid grid-cols-1 gap-4">
        <Card className="hover-elevate border-l-4 border-l-blue-600">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl font-heading text-blue-600">Area Manager</CardTitle>
                <CardDescription>Target: 50 Referrals</CardDescription>
              </div>
              <Landmark className="h-8 w-8 text-blue-600 opacity-20" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold">Monthly Salary</span>
                <span className="text-2xl font-bold font-heading text-blue-600">৳200,000</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-elevate border-l-4 border-l-purple-600">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl font-heading text-purple-600">Regional Manager</CardTitle>
                <CardDescription>Target: 100 Referrals</CardDescription>
              </div>
              <Trophy className="h-8 w-8 text-purple-600 opacity-20" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold">Monthly Salary</span>
                <span className="text-2xl font-bold font-heading text-purple-600">৳500,000</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="hover-elevate">
          <CardContent className="pt-6">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Direct Team</p>
            <p className="text-3xl font-bold font-heading">{TEAM_MEMBERS.length}</p>
          </CardContent>
        </Card>
        <Card className="hover-elevate">
          <CardContent className="pt-6">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Total Comms</p>
            <p className="text-3xl font-bold font-heading">৳{totalTeamEarnings.toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      {/* Team List */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading">Direct Team Members</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {TEAM_MEMBERS.map((member) => (
            <div key={member.id} className="flex items-center justify-between p-4 bg-secondary/30 rounded-xl border border-border/50">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                  {member.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-sm">{member.name}</p>
                  <p className="text-[10px] text-muted-foreground font-mono">{member.phone}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-xs text-primary">+৳{member.earnings}</p>
                <p className="text-[10px] text-muted-foreground">{member.joined}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
