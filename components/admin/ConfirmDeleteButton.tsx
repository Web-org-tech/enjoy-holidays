"use client";

import { useState } from "react";
import { Trash2, AlertTriangle, Loader2 } from "lucide-react";

interface ConfirmDeleteButtonProps {
  onConfirm: () => Promise<void>;
  title?: string;
  itemType?: string;
  className?: string;
}

export default function ConfirmDeleteButton({
  onConfirm,
  title = "Delete",
  itemType = "item",
  className = "",
}: ConfirmDeleteButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
      setIsOpen(false);
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={
          className ||
          "p-2 rounded-xl text-[#9CA3AF] hover:text-[#DC2626] hover:bg-[#FEF2F2] border border-transparent hover:border-[#FECACA] transition-colors cursor-pointer"
        }
        title={title}
        aria-label={title}
      >
        <Trash2 size={15} />
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-150"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-delete-title"
        >
          <div className="w-full max-w-sm rounded-2xl p-6 shadow-2xl border border-[#E5E7EB] bg-white animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-xl bg-[#FEF2F2] text-[#DC2626] flex items-center justify-center mb-4 mx-auto border border-[#FECACA]">
              <AlertTriangle size={24} />
            </div>

            <h3
              id="confirm-delete-title"
              className="text-lg font-bold text-[#111827] text-center mb-1.5"
            >
              Delete {itemType}?
            </h3>

            <p className="text-[#4B5563] text-xs sm:text-sm text-center mb-6 leading-relaxed">
              Are you sure you want to delete this {itemType.toLowerCase()}? This action is permanent and cannot be undone.
            </p>

            <div className="flex gap-2.5">
              <button
                type="button"
                disabled={loading}
                onClick={() => setIsOpen(false)}
                className="flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold text-[#374151] hover:bg-[#F1F5F9] bg-[#F8FAFC] border border-[#E5E7EB] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={handleConfirm}
                className="flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold text-white bg-[#DC2626] hover:bg-[#B91C1C] transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  "Delete Permanently"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
