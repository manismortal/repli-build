import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Video, CheckCircle2, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const TASKS = [
  { id: 1, title: "Watch Shipping Documentary", duration: 2, reward: 100 },
  { id: 2, title: "View Logistics Tutorial", duration: 3, reward: 150 },
  { id: 3, title: "Learn Port Operations", duration: 2, reward: 100 },
  { id: 4, title: "Container Management Guide", duration: 4, reward: 200 },
  { id: 5, title: "Maritime Safety Training", duration: 3, reward: 150 },
];

export default function DailyTasks() {
  const { user, updateBalance } = useAuth();
  const [completedTasks, setCompletedTasks] = useState<number[]>([]);
  const [watchingTask, setWatchingTask] = useState<number | null>(null);
  const { toast } = useToast();

  const handleWatchAd = (taskId: number) => {
    if (completedTasks.includes(taskId)) {
      toast({ title: "Already Completed", description: "You've already completed this task today." });
      return;
    }
    
    setWatchingTask(taskId);
    const task = TASKS.find(t => t.id === taskId);
    
    // Simulate ad watching (shorter for demo)
    setTimeout(() => {
      setWatchingTask(null);
      setCompletedTasks([...completedTasks, taskId]);
      updateBalance(task?.reward || 0);
      toast({ title: "Task Completed!", description: `Earned ৳${task?.reward || 0}` });
    }, 2000);
  };

  const completedCount = completedTasks.length;
  const totalReward = TASKS.filter(t => completedTasks.includes(t.id)).reduce((sum, t) => sum + t.reward, 0);
  const progressPercent = (completedCount / TASKS.length) * 100;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-4xl font-heading font-bold mb-2">Daily Ad Tasks</h1>
        <p className="text-muted-foreground text-lg">Complete 5 sequential tasks to earn daily bonuses</p>
      </div>

      {/* Progress Summary */}
      <Card className="hover-elevate bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/10">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Daily Progress</p>
                <p className="text-3xl font-bold font-heading">{completedCount}/5 Tasks</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground mb-1">Earnings Today</p>
                <p className="text-3xl font-bold font-heading text-primary">৳{totalReward}</p>
              </div>
            </div>
            <Progress value={progressPercent} className="h-2" />
            {completedCount === 5 && (
              <div className="bg-green-600/10 border border-green-600/30 rounded-lg p-3">
                <p className="text-sm font-semibold text-green-700">🎉 All tasks completed! Check back tomorrow.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tasks Grid */}
      <div className="grid gap-4">
        {TASKS.map((task, index) => {
          const isCompleted = completedTasks.includes(task.id);
          const isLocked = completedCount < index;
          const isWatching = watchingTask === task.id;

          return (
            <Card key={task.id} className={`hover-elevate transition-all ${isLocked ? "opacity-50" : ""}`}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className={`h-12 w-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    isCompleted ? "bg-green-600/10 text-green-600" : 
                    isLocked ? "bg-muted text-muted-foreground" :
                    "bg-primary/10 text-primary"
                  }`}>
                    {isCompleted ? (
                      <CheckCircle2 className="h-6 w-6" />
                    ) : (
                      <Video className="h-6 w-6" />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold">{task.title}</p>
                      {isCompleted && <Badge className="bg-green-600">COMPLETED</Badge>}
                      {isLocked && <Badge variant="outline">LOCKED</Badge>}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {task.duration} min
                      </span>
                      <span className="text-primary font-semibold">Earn ৳{task.reward}</span>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleWatchAd(task.id)}
                    disabled={isLocked || isCompleted || isWatching || completedCount >= 5}
                    className="font-heading h-11 flex-shrink-0"
                  >
                    {isCompleted ? "✓ Done" : isWatching ? "Watching..." : "Watch Ad"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Info Box */}
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="font-heading text-lg">How It Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>✓ Watch 2-4 minute short videos about shipping and logistics</p>
          <p>✓ Complete tasks in order - each unlocks the next</p>
          <p>✓ Earn instant bonuses added to your balance</p>
          <p>✓ Task rewards reset daily at midnight</p>
        </CardContent>
      </Card>
    </div>
  );
}
