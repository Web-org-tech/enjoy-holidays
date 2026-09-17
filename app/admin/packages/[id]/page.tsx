import { getPackageForEdit } from "@/lib/supabase/queries";
import { updatePackageAction, deletePackageAction } from "@/app/actions/packages";
import PackageEditor, { ItineraryDay } from "@/components/admin/PackageEditor";
import { notFound, redirect } from "next/navigation";
import ConfirmDeleteButton from "@/components/admin/ConfirmDeleteButton";

export default async function EditPackagePage({
  params,
}: {
  params: { id: string };
}) {
  const pkg = await getPackageForEdit(params.id);

  if (!pkg) {
    notFound();
  }

  const updateWithId = updatePackageAction.bind(null, pkg.id);

  // Map package_days and day_activities to ItineraryDay format
  const mappedDays: ItineraryDay[] = (pkg.package_days || []).map((d) => ({
    id: d.id,
    day_number: d.day_number,
    is_departure: d.day_number === 0,
    is_return: d.day_number >= 90,
    title: d.title,
    subtitle: d.subtitle || "",
    photo_url: d.photo_url || "",
    transition_text: d.transition_text || "",
    activities: (d.day_activities || []).map((a) => ({
      id: a.id,
      icon: a.icon || "activity",
      label: a.label,
    })),
  }));

  const initialData = {
    id: pkg.id,
    name: pkg.name,
    slug: pkg.slug,
    summary: pkg.summary,
    destinations: pkg.destinations || [],
    duration_days: pkg.duration_days,
    duration_nights: pkg.duration_nights,
    pax_capacity: pkg.pax_capacity,
    price_with_food: pkg.price_with_food,
    price_without_food: pkg.price_without_food,
    hero_image_url: pkg.hero_image_url,
    vehicle_type: pkg.vehicle_type,
    status: pkg.status,
    inclusions: pkg.package_inclusions?.map((i) => i.text) || [],
    exclusions: pkg.package_exclusions?.map((e) => e.text) || [],
    days: mappedDays,
  };

  return (
    <div className="min-h-screen" style={{ background: "#0a0d14" }}>
      <div className="max-w-7xl mx-auto pt-6 px-4 md:px-8 flex justify-end">
        <ConfirmDeleteButton
          itemType="Package"
          title="Delete package"
          className="px-4 py-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs font-bold border border-red-500/20 flex items-center gap-2 transition-colors cursor-pointer"
          onConfirm={async () => {
            "use server";
            await deletePackageAction(pkg.id);
            redirect("/admin/packages");
          }}
        />
      </div>

      <PackageEditor
        initialData={initialData}
        formAction={updateWithId}
        isEditing={true}
      />
    </div>
  );
}
