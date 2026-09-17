import { getAllPackagesAdmin } from "@/lib/supabase/queries";
import { togglePackageStatusAction, deletePackageAction } from "@/app/actions/packages";
import Link from "next/link";
import { Plus, Edit, Eye, Power } from "lucide-react";
import ConfirmDeleteButton from "@/components/admin/ConfirmDeleteButton";

export default async function AdminPackagesPage() {
  const packages = await getAllPackagesAdmin();

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Tour Packages</h1>
          <p className="text-white/40 text-sm">{packages.length} total packages created</p>
        </div>
        <Link
          href="/admin/packages/new"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white shadow-md transition-all hover:scale-105"
          style={{ background: "linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)" }}
          id="admin-new-package-cta"
        >
          <Plus size={16} />
          New Package
        </Link>
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden border border-white/10" style={{ background: "rgba(255,255,255,0.02)" }}>
        <div className="overflow-x-auto w-full">
          <table className="w-full text-sm min-w-[550px]">
          <thead>
            <tr style={{ background: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-white/40 uppercase tracking-wider">Package</th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-white/40 uppercase tracking-wider hidden md:table-cell">Destinations</th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-white/40 uppercase tracking-wider hidden md:table-cell">Duration</th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-white/40 uppercase tracking-wider">Status</th>
              <th className="px-5 py-3.5 text-right text-xs font-semibold text-white/40 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {packages.map((pkg, i) => (
              <tr
                key={pkg.id}
                style={{
                  borderBottom: i < packages.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
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
                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold capitalize border ${
                      pkg.status === "published"
                        ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/20"
                        : pkg.status === "archived"
                        ? "bg-white/10 text-white/40 border-white/10"
                        : "bg-amber-500/15 text-amber-400 border-amber-500/20"
                    }`}
                  >
                    {pkg.status}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <form
                      action={async () => {
                        "use server";
                        await togglePackageStatusAction(pkg.id!, pkg.status!);
                      }}
                    >
                      <button
                        type="submit"
                        className="p-1.5 rounded-lg text-white/40 hover:text-amber-300 hover:bg-amber-500/10 transition-colors"
                        title={pkg.status === "published" ? "Unpublish (Set to Draft)" : "Publish"}
                      >
                        <Power size={14} />
                      </button>
                    </form>

                    <Link
                      href={`/packages/${pkg.slug}`}
                      target="_blank"
                      className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/10 transition-colors"
                      title="View live page"
                    >
                      <Eye size={14} />
                    </Link>

                    <Link
                      href={`/admin/packages/${pkg.id}`}
                      className="px-3 py-1 rounded-lg text-xs font-semibold text-white/80 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors flex items-center gap-1.5"
                    >
                      <Edit size={12} />
                      Edit
                    </Link>

                    <ConfirmDeleteButton
                      itemType="Package"
                      title="Delete package"
                      onConfirm={async () => {
                        "use server";
                        await deletePackageAction(pkg.id!);
                      }}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          </table>
        </div>

        {packages.length === 0 && (
          <div className="text-center py-16 text-white/30 text-sm">
            No packages created yet. Click &ldquo;New Package&rdquo; above to create your first package!
          </div>
        )}
      </div>
    </div>
  );
}
