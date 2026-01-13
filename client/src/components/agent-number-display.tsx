import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Copy, RefreshCw } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

interface AgentNumberDisplayProps {
  number: string;
  onRefresh?: () => void;
  label?: string;
  autoRefreshInterval?: number;
}

export function AgentNumberDisplay({ number, onRefresh, label = "Agent Number", autoRefreshInterval = 5000 }: AgentNumberDisplayProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  
  const savedCallback = useRef<() => void | undefined>(undefined);

  // Update ref.current value if onRefresh changes.
  // This allows our effect below to always get latest handler without resetting interval.
  useEffect(() => {
    savedCallback.current = onRefresh;
  }, [onRefresh]);

  // Auto-refresh logic when not revealed
  useEffect(() => {
    function tick() {
      if (savedCallback.current) {
        savedCallback.current();
      }
    }

    let interval: NodeJS.Timeout;
    if (!isRevealed && autoRefreshInterval > 0) {
      interval = setInterval(tick, autoRefreshInterval);
    }
    return () => clearInterval(interval);
  }, [isRevealed, autoRefreshInterval]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRevealed && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRevealed) {
      setIsRevealed(false);
      // Optional: Trigger a refresh when re-masking to ensure fresh data
      if (onRefresh) onRefresh();
    }

    return () => clearInterval(interval);
  }, [isRevealed, timeLeft, onRefresh]);

  const handleReveal = () => {
    setIsRevealed(true);
    setTimeLeft(15);
  };

  const handleCopy = () => {
    // Ensure we copy the actual number, not the masked one
    if (number) {
        navigator.clipboard.writeText(number).then(() => {
            toast({
                title: "Copied!",
                description: "Agent number copied to clipboard.",
            });
        }).catch(err => {
            console.error("Failed to copy:", err);
            toast({
                title: "Error",
                description: "Failed to copy number.",
                variant: "destructive"
            });
        });
        
        // If not revealed, reveal it briefly so user confirms what they copied
        if (!isRevealed) {
            handleReveal();
        }
    }
  };

  const maskedNumber = "*** msk";

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span className="font-medium">{label}</span>
        {isRevealed && (
          <span className="flex items-center gap-1 text-xs text-orange-500 font-bold animate-pulse">
            <RefreshCw className="h-3 w-3 animate-spin" />
            Hiding in {timeLeft}s
          </span>
        )}
      </div>

      <div className="relative group">
        <div 
          className={`
            h-14 w-full rounded-xl border-2 flex items-center justify-between px-4 transition-all duration-300
            ${isRevealed 
              ? "bg-white border-primary text-primary shadow-lg scale-[1.02]" 
              : "bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300"
            }
          `}
        >
          <div className="flex flex-col cursor-pointer" onClick={!isRevealed ? handleReveal : undefined}>
            <span className="text-xs uppercase tracking-wider opacity-70">
              {isRevealed ? "Personal / Agent" : "Tap to Reveal"}
            </span>
            <span className="text-lg font-mono font-bold tracking-widest">
              <AnimatePresence mode="wait">
                {isRevealed ? (
                  <motion.span
                    key="real"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                  >
                    {number}
                  </motion.span>
                ) : (
                  <motion.span
                    key="masked"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                  >
                    {maskedNumber}
                  </motion.span>
                )}
              </AnimatePresence>
            </span>
          </div>

          <div className="flex items-center gap-2">
             <Button 
                  size="icon" 
                  variant="ghost" 
                  className={`h-9 w-9 rounded-full ${isRevealed ? 'bg-primary/10 text-primary hover:bg-primary hover:text-white' : 'bg-white shadow-sm hover:bg-slate-100'}`}
                  onClick={handleCopy}
                >
                  <Copy className="h-4 w-4" />
             </Button>
            
            {!isRevealed ? (
              <Button 
                size="icon" 
                variant="ghost" 
                className="h-9 w-9 rounded-full bg-white shadow-sm hover:bg-primary hover:text-white transition-colors"
                onClick={handleReveal}
              >
                <Eye className="h-4 w-4" />
              </Button>
            ) : (
              <Button 
                  size="icon" 
                  variant="ghost" 
                  className="h-9 w-9 rounded-full bg-red-50 text-red-500 hover:bg-red-100"
                  onClick={() => setIsRevealed(false)}
                >
                  <EyeOff className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
      
      {/* Security Note */}
      {!isRevealed && (
        <p className="text-[10px] text-center text-muted-foreground bg-slate-100 py-1 rounded-md">
          <span className="font-bold text-slate-600">🔒 Secure Mode:</span> Number is masked for your safety.
        </p>
      )}
    </div>
  );
}
