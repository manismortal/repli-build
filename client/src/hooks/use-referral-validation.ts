import { useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export function useReferralValidation() {
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: referralData } = useQuery({
    queryKey: ["user", "referrals"],
    queryFn: async () => {
      const res = await fetch("/api/user/referrals");
      if (!res.ok) throw new Error("Failed to fetch referral data");
      return res.json();
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (user && referralData) {
      const dashboardCode = (user as any).referralCode;
      const teamCode = referralData.referralCode;

      if (dashboardCode && teamCode && dashboardCode !== teamCode) {
        toast({
          title: "Data Synchronization Error",
          description: `Referral Code mismatch detected. Dashboard: ${dashboardCode}, Team: ${teamCode}. Please contact support.`,
          variant: "destructive",
          duration: 10000,
        });
      }
    }
  }, [user, referralData, toast]);
}
