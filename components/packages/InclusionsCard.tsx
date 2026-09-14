import type { PackageInclusion, PackageExclusion } from "@/lib/supabase/types";
import { Check, X } from "lucide-react";

interface InclusionsCardProps {
  inclusions: PackageInclusion[];
  exclusions: PackageExclusion[];
}

export default function InclusionsCard({ inclusions, exclusions }: InclusionsCardProps) {
  return (
    <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
      {/* Inclusions */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ border: "1px solid var(--color-border)", background: "white" }}
      >
        <div
          className="px-5 py-4 flex items-center gap-3"
          style={{ borderBottom: "1px solid var(--color-border)", background: "rgba(16,185,129,0.04)" }}
        >
          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
            <Check size={16} className="text-emerald-600" />
          </div>
          <h3 className="font-bold text-[var(--color-text-primary)] text-sm">What&apos;s Included</h3>
        </div>
        <ul className="p-5 flex flex-col gap-3" role="list">
          {inclusions.length > 0 ? (
            inclusions.map((inc) => (
              <li key={inc.id} className="flex items-start gap-3">
                <Check
                  size={15}
                  className="text-emerald-500 flex-shrink-0 mt-0.5"
                  strokeWidth={2.5}
                />
                <span className="text-sm text-[var(--color-text-secondary)]">{inc.text}</span>
              </li>
            ))
          ) : (
            <li className="text-sm text-[var(--color-text-muted)]">Contact us for inclusion details.</li>
          )}
        </ul>
      </div>

      {/* Exclusions */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ border: "1px solid var(--color-border)", background: "white" }}
      >
        <div
          className="px-5 py-4 flex items-center gap-3"
          style={{ borderBottom: "1px solid var(--color-border)", background: "rgba(239,68,68,0.03)" }}
        >
          <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center">
            <X size={16} className="text-red-400" />
          </div>
          <h3 className="font-bold text-[var(--color-text-primary)] text-sm">Not Included</h3>
        </div>
        <ul className="p-5 flex flex-col gap-3" role="list">
          {exclusions.length > 0 ? (
            exclusions.map((exc) => (
              <li key={exc.id} className="flex items-start gap-3">
                <X
                  size={15}
                  className="text-red-300 flex-shrink-0 mt-0.5"
                  strokeWidth={2.5}
                />
                <span className="text-sm text-[var(--color-text-muted)]">{exc.text}</span>
              </li>
            ))
          ) : (
            <li className="text-sm text-[var(--color-text-muted)]">No exclusions listed.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
