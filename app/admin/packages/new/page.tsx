import { createPackageAction } from "@/app/actions/packages";
import PackageEditor from "@/components/admin/PackageEditor";

export default function NewPackagePage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <PackageEditor formAction={createPackageAction} isEditing={false} />
    </div>
  );
}
