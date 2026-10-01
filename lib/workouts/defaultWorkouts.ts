export interface Exercise {
  id: string;
  name: string;
  setsReps: string;
  target?: string;
  category: "push" | "pull" | "legs" | "core" | "fullbody" | "conditioning" | "recovery" | "other";
  notes?: string;
  isOptional?: boolean;
}

export interface DayWorkout {
  id: string;
  dayName: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
  shortName: "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN";
  title: string;
  focus: string;
  mainGoal: string;
  exercises: Exercise[];
  roundsNote?: string;
  cooldownNote?: string;
}

export interface WorkoutProgramInfo {
  title: string;
  goal: string;
  stats: string;
  generalRules: string[];
}

export const PROGRAM_INFO: WorkoutProgramInfo = {
  title: "Home Calisthenics Weekly Workout Plan",
  goal: "Lean, muscular, athletic/calisthenic physique & gradual fat loss",
  stats: "Starting point: 72 kg • 165 cm • Home workouts • No dumbbells required • Sunday rest",
  generalRules: [
    "Warm up for about 5 minutes before each session.",
    "Rest 60–90 seconds between normal sets.",
    "Rest 1.5–2 minutes between full-body circuit rounds.",
    "Keep repetitions controlled with full range of motion; stop immediately if you feel sharp joint pain.",
  ],
};

export const DEFAULT_WEEKLY_WORKOUTS: DayWorkout[] = [
  {
    id: "monday",
    dayName: "Monday",
    shortName: "MON",
    title: "Push + Core",
    focus: "Chest, shoulders, triceps, abs",
    mainGoal: "Upper body pushing power & core stability",
    exercises: [
      {
        id: "mon-1",
        name: "Push-ups",
        setsReps: "4 × 8–15",
        target: "Chest & Triceps",
        category: "push",
        notes: "Full depth, chest touching or near floor, locked-out elbows at top",
      },
      {
        id: "mon-2",
        name: "Diamond push-ups",
        setsReps: "3 × 6–12",
        target: "Triceps & Inner Chest",
        category: "push",
        notes: "Hands forming a diamond shape below the center of your chest",
      },
      {
        id: "mon-3",
        name: "Pike push-ups",
        setsReps: "3 × 6–12",
        target: "Anterior & Lateral Deltoids",
        category: "push",
        notes: "Hips elevated in inverted V; lower head in front of hands",
      },
      {
        id: "mon-4",
        name: "Decline push-ups",
        setsReps: "3 × 8–12",
        target: "Upper Chest & Shoulders",
        category: "push",
        notes: "Feet elevated on a couch, bed, or sturdy chair",
      },
      {
        id: "mon-5",
        name: "Chair dips",
        setsReps: "3 × 8–15",
        target: "Triceps & Lower Chest",
        category: "push",
        notes: "Ensure sturdy chair/bench; keep torso upright and shoulders depressed",
      },
      {
        id: "mon-6",
        name: "Plank",
        setsReps: "3 × 30–60 sec",
        target: "Core & Abdominals",
        category: "core",
        notes: "Tuck pelvis, engage glutes, actively push floor away",
      },
      {
        id: "mon-7",
        name: "Reverse crunches",
        setsReps: "3 × 12–20",
        target: "Lower Abs",
        category: "core",
        notes: "Curl pelvis towards ribs with controlled tempo on descent",
      },
    ],
  },
  {
    id: "tuesday",
    dayName: "Tuesday",
    shortName: "TUE",
    title: "Pull + Back",
    focus: "Back, rear delts, pulling strength",
    mainGoal: "Posterior chain hypertrophy, scapular health & pull power",
    exercises: [
      {
        id: "tue-1",
        name: "Superman pulls",
        setsReps: "4 × 12–15",
        target: "Lats & Lower Back",
        category: "pull",
        notes: "Lie prone, lift chest and squeeze lats bringing elbows back",
      },
      {
        id: "tue-2",
        name: "Prone Y-T-W raises",
        setsReps: "3 × 8 each position",
        target: "Rear Delts & Upper Back",
        category: "pull",
        notes: "8 reps in Y position, 8 in T position, 8 in W position",
      },
      {
        id: "tue-3",
        name: "Reverse snow angels",
        setsReps: "3 × 12–15",
        target: "Upper Back & Rhomboids",
        category: "pull",
        notes: "Smooth controlled circular sweeps keeping hands off floor",
      },
      {
        id: "tue-4",
        name: "Superman hold",
        setsReps: "3 × 20–40 sec",
        target: "Erectors & Glutes",
        category: "pull",
        notes: "Hold static contraction at apex with glutes tight",
      },
      {
        id: "tue-5",
        name: "Towel rows / Safe bodyweight rows",
        setsReps: "3 × 8–15",
        target: "Mid Back & Biceps",
        category: "pull",
        notes: "Use sturdy door anchor with towel or under a sturdy table",
      },
      {
        id: "tue-6",
        name: "Plank shoulder taps",
        setsReps: "3 × 20 (10/side)",
        target: "Anti-rotation Core",
        category: "core",
        notes: "Keep hips level and square without swaying",
      },
      {
        id: "tue-7",
        name: "Dead bug",
        setsReps: "3 × 10 each side",
        target: "Deep Core & Stability",
        category: "core",
        notes: "Lower back glued to floor throughout movement",
      },
      {
        id: "tue-8",
        name: "Pull-ups (Optional)",
        setsReps: "3 × max",
        target: "Lats & Biceps",
        category: "pull",
        notes: "Optional if you have safe access to a pull-up bar",
        isOptional: true,
      },
      {
        id: "tue-9",
        name: "Chin-ups (Optional)",
        setsReps: "3 × max",
        target: "Biceps & Upper Back",
        category: "pull",
        notes: "Optional if you have safe access to a pull-up bar",
        isOptional: true,
      },
    ],
  },
  {
    id: "wednesday",
    dayName: "Wednesday",
    shortName: "WED",
    title: "Legs + Core",
    focus: "Quads, hamstrings, glutes, abs",
    mainGoal: "Lower body explosion, endurance & abdominal shred",
    exercises: [
      {
        id: "wed-1",
        name: "Bodyweight squats",
        setsReps: "4 × 15–25",
        target: "Quads & Glutes",
        category: "legs",
        notes: "Parallel or below depth, knees tracking over toes",
      },
      {
        id: "wed-2",
        name: "Reverse lunges",
        setsReps: "3 × 10–15 each leg",
        target: "Quads & Hamstrings",
        category: "legs",
        notes: "Step backward with control, light tap of back knee",
      },
      {
        id: "wed-3",
        name: "Bulgarian split squats",
        setsReps: "3 × 8–12 each leg",
        target: "Single-leg Quads & Glutes",
        category: "legs",
        notes: "Rear foot elevated on chair/couch; drive through front foot",
      },
      {
        id: "wed-4",
        name: "Single-leg glute bridges",
        setsReps: "3 × 12–15 each leg",
        target: "Glutes & Hamstrings",
        category: "legs",
        notes: "Drive through heel, hold at top for 1 full second",
      },
      {
        id: "wed-5",
        name: "Calf raises",
        setsReps: "4 × 15–25",
        target: "Calves (Gastrocnemius)",
        category: "legs",
        notes: "Elevate on a step for full stretch at bottom and peak squeeze",
      },
      {
        id: "wed-6",
        name: "Wall sit",
        setsReps: "3 × 30–60 sec",
        target: "Quad Isometric Endurance",
        category: "legs",
        notes: "Thighs parallel to floor, back flat against wall",
      },
      {
        id: "wed-7",
        name: "Leg raises",
        setsReps: "3 × 8–15",
        target: "Lower Abs & Hip Flexors",
        category: "core",
        notes: "Controlled eccentric lowering without arching lower back",
      },
      {
        id: "wed-8",
        name: "Russian twists",
        setsReps: "3 × 20 (10/side)",
        target: "Obliques & Core",
        category: "core",
        notes: "Feet elevated or lightly touching floor; rotate whole torso",
      },
      {
        id: "wed-9",
        name: "Finisher Circuit",
        setsReps: "3 rounds",
        target: "Cardiovascular & Fat Burn",
        category: "conditioning",
        notes: "30s high knees + 30s mountain climbers + 30s jumping jacks + 30s rest",
      },
    ],
  },
  {
    id: "thursday",
    dayName: "Thursday",
    shortName: "THU",
    title: "Push 2 (Push + Core)",
    focus: "Chest, shoulders, triceps",
    mainGoal: "Upper body hypertrophy & time-under-tension overload",
    exercises: [
      {
        id: "thu-1",
        name: "Wide push-ups",
        setsReps: "3 × 10–20",
        target: "Chest & Anterior Delts",
        category: "push",
        notes: "Wider hand placement to maximize chest stretch and recruitment",
      },
      {
        id: "thu-2",
        name: "Diamond push-ups",
        setsReps: "3 × 6–12",
        target: "Triceps & Chest",
        category: "push",
        notes: "Tuck elbows close to ribs on the descent",
      },
      {
        id: "thu-3",
        name: "Pike push-ups",
        setsReps: "4 × 6–12",
        target: "Shoulders & Triceps",
        category: "push",
        notes: "Elevate volume for overhead pressing progression",
      },
      {
        id: "thu-4",
        name: "Slow tempo push-ups",
        setsReps: "3 × 8–12",
        target: "Chest Hypertrophy",
        category: "push",
        notes: "Strict 3 sec down, 1 sec pause at bottom, explode up",
      },
      {
        id: "thu-5",
        name: "Chair dips",
        setsReps: "3 × 10–15",
        target: "Triceps",
        category: "push",
        notes: "Extend legs forward to increase load",
      },
      {
        id: "thu-6",
        name: "Push-up halfway hold",
        setsReps: "3 × 15–30 sec",
        target: "Isometric Chest & Shoulder Strength",
        category: "push",
        notes: "Hold at 90-degree elbow bend with active core bracing",
      },
      {
        id: "thu-7",
        name: "Plank",
        setsReps: "3 × 45–60 sec",
        target: "Core Stability",
        category: "core",
        notes: "Hard contraction: squeeze quads, glutes, and abdominals",
      },
      {
        id: "thu-8",
        name: "Reverse crunch",
        setsReps: "3 × 15–20",
        target: "Lower Abs",
        category: "core",
        notes: "Slow curling motion, don't use swinging momentum",
      },
    ],
  },
  {
    id: "friday",
    dayName: "Friday",
    shortName: "FRI",
    title: "Pull + Conditioning",
    focus: "Back + conditioning",
    mainGoal: "Upper back endurance, metabolic conditioning & fat loss",
    exercises: [
      {
        id: "fri-1",
        name: "Superman pulls",
        setsReps: "4 × 12",
        target: "Lats & Lower Back",
        category: "pull",
        notes: "Squeeze shoulder blades together forcefully at bottom",
      },
      {
        id: "fri-2",
        name: "Y-T-W raises",
        setsReps: "3 × 8 each",
        target: "Rear Delts & Rotator Cuff",
        category: "pull",
        notes: "Prone position on floor or bench; thumbs up for external rotation",
      },
      {
        id: "fri-3",
        name: "Reverse snow angels",
        setsReps: "3 × 15",
        target: "Upper Back & Posture",
        category: "pull",
        notes: "Smooth slow arc from hips overhead and back",
      },
      {
        id: "fri-4",
        name: "Superman hold",
        setsReps: "3 × 30 sec",
        target: "Posterior Chain Isometric",
        category: "pull",
        notes: "Elevate chest and thighs simultaneously, breathe steadily",
      },
      {
        id: "fri-5",
        name: "Towel rows / safe bodyweight rows",
        setsReps: "3 × 10–15",
        target: "Lats & Biceps",
        category: "pull",
        notes: "Keep straight plank posture while pulling chest up",
      },
      {
        id: "fri-6",
        name: "Conditioning Finisher",
        setsReps: "4 rounds",
        target: "High-Intensity Conditioning",
        category: "conditioning",
        notes: "30 sec mountain climbers + 30 sec high knees + 30 sec burpees + 60 sec rest",
      },
    ],
  },
  {
    id: "saturday",
    dayName: "Saturday",
    shortName: "SAT",
    title: "Full Body Calisthenics",
    focus: "Athletic full-body strength",
    mainGoal: "Full body circuit endurance, total work capacity & mobility",
    roundsNote: "Perform 4 rounds of the circuit below. Rest 1.5–2 minutes between rounds.",
    cooldownNote: "Finish with 5–10 minutes of full-body stretching and mobility.",
    exercises: [
      {
        id: "sat-1",
        name: "Push-ups",
        setsReps: "4 rounds × 10–15 reps",
        target: "Chest, Shoulders & Triceps",
        category: "fullbody",
        notes: "Round circuit: fluid controlled cadence",
      },
      {
        id: "sat-2",
        name: "Bodyweight squats",
        setsReps: "4 rounds × 15–20 reps",
        target: "Quads & Glutes",
        category: "fullbody",
        notes: "Round circuit: deep squats with tall posture",
      },
      {
        id: "sat-3",
        name: "Pike push-ups",
        setsReps: "4 rounds × 8–12 reps",
        target: "Shoulders & Upper Back",
        category: "fullbody",
        notes: "Round circuit: inverted V overhead push",
      },
      {
        id: "sat-4",
        name: "Reverse lunges",
        setsReps: "4 rounds × 10 each leg",
        target: "Legs & Balance",
        category: "fullbody",
        notes: "Round circuit: alternating step back",
      },
      {
        id: "sat-5",
        name: "Superman pulls",
        setsReps: "4 rounds × 12 reps",
        target: "Lats & Lower Back",
        category: "fullbody",
        notes: "Round circuit: lat engagement on floor",
      },
      {
        id: "sat-6",
        name: "Leg raises",
        setsReps: "4 rounds × 10–15 reps",
        target: "Core & Abdominals",
        category: "fullbody",
        notes: "Round circuit: lower ab activation",
      },
      {
        id: "sat-7",
        name: "Plank",
        setsReps: "4 rounds × 30–45 sec",
        target: "Core Bracing",
        category: "fullbody",
        notes: "Round circuit: end of round core isometric hold",
      },
      {
        id: "sat-8",
        name: "Stretching & Mobility Cooldown",
        setsReps: "5–10 minutes",
        target: "Hamstrings, Hip Flexors, Chest & Shoulders",
        category: "recovery",
        notes: "Full body static stretches and gentle deep breathing",
      },
    ],
  },
  {
    id: "sunday",
    dayName: "Sunday",
    shortName: "SUN",
    title: "REST & Active Recovery",
    focus: "Recovery / optional easy walking",
    mainGoal: "Systemic recovery, muscle repair & central nervous system recharge",
    exercises: [
      {
        id: "sun-1",
        name: "Complete Rest from Structured Training",
        setsReps: "Full Day",
        target: "Central Nervous System & Muscles",
        category: "recovery",
        notes: "Allow muscle tissue to repair and glycogen stores to replenish",
      },
      {
        id: "sun-2",
        name: "Relaxed Walking (Optional)",
        setsReps: "30–60 minutes",
        target: "Low-impact Aerobic Bloodflow",
        category: "recovery",
        notes: "Easy pace outdoor or treadmill walk to stimulate lymphatic drainage",
        isOptional: true,
      },
      {
        id: "sun-3",
        name: "Prioritize Sleep, Food & Recovery",
        setsReps: "7–9 hours sleep + Hydration",
        target: "Protein Synthesis & Hormonal Balance",
        category: "recovery",
        notes: "Hit protein target (100–130g) and prepare mindset for Monday",
      },
    ],
  },
];

export const PROGRESSION_GUIDE = {
  progressiveOverload:
    "When you can reach the top of a rep range with good form, increase reps first, then move to a harder variation. Example: push-up → decline push-up → archer push-up → pseudo-planche push-up.",
  fatLoss:
    "Belly, thigh, and face fat cannot be spot-reduced. Overall body-fat reduction through consistent caloric deficit and movement is what gradually sculpts these areas.",
  protein:
    "Target 100–130 g protein/day. Key sources: eggs, chicken, fish, paneer, curd/Greek yogurt, milk, dal, rajma, chole, soy chunks, and tofu.",
  walking: "Aim for roughly 8,000–10,000 steps/day if practical for non-exercise activity thermogenesis (NEAT).",
  sleep: "Aim for 7–9 hours per night for muscle recovery and hormonal regulation.",
  tracking:
    "Take front/side photos and measure your waist every 2 weeks. Track push-ups, squats, and plank time. Focus on reducing waist size while maintaining or increasing strength, rather than chasing rapid scale-weight loss.",
  safety:
    "Chair dips and household rows require secure equipment. Do not use an unstable chair, loose door, or unsafe setup. Substitute another exercise if the setup is questionable.",
};

export const DAILY_CHECKLIST_ITEMS = [
  "Workout completed / recovery day",
  "Protein target broadly met (100–130g)",
  "Steps / walking completed (8k–10k)",
  "Water intake adequate (2.5–3.5L)",
  "7–9 hours sleep planned",
  "No need for perfection — stay consistent",
];
