import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Video, CheckCircle2, Clock, PlayCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const TASKS = [
  { id: 1, title: "Container Operations", titleBn: "কন্টেইনার অপারেশনস", reward: 50 },
  { id: 2, title: "Logistics Flow", titleBn: "লজিস্টিক ফ্লো", reward: 50 },
  { id: 3, title: "Port Terminal View", titleBn: "পোর্ট টার্মিনাল ভিউ", reward: 50 },
  { id: 4, title: "Shipping Route Info", titleBn: "শিপিং রুট ইনফো", reward: 50 },
  { id: 5, title: "Maersk Fleet Highlight", titleBn: "মেয়ার্স্ক ফ্লিট হাইলাইট", reward: 50 },
];

export default function DailyTasks() {
  const { user, updateBalance, language } = useAuth();
  const [completedTasks, setCompletedTasks] = useState<number[]>([]);
  const [watchingTask, setWatchingTask] = useState<number | null>(null);
  const { toast } = useToast();

  const handleWatchAd = (taskId: number) => {
    if (completedTasks.includes(taskId)) return;
    
    setWatchingTask(taskId);
    setTimeout(() => {
      setWatchingTask(null);
      setCompletedTasks([...completedTasks, taskId]);
      updateBalance(50);
      toast({ 
        title: language === "bn" ? "বিজ্ঞাপন সম্পন্ন" : "Ad Complete", 
        description: language === "bn" ? "আপনার ব্যালেন্সে ৳৫০ যোগ হয়েছে।" : "৳50 added to your balance." 
      });
    }, 3000);
  };

  const progress = (completedTasks.length / 5) * 100;

  const t = {
    title: language === "bn" ? "টাস্ক সেন্টার" : "Task Center",
    sub: language === "bn" ? "মুনাফা আনলক করতে প্রতিদিন ৫টি বিজ্ঞাপন দেখুন" : "Watch 5 daily ads for 60 days to unlock profits",
    progress: language === "bn" ? "আজকের অগ্রগতি" : "Today's Progress",
    note: language === "bn" ? "* ১২ গুণ মুনাফা উত্তোলনের জন্য ৬০ দিনের বিজ্ঞাপন সম্পন্ন করা বাধ্যতামূলক।" : "* 60 days of ad completion is required for x12 profit withdrawal.",
    reward: language === "bn" ? "পুরস্কার" : "Reward",
    done: language === "bn" ? "সম্পন্ন" : "DONE",
    watching: language === "bn" ? "চলছে..." : "WATCHING...",
    watch: language === "bn" ? "দেখুন" : "WATCH",
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div>
        <h1 className="text-4xl font-heading font-bold mb-2">{t.title}</h1>
        <p className="text-muted-foreground text-lg">{t.sub}</p>
      </div>

      <Card className="bg-primary text-primary-foreground border-none shadow-xl shadow-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-primary-foreground/70 text-xs font-bold uppercase tracking-widest">{t.progress}</p>
              <p className="text-3xl font-bold font-heading">{completedTasks.length}/5</p>
            </div>
            <PlayCircle className="h-10 w-10 opacity-20" />
          </div>
          <Progress value={progress} className="h-2 bg-white/20" />
          <p className="mt-4 text-[10px] text-primary-foreground/60 font-medium">
            {t.note}
          </p>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {TASKS.map((task, index) => {
          const isDone = completedTasks.includes(task.id);
          const isLocked = index > completedTasks.length;
          const isWatching = watchingTask === task.id;

          return (
            <Card key={task.id} className={`transition-all ${isLocked ? 'opacity-40 grayscale' : 'hover-elevate'}`}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${isDone ? 'bg-green-600/10 text-green-600' : 'bg-primary/10 text-primary'}`}>
                    {isDone ? <CheckCircle2 className="h-5 w-5" /> : <Video className="h-5 w-5" />}
                  </div>
                  <div>
                    <p className="text-sm font-bold tracking-tight">{language === "bn" ? task.titleBn : task.title}</p>
                    <p className="text-[10px] text-muted-foreground font-semibold uppercase">{t.reward}: ৳{task.reward}</p>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  className="font-heading"
                  disabled={isDone || isLocked || isWatching}
                  onClick={() => handleWatchAd(task.id)}
                >
                  {isDone ? t.done : isWatching ? t.watching : t.watch}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
