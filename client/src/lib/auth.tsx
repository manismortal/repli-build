import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

// Types
export type User = {
  id: string;
  name: string;
  mobile: string;
  role: "user" | "admin" | "area_manager" | "regional_manager";
  balance: number;
  lockedBalance: number;
  referralCode: string;
  isFrozen: boolean;
};

type AuthContextType = {
  user: User | null;
  login: (mobile: string, pass: string) => void;
  register: (name: string, mobile: string, pass: string, refCode?: string) => void;
  logout: () => void;
  updateBalance: (amount: number) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock Data
const MOCK_USER: User = {
  id: "u1",
  name: "Rahim Ahmed",
  mobile: "01712345678",
  role: "user",
  balance: 1500.00,
  lockedBalance: 5000.00,
  referralCode: "MAERSK123",
  isFrozen: false,
};

const MOCK_ADMIN: User = {
  id: "a1",
  name: "Admin User",
  mobile: "admin",
  role: "admin",
  balance: 999999,
  lockedBalance: 0,
  referralCode: "ADMIN",
  isFrozen: false,
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check local storage for session
    const stored = localStorage.getItem("maersk_session");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const login = (mobile: string, pass: string) => {
    if (mobile === "admin" && pass === "admin") {
      setUser(MOCK_ADMIN);
      localStorage.setItem("maersk_session", JSON.stringify(MOCK_ADMIN));
      toast({ title: "Welcome back, Admin" });
      return;
    }
    
    // Simulating login for demo
    if (mobile && pass) {
      const newUser = { ...MOCK_USER, mobile, name: "Demo User" };
      setUser(newUser);
      localStorage.setItem("maersk_session", JSON.stringify(newUser));
      toast({ title: "Login Successful", description: "Welcome to MAERSK.Line BD" });
    } else {
      toast({ title: "Login Failed", variant: "destructive" });
    }
  };

  const register = (name: string, mobile: string, pass: string, refCode?: string) => {
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      mobile,
      role: "user",
      balance: 0,
      lockedBalance: 0,
      referralCode: Math.random().toString(36).substr(2, 6).toUpperCase(),
      isFrozen: false
    };
    setUser(newUser);
    localStorage.setItem("maersk_session", JSON.stringify(newUser));
    toast({ title: "Registration Successful", description: "Your account has been created." });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("maersk_session");
    toast({ title: "Logged out" });
  };

  const updateBalance = (amount: number) => {
    if (user) {
      const updated = { ...user, balance: user.balance + amount };
      setUser(updated);
      localStorage.setItem("maersk_session", JSON.stringify(updated));
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateBalance }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
