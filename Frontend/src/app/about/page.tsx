import {
  Rocket,
  Globe,
  Telescope,
  BookOpen,
  Brain,
  Mountain,
  Map,
  Newspaper,
  FlaskConical,
  FileStack,
  BookMarked,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

const subjects = [
  {
    icon: Mountain,
    name: "Geology",
    description:
      "Explore minerals, rocks, petrology, structural geology, geomorphology, and Earth processes.",
    href: "/geology",
    color: "text-orange-400",
    bg: "from-orange-400/15 to-orange-400/5",
  },
  {
    icon: Map,
    name: "Geography",
    description:
      "Learn about physical geography, human geography, environment, maps, and GIS.",
    href: "/geography",
    color: "text-emerald-400",
    bg: "from-emerald-400/15 to-emerald-400/5",
  },
  {
    icon: Telescope,
    name: "Astronomy",
    description:
      "Discover planets, stars, galaxies, cosmology, and the science of the universe.",
    href: "/astronomy",
    color: "text-cyan-400",
    bg: "from-cyan-400/15 to-cyan-400/5",
  },
  {
    icon: Newspaper,
    name: "Current Affairs",
    description:
      "Stay informed about important developments in science, technology, environment, space, and the world.",
    href: "/current-affairs",
    color: "text-purple-400",
    bg: "from-purple-400/15 to-purple-400/5",
  },
  {
    icon: FlaskConical,
    name: "General Science",
    description:
      "Build a broader understanding of physics, chemistry, biology, and everyday science.",
    href: "/general-science",
    color: "text-amber-400",
    bg: "from-amber-400/15 to-amber-400/5",
  },
];

const learnWays = [
  {
    icon: BookOpen,
    title: "Study Materials",
    description: "Notes, diagrams, explanations, and revision resources.",
    color: "text-cyan-400",
    bg: "from-cyan-400/15 to-cyan-400/5",
  },
  {
    icon: Brain,
    title: "Quizzes",
    description: "Practice questions and knowledge assessments.",
    color: "text-purple-400",
    bg: "from-purple-400/15 to-purple-400/5",
  },
  {
    icon: FileStack,
    title: "Research Papers",
    description: "Explore scientific literature and research.",
    color: "text-orange-400",
    bg: "from-orange-400/15 to-orange-400/5",
  },
  {
    icon: BookMarked,
    title: "Books & References",
    description:
      "Discover recommended books and additional resources.",
    color: "text-emerald-400",
    bg: "from-emerald-400/15 to-emerald-400/5",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="mb-16 text-center">
          <Badge variant="outline" className="mb-4">
            <Telescope className="mr-1 h-3 w-3" />
            About
          </Badge>
          <h1 className="font-display text-4xl font-bold text-white sm:text-5xl">
            About{" "}
            <span className="gradient-text-cyan">CosmosEarth Academy</span>
          </h1>
        </div>

        {/* Description */}
        <div className="mb-16 space-y-5 text-center">
          <p className="text-lg leading-relaxed text-white/50">
            CosmosEarth Academy is an online educational platform created for
            people who want to learn more about Earth and the universe.
          </p>
          <p className="text-base leading-relaxed text-white/40">
            We bring together structured study materials, notes, quizzes,
            articles, and other learning resources covering subjects across
            Earth and Space Science.
          </p>
          <p className="text-base leading-relaxed text-white/40">
            From minerals and rocks to planetary systems and the wider cosmos,
            our goal is to make scientific knowledge easier to explore,
            understand, and apply.
          </p>
        </div>

        <div className="section-divider mb-16" />

        {/* Explore Our Subjects */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="font-display text-2xl font-bold text-white">
              Explore Our Subjects
            </h2>
            <p className="mt-2 text-sm text-white/35">
              Discover learning resources across Earth, Space, and General
              Science.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {subjects.map((s) => (
              <Link key={s.name} href={s.href}>
                <Card className="group h-full">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${s.bg}`}
                      >
                        <s.icon className={`h-5 w-5 ${s.color}`} />
                      </div>
                      <div className="flex-1">
                        <h3
                          className={`font-display text-base font-bold text-white ${s.color.replace("text-", "group-hover:text-")} transition-colors`}
                        >
                          {s.name}
                        </h3>
                        <p className="mt-1 text-[11px] text-white/30 leading-relaxed">
                          {s.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        <div className="section-divider mb-16" />

        {/* Learn Your Way */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="font-display text-2xl font-bold text-white">
              Learn Your Way
            </h2>
            <p className="mt-2 text-sm text-white/35">
              Subjects are what you learn. Resources are how you learn.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {learnWays.map((item) => (
              <Card key={item.title}>
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${item.bg}`}
                    >
                      <item.icon className={`h-5 w-5 ${item.color}`} />
                    </div>
                    <div>
                      <h3 className="font-display text-base font-bold text-white">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-sm text-white/40">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="section-divider mb-16" />

        {/* Closing */}
        <div className="text-center">
          <h2 className="mb-4 font-display text-2xl font-bold text-white">
            Keep Exploring
          </h2>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-white/40">
            There is always more to discover—from the structure beneath our feet
            to the universe beyond our planet.
          </p>
          <div className="mt-8">
            <Link href="/" className="btn-cosmic inline-flex items-center gap-2 text-sm">
              <Rocket className="h-4 w-4" /> Start Exploring
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
