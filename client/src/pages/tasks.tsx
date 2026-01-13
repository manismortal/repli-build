import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/lib/auth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Video, CheckCircle2, PlayCircle, ExternalLink, Link as LinkIcon, Lock, Clock, PartyPopper } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { TaskGuidelines } from "@/components/task-guidelines";
import { FutureVisionModal } from "@/components/future-vision-modal";
import { InspirationView } from "@/components/inspiration-view";

export default function DailyTasks() {
  const { user, language } = useAuth();
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  
  // Timer State
  const [activeTask, setActiveTask] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const taskWindowRef = useRef<Window | null>(null);
  
  // Congrats State
  const [showCongrats, setShowCongrats] = useState(false);
  const [dailyProfit, setDailyProfit] = useState("0");

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: tasks, isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const res = await fetch("/api/tasks");
      if (!res.ok) throw new Error("Failed to fetch tasks");
      return res.json();
    },
  });

  // Fetch user daily progress to check if tasks are already done
  // We can assume user object has hasPackage from /me endpoint
  // Or fetch subscription status separately? 
  // user object from useAuth() comes from /api/auth/me which includes hasPackage (added in server/routes.ts earlier)
  
  const { data: journey, isLoading: isJourneyLoading } = useQuery({
      queryKey: ["journey-progress"],
      queryFn: async () => {
          const res = await fetch("/api/user/journey-progress");
          if (!res.ok) return [];
          return res.json();
      }
  });

  // Check if today is completed
  const isTodayCompleted = () => {
      if (!journey) return false;
      const today = new Date().toISOString().split('T')[0];
      return journey.includes(today);
  };

  const startTask = async (task: any) => {
    try {
        // 1. Notify Backend
        const res = await fetch("/api/tasks/start", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ taskId: task.id })
        });

        if (!res.ok) {
            toast({ title: "Error", description: "Failed to start task session", variant: "destructive" });
            return;
        }

        // 2. Open Link
        if (task.link) {
            taskWindowRef.current = window.open(task.link, '_blank');
        }

        // 3. Start Timer
        setActiveTask(task);
        const duration = parseInt(String(task.visitDuration || 60), 10);
        setTimeLeft(duration);
        setIsTimerRunning(true);
    } catch (e) {
        toast({ title: "Error", description: "Network error", variant: "destructive" });
    }
  };

  useEffect(() => {
    if (isTimerRunning && timeLeft > 0) {
        timerRef.current = setTimeout(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);
    } else if (isTimerRunning && timeLeft === 0) {
        // Timer finished
        completeCurrentTask();
    }

    return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isTimerRunning, timeLeft]);

  const completeCurrentTask = async () => {
      setIsTimerRunning(false);
      
      // Auto-close the tab
      if (taskWindowRef.current) {
          taskWindowRef.current.close();
          taskWindowRef.current = null;
      }

      if (!activeTask) return;
      const currentTask = activeTask; // Capture ref

      try {
        const res = await fetch("/api/tasks/complete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ taskId: currentTask.id })
        });

        if (res.ok) {
            const data = await res.json();
            setCompletedTasks(prev => [...prev, currentTask.id]);
            
            if (data.allTasksCompleted) {
                setDailyProfit(data.totalReward || "0");
                setShowCongrats(true);
            } else {
                toast({ 
                    title: "Task Complete", 
                    description: "Proceed to the next task." 
                });
            }
        } else {
            toast({ title: "Error", description: "Failed to verify task.", variant: "destructive" });
        }
      } catch (e) {
          toast({ title: "Error", description: "Network error", variant: "destructive" });
      } finally {
          setActiveTask(null);
      }
  };


  const activeTasks = tasks || [];
  const progress = activeTasks.length > 0 ? (completedTasks.length / activeTasks.length) * 100 : 0;
  
  // Sequential Logic: User can only do the task at index `completedTasks.length`
  // Assuming `completedTasks` order matches `activeTasks` order implicitly or checking IDs?
  // Better: Filter activeTasks to find first ONE that is NOT in completedTasks.
  // Actually, simplest is just index based if the list is static.
  // But wait, `completedTasks` is just an array of IDs.
  // Let's find the first task ID that is NOT in `completedTasks`.
  const nextTaskIndex = activeTasks.findIndex((t: any) => !completedTasks.includes(t.id));

  const t = {
    title: language === "bn" ? "টাস্ক সেন্টার" : "Task Center",
    sub: language === "bn" ? "মুনাফা আনলক করতে প্রতিদিন টাস্ক সম্পন্ন করুন" : "Complete daily tasks to unlock profits",
    progress: language === "bn" ? "আজকের অগ্রগতি" : "Today's Progress",
  };

  if (isLoading || isJourneyLoading) return <div className="p-10 text-center animate-pulse">Loading tasks...</div>;

  // 1. Check Subscription
  if (!user?.hasPackage) {
      return <InspirationView mode="free" />;
  }

  // 2. Check Daily Limit
  // If already marked as completed for today (from backend journey check OR local optimiztic check if we just finished)
  if (isTodayCompleted() || (activeTasks.length > 0 && completedTasks.length >= activeTasks.length)) {
      // Also show if we just finished all tasks (showCongrats is redundant if we handle it here, but let's keep modal for immediate feedback)
      if (!showCongrats) {
          return <InspirationView mode="done" />;
      }
      // If showCongrats is true, we render the main UI but with the modal open on top.
      // After modal close, we might want to show InspirationView.
      // But for now, let's allow the modal to be the "end state" and then user navigates away or sees this view on refresh.
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      {/* Header */}
      <div>
        <h1 className="text-4xl font-heading font-bold mb-2">{t.title}</h1>
        <p className="text-muted-foreground text-lg">{t.sub}</p>
      </div>

      {/* Task Guidelines */}
      <TaskGuidelines />

      {/* Progress Card */}
      <Card className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white border-none shadow-xl shadow-blue-900/20">
        <CardContent className="pt-8 pb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-blue-100 text-xs font-bold uppercase tracking-widest mb-1">{t.progress}</p>
              <div className="flex items-baseline gap-2">
                 <span className="text-4xl font-black font-heading">{completedTasks.length}</span>
                 <span className="text-blue-200 text-lg">/ {activeTasks.length}</span>
              </div>
            </div>
            <div className="h-14 w-14 rounded-full bg-white/10 flex items-center justify-center ring-2 ring-white/20">
              <PlayCircle className="h-8 w-8 text-white" />
            </div>
          </div>
          <div className="relative h-3 bg-black/20 rounded-full overflow-hidden">
             <motion.div 
               initial={{ width: 0 }}
               animate={{ width: `${progress}%` }}
               className="absolute top-0 left-0 h-full bg-green-400 rounded-full"
             />
          </div>
          <p className="mt-4 text-[11px] text-blue-100 font-medium bg-white/10 inline-block px-3 py-1 rounded-full">
            Complete all tasks to unlock daily profit.
          </p>
        </CardContent>
      </Card>

      {/* Task List */}
      <div className="space-y-4">
        {activeTasks.map((task: any, index: number) => {
          const isDone = completedTasks.includes(task.id);
          // Lock logic: Locked if it's NOT done AND NOT the next one up
          // If nextTaskIndex is -1 (all done), everything is done.
          const isLocked = !isDone && (nextTaskIndex !== -1 && index !== nextTaskIndex); 
          const isCurrent = index === nextTaskIndex;

          let Icon = Video;
          if (task.linkType === 'subscription') Icon = LinkIcon;
          if (task.linkType === 'external') Icon = ExternalLink;

          return (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
                <Card className={`border-0 shadow-md transition-all duration-300 ${isDone ? 'bg-green-50/50 opacity-80' : isLocked ? 'bg-slate-50 opacity-60 grayscale' : 'bg-white hover:shadow-xl ring-1 ring-blue-100'}`}>
                <CardContent className="p-5 flex items-center justify-between">
                    <div className="flex items-center gap-5">
                    <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${isDone ? 'bg-green-100 text-green-600' : isLocked ? 'bg-slate-200 text-slate-400' : 'bg-blue-100 text-blue-600'}`}>
                        {isDone ? <CheckCircle2 className="h-6 w-6" /> : isLocked ? <Lock className="h-5 w-5" /> : <Icon className="h-6 w-6" />}
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className={`font-bold text-base ${isLocked ? 'text-slate-500' : 'text-slate-800'}`}>{task.title}</h3>
                            {isCurrent && <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>}
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-1">{task.description}</p>
                    </div>
                    </div>
                    
                    <Button 
                        size="sm" 
                        className={`rounded-full px-6 font-bold ${isDone ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                        disabled={isDone || isLocked}
                        onClick={() => startTask(task)}
                    >
                        {isDone ? "DONE" : isLocked ? <Lock className="h-3 w-3" /> : "START"}
                    </Button>
                </CardContent>
                </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Timer Modal (Un-dismissable via click outside) */}
      <Dialog open={!!activeTask} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md text-center [&>button]:hidden" onPointerDownOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
            <DialogHeader>
                <DialogTitle className="text-2xl font-bold font-heading flex items-center justify-center gap-2">
                    <Clock className="h-6 w-6 text-blue-600 animate-pulse" />
                    Task in Progress
                </DialogTitle>
                <DialogDescription className="text-base pt-2">
                    Please complete the activity in the new tab. <br/>
                    <span className="font-bold text-red-500">Do not close this window.</span>
                </DialogDescription>
            </DialogHeader>
            
            <div className="py-8 flex flex-col items-center justify-center">
                <div className="relative h-32 w-32 flex items-center justify-center">
                    <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                        <circle className="text-slate-100" strokeWidth="8" stroke="currentColor" fill="transparent" r="40" cx="50" cy="50" />
                        <circle 
                            className="text-blue-600 transition-all duration-1000 ease-linear" 
                            strokeWidth="8" 
                            strokeDasharray={251.2} 
                            strokeDashoffset={
                                251.2 - (251.2 * (timeLeft || 0)) / 
                                (activeTask?.visitDuration ? parseInt(String(activeTask.visitDuration), 10) : 60)
                            } 
                            strokeLinecap="round" 
                            stroke="currentColor" 
                            fill="transparent" 
                            r="40" cx="50" cy="50" 
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                        <span className="text-3xl font-black tabular-nums text-slate-800">
                            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                        </span>
                        <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Remaining</span>
                    </div>
                </div>
            </div>
            
            <DialogFooter className="sm:justify-center">
                <Button variant="ghost" disabled className="w-full text-slate-400">
                    Verifying Activity...
                </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Futuristic Profit Sharing Modal */}
      <FutureVisionModal 
        open={showCongrats} 
        onOpenChange={setShowCongrats} 
        dailyProfit={dailyProfit}
      />

    </div>
  );
}