import { createPackageAction } from "@/app/actions/packages";
import PackageEditor from "@/components/admin/PackageEditor";

export default function NewPackagePage() {
  return (
    <div className="min-h-screen" style={{ background: "#0a0d14" }}>
      <PackageEditor formAction={createPackageAction} isEditing={false} />
    </div>
  );
}
