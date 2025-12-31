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

type Language = "bn" | "en";

type AuthContextType = {
  user: User | null;
  language: Language;
  setLanguage: (lang: Language) => void;
  login: (mobile: string, pass: string) => void;
  register: (name: string, mobile: string, pass: string, refCode?: string) => void;
  logout: () => void;
  updateBalance: (amount: number) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock Data
const MOCK_USER: User = {
  id: "u1",
  name: "রহিম আহমেদ",
  mobile: "01712345678",
  role: "user",
  balance: 1500.00,
  lockedBalance: 5000.00,
  referralCode: "MAERSK123",
  isFrozen: false,
};

const MOCK_ADMIN: User = {
  id: "a1",
  name: "অ্যাডমিন ইউজার",
  mobile: "admin",
  role: "admin",
  balance: 999999,
  lockedBalance: 0,
  referralCode: "ADMIN",
  isFrozen: false,
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [language, setLanguageState] = useState<Language>("bn");
  const { toast } = useToast();

  useEffect(() => {
    const stored = localStorage.getItem("maersk_session");
    if (stored) {
      setUser(JSON.parse(stored));
    }
    const storedLang = localStorage.getItem("maersk_lang") as Language;
    if (storedLang) {
      setLanguageState(storedLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("maersk_lang", lang);
  };

  const login = (mobile: string, pass: string) => {
    if (mobile === "admin" && pass === "admin") {
      setUser(MOCK_ADMIN);
      localStorage.setItem("maersk_session", JSON.stringify(MOCK_ADMIN));
      toast({ title: language === "bn" ? "আবার স্বাগতম, অ্যাডমিন" : "Welcome back, Admin" });
      return;
    }
    
    if (mobile && pass) {
      const newUser = { ...MOCK_USER, mobile, name: language === "bn" ? "ডেমো ইউজার" : "Demo User" };
      setUser(newUser);
      localStorage.setItem("maersk_session", JSON.stringify(newUser));
      toast({ 
        title: language === "bn" ? "লগইন সফল হয়েছে" : "Login Successful", 
        description: language === "bn" ? "MAERSK.Line BD-তে আপনাকে স্বাগতম" : "Welcome to MAERSK.Line BD" 
      });
    } else {
      toast({ 
        title: language === "bn" ? "লগইন ব্যর্থ হয়েছে" : "Login Failed", 
        variant: "destructive" 
      });
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
    toast({ 
      title: language === "bn" ? "নিবন্ধন সফল হয়েছে" : "Registration Successful", 
      description: language === "bn" ? "আপনার অ্যাকাউন্ট তৈরি করা হয়েছে।" : "Your account has been created." 
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("maersk_session");
    toast({ title: language === "bn" ? "লগ আউট হয়েছে" : "Logged out" });
  };

  const updateBalance = (amount: number) => {
    if (user) {
      const updated = { ...user, balance: user.balance + amount };
      setUser(updated);
      localStorage.setItem("maersk_session", JSON.stringify(updated));
    }
  }

  return (
    <AuthContext.Provider value={{ user, language, setLanguage, login, register, logout, updateBalance }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
