"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Star,
  Clock,
  Users,
  BookOpen,
  Loader2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail?: string;
  level: string;
  duration?: string;
  published: boolean;
  featured: boolean;
  category?: { name: string };
  instructor?: { name: string };
  _count?: { enrollments: number; modules: number };
}

const levels = ["All", "Beginner", "Intermediate", "Advanced"];

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("All");

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (searchQuery) params.set("search", searchQuery);
        if (selectedLevel !== "All") params.set("level", selectedLevel.toLowerCase());

        const res = await fetch(`${API_URL}/api/courses?${params}`);
        if (res.ok) {
          const data = await res.json();
          setCourses(data.data || []);
        }
      } catch {
        // API unavailable
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchCourses, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery, selectedLevel]);

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <Badge variant="outline" className="mb-4">
            <BookOpen className="mr-1 h-3 w-3" />
            Courses
          </Badge>
          <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">
            Explore <span className="gradient-text-cyan">Courses</span>
          </h1>
          <p className="mt-3 text-white/50">
            Structured learning paths for every level.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search courses..."
              className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-white/30 focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/30"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {levels.map((level) => (
              <button
                key={level}
                onClick={() => setSelectedLevel(level)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  selectedLevel === level
                    ? "bg-cyan-400 text-[#050710]"
                    : "border border-white/10 bg-white/5 text-white/50 hover:text-white"
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
          </div>
        )}

        {/* Courses Grid */}
        {!loading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <Link key={course.id} href={`/courses/${course.slug}`}>
                <Card className="group h-full cursor-pointer">
                  {course.thumbnail && (
                    <div className="overflow-hidden rounded-t-xl">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="h-40 w-full object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                  )}
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="outline" className="text-xs">
                        {course.category?.name || "General"}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {course.level}
                      </Badge>
                    </div>
                    <h3 className="font-display text-lg font-bold text-white group-hover:text-cyan-300 transition-colors mb-2">
                      {course.title}
                    </h3>
                    <p className="text-sm text-white/50 line-clamp-2 mb-4">
                      {course.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-white/40">
                      <span>{course.instructor?.name || "Instructor"}</span>
                      <div className="flex items-center gap-3">
                        {course.duration && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {course.duration}
                          </span>
                        )}
                        {course._count?.enrollments !== undefined && (
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {course._count.enrollments}
                          </span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && courses.length === 0 && (
          <div className="py-20 text-center">
            <BookOpen className="mx-auto h-12 w-12 text-white/20" />
            <p className="mt-4 text-white/40">No courses found</p>
          </div>
        )}
      </div>
    </div>
  );
}
