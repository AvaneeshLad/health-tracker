const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

function formatDate(d) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addDays(d, days) {
  const next = new Date(d);
  next.setDate(next.getDate() + days);
  return next;
}

async function main() {
  console.log("Seeding Winter Arc Tracker database...");

  // Clean existing data
  await prisma.habitCompletion.deleteMany();
  await prisma.habit.deleteMany();
  await prisma.user.deleteMany();

  // Create Demo User
  const passwordHash = await bcrypt.hash("discipline2026", 10);
  const user = await prisma.user.create({
    data: {
      name: "Alex Thorne",
      email: "demo@winterarc.com",
      passwordHash,
    },
  });

  console.log(`Created user: ${user.name} (${user.email})`);

  // Create 8 Winter Arc Habits
  const habitsData = [
    {
      name: "Wake up before 7:30 AM",
      description: "Start the day with discipline. No snooze button.",
      icon: "sun",
      category: "discipline",
      sortOrder: 1,
    },
    {
      name: "Meditation / Mindfulness",
      description: "10-15 minutes silence and breathwork.",
      icon: "brain",
      category: "mindset",
      sortOrder: 2,
    },
    {
      name: "Workout / Strength Training",
      description: "Heavy lifting, calisthenics, or endurance cardio.",
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
      name: "Less mobile screen time",
      description: "Maintaining a healthy attention span.",
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
      name: "Sleep before 11:00 PM",
      description: "7-8 hours restorative sleep. Protect recovery.",
      icon: "moon",
      category: "routine",
      sortOrder: 8,
    },
  ];

  const createdHabits = [];
  for (const h of habitsData) {
    const habit = await prisma.habit.create({
      data: {
        userId: user.id,
        ...h,
        isActive: true,
      },
    });
    createdHabits.push(habit);
  }

  console.log(`Created ${createdHabits.length} habits.`);

  // Generate 35 days of realistic historical completion data
  const today = new Date();
  const completionsToCreate = [];

  // Patterns for each habit over past 35 days (day 34 ago to day 0 = today)
  for (let offset = 34; offset >= 0; offset--) {
    const targetDate = addDays(today, -offset);
    const dateStr = formatDate(targetDate);

    // Realistic patterns:
    // Day 20 ago was a rest/off day (missed day)
    // Day 10 ago was partial day
    // Last 7 days is a strong streak
    createdHabits.forEach((habit, habitIndex) => {
      let isCompleted = false;

      if (offset === 20) {
        // Off day: only water was checked
        isCompleted = habit.name.includes("Water");
      } else if (offset === 10) {
        // Partial day: 5 out of 8 completed
        isCompleted = habitIndex < 5;
      } else if (offset === 0) {
        // Today: 6 out of 8 completed so far
        isCompleted = habitIndex < 6;
      } else if (offset <= 7) {
        // Last 7 days: 100% discipline streak!
        isCompleted = true;
      } else {
        // General realistic consistency (80-90% completion)
        const pseudoRandom = (offset * 13 + habitIndex * 7) % 10;
        isCompleted = pseudoRandom !== 3; // ~90% completion
      }

      if (isCompleted) {
        completionsToCreate.push({
          userId: user.id,
          habitId: habit.id,
          date: dateStr,
          completedAt: targetDate,
        });
      }
    });
  }

  await prisma.habitCompletion.createMany({
    data: completionsToCreate,
  });

  console.log(
    `Seeded ${completionsToCreate.length} habit completions across 35 days.`
  );
  console.log("Seeding complete! You can login with demo@winterarc.com / discipline2026");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
