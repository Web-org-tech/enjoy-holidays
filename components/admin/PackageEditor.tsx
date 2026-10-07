"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Package as PackageIcon,
  Sparkles,
  MapPin,
  Clock,
  Car,
  Utensils,
  Calendar,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Eye,
  Edit3,
  Save,
  ArrowLeft,
  CheckCircle2,
  Compass,
  ArrowRight,
  ShieldCheck,
  Plane,
  Ship,
  Hotel,
  Coffee,
  Sun,
  Camera,
} from "lucide-react";
import ActivityIcon from "@/components/journey/ActivityIcon";
import ActivityIconPicker from "@/components/admin/ActivityIconPicker";
import ImageUploader from "@/components/ui/ImageUploader";

export interface ActivityItem {
  id: string;
  icon: string;
  label: string;
}

export interface ItineraryDay {
  id: string;
  day_number: number;
  is_departure?: boolean;
  is_return?: boolean;
  title: string;
  subtitle: string;
  photo_url: string;
  transition_text: string;
  activities: ActivityItem[];
}

interface PackageEditorProps {
  initialData?: {
    id?: string;
    name: string;
    slug: string;
    summary: string;
    destinations: string[];
    duration_days: number;
    duration_nights: number;
    pax_capacity: number;
    price_with_food: number;
    price_without_food: number | null;
    hero_image_url: string | null;
    vehicle_type: string;
    status: string;
    inclusions?: string[];
    exclusions?: string[];
    days?: ItineraryDay[];
  };
  formAction: (formData: FormData) => Promise<void>;
  isEditing?: boolean;
}

export default function PackageEditor({
  initialData,
  formAction,
  isEditing = false,
}: PackageEditorProps) {
  // Form State
  const [name, setName] = useState(initialData?.name || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [summary, setSummary] = useState(
    initialData?.summary || ""
  );
  const [destinations, setDestinations] = useState(
    initialData?.destinations?.join(", ") || ""
  );
  const [durationDays, setDurationDays] = useState(initialData?.duration_days || 3);
  const [durationNights, setDurationNights] = useState(initialData?.duration_nights || 2);
  const [paxCapacity, setPaxCapacity] = useState(initialData?.pax_capacity || 12);
  const [priceWithFood, setPriceWithFood] = useState(initialData?.price_with_food || 8000);
  const [priceWithoutFood, setPriceWithoutFood] = useState<number | string>(
    initialData?.price_without_food ?? 6500
  );
  const [heroImageUrl, setHeroImageUrl] = useState(
    initialData?.hero_image_url || ""
  );
  const [vehicleType, setVehicleType] = useState(initialData?.vehicle_type || "jeep");
  const [status, setStatus] = useState(initialData?.status || "published");

  const [inclusionsText, setInclusionsText] = useState(
    initialData?.inclusions?.join("\n") ||
      "Private AC Chauffeur Vehicle throughout\nComfortable Hotel Accommodation\nDaily Breakfast & Refreshments\nSightseeing as per itinerary\nAll Tolls, Fuel, Parking & Driver Allowances"
  );

  const [exclusionsText, setExclusionsText] = useState(
    initialData?.exclusions?.join("\n") ||
      "Flight / Train tickets to starting point\nPersonal expenses, tips & shopping\nMonument / special darshan entry tickets not specified\nItems not mentioned in inclusions"
  );

  // Dynamic Days Itinerary State
  const defaultInitialDays: ItineraryDay[] = [
    {
      id: "day-1",
      day_number: 1,
      title: "Arrival & Sightseeing",
      subtitle: "Welcome & Tour Commences",
      photo_url: "",
      transition_text: "",
      activities: [
        { id: "a1", icon: "transport", label: "Doorstep / Airport / Station pickup" },
        { id: "a2", icon: "hotel", label: "Check-in at Hotel & Refresh" },
        { id: "a3", icon: "activity", label: "Guided Sightseeing Tour" },
      ],
    },
  ];

  const [itineraryDays, setItineraryDays] = useState<ItineraryDay[]>(
    initialData?.days && initialData.days.length > 0 ? initialData.days : defaultInitialDays
  );

  const [expandedDayId, setExpandedDayId] = useState<string | null>(
    initialData?.days && initialData.days.length > 0 ? initialData.days[0]?.id : "day-1"
  );
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [previewFoodToggle, setPreviewFoodToggle] = useState<"with" | "without">("with");

  // Auto-generate Day Stops based on Duration
  const handleAutoGenerateStops = () => {
    const totalDays = Math.max(1, Number(durationDays));
    const destList = destinations.split(",").map((d) => d.trim()).filter(Boolean);

    const generated: ItineraryDay[] = [];

    // Departure Day 0
    generated.push({
      id: "day-0",
      day_number: 0,
      is_departure: true,
      title: "Departure",
      subtitle: "Journey Begins",
      photo_url: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800&q=80",
      transition_text: `Board your journey to ${destList[0] || "your destination"}. Our tour manager awaits you.`,
      activities: [
        { id: `gen-0-1`, icon: "transport", label: `Arrival & welcome transfer to accommodation` },
        { id: `gen-0-2`, icon: "hotel", label: `Check-in & relaxing evening` },
      ],
    });

    // Days 1..N
    for (let i = 1; i <= totalDays; i++) {
      const currentDest = destList[(i - 1) % destList.length] || `Destination ${i}`;
      const nextDest = destList[i % destList.length] || `Next Destination`;
      generated.push({
        id: `day-${i}`,
        day_number: i,
        title: `Day ${i} — ${currentDest}`,
        subtitle: `Exploration & Highlights`,
        photo_url: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80",
        transition_text: i < totalDays ? `Scenic drive towards ${nextDest} with roadside stops.` : `Prepare for departure and farewell memories.`,
        activities: [
          { id: `gen-${i}-1`, icon: "breakfast", label: "Complimentary breakfast & briefing" },
          { id: `gen-${i}-2`, icon: "activity", label: `Guided tour of ${currentDest} landmarks & scenic spots` },
          { id: `gen-${i}-3`, icon: "meal", label: "Lunch with authentic regional flavors" },
          { id: `gen-${i}-4`, icon: "sunset", label: "Evening sunset viewpoint & leisure stroll" },
        ],
      });
    }

    // Return Day
    generated.push({
      id: `day-return`,
      day_number: 99,
      is_return: true,
      title: "Return",
      subtitle: "Safe Travels Home",
      photo_url: "",
      transition_text: "",
      activities: [
        { id: `gen-ret-1`, icon: "transport", label: "Check-out and transfer to airport / railway station for journey home" },
      ],
    });

    setItineraryDays(generated);
  };

  // Add a new custom day
  const handleAddDay = () => {
    const newIdx = itineraryDays.length;
    const newDay: ItineraryDay = {
      id: `day-${Date.now()}`,
      day_number: newIdx,
      title: `Day ${newIdx} — Exploration`,
      subtitle: "Highlights & Activities",
      photo_url: "",
      transition_text: "Drive to next stop with scenic views.",
      activities: [
        { id: `act-${Date.now()}-1`, icon: "breakfast", label: "Morning breakfast" },
        { id: `act-${Date.now()}-2`, icon: "activity", label: "Sightseeing and cultural exploration" },
      ],
    };
    setItineraryDays([...itineraryDays, newDay]);
    setExpandedDayId(newDay.id);
  };

  // Remove a day
  const handleRemoveDay = (id: string) => {
    setItineraryDays(itineraryDays.filter((d) => d.id !== id));
  };

  // Update a day's fields
  const handleUpdateDay = (id: string, updates: Partial<ItineraryDay>) => {
    setItineraryDays(
      itineraryDays.map((d) => (d.id === id ? { ...d, ...updates } : d))
    );
  };

  // Add activity to a day
  const handleAddActivity = (dayId: string) => {
    setItineraryDays(
      itineraryDays.map((d) => {
        if (d.id === dayId) {
          return {
            ...d,
            activities: [
              ...d.activities,
              { id: `act-${Date.now()}`, icon: "activity", label: "New activity / stop" },
            ],
          };
        }
        return d;
      })
    );
  };

  // Remove activity from a day
  const handleRemoveActivity = (dayId: string, activityId: string) => {
    setItineraryDays(
      itineraryDays.map((d) => {
        if (d.id === dayId) {
          return {
            ...d,
            activities: d.activities.filter((a) => a.id !== activityId),
          };
        }
        return d;
      })
    );
  };

  // Update activity
  const handleUpdateActivity = (
    dayId: string,
    activityId: string,
    updates: Partial<ActivityItem>
  ) => {
    setItineraryDays(
      itineraryDays.map((d) => {
        if (d.id === dayId) {
          return {
            ...d,
            activities: d.activities.map((a) =>
              a.id === activityId ? { ...a, ...updates } : a
            ),
          };
        }
        return d;
      })
    );
  };

  // Prepare serialized JSON for server submission
  const itineraryJSON = useMemo(() => {
    return JSON.stringify(
      itineraryDays.map((d, index) => ({
        day_number: d.day_number ?? index,
        title: d.title,
        subtitle: d.subtitle,
        photo_url: d.photo_url || null,
        transition_text: d.transition_text || null,
        activities: d.activities.map((a, actIndex) => ({
          icon: a.icon,
          label: a.label,
          sort_order: actIndex,
        })),
      }))
    );
  }, [itineraryDays]);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto text-[#111827] space-y-6">
      {/* Top Header & Tab Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E5E7EB]">
        <div>
          <Link
            href="/admin/packages"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6B7280] hover:text-[#111827] mb-2 transition-colors"
          >
            <ArrowLeft size={14} /> Back to Tour Packages
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#111827] flex items-center gap-2.5">
            <span className="w-10 h-10 rounded-xl bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] flex items-center justify-center shrink-0">
              <PackageIcon size={22} />
            </span>
            <span>{isEditing ? `Edit: ${name || "Tour Package"}` : "Create Tour Package"}</span>
          </h1>
          <p className="text-[#4B5563] text-xs sm:text-sm mt-1">
            Build your handcrafted itinerary, manage pricing options, and preview in real-time.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1 bg-[#F1F5F9] p-1 rounded-xl border border-[#E5E7EB] self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab("edit")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              activeTab === "edit"
                ? "bg-[#059669] text-white shadow-sm"
                : "text-[#4B5563] hover:text-[#111827]"
            }`}
          >
            <Edit3 size={14} /> Form &amp; Itinerary
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("preview")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              activeTab === "preview"
                ? "bg-[#059669] text-white shadow-sm"
                : "text-[#4B5563] hover:text-[#111827]"
            }`}
          >
            <Eye size={14} /> Live Customer View
          </button>
        </div>
      </div>

      <form action={formAction} className="space-y-6">
        {/* Hidden field for full Itinerary JSON */}
        <input type="hidden" name="itinerary_json" value={itineraryJSON} />

        {/* TAB 1: FORM & DYNAMIC ITINERARY BUILDER */}
        <div className={activeTab === "edit" ? "block space-y-6" : "hidden"}>
          {/* Section 1: Basic Information */}
          <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
              <h2 className="text-base sm:text-lg font-bold text-[#111827] flex items-center gap-2">
                <Sparkles size={18} className="text-[#059669]" /> 1. Basic Package Information
              </h2>
              <span className="text-[11px] font-semibold text-[#047857] bg-[#ECFDF5] border border-[#A7F3D0] px-2.5 py-0.5 rounded-full">
                Core Details
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1.5">
                  Package Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!isEditing) {
                      setSlug(
                        e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, "-")
                          .replace(/(^-|-$)/g, "")
                      );
                    }
                  }}
                  required
                  placeholder="e.g. Madurai Heritage & Rameswaram Circuit"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E5E7EB] text-[#111827] text-sm placeholder-[#9CA3AF] focus:outline-none focus:border-[#059669] focus:ring-2 focus:ring-[#A7F3D0] transition-all shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1.5">
                  URL Slug
                </label>
                <input
                  type="text"
                  name="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="madurai-heritage-circuit"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E5E7EB] text-[#111827] text-sm font-mono placeholder-[#9CA3AF] focus:outline-none focus:border-[#059669] focus:ring-2 focus:ring-[#A7F3D0] transition-all shadow-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1.5">
                Destinations (Comma-separated)
              </label>
              <input
                type="text"
                name="destinations"
                value={destinations}
                onChange={(e) => setDestinations(e.target.value)}
                placeholder="Madurai, Rameswaram, Kodaikanal"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E5E7EB] text-[#111827] text-sm placeholder-[#9CA3AF] focus:outline-none focus:border-[#059669] focus:ring-2 focus:ring-[#A7F3D0] transition-all shadow-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1.5">
                Package Summary / Subtitle
              </label>
              <textarea
                name="summary"
                rows={2}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="A curated tour covering sacred shrines, architectural landmarks, and scenic hill country..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E5E7EB] text-[#111827] text-sm placeholder-[#9CA3AF] focus:outline-none focus:border-[#059669] focus:ring-2 focus:ring-[#A7F3D0] transition-all shadow-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1.5">
                Package Hero Banner Image
              </label>
              <ImageUploader
                name="hero_image_url"
                defaultValue={heroImageUrl}
                bucket="package-media"
                aspectRatio="video"
                placeholder="https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1200&q=80"
                onChange={(url) => setHeroImageUrl(url)}
                className="text-[#111827]"
              />
            </div>
          </div>

          {/* Section 2: Duration, Pricing & Vehicle */}
          <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E5E7EB]">
              <h2 className="text-base sm:text-lg font-bold text-[#111827] flex items-center gap-2">
                <Clock size={18} className="text-[#059669]" /> 2. Duration, Capacity &amp; Pricing
              </h2>
              <button
                type="button"
                onClick={handleAutoGenerateStops}
                className="text-xs font-semibold text-[#047857] bg-[#ECFDF5] hover:bg-[#D1FAE5] border border-[#A7F3D0] px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1.5 self-start sm:self-auto"
              >
                <Compass size={14} /> Auto-Generate Itinerary Stops
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1.5">
                  Duration Days *
                </label>
                <input
                  type="number"
                  name="duration_days"
                  value={durationDays}
                  onChange={(e) => setDurationDays(Number(e.target.value))}
                  min={1}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E5E7EB] text-[#111827] text-sm focus:outline-none focus:border-[#059669] focus:ring-2 focus:ring-[#A7F3D0] transition-all shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1.5">
                  Duration Nights *
                </label>
                <input
                  type="number"
                  name="duration_nights"
                  value={durationNights}
                  onChange={(e) => setDurationNights(Number(e.target.value))}
                  min={0}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E5E7EB] text-[#111827] text-sm focus:outline-none focus:border-[#059669] focus:ring-2 focus:ring-[#A7F3D0] transition-all shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1.5">
                  Max Capacity (Pax)
                </label>
                <input
                  type="number"
                  name="pax_capacity"
                  value={paxCapacity}
                  onChange={(e) => setPaxCapacity(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E5E7EB] text-[#111827] text-sm focus:outline-none focus:border-[#059669] focus:ring-2 focus:ring-[#A7F3D0] transition-all shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1.5">
                  Vehicle Type
                </label>
                <select
                  name="vehicle_type"
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E5E7EB] text-[#111827] text-sm font-medium focus:outline-none focus:border-[#059669] focus:ring-2 focus:ring-[#A7F3D0] transition-all shadow-sm"
                >
                  <option value="jeep">Jeep Safari</option>
                  <option value="boat">Houseboat / Cruise</option>
                  <option value="tuk-tuk">Tuk-Tuk Heritage</option>
                  <option value="bike">Motorcycle Expedition</option>
                  <option value="train">Scenic Mountain Train</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1.5">
                  Price (With Food) ₹ *
                </label>
                <input
                  type="number"
                  name="price_with_food"
                  value={priceWithFood}
                  onChange={(e) => setPriceWithFood(Number(e.target.value))}
                  step="100"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E5E7EB] text-[#111827] text-sm focus:outline-none focus:border-[#059669] focus:ring-2 focus:ring-[#A7F3D0] transition-all shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1.5">
                  Price (Without Food) ₹
                </label>
                <input
                  type="number"
                  name="price_without_food"
                  value={priceWithoutFood}
                  onChange={(e) => setPriceWithoutFood(e.target.value)}
                  step="100"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E5E7EB] text-[#111827] text-sm focus:outline-none focus:border-[#059669] focus:ring-2 focus:ring-[#A7F3D0] transition-all shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1.5">
                  Package Status
                </label>
                <select
                  name="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E5E7EB] text-[#111827] text-sm font-semibold focus:outline-none focus:border-[#059669] focus:ring-2 focus:ring-[#A7F3D0] transition-all shadow-sm"
                >
                  <option value="published">Published (Live on Site)</option>
                  <option value="draft">Draft (Hidden)</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: DYNAMIC DAY-BY-DAY ITINERARY BUILDER */}
          <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E5E7EB]">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-[#111827] flex items-center gap-2">
                  <Calendar size={18} className="text-[#059669]" /> 3. Day-by-Day Itinerary Builder ({itineraryDays.length} Stops)
                </h2>
                <p className="text-xs text-[#6B7280] mt-0.5">
                  Configure daily highlights, activity icons, transition notes (`→`), and safe return.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddDay}
                className="px-3.5 py-2 rounded-xl bg-[#059669] text-white text-xs font-semibold hover:bg-[#047857] transition-all flex items-center gap-1.5 shadow-sm self-start sm:self-auto"
              >
                <Plus size={14} /> Add Day / Stop
              </button>
            </div>

            {/* List of Day Cards */}
            <div className="space-y-3.5">
              {itineraryDays.map((day, dIdx) => {
                const isExpanded = expandedDayId === day.id;

                return (
                  <div
                    key={day.id}
                    className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden shadow-xs transition-all"
                  >
                    {/* Day Card Header Bar */}
                    <div
                      onClick={() => setExpandedDayId(isExpanded ? null : day.id)}
                      className="p-4 flex items-center justify-between cursor-pointer hover:bg-[#F8FAFC] transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shadow-xs ${
                            day.is_departure
                              ? "bg-[#059669] text-white"
                              : day.is_return
                              ? "bg-[#F59E0B] text-white"
                              : "bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0]"
                          }`}
                        >
                          {day.is_departure ? "D0" : day.is_return ? "★" : `D${day.day_number || dIdx}`}
                        </span>

                        <div>
                          <div className="font-semibold text-sm text-[#111827]">
                            {day.title || `Day ${dIdx}`}
                          </div>
                          {day.subtitle && (
                            <div className="text-xs text-[#6B7280]">{day.subtitle}</div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-[11px] font-semibold text-[#6B7280] bg-[#F1F5F9] px-2.5 py-0.5 rounded-full">
                          {day.activities?.length || 0} activities
                        </span>
                        {isExpanded ? <ChevronUp size={16} className="text-[#6B7280]" /> : <ChevronDown size={16} className="text-[#6B7280]" />}
                      </div>
                    </div>

                    {/* Day Expanded Form Details */}
                    {isExpanded && (
                      <div className="p-5 border-t border-[#E5E7EB] bg-[#F8FAFC] space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-[#374151] mb-1">
                              Day Title *
                            </label>
                            <input
                              type="text"
                              value={day.title}
                              onChange={(e) => handleUpdateDay(day.id, { title: e.target.value })}
                              placeholder="e.g. Alleppey — Life on the Backwaters"
                              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E5E7EB] text-sm text-[#111827] focus:outline-none focus:border-[#059669] focus:ring-2 focus:ring-[#A7F3D0] shadow-sm"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-[#374151] mb-1">
                              Day Subtitle
                            </label>
                            <input
                              type="text"
                              value={day.subtitle}
                              onChange={(e) => handleUpdateDay(day.id, { subtitle: e.target.value })}
                              placeholder="e.g. Private Houseboat Cruise"
                              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E5E7EB] text-sm text-[#111827] focus:outline-none focus:border-[#059669] focus:ring-2 focus:ring-[#A7F3D0] shadow-sm"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[#374151] mb-1">
                            Day Photo (Upload File or Direct Image URL)
                          </label>
                          <ImageUploader
                            name={`day_photo_${day.id}`}
                            defaultValue={day.photo_url}
                            bucket="package-media"
                            aspectRatio="video"
                            placeholder="https://images.unsplash.com/photo-..."
                            onChange={(url) => handleUpdateDay(day.id, { photo_url: url })}
                            className="text-[#111827]"
                          />
                        </div>

                        {/* Activities List Editor */}
                        <div className="space-y-3 pt-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-[#111827]">
                              Scheduled Activities &amp; Highlights:
                            </span>
                            <button
                              type="button"
                              onClick={() => handleAddActivity(day.id)}
                              className="text-xs font-semibold text-[#059669] hover:text-[#047857] flex items-center gap-1"
                            >
                              <Plus size={12} /> Add Activity
                            </button>
                          </div>

                          <div className="space-y-2">
                            {day.activities.map((act) => (
                              <div
                                key={act.id}
                                className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-[#E5E7EB] shadow-xs"
                              >
                                <ActivityIconPicker
                                  value={act.icon}
                                  onChange={(iconKey) =>
                                    handleUpdateActivity(day.id, act.id, { icon: iconKey })
                                  }
                                />

                                <input
                                  type="text"
                                  value={act.label}
                                  onChange={(e) =>
                                    handleUpdateActivity(day.id, act.id, { label: e.target.value })
                                  }
                                  placeholder="e.g. Sunset cruise along backwaters"
                                  className="flex-1 px-3 py-2 text-xs text-[#111827] rounded-lg border border-[#E5E7EB] focus:outline-none focus:border-[#059669] focus:ring-2 focus:ring-[#A7F3D0]"
                                />

                                <button
                                  type="button"
                                  onClick={() => handleRemoveActivity(day.id, act.id)}
                                  className="p-2 text-[#9CA3AF] hover:text-[#DC2626] hover:bg-[#FEF2F2] rounded-lg transition-colors shrink-0"
                                  title="Remove activity"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Transition Text to Next Stop */}
                        <div>
                          <label className="block text-xs font-semibold text-[#374151] mb-1">
                            Transition Note to Next Stop (`→`)
                          </label>
                          <input
                            type="text"
                            value={day.transition_text}
                            onChange={(e) =>
                              handleUpdateDay(day.id, { transition_text: e.target.value })
                            }
                            placeholder="e.g. Early morning scenic drive south to Alleppey (90 min)..."
                            className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E5E7EB] text-xs italic text-[#111827] focus:outline-none focus:border-[#059669] focus:ring-2 focus:ring-[#A7F3D0]"
                          />
                        </div>

                        {/* Day Card Footer Actions */}
                        <div className="flex items-center justify-between pt-3 border-t border-[#E5E7EB]">
                          <button
                            type="button"
                            onClick={() => handleRemoveDay(day.id)}
                            className="text-xs font-semibold text-[#DC2626] hover:text-[#B91C1C] flex items-center gap-1"
                          >
                            <Trash2 size={13} /> Remove Stop
                          </button>

                          <button
                            type="button"
                            onClick={() => setExpandedDayId(null)}
                            className="text-xs font-semibold text-[#059669] hover:underline"
                          >
                            Done Editing Stop
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 4: Media, Inclusions & Exclusions */}
          <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-sm space-y-4">
            <h2 className="text-base sm:text-lg font-bold text-[#111827] flex items-center gap-2 pb-3 border-b border-[#E5E7EB]">
              <Camera size={18} className="text-[#059669]" /> 4. Inclusions &amp; Exclusions
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1.5">
                  Package Inclusions (One item per line)
                </label>
                <textarea
                  name="inclusions"
                  rows={5}
                  value={inclusionsText}
                  onChange={(e) => setInclusionsText(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E5E7EB] text-[#111827] text-xs font-mono focus:outline-none focus:border-[#059669] focus:ring-2 focus:ring-[#A7F3D0] shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1.5">
                  Package Exclusions (One item per line)
                </label>
                <textarea
                  name="exclusions"
                  rows={5}
                  value={exclusionsText}
                  onChange={(e) => setExclusionsText(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E5E7EB] text-[#111827] text-xs font-mono focus:outline-none focus:border-[#059669] focus:ring-2 focus:ring-[#A7F3D0] shadow-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* TAB 2: REAL-TIME LIVE TRAVEL PREVIEW */}
        <div className={activeTab === "preview" ? "block space-y-6" : "hidden"}>
          <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-[#059669] uppercase tracking-wider">
                Live Customer View Simulation
              </span>
              <h2 className="text-xl font-bold text-[#111827] mt-0.5">
                {name || "Untitled Tour Package"}
              </h2>
            </div>

            <div className="flex items-center gap-1.5 bg-[#F1F5F9] p-1 rounded-xl border border-[#E5E7EB]">
              <button
                type="button"
                onClick={() => setPreviewFoodToggle("with")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  previewFoodToggle === "with"
                    ? "bg-[#059669] text-white shadow-sm"
                    : "text-[#6B7280] hover:text-[#111827]"
                }`}
              >
                With Food: ₹{priceWithFood.toLocaleString("en-IN")}
              </button>
              <button
                type="button"
                onClick={() => setPreviewFoodToggle("without")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  previewFoodToggle === "without"
                    ? "bg-[#059669] text-white shadow-sm"
                    : "text-[#6B7280] hover:text-[#111827]"
                }`}
              >
                Without Food: ₹{Number(priceWithoutFood || priceWithFood).toLocaleString("en-IN")}
              </button>
            </div>
          </div>

          {/* Package Card Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <h3 className="text-sm font-bold text-[#111827] mb-3">
                Card Preview (Listing &amp; Carousel)
              </h3>
              <div className="bg-white rounded-2xl overflow-hidden border border-[#E5E7EB] shadow-md">
                <div className="relative h-56 bg-slate-100">
                  {heroImageUrl && (
                    <Image
                      src={heroImageUrl}
                      alt={name || "Preview"}
                      fill
                      className="object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#059669] text-white shadow-sm">
                      {durationDays}D / {durationNights}N
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <h4 className="font-bold text-lg leading-tight">
                      {name || "Kerala Holiday"}
                    </h4>
                    <p className="text-xs text-white/90 line-clamp-1 mt-0.5">
                      {destinations}
                    </p>
                  </div>
                </div>

                <div className="p-5 space-y-4">
                  <p className="text-xs text-[#4B5563] leading-relaxed line-clamp-2">
                    {summary}
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-[#E5E7EB]">
                    <div>
                      <div className="text-[10px] uppercase font-bold text-[#6B7280]">Starting From</div>
                      <div className="text-lg font-extrabold text-[#059669]">
                        ₹{(previewFoodToggle === "with" ? priceWithFood : Number(priceWithoutFood || priceWithFood)).toLocaleString("en-IN")}
                      </div>
                    </div>
                    <span className="px-3.5 py-2 rounded-xl bg-[#059669] text-white text-xs font-semibold">
                      Explore Itinerary →
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Journey Road Timeline Preview */}
            <div className="lg:col-span-2">
              <h3 className="text-sm font-bold text-[#111827] mb-3">
                Live Journey Road / Itinerary Timeline ({itineraryDays.length} Stops)
              </h3>

              <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-md space-y-6">
                <div className="flex items-center gap-2 pb-4 border-b border-[#E5E7EB]">
                  <Compass className="text-[#059669]" size={20} />
                  <span className="font-bold text-base text-[#111827]">
                    Day-by-Day Interactive Travel Experience
                  </span>
                </div>

                <div className="space-y-6">
                  {itineraryDays.map((day, idx) => (
                    <div key={day.id} className="relative pl-8 border-l-2 border-emerald-200 pb-4 last:border-l-0">
                      {/* Timeline Dot */}
                      <span
                        className={`absolute -left-[17px] top-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-sm ${
                          day.is_departure
                            ? "bg-[#059669] text-white"
                            : day.is_return
                            ? "bg-[#F59E0B] text-white"
                            : "bg-[#059669] text-white"
                        }`}
                      >
                        {day.is_departure ? "D0" : day.is_return ? "★" : idx}
                      </span>

                      <div className="bg-[#F8FAFC] rounded-xl p-4 border border-[#E5E7EB] shadow-xs space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-bold text-sm text-[#111827]">
                              {day.title}
                            </h4>
                            {day.subtitle && (
                              <p className="text-xs text-[#6B7280] mt-0.5">{day.subtitle}</p>
                            )}
                          </div>
                        </div>

                        {day.activities && day.activities.length > 0 && (
                          <div className="space-y-2 pt-1">
                            {day.activities.map((act) => (
                              <div key={act.id} className="flex items-start gap-2.5 text-xs text-[#374151]">
                                <span className="w-5 h-5 rounded-md bg-white border border-[#E5E7EB] flex items-center justify-center shrink-0 mt-0.5 text-[#059669]">
                                  <ActivityIcon icon={act.icon} size={11} />
                                </span>
                                <span>{act.label}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {day.transition_text && (
                          <div className="mt-2.5 pt-2 border-t border-dashed border-[#E5E7EB] text-[11px] text-[#059669] font-medium flex items-center gap-1.5 italic">
                            <span>→</span>
                            <span>{day.transition_text}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Save Bar */}
        <div className="sticky bottom-4 z-20 bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-[#E5E7EB] shadow-lg flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse" />
            <span className="text-xs font-semibold text-[#047857]">
              {status === "published" ? "Will publish live immediately" : "Saving as draft"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/packages"
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#6B7280] hover:text-[#111827] transition-colors"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#059669] hover:bg-[#047857] text-white text-xs font-semibold shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer"
            >
              <Save size={14} />
              <span>{isEditing ? "Save & Update Package" : "Publish Package"}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
