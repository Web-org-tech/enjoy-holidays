"use client";

import React, { useState, useMemo } from "react";
import { Search, ChevronDown, Check, X, Sparkles } from "lucide-react";
import ActivityIcon, { ALL_ICON_OPTIONS, ACTIVITY_CATEGORIES } from "@/components/journey/ActivityIcon";

interface ActivityIconPickerProps {
  value: string;
  onChange: (iconKey: string) => void;
  className?: string;
}

export default function ActivityIconPicker({
  value,
  onChange,
  className = "",
}: ActivityIconPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [customKeyInput, setCustomKeyInput] = useState("");

  // Find currently active option
  const currentOption = useMemo(() => {
    return (
      ALL_ICON_OPTIONS.find((opt) => opt.value.toLowerCase() === (value || "").toLowerCase()) || {
        value: value || "activity",
        label: value ? `${value.charAt(0).toUpperCase()}${value.slice(1)}` : "Activity",
        category: "adventure" as const,
      }
    );
  }, [value]);

  // Filter options by category and search
  const filteredOptions = useMemo(() => {
    return ALL_ICON_OPTIONS.filter((opt) => {
      const matchesCategory =
        selectedCategory === "all" || opt.category === selectedCategory;
      const matchesSearch =
        opt.label.toLowerCase().includes(search.toLowerCase()) ||
        opt.value.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, search]);

  const handleSelect = (key: string) => {
    onChange(key);
    setIsOpen(false);
  };

  const handleApplyCustom = () => {
    if (customKeyInput.trim()) {
      onChange(customKeyInput.trim().toLowerCase());
      setCustomKeyInput("");
      setIsOpen(false);
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-2.5 sm:px-3 py-2 rounded-xl bg-white border border-[#E5E7EB] hover:border-[#059669] text-xs font-semibold text-[#111827] transition-all shadow-sm group text-left w-full sm:w-auto sm:min-w-[130px] max-w-full cursor-pointer"
        title="Choose activity or highlight icon"
      >
        <div className="w-6 h-6 rounded-lg bg-[#ECFDF5] text-[#059669] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
          <ActivityIcon icon={value || "activity"} size={13} />
        </div>
        <span className="truncate flex-1 text-[#111827] capitalize">
          {currentOption.label}
        </span>
        <ChevronDown size={14} className="text-[#9CA3AF] shrink-0 group-hover:text-[#111827]" />
      </button>

      {/* Popover / Modal */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          <div className="fixed sm:absolute z-50 left-3 right-3 sm:left-0 sm:right-auto sm:w-96 top-1/2 sm:top-full -translate-y-1/2 sm:translate-y-2 bg-white rounded-2xl shadow-2xl border border-[#E5E7EB] p-4 text-[#111827] max-h-[85vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-[#059669]" />
                <span className="text-xs font-bold text-[#111827]">
                  Choose Activity &amp; Highlight Icon
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-[#9CA3AF] hover:text-[#111827] hover:bg-[#F3F4F6] transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Search Input */}
            <div className="relative mt-3">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none"
              />
              <input
                type="text"
                placeholder="Search icons (e.g. food, cruise, stay)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-[#E5E7EB] text-xs text-[#111827] placeholder-[#9CA3AF] font-medium focus:outline-none focus:border-[#059669] focus:ring-2 focus:ring-[#A7F3D0] transition-all"
                autoFocus
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex gap-1.5 overflow-x-auto py-2.5 no-scrollbar shrink-0">
              {ACTIVITY_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat.id
                      ? "bg-[#059669] text-white shadow-xs"
                      : "bg-[#F1F5F9] text-[#4B5563] hover:text-[#111827] hover:bg-[#E2E8F0]"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Icons Grid */}
            <div className="grid grid-cols-3 gap-2 overflow-y-auto max-h-56 p-1 pr-1.5 my-1">
              {filteredOptions.map((opt) => {
                const isSelected = opt.value.toLowerCase() === (value || "").toLowerCase();
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleSelect(opt.value)}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all ${
                      isSelected
                        ? "bg-[#ECFDF5] border-[#059669] text-[#047857] font-bold shadow-xs"
                        : "bg-white border-[#E5E7EB] hover:border-[#059669] hover:bg-[#F8FAFC]"
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#F8FAFC] flex items-center justify-center mb-1.5 text-[#059669]">
                      <ActivityIcon icon={opt.value} size={16} />
                    </div>
                    <span className="text-[10px] leading-tight line-clamp-1 text-[#374151]">
                      {opt.label}
                    </span>
                  </button>
                );
              })}

              {filteredOptions.length === 0 && (
                <div className="col-span-3 py-6 text-center text-xs text-[#9CA3AF]">
                  No matching icons found for &quot;{search}&quot;.
                </div>
              )}
            </div>

            {/* Custom Icon / Keyword Input */}
            <div className="pt-3 border-t border-[#E5E7EB] mt-2">
              <label className="block text-[11px] font-semibold text-[#4B5563] mb-1">
                Custom Icon Keyword (e.g. &quot;safari&quot;, &quot;sunset&quot;):
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter keyword..."
                  value={customKeyInput}
                  onChange={(e) => setCustomKeyInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleApplyCustom();
                    }
                  }}
                  className="flex-1 px-3 py-1.5 rounded-xl bg-white border border-[#E5E7EB] text-xs text-[#111827] placeholder-[#9CA3AF] font-medium focus:outline-none focus:border-[#059669] focus:ring-2 focus:ring-[#A7F3D0]"
                />
                <button
                  type="button"
                  onClick={handleApplyCustom}
                  className="px-3 py-1.5 rounded-xl bg-[#059669] text-white text-xs font-bold hover:bg-[#047857] cursor-pointer"
                >
                  <Check size={14} />
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
