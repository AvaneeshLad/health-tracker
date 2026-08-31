import React from "react";
import {
  Flame,
  Sun,
  Moon,
  Brain,
  Dumbbell,
  Book,
  Ban,
  Utensils,
  Droplet,
  PenTool,
  Check,
  Zap,
  Target,
  Shield,
  Heart,
  Activity,
  Award,
  Sparkles,
  Footprints,
  Coffee,
  Code,
  Compass,
  Smile,
  Clock,
  Circle,
  type LucideProps,
} from "lucide-react";

export const ICON_OPTIONS = [
  { id: "flame", label: "Flame", Icon: Flame },
  { id: "sun", label: "Sun (Morning)", Icon: Sun },
  { id: "moon", label: "Moon (Sleep)", Icon: Moon },
  { id: "brain", label: "Brain (Meditation/Focus)", Icon: Brain },
  { id: "dumbbell", label: "Dumbbell (Workout)", Icon: Dumbbell },
  { id: "book", label: "Book (Reading)", Icon: Book },
  { id: "droplet", label: "Droplet (Water)", Icon: Droplet },
  { id: "ban", label: "Ban (No Sugar/Junk)", Icon: Ban },
  { id: "utensils", label: "Utensils (Clean Eating)", Icon: Utensils },
  { id: "pen-tool", label: "Journal / Writing", Icon: PenTool },
  { id: "zap", label: "Zap (Discipline/Energy)", Icon: Zap },
  { id: "target", label: "Target (Goal)", Icon: Target },
  { id: "shield", label: "Shield (Defense)", Icon: Shield },
  { id: "heart", label: "Heart (Health)", Icon: Heart },
  { id: "activity", label: "Activity (Cardio)", Icon: Activity },
  { id: "footprints", label: "Steps / Walk", Icon: Footprints },
  { id: "coffee", label: "Coffee / Routine", Icon: Coffee },
  { id: "code", label: "Code / Deep Work", Icon: Code },
  { id: "compass", label: "Compass (Direction)", Icon: Compass },
  { id: "clock", label: "Clock (Punctuality)", Icon: Clock },
];

const ICON_MAP: Record<string, React.ComponentType<LucideProps>> = {
  flame: Flame,
  sun: Sun,
  moon: Moon,
  brain: Brain,
  dumbbell: Dumbbell,
  book: Book,
  droplet: Droplet,
  ban: Ban,
  utensils: Utensils,
  "pen-tool": PenTool,
  zap: Zap,
  target: Target,
  shield: Shield,
  heart: Heart,
  activity: Activity,
  award: Award,
  sparkles: Sparkles,
  footprints: Footprints,
  coffee: Coffee,
  code: Code,
  compass: Compass,
  smile: Smile,
  clock: Clock,
  check: Check,
};

interface IconRendererProps extends LucideProps {
  name: string;
}

export function IconRenderer({ name, ...props }: IconRendererProps) {
  const IconComponent = ICON_MAP[name.toLowerCase()] || Flame;
  return <IconComponent {...props} />;
}
