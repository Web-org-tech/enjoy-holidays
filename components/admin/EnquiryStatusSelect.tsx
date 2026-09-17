"use client";

import { useState, useTransition } from "react";
import { updateEnquiryStatusAction } from "@/app/actions/enquiries";
import { Loader2 } from "lucide-react";

interface EnquiryStatusSelectProps {
  enquiryId: string;
  initialStatus: string;
}

const STATUS_COLORS: Record<string, string> = {
  new: "bg-amber-500/15 text-amber-400 border border-amber-500/20",
  contacted: "bg-blue-500/15 text-blue-400 border border-blue-500/20",
  converted: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20",
  closed: "bg-white/10 text-white/40 border border-white/10",
};

export default function EnquiryStatusSelect({
  enquiryId,
  initialStatus,
}: EnquiryStatusSelectProps) {
  const [status, setStatus] = useState(initialStatus);
  const [isPending, startTransition] = useTransition();

  const handleChange = (newStatus: string) => {
    setStatus(newStatus);
    startTransition(async () => {
      try {
        await updateEnquiryStatusAction(enquiryId, newStatus);
      } catch (err) {
        console.error("Failed to update status:", err);
        setStatus(initialStatus);
      }
    });
  };

  return (
    <div className="inline-flex items-center gap-1.5">
      <select
        value={status}
        disabled={isPending}
        onChange={(e) => handleChange(e.target.value)}
        className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize cursor-pointer outline-none bg-[#0a0d14] transition-opacity ${
          STATUS_COLORS[status] ?? STATUS_COLORS.new
        } ${isPending ? "opacity-50" : ""}`}
        aria-label="Update enquiry status"
      >
        <option value="new">New</option>
        <option value="contacted">Contacted</option>
        <option value="converted">Converted</option>
        <option value="closed">Closed</option>
      </select>
      {isPending && <Loader2 size={12} className="text-white/40 animate-spin" />}
    </div>
  );
}
