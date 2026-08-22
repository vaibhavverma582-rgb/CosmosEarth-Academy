import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...\n");

  // ─── Categories ─────────────────────────────
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: "Astronomy",
        slug: "astronomy",
        description: "Stars, galaxies, and the cosmos",
        icon: "telescope",
        color: "cyan",
      },
    }),
    prisma.category.create({
      data: {
        name: "Planetary Science",
        slug: "planetary-science",
        description: "Worlds beyond our own",
        icon: "globe",
        color: "purple",
      },
    }),
    prisma.category.create({
      data: {
        name: "Space Engineering",
        slug: "space-engineering",
        description: "Build the future of space travel",
        icon: "satellite",
        color: "orange",
      },
    }),
    prisma.category.create({
      data: {
        name: "Astrophysics",
        slug: "astrophysics",
        description: "The physics of the universe",
        icon: "atom",
        color: "pink",
      },
    }),
  ]);

  console.log(`✅ Created ${categories.length} categories`);

  // ─── Users (Instructors) ────────────────────
  const instructors = await Promise.all([
    prisma.user.create({
      data: {
        email: "elena@cosmosearth.edu",
        name: "Dr. Elena Vasquez",
        password: "password123",
        role: "instructor",
        bio: "Former NASA JPL scientist with 15 years in planetary research.",
      },
    }),
    prisma.user.create({
      data: {
        email: "james@cosmosearth.edu",
        name: "Prof. James Chen",
        password: "password123",
        role: "instructor",
        bio: "Aerospace engineer and educator at MIT for 12 years.",
      },
    }),
    prisma.user.create({
      data: {
        email: "amara@cosmosearth.edu",
        name: "Dr. Amara Singh",
        password: "password123",
        role: "instructor",
        bio: "Published 50+ papers on black hole dynamics and dark matter.",
      },
    }),
    prisma.user.create({
      data: {
        email: "demo@cosmosearth.edu",
        name: "Demo Student",
        password: "password123",
        role: "student",
      },
    }),
  ]);

  console.log(`✅ Created ${instructors.length} users`);

  // ─── Courses ────────────────────────────────
  const courses = await Promise.all([
    prisma.course.create({
      data: {
        title: "Introduction to Cosmology",
        slug: "introduction-to-cosmology",
        description:
          "Journey through the origins, structure, and fate of the universe. From the Big Bang to dark energy — explore the fundamental science of cosmology.",
        price: 0,
        level: "beginner",
        duration: "8 weeks",
        published: true,
        featured: true,
        instructorId: instructors[0].id,
        categoryId: categories[0].id,
      },
    }),
    prisma.course.create({
      data: {
        title: "Mars Colonization Engineering",
        slug: "mars-colonization-engineering",
        description:
          "Design habitats, life support systems, and propulsion technologies for human settlement on Mars. Hands-on engineering projects included.",
        price: 49,
        level: "advanced",
        duration: "12 weeks",
        published: true,
        featured: true,
        instructorId: instructors[1].id,
        categoryId: categories[2].id,
      },
    }),
    prisma.course.create({
      data: {
        title: "Black Holes & Dark Matter",
        slug: "black-holes-dark-matter",
        description:
          "Unravel the mysteries of the most extreme objects in the universe. Study event horizons, singularities, and the invisible mass shaping galaxies.",
        price: 39,
        level: "intermediate",
        duration: "10 weeks",
        published: true,
        featured: true,
        instructorId: instructors[2].id,
        categoryId: categories[3].id,
      },
    }),
    prisma.course.create({
      data: {
        title: "The Solar System: A Tour",
        slug: "the-solar-system-a-tour",
        description:
          "An introductory journey through our cosmic neighborhood — from the scorching surface of Mercury to the icy moons of Neptune.",
        price: 0,
        level: "beginner",
        duration: "4 weeks",
        published: true,
        featured: false,
        instructorId: instructors[0].id,
        categoryId: categories[1].id,
      },
    }),
    prisma.course.create({
      data: {
        title: "Orbital Mechanics 101",
        slug: "orbital-mechanics-101",
        description:
          "Master the physics of orbits — Kepler's laws, Hohmann transfers, and gravitational assists. Includes simulation projects.",
        price: 0,
        level: "beginner",
        duration: "5 weeks",
        published: true,
        featured: false,
        instructorId: instructors[1].id,
        categoryId: categories[2].id,
      },
    }),
  ]);

  console.log(`✅ Created ${courses.length} courses`);

  // ─── Modules & Lessons ──────────────────────
  for (const course of courses) {
    const moduleCount = Math.floor(Math.random() * 3) + 3; // 3-5 modules
    for (let i = 0; i < moduleCount; i++) {
      const mod = await prisma.module.create({
        data: {
          title: `Module ${i + 1}: ${course.title} — Part ${i + 1}`,
          description: `Core concepts for ${course.title}`,
          order: i + 1,
          courseId: course.id,
        },
      });

      const lessonCount = Math.floor(Math.random() * 3) + 2; // 2-4 lessons
      for (let j = 0; j < lessonCount; j++) {
        await prisma.lesson.create({
          data: {
            title: `Lesson ${j + 1}`,
            content: `Detailed content for lesson ${j + 1} of module ${i + 1}.`,
            duration: `${Math.floor(Math.random() * 30) + 10} min`,
            order: j + 1,
            moduleId: mod.id,
          },
        });
      }
    }
  }

  console.log("✅ Created modules and lessons");

  // ─── Sample Review ──────────────────────────
  await prisma.review.create({
    data: {
      rating: 5,
      comment:
        "Amazing course! Dr. Vasquez makes cosmology so accessible and exciting.",
      userId: instructors[3].id,
      courseId: courses[0].id,
    },
  });

  console.log("✅ Created sample review");

  console.log("\n🎉 Database seeded successfully!\n");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
