import { getAllPackagesAdmin } from "@/lib/supabase/queries";
import Link from "next/link";
import { Plus, Edit, Eye } from "lucide-react";

export default async function AdminPackagesPage() {
  const packages = await getAllPackagesAdmin();

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Packages</h1>
          <p className="text-white/40 text-sm">{packages.length} total packages</p>
        </div>
        <Link
          href="/admin/packages/new"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white shadow-md transition-all hover:scale-105"
          style={{ background: "linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)" }}
          id="admin-new-package-cta"
        >
          <Plus size={16} />
          New Package
        </Link>
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
              <th className="px-5 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-wider">Package</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-wider hidden md:table-cell">Destinations</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-wider hidden md:table-cell">Duration</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-wider">Status</th>
              <th className="px-5 py-3 text-right text-xs font-semibold text-white/40 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {packages.map((pkg, i) => (
              <tr
                key={pkg.id}
                style={{
                  borderBottom: i < packages.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                  background: "rgba(255,255,255,0.02)",
                }}
                className="hover:bg-white/4 transition-colors"
              >
                <td className="px-5 py-4">
                  <div className="font-semibold text-white">{pkg.name}</div>
                  <div className="text-white/30 text-xs mt-0.5">/{pkg.slug}</div>
                </td>
                <td className="px-5 py-4 hidden md:table-cell">
                  <div className="text-white/60 text-xs">{pkg.destinations?.join(", ") ?? "—"}</div>
                </td>
                <td className="px-5 py-4 hidden md:table-cell">
                  <div className="text-white/60 text-xs">{pkg.duration_days}D/{(pkg.duration_days ?? 1) - 1}N</div>
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                      pkg.status === "published"
                        ? "bg-emerald-500/15 text-emerald-400"
                        : pkg.status === "archived"
                        ? "bg-white/10 text-white/30"
                        : "bg-amber-500/15 text-amber-400"
                    }`}
                  >
                    {pkg.status}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/packages/${pkg.slug}`}
                      target="_blank"
                      className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/10 transition-colors"
                      aria-label={`View ${pkg.name} on site`}
                    >
                      <Eye size={14} />
                    </Link>
                    <Link
                      href={`/admin/packages/${pkg.id}/edit`}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white/70 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-1.5"
                    >
                      <Edit size={12} />
                      Edit
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {packages.length === 0 && (
          <div className="text-center py-16 text-white/30 text-sm">
            No packages yet. Create your first one!
          </div>
        )}
      </div>
    </div>
  );
}
