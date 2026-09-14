import {
  Coffee,
  UtensilsCrossed,
  Moon,
  Bus,
  Waves,
  Sunset,
  Camera,
  Ticket,
  ShoppingBag,
  Heart,
  TreePine,
  Dumbbell,
  Bike,
  Ship,
  Train,
  Plane,
  MapPin,
  Star,
  type LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  breakfast: Coffee,
  coffee: Coffee,
  meal: UtensilsCrossed,
  lunch: UtensilsCrossed,
  dinner: UtensilsCrossed,
  food: UtensilsCrossed,
  hotel: Moon,
  stay: Moon,
  night: Moon,
  sleep: Moon,
  transport: Bus,
  bus: Bus,
  drive: Bus,
  swim: Waves,
  beach: Waves,
  water: Waves,
  ocean: Waves,
  sunset: Sunset,
  sunrise: Sunset,
  photo: Camera,
  photography: Camera,
  camera: Camera,
  activity: Ticket,
  sightseeing: Ticket,
  ticket: Ticket,
  shopping: ShoppingBag,
  spa: Heart,
  massage: Heart,
  ayurveda: Heart,
  wellness: Heart,
  nature: TreePine,
  trek: TreePine,
  hike: TreePine,
  forest: TreePine,
  gym: Dumbbell,
  bike: Bike,
  bicycle: Bike,
  boat: Ship,
  cruise: Ship,
  houseboat: Ship,
  ferry: Ship,
  train: Train,
  flight: Plane,
  fly: Plane,
  airport: Plane,
  map: MapPin,
  location: MapPin,
  special: Star,
  highlight: Star,
};

interface ActivityIconProps {
  icon: string;
  size?: number;
  className?: string;
}

export default function ActivityIcon({ icon, size = 16, className = "" }: ActivityIconProps) {
  const key = icon.toLowerCase().trim();
  const IconComponent = ICON_MAP[key] ?? Ticket;

  return (
    <IconComponent
      size={size}
      className={`text-[var(--color-primary)] ${className}`}
    />
  );
}
