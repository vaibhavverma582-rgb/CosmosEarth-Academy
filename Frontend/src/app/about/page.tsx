import {
  Rocket,
  Globe,
  Users,
  Award,
  Heart,
  Star,
  Target,
  Telescope,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const team = [
  {
    name: "Dr. Elena Vasquez",
    role: "Founder & Lead Educator",
    bio: "Former NASA JPL scientist with 15 years in planetary research.",
    initials: "EV",
  },
  {
    name: "Prof. James Chen",
    role: "Head of Engineering",
    bio: "Aerospace engineer and educator at MIT for 12 years.",
    initials: "JC",
  },
  {
    name: "Dr. Amara Singh",
    role: "Director of Astrophysics",
    bio: "Published 50+ papers on black hole dynamics and dark matter.",
    initials: "AS",
  },
  {
    name: "Dr. Lisa Chang",
    role: "Curriculum Director",
    bio: "PhD in Science Education with a passion for accessible learning.",
    initials: "LC",
  },
];

const values = [
  {
    icon: Target,
    title: "Mission-Driven",
    description:
      "Every course is designed to spark wonder and build real expertise in space science.",
  },
  {
    icon: Globe,
    title: "Global Access",
    description:
      "We believe everyone deserves access to world-class space education, regardless of location.",
  },
  {
    icon: Heart,
    title: "Community First",
    description:
      "Learning is better together. We foster a supportive, inclusive global community.",
  },
  {
    icon: Star,
    title: "Excellence",
    description:
      "Our curriculum is vetted by leading scientists and engineers from top institutions.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="mb-16 text-center">
          <Badge variant="outline" className="mb-4">
            <Telescope className="mr-1 h-3 w-3" />
            Our Story
          </Badge>
          <h1 className="font-display text-4xl font-bold text-white sm:text-5xl">
            Making the Cosmos{" "}
            <span className="gradient-text-cyan">Accessible</span> to Everyone
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg text-white/50">
            CosmosEarth Academy was founded in 2022 with a simple belief: the
            wonders of the universe should be accessible to every curious mind,
            everywhere on Earth and beyond.
          </p>
        </div>

        {/* Stats */}
        <div className="mb-16 grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { label: "Founded", value: "2022" },
            { label: "Students", value: "12,500+" },
            { label: "Countries", value: "85+" },
            { label: "Courses", value: "180+" },
          ].map((stat) => (
            <div key={stat.label} className="glass-card rounded-xl p-6 text-center">
              <p className="font-display text-3xl font-bold gradient-text-cyan">
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-white/50">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="mb-8 text-center font-display text-2xl font-bold text-white">
            Our Values
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <Card key={v.title} className="text-center">
                <CardHeader>
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-cosmos-cyan/10">
                    <v.icon className="h-6 w-6 text-cosmos-cyan" />
                  </div>
                  <CardTitle className="text-lg">{v.title}</CardTitle>
                  <CardDescription>{v.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        {/* Team */}
        <div>
          <h2 className="mb-8 text-center font-display text-2xl font-bold text-white">
            Meet the Team
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member) => (
              <Card key={member.name} className="text-center">
                <CardHeader>
                  <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-cosmos-cyan to-cosmos-purple text-lg font-bold text-white">
                    {member.initials}
                  </div>
                  <CardTitle className="text-lg">{member.name}</CardTitle>
                  <CardDescription className="text-cosmos-cyan">
                    {member.role}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-white/50">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
