export interface HabitPreset {
  name: string;
  description: string;
  icon: string;
  category: string;
  sortOrder: number;
}

export const WINTER_ARC_PRESET: HabitPreset[] = [
  {
    name: "Wake up before 7:30 AM",
    description: "Start the day with discipline. No snooze.",
    icon: "sun",
    category: "discipline",
    sortOrder: 1,
  },
  {
    name: "Meditation / Mindfulness",
    description: "10-15 minutes of silence and mental clarity.",
    icon: "brain",
    category: "mindset",
    sortOrder: 2,
  },
  {
    name: "Workout / Physical Training",
    description: "Weight training or high-intensity cardio.",
    icon: "dumbbell",
    category: "fitness",
    sortOrder: 3,
  },
  {
    name: "Read 10+ Pages",
    description: "Non-fiction, philosophy, or technical reading.",
    icon: "book",
    category: "mindset",
    sortOrder: 4,
  },
  {
    name: "No Sugar",
    description: "Zero refined sugars, desserts, or sodas.",
    icon: "ban",
    category: "health",
    sortOrder: 5,
  },
  {
    name: "Less Mobile Screen Time",
    description: "No doom scrolling, increase your attention span!",
    icon: "smartphone",
    category: "health",
    sortOrder: 6,
  },
  {
    name: "Drink 3L+ Water",
    description: "Stay fully hydrated throughout the day.",
    icon: "droplet",
    category: "health",
    sortOrder: 7,
  },
  {
    name: "Daily Journal / Review",
    description: "Write down reflections, wins, and next-day priorities.",
    icon: "pen-tool",
    category: "routine",
    sortOrder: 8,
  },
  {
    name: "Sleep before 11:00 PM",
    description: "7-8 hours restorative sleep. Guard your recovery.",
    icon: "moon",
    category: "routine",
    sortOrder: 9,
  },
];
