import {
  Coffee,
  UtensilsCrossed,
  Moon,
  Bus,
  Waves,
  Sunset,
  Sunrise,
  Sun,
  Camera,
  Ticket,
  ShoppingBag,
  Heart,
  TreePine,
  Trees,
  Mountain,
  Palmtree,
  Dumbbell,
  Bike,
  Ship,
  Train,
  Plane,
  Car,
  MapPin,
  Star,
  Hotel,
  Bed,
  Home,
  Tent,
  Castle,
  Landmark,
  Wine,
  Sparkles,
  Footprints,
  Flame,
  Binoculars,
  Compass,
  Navigation,
  Anchor,
  Music,
  Bath,
  Gem,
  Gift,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

export const ACTIVITY_CATEGORIES = [
  {
    id: "all",
    label: "All Icons",
  },
  {
    id: "transit",
    label: "Transit & Travel",
    icons: ["transport", "bus", "car", "train", "flight", "boat", "cruise", "ferry", "bike", "navigation", "map"],
  },
  {
    id: "stays",
    label: "Stays & Lodging",
    icons: ["hotel", "stay", "resort", "homestay", "camp", "tent", "heritage", "palace"],
  },
  {
    id: "dining",
    label: "Food & Dining",
    icons: ["breakfast", "coffee", "meal", "lunch", "dinner", "tea", "drink", "traditional"],
  },
  {
    id: "nature",
    label: "Nature & Views",
    icons: ["beach", "water", "nature", "forest", "mountain", "hillstation", "sunrise", "sunset", "wildlife", "safari"],
  },
  {
    id: "adventure",
    label: "Adventure & Highlights",
    icons: ["activity", "sightseeing", "trek", "hike", "photography", "camera", "campfire", "culture", "special", "highlight"],
  },
  {
    id: "wellness",
    label: "Wellness & Leisure",
    icons: ["spa", "massage", "ayurveda", "wellness", "shopping", "temple", "monument"],
  },
] as const;

export const ICON_MAP: Record<string, LucideIcon> = {
  // Stays
  hotel: Hotel,
  stay: Moon,
  night: Moon,
  sleep: Moon,
  resort: Bed,
  homestay: Home,
  camp: Tent,
  tent: Tent,
  heritage: Landmark,
  palace: Castle,

  // Dining
  breakfast: Coffee,
  coffee: Coffee,
  tea: Coffee,
  meal: UtensilsCrossed,
  lunch: UtensilsCrossed,
  dinner: UtensilsCrossed,
  food: UtensilsCrossed,
  drink: Wine,
  traditional: UtensilsCrossed,

  // Transit
  transport: Bus,
  bus: Bus,
  drive: Car,
  car: Car,
  train: Train,
  flight: Plane,
  fly: Plane,
  airport: Plane,
  plane: Plane,
  boat: Ship,
  cruise: Ship,
  houseboat: Ship,
  ferry: Ship,
  anchor: Anchor,
  bike: Bike,
  bicycle: Bike,
  navigation: Navigation,
  compass: Compass,
  map: MapPin,
  location: MapPin,

  // Nature
  swim: Waves,
  beach: Waves,
  water: Waves,
  ocean: Waves,
  sunset: Sunset,
  sunrise: Sunrise,
  sun: Sun,
  nature: TreePine,
  tree: TreePine,
  forest: Trees,
  trees: Trees,
  mountain: Mountain,
  hillstation: Mountain,
  palm: Palmtree,
  safari: Binoculars,
  wildlife: Binoculars,

  // Activities & Culture
  activity: Ticket,
  sightseeing: Ticket,
  ticket: Ticket,
  trek: Footprints,
  hike: Footprints,
  walk: Footprints,
  footprints: Footprints,
  campfire: Flame,
  bonfire: Flame,
  photo: Camera,
  photography: Camera,
  camera: Camera,
  culture: Music,
  music: Music,
  special: Star,
  highlight: Sparkles,
  sparkles: Sparkles,
  temple: Landmark,
  monument: Landmark,

  // Wellness & Shopping
  spa: Heart,
  massage: Heart,
  ayurveda: Bath,
  wellness: Bath,
  shopping: ShoppingBag,
  market: ShoppingBag,
  gift: Gift,
  gem: Gem,
  gym: Dumbbell,
  safety: ShieldCheck,
};

// Curated list for icon picker with labels and categories
export interface IconOption {
  value: string;
  label: string;
  category: "transit" | "stays" | "dining" | "nature" | "adventure" | "wellness";
}

export const ALL_ICON_OPTIONS: IconOption[] = [
  // Transit
  { value: "transport", label: "Coach / Bus", category: "transit" },
  { value: "car", label: "Private Car / Cab", category: "transit" },
  { value: "train", label: "Scenic Train", category: "transit" },
  { value: "flight", label: "Flight / Airport", category: "transit" },
  { value: "boat", label: "Houseboat / Boat", category: "transit" },
  { value: "cruise", label: "Luxury Cruise", category: "transit" },
  { value: "ferry", label: "Island Ferry", category: "transit" },
  { value: "bike", label: "Bicycle / Bike", category: "transit" },
  { value: "compass", label: "Guided Route", category: "transit" },
  { value: "map", label: "Destination / Stop", category: "transit" },

  // Stays
  { value: "hotel", label: "Hotel / Resort", category: "stays" },
  { value: "homestay", label: "Heritage Homestay", category: "stays" },
  { value: "stay", label: "Overnight Rest", category: "stays" },
  { value: "camp", label: "Camp / Glamping", category: "stays" },
  { value: "palace", label: "Heritage Palace", category: "stays" },

  // Dining
  { value: "breakfast", label: "Morning Breakfast", category: "dining" },
  { value: "coffee", label: "Coffee / Tea Break", category: "dining" },
  { value: "lunch", label: "Authentic Lunch", category: "dining" },
  { value: "dinner", label: "Dinner / Sadya", category: "dining" },
  { value: "drink", label: "Beverages / Welcome Drink", category: "dining" },

  // Nature
  { value: "beach", label: "Beach / Coastal", category: "nature" },
  { value: "sunset", label: "Sunset Viewpoint", category: "nature" },
  { value: "sunrise", label: "Sunrise View", category: "nature" },
  { value: "mountain", label: "Highlands / Peaks", category: "nature" },
  { value: "forest", label: "Rainforest / Woods", category: "nature" },
  { value: "nature", label: "Pine Trees / Flora", category: "nature" },
  { value: "safari", label: "Wildlife Safari", category: "nature" },

  // Adventure
  { value: "activity", label: "General Sightseeing", category: "adventure" },
  { value: "trek", label: "Trekking / Hike", category: "adventure" },
  { value: "photography", label: "Photo Stop", category: "adventure" },
  { value: "culture", label: "Cultural Show / Dance", category: "adventure" },
  { value: "campfire", label: "Campfire & Music", category: "adventure" },
  { value: "monument", label: "Historical Landmark", category: "adventure" },
  { value: "highlight", label: "Special Highlight", category: "adventure" },

  // Wellness
  { value: "ayurveda", label: "Ayurveda / Therapy", category: "wellness" },
  { value: "spa", label: "Spa & Rejuvenation", category: "wellness" },
  { value: "shopping", label: "Spice & Craft Market", category: "wellness" },
  { value: "gift", label: "Souvenir / Keepsake", category: "wellness" },
];

interface ActivityIconProps {
  icon: string;
  size?: number;
  className?: string;
}

export default function ActivityIcon({ icon, size = 16, className = "" }: ActivityIconProps) {
  const key = (icon || "").toLowerCase().trim();
  const IconComponent = ICON_MAP[key] ?? Ticket;

  return (
    <IconComponent
      size={size}
      className={`text-[var(--color-primary)] ${className}`}
    />
  );
}
