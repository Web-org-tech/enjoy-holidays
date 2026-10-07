import { getAllPackagesAdmin } from "@/lib/supabase/queries";
import { togglePackageStatusAction, deletePackageAction } from "@/app/actions/packages";
import Link from "next/link";
import { Plus, Edit, Eye, Power, MapPin, Clock } from "lucide-react";
import ConfirmDeleteButton from "@/components/admin/ConfirmDeleteButton";

export default async function AdminPackagesPage() {
  const packages = await getAllPackagesAdmin();

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full text-[#111827] space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#111827] tracking-tight mb-1">
            Tour Packages
          </h1>
          <p className="text-[#4B5563] text-sm">
            {packages.length} tour {packages.length === 1 ? "package" : "packages"} currently configured in your catalog
          </p>
        </div>
        <Link
          href="/admin/packages/new"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#059669] hover:bg-[#047857] active:bg-[#065F46] shadow-sm transition-all"
          id="admin-new-package-cta"
        >
          <Plus size={16} />
          <span>Add New Package</span>
        </Link>
      </div>

      {/* MOBILE VIEW: Touch-friendly cards for mobile screens */}
      <div className="block md:hidden space-y-4">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm space-y-3.5"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-bold text-base text-[#111827] leading-snug">
                  {pkg.name}
                </h3>
                <div className="flex items-center gap-2 mt-1 text-xs text-[#6B7280] font-medium">
                  <Clock size={13} className="text-[#059669]" />
                  <span>{pkg.duration_days} Days / {(pkg.duration_days ?? 1) - 1} Nights</span>
                </div>
              </div>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold capitalize border ${
                  pkg.status === "published"
                    ? "bg-[#ECFDF5] text-[#047857] border-[#A7F3D0]"
                    : pkg.status === "archived"
                    ? "bg-[#F3F4F6] text-[#4B5563] border-[#E5E7EB]"
                    : "bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]"
                }`}
              >
                {pkg.status}
              </span>
            </div>

            {pkg.destinations && pkg.destinations.length > 0 && (
              <div className="flex items-center gap-1.5 text-xs text-[#4B5563] bg-[#F8FAFC] p-2.5 rounded-xl border border-[#E5E7EB]">
                <MapPin size={13} className="text-[#059669] shrink-0" />
                <span className="truncate">{pkg.destinations.join(", ")}</span>
              </div>
            )}

            {/* Mobile Action Buttons (Touch Targets) */}
            <div className="pt-3 border-t border-[#E5E7EB] flex items-center justify-between gap-2">
              <Link
                href={`/admin/packages/${pkg.id}`}
                className="flex-1 py-2 px-3 rounded-xl bg-[#F8FAFC] hover:bg-[#F1F5F9] text-[#111827] font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors border border-[#E5E7EB]"
              >
                <Edit size={13} className="text-[#059669]" />
                <span>Edit</span>
              </Link>

              <Link
                href={`/packages/${pkg.slug}`}
                target="_blank"
                className="py-2 px-3 rounded-xl bg-white hover:bg-[#F8FAFC] text-[#4B5563] font-semibold text-xs border border-[#E5E7EB] flex items-center justify-center gap-1 transition-colors"
                title="Preview live"
              >
                <Eye size={13} />
                <span>View</span>
              </Link>

              <form
                action={async () => {
                  "use server";
                  await togglePackageStatusAction(pkg.id!, pkg.status!);
                }}
              >
                <button
                  type="submit"
                  className="py-2 px-3 rounded-xl text-xs font-semibold border border-[#E5E7EB] bg-white hover:bg-[#F8FAFC] text-[#4B5563] flex items-center justify-center gap-1 transition-colors"
                  title={pkg.status === "published" ? "Unpublish" : "Publish"}
                >
                  <Power size={13} />
                  <span>{pkg.status === "published" ? "Hide" : "Publish"}</span>
                </button>
              </form>

              <ConfirmDeleteButton
                itemType="Package"
                title="Delete package"
                onConfirm={async () => {
                  "use server";
                  await deletePackageAction(pkg.id!);
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* DESKTOP TABLE VIEW */}
      <div className="hidden md:block rounded-2xl overflow-hidden border border-[#E5E7EB] bg-white shadow-sm">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-sm min-w-[650px] border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E5E7EB]">
                <th className="px-5 py-3.5 text-left text-xs font-bold text-[#6B7280] uppercase tracking-wider">
                  Package Name
                </th>
                <th className="px-5 py-3.5 text-left text-xs font-bold text-[#6B7280] uppercase tracking-wider">
                  Destinations
                </th>
                <th className="px-5 py-3.5 text-left text-xs font-bold text-[#6B7280] uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-5 py-3.5 text-left text-xs font-bold text-[#6B7280] uppercase tracking-wider">
                  Status
                </th>
                <th className="px-5 py-3.5 text-right text-xs font-bold text-[#6B7280] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {packages.map((pkg) => (
                <tr
                  key={pkg.id}
                  className="hover:bg-[#F8FAFC] transition-colors"
                >
                  <td className="px-5 py-4">
                    <div className="font-semibold text-[#111827] text-sm">
                      {pkg.name}
                    </div>
                    <div className="text-[#6B7280] text-xs mt-0.5 font-mono">
                      /{pkg.slug}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="text-[#4B5563] text-xs max-w-[200px] truncate">
                      {pkg.destinations?.join(", ") ?? "—"}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="text-[#111827] text-xs font-medium">
                      {pkg.duration_days}D / {(pkg.duration_days ?? 1) - 1}N
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold capitalize border ${
                        pkg.status === "published"
                          ? "bg-[#ECFDF5] text-[#047857] border-[#A7F3D0]"
                          : pkg.status === "archived"
                          ? "bg-[#F3F4F6] text-[#4B5563] border-[#E5E7EB]"
                          : "bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]"
                      }`}
                    >
                      {pkg.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1.5">
                      <form
                        action={async () => {
                          "use server";
                          await togglePackageStatusAction(pkg.id!, pkg.status!);
                        }}
                      >
                        <button
                          type="submit"
                          className="p-2 rounded-xl text-[#6B7280] hover:text-[#B45309] hover:bg-[#FFFBEB] border border-transparent hover:border-[#FDE68A] transition-colors"
                          title={pkg.status === "published" ? "Unpublish (Set to Draft)" : "Publish live"}
                        >
                          <Power size={14} />
                        </button>
                      </form>

                      <Link
                        href={`/packages/${pkg.slug}`}
                        target="_blank"
                        className="p-2 rounded-xl text-[#6B7280] hover:text-[#111827] hover:bg-[#F3F4F6] border border-transparent hover:border-[#E5E7EB] transition-colors"
                        title="View live page"
                      >
                        <Eye size={14} />
                      </Link>

                      <Link
                        href={`/admin/packages/${pkg.id}`}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold text-[#111827] bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E5E7EB] transition-colors flex items-center gap-1.5 shadow-sm"
                      >
                        <Edit size={12} className="text-[#059669]" />
                        <span>Edit</span>
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
          <div className="text-center py-16 text-[#6B7280] text-sm">
            No packages created yet. Click &ldquo;Add New Package&rdquo; above to create your first package.
          </div>
        )}
      </div>
    </div>
  );
}
