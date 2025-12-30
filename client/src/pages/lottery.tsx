import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Ticket, Calendar, Trophy, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const LOTTERY_DRAWS = [
  {
    id: 1,
    number: "#LT-2025-001",
    drawDate: "2025-02-15",
    daysLeft: 18,
    ticketsOwned: 5,
    jackpot: 500000,
    winners: { first: 250000, second: 150000, third: 100000 },
    status: "active"
  },
  {
    id: 2,
    number: "#LT-2025-002",
    drawDate: "2025-01-30",
    daysLeft: 2,
    ticketsOwned: 3,
    jackpot: 450000,
    winners: { first: 225000, second: 135000, third: 90000 },
    status: "active"
  },
  {
    id: 3,
    number: "#LT-2025-003",
    drawDate: "2025-01-25",
    daysLeft: 0,
    ticketsOwned: 0,
    jackpot: 500000,
    winners: { first: 250000, second: 150000, third: 100000 },
    status: "completed",
    winner: "Prize not won"
  },
];

export default function Lottery() {
  const { toast } = useToast();
  const [purchasingDraw, setPurchasingDraw] = useState<number | null>(null);

  const handlePurchaseTicket = (drawId: number) => {
    setPurchasingDraw(drawId);
    setTimeout(() => {
      setPurchasingDraw(null);
      toast({ title: "Ticket Purchased!", description: "Your lottery ticket has been added to draw #" + drawId });
    }, 1500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-4xl font-heading font-bold mb-2">Lottery System</h1>
        <p className="text-muted-foreground text-lg">15-day draws with daily winners and massive prizes</p>
      </div>

      {/* How It Works */}
      <Card className="hover-elevate border-dashed">
        <CardHeader>
          <CardTitle className="font-heading text-xl">How Lottery Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex gap-3">
            <Ticket className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Buy Tickets</p>
              <p className="text-muted-foreground">Purchase tickets for ৳500 each</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Calendar className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">15-Day Cycles</p>
              <p className="text-muted-foreground">Each lottery cycle runs for exactly 15 days</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Zap className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Daily Draws</p>
              <p className="text-muted-foreground">Winners drawn daily throughout the cycle</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Trophy className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Final Jackpot</p>
              <p className="text-muted-foreground">Mega jackpot winner announced on day 15</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lottery Draws */}
      <div className="space-y-4">
        {LOTTERY_DRAWS.map((draw) => (
          <Card key={draw.id} className={`hover-elevate ${draw.status === "completed" ? "opacity-75" : ""}`}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="font-heading text-2xl">{draw.number}</CardTitle>
                  <CardDescription>15-day lottery cycle</CardDescription>
                </div>
                <Badge variant={draw.status === "active" ? "default" : "secondary"}>
                  {draw.status === "active" ? "ACTIVE" : "COMPLETED"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Timeline */}
              <div className="bg-secondary/50 p-4 rounded-lg border">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold">Draw Date</p>
                  <p className="text-sm text-muted-foreground">{draw.drawDate}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">Time Remaining</p>
                  {draw.daysLeft > 0 ? (
                    <Badge className="bg-blue-600">{draw.daysLeft} days left</Badge>
                  ) : (
                    <Badge variant="outline">Draw Complete</Badge>
                  )}
                </div>
              </div>

              {/* Prize Breakdown */}
              <div>
                <p className="font-semibold mb-3 text-sm">Prize Distribution</p>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div className="bg-yellow-50 dark:bg-yellow-950/20 p-3 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <p className="text-xs text-muted-foreground mb-1">Jackpot</p>
                    <p className="font-bold font-heading">৳{draw.jackpot.toLocaleString()}</p>
                  </div>
                  <div className="bg-orange-50 dark:bg-orange-950/20 p-3 rounded-lg border border-orange-200 dark:border-orange-800">
                    <p className="text-xs text-muted-foreground mb-1">1st Prize</p>
                    <p className="font-bold font-heading">৳{draw.winners.first.toLocaleString()}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-950/20 p-3 rounded-lg border border-gray-200 dark:border-gray-800">
                    <p className="text-xs text-muted-foreground mb-1">2nd Prize</p>
                    <p className="font-bold font-heading">৳{draw.winners.second.toLocaleString()}</p>
                  </div>
                  <div className="bg-orange-100 dark:bg-orange-950/30 p-3 rounded-lg border border-orange-300 dark:border-orange-700">
                    <p className="text-xs text-muted-foreground mb-1">3rd Prize</p>
                    <p className="font-bold font-heading">৳{draw.winners.third.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Your Tickets */}
              <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg border border-primary/10">
                <div>
                  <p className="text-sm font-semibold">Your Tickets</p>
                  <p className="text-xs text-muted-foreground">{draw.ticketsOwned} tickets owned</p>
                </div>
                <p className="text-2xl font-bold font-heading text-primary">{draw.ticketsOwned}</p>
              </div>

              {/* Action Button */}
              {draw.status === "active" ? (
                <Button 
                  className="w-full h-12 font-heading text-base"
                  onClick={() => handlePurchaseTicket(draw.id)}
                  disabled={purchasingDraw === draw.id}
                >
                  {purchasingDraw === draw.id ? "Processing..." : "BUY TICKET - ৳500"}
                </Button>
              ) : draw.winner ? (
                <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800 text-center">
                  <p className="text-sm font-semibold text-green-700">{draw.winner}</p>
                </div>
              ) : null}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
