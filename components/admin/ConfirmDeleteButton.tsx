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
          "p-1.5 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors"
        }
        title={title}
        aria-label={title}
      >
        <Trash2 size={14} />
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-delete-title"
        >
          <div
            className="w-full max-w-sm rounded-2xl p-6 shadow-2xl border border-white/10"
            style={{ background: "#121824" }}
          >
            <div className="w-12 h-12 rounded-xl bg-red-500/15 text-red-400 flex items-center justify-center mb-4 mx-auto">
              <AlertTriangle size={24} />
            </div>

            <h3
              id="confirm-delete-title"
              className="text-lg font-bold text-white text-center mb-2"
            >
              Delete {itemType}?
            </h3>

            <p className="text-white/60 text-xs text-center mb-6 leading-relaxed">
              Are you sure you want to delete this {itemType.toLowerCase()}? This action is permanent and cannot be undone.
            </p>

            <div className="flex gap-3">
              <button
                type="button"
                disabled={loading}
                onClick={() => setIsOpen(false)}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-white/70 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={handleConfirm}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-500 transition-colors flex items-center justify-center gap-1.5 shadow-lg shadow-red-900/40"
              >
                {loading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Yes, Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
