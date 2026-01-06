import { useState } from "react";
import { AdminSidebar } from "@/components/admin/ui/sidebar";
import { AdminHeader } from "@/components/admin/ui/header";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-secondary/30 flex font-sans">
      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
