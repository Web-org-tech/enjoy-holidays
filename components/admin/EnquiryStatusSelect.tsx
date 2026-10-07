"use client";

import { useState, useTransition } from "react";
import { updateEnquiryStatusAction } from "@/app/actions/enquiries";
import { Loader2 } from "lucide-react";

interface EnquiryStatusSelectProps {
  enquiryId: string;
  initialStatus: string;
}

const STATUS_COLORS: Record<string, string> = {
  new: "bg-[#FFFBEB] text-[#92400E] border-[#FDE68A]",
  contacted: "bg-[#EFF6FF] text-[#1D4ED8] border-[#BFDBFE]",
  converted: "bg-[#ECFDF5] text-[#047857] border-[#A7F3D0]",
  closed: "bg-[#F3F4F6] text-[#4B5563] border-[#E5E7EB]",
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
        className={`px-3 py-1 rounded-xl text-xs font-semibold capitalize cursor-pointer outline-none border transition-all ${
          STATUS_COLORS[status] ?? STATUS_COLORS.new
        } ${isPending ? "opacity-50" : "hover:brightness-95"}`}
        aria-label="Update enquiry status"
      >
        <option value="new" className="bg-white text-[#92400E] font-semibold">
          New
        </option>
        <option value="contacted" className="bg-white text-[#1D4ED8] font-semibold">
          Contacted
        </option>
        <option value="converted" className="bg-white text-[#047857] font-semibold">
          Converted
        </option>
        <option value="closed" className="bg-white text-[#4B5563] font-semibold">
          Closed
        </option>
      </select>
      {isPending && <Loader2 size={13} className="text-[#6B7280] animate-spin" />}
    </div>
  );
}
