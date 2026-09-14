import { getAllEnquiriesAdmin } from "@/lib/supabase/queries";
import { MessageCircle, Phone } from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  new: "bg-amber-500/15 text-amber-400",
  contacted: "bg-blue-500/15 text-blue-400",
  converted: "bg-emerald-500/15 text-emerald-400",
  closed: "bg-white/10 text-white/30",
};

export default async function AdminEnquiriesPage() {
  const enquiries = await getAllEnquiriesAdmin();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Enquiries</h1>
        <p className="text-white/40 text-sm">{enquiries.length} total leads</p>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
              <th className="px-5 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-wider">Name</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-wider hidden md:table-cell">Contact</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-wider hidden lg:table-cell">Package</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-wider">Source</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-wider">Status</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-wider hidden md:table-cell">Date</th>
            </tr>
          </thead>
          <tbody>
            {enquiries.map((enq: any, i: number) => (
              <tr
                key={enq.id}
                style={{
                  borderBottom: i < enquiries.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                  background: "rgba(255,255,255,0.02)",
                }}
                className="hover:bg-white/4 transition-colors"
              >
                <td className="px-5 py-4">
                  <div className="font-semibold text-white">{enq.name}</div>
                  {enq.message && (
                    <div className="text-white/30 text-xs mt-0.5 max-w-[200px] truncate">{enq.message}</div>
                  )}
                </td>
                <td className="px-5 py-4 hidden md:table-cell">
                  <div className="flex flex-col gap-1">
                    <a href={`tel:${enq.phone}`} className="flex items-center gap-1.5 text-white/60 hover:text-white text-xs transition-colors">
                      <Phone size={11} />{enq.phone}
                    </a>
                    {enq.source === "whatsapp_click" || enq.phone !== "0000000000" ? (
                      <a
                        href={`https://wa.me/91${enq.phone}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-[#25d366] hover:text-green-400 text-xs transition-colors"
                      >
                        <MessageCircle size={11} />WhatsApp
                      </a>
                    ) : null}
                  </div>
                </td>
                <td className="px-5 py-4 hidden lg:table-cell">
                  <div className="text-white/50 text-xs">{enq.package?.name ?? "—"}</div>
                </td>
                <td className="px-5 py-4">
                  <span className="text-white/50 text-xs capitalize">{enq.source?.replace("_", " ") ?? "form"}</span>
                </td>
                <td className="px-5 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold capitalize ${STATUS_COLORS[enq.status] ?? STATUS_COLORS.new}`}>
                    {enq.status}
                  </span>
                </td>
                <td className="px-5 py-4 hidden md:table-cell">
                  <div className="text-white/30 text-xs">
                    {new Date(enq.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {enquiries.length === 0 && (
          <div className="text-center py-16 text-white/30 text-sm">No enquiries yet.</div>
        )}
      </div>
    </div>
  );
}
