import { createContext, useContext, ReactNode } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import type { User, InsertUser } from "@shared/schema";
import { useLocation } from "wouter";
import { useTranslation } from "react-i18next";

// =================================================================
// Types
// =================================================================
export type APIUser = User & {
  balance: string;
  bonusBalance: string;
  lockedBalance: string;
  referralBalance: string;
  hasPackage: boolean;
};

// =================================================================
// API Fetcher Functions
// =================================================================

async function fetchMe(): Promise<APIUser> {
  const res = await fetch("/api/auth/me");
  if (!res.ok) {
    if (res.status === 401) {
      throw new Error("Not authenticated");
    }
    throw new Error("Failed to fetch user");
  }
  return res.json();
}

async function loginUser(credentials: Omit<InsertUser, "password"> & { password: InsertUser["password"] }): Promise<APIUser> {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Login failed");
  }
  return res.json();
}

async function registerUser(credentials: InsertUser & { referralCode?: string }): Promise<APIUser> {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Registration failed");
  }
  return res.json();
}

async function logoutUser(): Promise<{ message: string }> {
  const res = await fetch("/api/auth/logout", {
    method: "POST",
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Logout failed");
  }
  return res.json();
}


// =================================================================
// Auth Context & Provider
// =================================================================

type AuthContextType = {
  user: APIUser | null | undefined;
  login: (username: string, password: string) => void;
  register: (username: string, password: string, name: string, email: string, phoneNumber: string, captcha: string, referralCode?: string) => void;
  logout: () => void;
  isLoading: boolean;
  language: "en" | "bn";
  setLanguage: (lang: "en" | "bn") => void;
  updateBalance: (amount: number) => void; 
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const { i18n } = useTranslation();

  const setLanguage = (lang: "en" | "bn") => {
    i18n.changeLanguage(lang);
  };

  // Query to get the current user
  const { data: user, isLoading, isError } = useQuery<APIUser, Error>({
    queryKey: ["user", "me"],
    queryFn: fetchMe,
    retry: (failureCount, error) => {
        // Do not retry on 401 errors
        return error.message !== 'Not authenticated' && failureCount < 2;
    },
  });

  // Mutation for logging in
  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (newUser) => {
      queryClient.setQueryData(["user", "me"], newUser);
      toast({ title: "Login Successful", description: "Welcome back!" });
      setLocation("/dashboard");
    },
    onError: (error) => {
      toast({ title: "Login Failed", description: error.message, variant: "destructive" });
    },
  });
  
  // Mutation for registering
  const registerMutation = useMutation({
    mutationFn: (credentials: any) => registerUser(credentials), // wrapper to match mutationFn type if strict
    onSuccess: (newUser) => {
        queryClient.setQueryData(["user", "me"], newUser);
        toast({ title: "Registration Successful", description: "Your account has been created." });
        setLocation("/dashboard");
    },
    onError: (error) => {
      toast({ title: "Registration Failed", description: error.message, variant: "destructive" });
    },
  });

  // Mutation for logging out
  const logoutMutation = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      queryClient.setQueryData(["user", "me"], null);
      toast({ title: "Logged Out" });
      setLocation("/auth");
    },
    onError: (error) => {
      toast({ title: "Logout Failed", description: error.message, variant: "destructive" });
    },
  });

  // Mock update balance for now
  const updateBalance = (amount: number) => {
      console.log("updateBalance called with", amount);
  }

  const authContextValue: AuthContextType = {
    user: isError ? null : user,
    login: (username, password) => loginMutation.mutate({ username, password }),
    register: (username, password, name, email, phoneNumber, captcha, referralCode) => 
      registerMutation.mutate({ username, password, name, email, phoneNumber, captcha, referralCode }),
    logout: () => logoutMutation.mutate(),
    isLoading: isLoading || loginMutation.isPending || registerMutation.isPending,
    language: (i18n.language?.startsWith("bn") ? "bn" : "en") as "en" | "bn",
    setLanguage,
    updateBalance
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// =================================================================
// useAuth Hook
// =================================================================
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
