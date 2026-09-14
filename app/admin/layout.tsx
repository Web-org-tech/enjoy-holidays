import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import AdminSidebar from "@/components/admin/AdminSidebar";

export const metadata: Metadata = {
  title: "Admin — ENJOY Holidays",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  return (
    <div className="flex min-h-screen" style={{ background: "#0a0d14", fontFamily: "var(--font-sans)" }}>
      <AdminSidebar userEmail={user.email} />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
