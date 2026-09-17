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
    initialData?.summary || "Handcrafted holiday journey curated with premium stays and authentic local experiences."
  );
  const [destinations, setDestinations] = useState(
    initialData?.destinations?.join(", ") || "Kochi, Alleppey, Varkala, Kovalam"
  );
  const [durationDays, setDurationDays] = useState(initialData?.duration_days || 4);
  const [durationNights, setDurationNights] = useState(initialData?.duration_nights || 3);
  const [paxCapacity, setPaxCapacity] = useState(initialData?.pax_capacity || 12);
  const [priceWithFood, setPriceWithFood] = useState(initialData?.price_with_food || 18500);
  const [priceWithoutFood, setPriceWithoutFood] = useState<number | string>(
    initialData?.price_without_food ?? 14200
  );
  const [heroImageUrl, setHeroImageUrl] = useState(
    initialData?.hero_image_url ||
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1200&q=80"
  );
  const [vehicleType, setVehicleType] = useState(initialData?.vehicle_type || "jeep");
  const [status, setStatus] = useState(initialData?.status || "published");

  const [inclusionsText, setInclusionsText] = useState(
    initialData?.inclusions?.join("\n") ||
      "Private AC Chauffeur Vehicle throughout\nDeluxe Heritage Homestay & Houseboat Stay\nDaily Breakfast & Traditional Meals\nBackwater Houseboat Cruise with Lunch\nKathakali Cultural Performance Pass\nAll Tolls, Fuel, Driver Allowances & Taxes"
  );

  const [exclusionsText, setExclusionsText] = useState(
    initialData?.exclusions?.join("\n") ||
      "Flight / Train tickets to and from Kerala\nPersonal expenses, tips & shopping\nMonument entry fees not mentioned\nAyurvedic massages / Optional watersports"
  );

  // Dynamic Days Itinerary State
  const defaultInitialDays: ItineraryDay[] = [
    {
      id: "day-0",
      day_number: 0,
      is_departure: true,
      title: "Departure",
      subtitle: "Journey Begins",
      photo_url: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800&q=80",
      transition_text: "Board your flight or train to Kochi. Our team will be waiting to welcome you.",
      activities: [
        { id: "a1", icon: "transport", label: "Arrive Kochi International Airport / Railway Station" },
        { id: "a2", icon: "hotel", label: "Check-in — Fort Kochi Heritage Homestay" },
        { id: "a3", icon: "sunset", label: "Evening stroll at Fort Kochi beach & sunset" },
      ],
    },
    {
      id: "day-1",
      day_number: 1,
      title: "Kochi — The Queen of the Arabian Sea",
      subtitle: "Fort Kochi & Cultural Immersion",
      photo_url: "https://images.unsplash.com/photo-1588416936097-41850ab3d86d?w=800&q=80",
      transition_text: "Early morning drive south to Alleppey (90 min). The coconut-lined road is an experience in itself.",
      activities: [
        { id: "a4", icon: "breakfast", label: "Kerala breakfast: Appam with Vegetable Stew & Roast" },
        { id: "a5", icon: "activity", label: "Chinese Fishing Nets, Jew Town & Spice Market Walk" },
        { id: "a6", icon: "culture", label: "Kathakali Classical Dance & Martial Arts Show" },
        { id: "a7", icon: "meal", label: "Dinner — Traditional Kerala Sadya served on banana leaf" },
      ],
    },
    {
      id: "day-2",
      day_number: 2,
      title: "Alleppey — Life on the Backwaters",
      subtitle: "Private Houseboat Cruise",
      photo_url: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80",
      transition_text: "Check out and drive south to Varkala (2 hrs) — watch the landscape shift from backwaters to sea cliffs.",
      activities: [
        { id: "a8", icon: "transport", label: "Drive to Alleppey jetty through coastal hamlets" },
        { id: "a9", icon: "boat", label: "Private Houseboat check-in & welcome tender coconut" },
        { id: "a10", icon: "meal", label: "Authentic Karimeen (Pearl Spot) lunch on calm canals" },
        { id: "a11", icon: "sunset", label: "Village walk & starlit overnight backwater stay" },
      ],
    },
    {
      id: "day-3",
      day_number: 3,
      title: "Varkala — Clifftop Serenity",
      subtitle: "Beach, Ayurveda & Sunset",
      photo_url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
      transition_text: "Short drive south to Kovalam (45 min) for the final coastal chapter.",
      activities: [
        { id: "a12", icon: "breakfast", label: "Breakfast on deck as morning mist clears" },
        { id: "a13", icon: "beach", label: "Cliff walk & Papanasam holy beach swim" },
        { id: "a14", icon: "ayurveda", label: "Ayurvedic rejuvenating massage session (90 min)" },
        { id: "a15", icon: "sunset", label: "Sunset overlooking the Arabian Sea from North Cliff" },
      ],
    },
    {
      id: "day-4",
      day_number: 4,
      title: "Kovalam & Farewell",
      subtitle: "Lighthouse Beach & Memories",
      photo_url: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80",
      transition_text: "Transfer to Trivandrum Airport. Until next time — Kerala awaits your return.",
      activities: [
        { id: "a16", icon: "breakfast", label: "Breakfast at clifftop café with espresso" },
        { id: "a17", icon: "beach", label: "Lighthouse Beach morning stroll & photography" },
        { id: "a18", icon: "meal", label: "Fresh coastal seafood lunch by the waves" },
      ],
    },
    {
      id: "day-return",
      day_number: 99,
      is_return: true,
      title: "Return",
      subtitle: "Safe Travels Home",
      photo_url: "",
      transition_text: "",
      activities: [
        { id: "a19", icon: "transport", label: "Fly home with unforgettable memories and stories to tell" },
      ],
    },
  ];

  const [itineraryDays, setItineraryDays] = useState<ItineraryDay[]>(
    initialData?.days && initialData.days.length > 0 ? initialData.days : defaultInitialDays
  );

  const [expandedDayId, setExpandedDayId] = useState<string | null>("day-0");
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
    <div className="p-4 md:p-8 max-w-7xl mx-auto text-[#0D1F1C]">
      {/* Top Header & Tab Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-black/10">
        <div>
          <Link
            href="/admin/packages"
            className="inline-flex items-center gap-2 text-xs font-bold text-white/60 hover:text-white mb-2 transition-colors"
          >
            <ArrowLeft size={14} /> Back to Packages
          </Link>
          <h1 className="text-2xl font-serif font-bold text-white flex items-center gap-2">
            <PackageIcon className="text-[#004741] bg-[#F0EDE4] p-1.5 rounded-lg" size={28} />
            {isEditing ? `Edit Package: ${name || "Tour Package"}` : "Create New Tour Package"}
          </h1>
          <p className="text-white/50 text-xs mt-1">
            Build your handcrafted itinerary, manage pricing, and preview in real-time.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-2 bg-white/10 p-1.5 rounded-2xl backdrop-blur-md">
          <button
            type="button"
            onClick={() => setActiveTab("edit")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "edit"
                ? "bg-[#004741] text-white shadow-md"
                : "text-white/70 hover:text-white"
            }`}
          >
            <Edit3 size={14} /> Form & Itinerary Editor
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("preview")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "preview"
                ? "bg-[#004741] text-white shadow-md"
                : "text-white/70 hover:text-white"
            }`}
          >
            <Eye size={14} /> Real-Time Live Preview
          </button>
        </div>
      </div>

      <form action={formAction} className="space-y-8">
        {/* Hidden field for full Itinerary JSON */}
        <input type="hidden" name="itinerary_json" value={itineraryJSON} />

        {/* TAB 1: FORM & DYNAMIC ITINERARY BUILDER */}
        <div className={activeTab === "edit" ? "block space-y-6" : "hidden"}>
          {/* Section 1: Basic Information */}
          <div className="bg-[#FAF8F5] rounded-3xl p-6 border border-[#DBD4C4] shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-serif font-bold text-[#004741] flex items-center gap-2">
                <Sparkles size={20} className="text-[#D49B35]" /> 1. Basic Package Information
              </h2>
              <span className="text-[11px] font-semibold text-[#004741] bg-[#004741]/10 px-3 py-1 rounded-full">
                SEO & Core Details
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#0D1F1C] mb-1.5">
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
                  placeholder="e.g. Kerala Coastal & Backwaters Odyssey"
                  className="w-full px-4 py-3 rounded-xl bg-white border border-[#DBD4C4] text-[#0D1F1C] text-sm focus:outline-none focus:border-[#004741] focus:ring-2 focus:ring-[#004741]/10"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0D1F1C] mb-1.5">
                  URL Slug
                </label>
                <input
                  type="text"
                  name="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="kerala-coastal-odyssey"
                  className="w-full px-4 py-3 rounded-xl bg-white border border-[#DBD4C4] text-[#0D1F1C] text-sm font-mono focus:outline-none focus:border-[#004741]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0D1F1C] mb-1.5">
                Destinations (Comma-separated)
              </label>
              <input
                type="text"
                name="destinations"
                value={destinations}
                onChange={(e) => setDestinations(e.target.value)}
                placeholder="Kochi, Alleppey, Varkala, Kovalam"
                className="w-full px-4 py-3 rounded-xl bg-white border border-[#DBD4C4] text-[#0D1F1C] text-sm focus:outline-none focus:border-[#004741]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0D1F1C] mb-1.5">
                Package Summary / Subtitle
              </label>
              <textarea
                name="summary"
                rows={2}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="A breathtaking journey along Kerala's tranquil backwaters and dramatic seaside cliffs..."
                className="w-full px-4 py-3 rounded-xl bg-white border border-[#DBD4C4] text-[#0D1F1C] text-sm focus:outline-none focus:border-[#004741]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0D1F1C] mb-1.5">
                Package Hero Banner Image
              </label>
              <ImageUploader
                name="hero_image_url"
                defaultValue={heroImageUrl}
                bucket="package-media"
                aspectRatio="video"
                placeholder="https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1200&q=80"
                onChange={(url) => setHeroImageUrl(url)}
                className="text-[#0D1F1C]"
              />
            </div>
          </div>

          {/* Section 2: Duration, Pricing & Vehicle */}
          <div className="bg-[#FAF8F5] rounded-3xl p-6 border border-[#DBD4C4] shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-serif font-bold text-[#004741] flex items-center gap-2">
                <Clock size={20} className="text-[#D49B35]" /> 2. Duration, Capacity & Pricing
              </h2>
              <button
                type="button"
                onClick={handleAutoGenerateStops}
                className="text-xs font-bold text-[#004741] bg-[#004741]/10 hover:bg-[#004741]/20 px-3.5 py-1.5 rounded-xl transition-colors flex items-center gap-1.5"
              >
                <Compass size={14} /> Auto-Generate Itinerary Stops
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#0D1F1C] mb-1.5">
                  Duration Days *
                </label>
                <input
                  type="number"
                  name="duration_days"
                  value={durationDays}
                  onChange={(e) => setDurationDays(Number(e.target.value))}
                  min={1}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white border border-[#DBD4C4] text-[#0D1F1C] text-sm focus:outline-none focus:border-[#004741]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0D1F1C] mb-1.5">
                  Duration Nights *
                </label>
                <input
                  type="number"
                  name="duration_nights"
                  value={durationNights}
                  onChange={(e) => setDurationNights(Number(e.target.value))}
                  min={0}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white border border-[#DBD4C4] text-[#0D1F1C] text-sm focus:outline-none focus:border-[#004741]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0D1F1C] mb-1.5">
                  Max Capacity (Pax)
                </label>
                <input
                  type="number"
                  name="pax_capacity"
                  value={paxCapacity}
                  onChange={(e) => setPaxCapacity(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-[#DBD4C4] text-[#0D1F1C] text-sm focus:outline-none focus:border-[#004741]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0D1F1C] mb-1.5">
                  Vehicle Type
                </label>
                <select
                  name="vehicle_type"
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-[#DBD4C4] text-[#0D1F1C] text-sm focus:outline-none focus:border-[#004741]"
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
                <label className="block text-xs font-bold text-[#0D1F1C] mb-1.5">
                  Price (With Food) ₹ *
                </label>
                <input
                  type="number"
                  name="price_with_food"
                  value={priceWithFood}
                  onChange={(e) => setPriceWithFood(Number(e.target.value))}
                  step="100"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white border border-[#DBD4C4] text-[#0D1F1C] text-sm focus:outline-none focus:border-[#004741]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0D1F1C] mb-1.5">
                  Price (Without Food) ₹
                </label>
                <input
                  type="number"
                  name="price_without_food"
                  value={priceWithoutFood}
                  onChange={(e) => setPriceWithoutFood(e.target.value)}
                  step="100"
                  className="w-full px-4 py-3 rounded-xl bg-white border border-[#DBD4C4] text-[#0D1F1C] text-sm focus:outline-none focus:border-[#004741]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0D1F1C] mb-1.5">
                  Status
                </label>
                <select
                  name="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-[#DBD4C4] text-[#0D1F1C] text-sm font-bold focus:outline-none focus:border-[#004741]"
                >
                  <option value="published">🟢 Published (Live on Site)</option>
                  <option value="draft">🟡 Draft</option>
                  <option value="archived">⚪ Archived</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: DYNAMIC DAY-BY-DAY ITINERARY BUILDER */}
          <div className="bg-[#FAF8F5] rounded-3xl p-6 border border-[#DBD4C4] shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-serif font-bold text-[#004741] flex items-center gap-2">
                  <Calendar size={20} className="text-[#D49B35]" /> 3. Day-by-Day Itinerary Builder ({itineraryDays.length} Stops)
                </h2>
                <p className="text-xs text-[#60736F] mt-0.5">
                  Start with Day 0 (Departure), add daily explorations, activities with icons, transition texts (`→`), and conclude with Return.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleAddDay}
                  className="px-4 py-2 rounded-xl bg-[#004741] text-white text-xs font-bold hover:bg-[#00332E] transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <Plus size={14} /> Add Day / Stop
                </button>
              </div>
            </div>

            {/* List of Day Cards */}
            <div className="space-y-4">
              {itineraryDays.map((day, dIdx) => {
                const isExpanded = expandedDayId === day.id;
                const isFirst = dIdx === 0;
                const isLast = dIdx === itineraryDays.length - 1;

                return (
                  <div
                    key={day.id}
                    className="bg-white rounded-2xl border border-[#DBD4C4] overflow-hidden shadow-sm transition-all"
                  >
                    {/* Day Card Header Bar */}
                    <div
                      onClick={() => setExpandedDayId(isExpanded ? null : day.id)}
                      className="p-4 flex items-center justify-between cursor-pointer hover:bg-[#F0EDE4]/40 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shadow-sm ${
                            day.is_departure
                              ? "bg-[#004741] text-white"
                              : day.is_return
                              ? "bg-[#D49B35] text-white"
                              : "bg-[#F0EDE4] text-[#004741] border border-[#DBD4C4]"
                          }`}
                        >
                          {day.is_departure ? "D0" : day.is_return ? "★" : `D${day.day_number || dIdx}`}
                        </span>

                        <div>
                          <div className="font-bold text-sm text-[#0D1F1C]">
                            {day.title || `Day ${dIdx}`}
                          </div>
                          {day.subtitle && (
                            <div className="text-xs text-[#60736F]">{day.subtitle}</div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-[11px] font-semibold text-[#60736F] bg-[#F0EDE4] px-2.5 py-1 rounded-full">
                          {day.activities?.length || 0} activities
                        </span>
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </div>
                    </div>

                    {/* Day Expanded Form Details */}
                    {isExpanded && (
                      <div className="p-5 border-t border-[#DBD4C4] bg-[#FAF8F5]/60 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-[#0D1F1C] mb-1">
                              Day Title *
                            </label>
                            <input
                              type="text"
                              value={day.title}
                              onChange={(e) => handleUpdateDay(day.id, { title: e.target.value })}
                              placeholder="e.g. Alleppey — Life on the Backwaters"
                              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#DBD4C4] text-sm focus:outline-none focus:border-[#004741]"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-[#0D1F1C] mb-1">
                              Day Subtitle
                            </label>
                            <input
                              type="text"
                              value={day.subtitle}
                              onChange={(e) => handleUpdateDay(day.id, { subtitle: e.target.value })}
                              placeholder="e.g. Private Houseboat Cruise"
                              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#DBD4C4] text-sm focus:outline-none focus:border-[#004741]"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-[#0D1F1C] mb-1">
                            Day Photo (Upload File or Direct Image URL)
                          </label>
                          <ImageUploader
                            name={`day_photo_${day.id}`}
                            defaultValue={day.photo_url}
                            bucket="package-media"
                            aspectRatio="video"
                            placeholder="https://images.unsplash.com/photo-..."
                            onChange={(url) => handleUpdateDay(day.id, { photo_url: url })}
                            className="text-[#0D1F1C]"
                          />
                        </div>

                        {/* Activities List Editor */}
                        <div className="space-y-3 pt-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-[#004741]">
                              Scheduled Activities & Highlights:
                            </span>
                            <button
                              type="button"
                              onClick={() => handleAddActivity(day.id)}
                              className="text-xs font-bold text-[#004741] hover:underline flex items-center gap-1"
                            >
                              <Plus size={12} /> Add Activity
                            </button>
                          </div>

                          <div className="space-y-2">
                            {day.activities.map((act) => (
                              <div
                                key={act.id}
                                className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-[#DBD4C4] shadow-xs"
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
                                  className="flex-1 px-3 py-2 text-xs text-[#0D1F1C] rounded-lg border border-[#DBD4C4] focus:outline-none focus:border-[#004741]"
                                />

                                <button
                                  type="button"
                                  onClick={() => handleRemoveActivity(day.id, act.id)}
                                  className="p-2 text-black/40 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0"
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
                          <label className="block text-xs font-bold text-[#0D1F1C] mb-1">
                            Transition Note to Next Stop (`→`)
                          </label>
                          <input
                            type="text"
                            value={day.transition_text}
                            onChange={(e) =>
                              handleUpdateDay(day.id, { transition_text: e.target.value })
                            }
                            placeholder="e.g. Early morning scenic drive south to Alleppey (90 min)..."
                            className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#DBD4C4] text-xs italic focus:outline-none focus:border-[#004741]"
                          />
                        </div>

                        {/* Day Card Footer Actions */}
                        <div className="flex items-center justify-between pt-3 border-t border-[#DBD4C4]">
                          <button
                            type="button"
                            onClick={() => handleRemoveDay(day.id)}
                            className="text-xs font-bold text-red-500 hover:text-red-700 flex items-center gap-1"
                          >
                            <Trash2 size={13} /> Remove Stop
                          </button>

                          <button
                            type="button"
                            onClick={() => setExpandedDayId(null)}
                            className="text-xs font-bold text-[#004741] hover:underline"
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
          <div className="bg-[#FAF8F5] rounded-3xl p-6 border border-[#DBD4C4] shadow-sm space-y-4">
            <h2 className="text-lg font-serif font-bold text-[#004741] flex items-center gap-2">
              <Camera size={20} className="text-[#D49B35]" /> 4. Hero Banner, Inclusions & Exclusions
            </h2>

            <div>
              <label className="block text-xs font-bold text-[#0D1F1C] mb-1.5">
                Hero Image URL
              </label>
              <input
                type="url"
                name="hero_image_url"
                value={heroImageUrl}
                onChange={(e) => setHeroImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full px-4 py-3 rounded-xl bg-white border border-[#DBD4C4] text-[#0D1F1C] text-sm focus:outline-none focus:border-[#004741]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#0D1F1C] mb-1.5">
                  Package Inclusions (One per line)
                </label>
                <textarea
                  name="inclusions"
                  rows={5}
                  value={inclusionsText}
                  onChange={(e) => setInclusionsText(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-[#DBD4C4] text-[#0D1F1C] text-xs font-mono focus:outline-none focus:border-[#004741]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0D1F1C] mb-1.5">
                  Package Exclusions (One per line)
                </label>
                <textarea
                  name="exclusions"
                  rows={5}
                  value={exclusionsText}
                  onChange={(e) => setExclusionsText(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-[#DBD4C4] text-[#0D1F1C] text-xs font-mono focus:outline-none focus:border-[#004741]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* TAB 2: REAL-TIME LIVE TRAVEL PREVIEW */}
        <div className={activeTab === "preview" ? "block space-y-8" : "hidden"}>
          <div className="bg-[#FAF8F5] rounded-3xl p-6 border border-[#DBD4C4] shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-[#004741] uppercase tracking-wider">
                Live Customer View Simulation
              </span>
              <h2 className="text-xl font-serif font-bold text-[#0D1F1C]">
                {name || "Untitled Tour Package"}
              </h2>
            </div>

            <div className="flex items-center gap-2 bg-[#F0EDE4] p-1.5 rounded-2xl border border-[#DBD4C4]">
              <button
                type="button"
                onClick={() => setPreviewFoodToggle("with")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  previewFoodToggle === "with"
                    ? "bg-[#004741] text-white shadow-sm"
                    : "text-[#60736F]"
                }`}
              >
                With Food: ₹{priceWithFood.toLocaleString("en-IN")}
              </button>
              <button
                type="button"
                onClick={() => setPreviewFoodToggle("without")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  previewFoodToggle === "without"
                    ? "bg-[#004741] text-white shadow-sm"
                    : "text-[#60736F]"
                }`}
              >
                Without Food: ₹{Number(priceWithoutFood || priceWithFood).toLocaleString("en-IN")}
              </button>
            </div>
          </div>

          {/* Package Card Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <h3 className="text-sm font-bold text-white mb-3">Card Preview (Listing & Carousel)</h3>
              <div className="bg-white rounded-3xl overflow-hidden border border-[#DBD4C4] shadow-xl">
                <div className="relative h-56 bg-black/20">
                  {heroImageUrl && (
                    <Image
                      src={heroImageUrl}
                      alt={name || "Preview"}
                      fill
                      className="object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#004741] text-white shadow-md">
                      {durationDays}D / {durationNights}N
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <h4 className="font-serif font-bold text-lg leading-tight">
                      {name || "Kerala Holiday"}
                    </h4>
                    <p className="text-xs text-white/80 line-clamp-1 mt-0.5">
                      {destinations}
                    </p>
                  </div>
                </div>

                <div className="p-5 space-y-4">
                  <p className="text-xs text-[#2D423E] leading-relaxed line-clamp-2">
                    {summary}
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-[#DBD4C4]">
                    <div>
                      <div className="text-[10px] uppercase font-bold text-[#60736F]">Starting From</div>
                      <div className="text-xl font-serif font-bold text-[#004741]">
                        ₹{(previewFoodToggle === "with" ? priceWithFood : Number(priceWithoutFood || priceWithFood)).toLocaleString("en-IN")}
                      </div>
                    </div>
                    <span className="px-4 py-2 rounded-xl bg-[#004741] text-white text-xs font-bold">
                      Explore Itinerary →
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Journey Road Timeline Preview */}
            <div className="lg:col-span-2">
              <h3 className="text-sm font-bold text-white mb-3">
                Live Journey Road / Itinerary Timeline ({itineraryDays.length} Stops)
              </h3>

              <div className="bg-[#F0EDE4] rounded-3xl p-6 border border-[#DBD4C4] shadow-xl space-y-6">
                <div className="flex items-center gap-2 pb-4 border-b border-[#DBD4C4]">
                  <Compass className="text-[#004741]" size={20} />
                  <span className="font-serif font-bold text-lg text-[#004741]">
                    Day-by-Day Interactive Travel Experience
                  </span>
                </div>

                <div className="space-y-6">
                  {itineraryDays.map((day, idx) => (
                    <div key={day.id} className="relative pl-8 border-l-2 border-[#004741]/20 pb-4 last:border-l-0">
                      {/* Timeline Dot */}
                      <span
                        className={`absolute -left-[17px] top-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-md ${
                          day.is_departure
                            ? "bg-[#004741] text-white"
                            : day.is_return
                            ? "bg-[#D49B35] text-white"
                            : "bg-[#004741] text-white"
                        }`}
                      >
                        {day.is_departure ? "D0" : day.is_return ? "★" : idx}
                      </span>

                      <div className="bg-white rounded-2xl p-5 border border-[#DBD4C4] shadow-sm space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-serif font-bold text-base text-[#004741]">
                              {day.title}
                            </h4>
                            {day.subtitle && (
                              <p className="text-xs text-[#60736F] mt-0.5">{day.subtitle}</p>
                            )}
                          </div>
                        </div>

                        {day.activities && day.activities.length > 0 && (
                          <div className="space-y-2 pt-1">
                            {day.activities.map((act) => (
                              <div key={act.id} className="flex items-start gap-2.5 text-xs text-[#2D423E]">
                                <span className="w-5 h-5 rounded-md bg-[#F0EDE4] flex items-center justify-center flex-shrink-0 mt-0.5 text-[#004741]">
                                  <ActivityIcon icon={act.icon} size={11} />
                                </span>
                                <span>{act.label}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {day.transition_text && (
                          <div className="mt-3 pt-2.5 border-t border-dashed border-[#DBD4C4] text-[11px] text-[#004741] font-medium flex items-center gap-1.5 italic">
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
        <div className="sticky bottom-4 z-20 bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-[#DBD4C4] shadow-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-[#004741]">
              {status === "published" ? "Ready to publish on live site" : "Will save as draft"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/packages"
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-[#60736F] hover:text-[#0D1F1C] transition-colors"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-[#004741] hover:bg-[#00332E] text-white text-xs font-bold shadow-lg hover:scale-105 transition-all flex items-center gap-2"
            >
              <Save size={15} />
              {isEditing ? "Save & Update Package" : "Publish Package"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
