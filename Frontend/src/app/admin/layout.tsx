import { ReactNode } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="admin-layout min-h-screen pt-16">
      <div className="flex">
        {/* Sidebar */}
        <AdminSidebar />

        {/* Main content */}
        <main className="flex-1 min-h-[calc(100vh-4rem)] p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
