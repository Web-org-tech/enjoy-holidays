import type { Metadata } from "next";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

export const metadata: Metadata = {
  title: "Admin Panel — PADMA TOURS & TRAVELS",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If not logged in, render the login page cleanly without sidebar
  if (!user) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] text-[#111827] admin-theme">
        {children}
      </div>
    );
  }

  return (
    <div
      className="flex min-h-screen bg-[#F8FAFC] text-[#111827] admin-theme"
      style={{ fontFamily: "var(--font-sans)" }}
    >
      <AdminSidebar userEmail={user.email} />
      <div className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC]">
        <AdminHeader userEmail={user.email} />
        <main className="flex-1 overflow-auto pt-16 md:pt-0 bg-[#F8FAFC] min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>
    </div>
  );
}
